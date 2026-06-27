import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { generateOtp, verifyOtp as confirmOtp } from "../services/otpService.js";
import { sendOtpEmail } from "../services/emailService.js";
import logger from "../utils/logger.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Auth user & get tokens
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  logger.info(`[Auth] Login attempt for email/identifier: ${identifier}`);

  const user = await User.findOne({ email: identifier });

  if (user && (await user.matchPassword(password))) {
    if (user.status === "Pending") {
      res.status(403);
      throw new Error("Account is pending Admin approval");
    }
    if (user.status === "Rejected") {
      res.status(403);
      throw new Error("Account registration was rejected");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user profile
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    logger.info(`[Auth] Login successful: ${user.email} with role: ${user.role}`);

    res.json({
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        bloodGroup: user.bloodGroup,
        allergies: user.allergies,
        department: user.department,
        specialization: user.specialization,
      },
    });
  } else {
    logger.warn(`[Auth] Failed login attempt for: ${identifier}`);
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, gender, dob } = req.body;

  logger.info(`[Auth] Registration attempt for: ${email}`);

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email address");
  }

  // Create user
  const userRole = role || "patient";
  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
    status: userRole === "patient" ? "Approved" : "Pending",
    phone: phone || "",
    gender: gender || "Unspecified",
    dob: dob || null
  });

  if (user) {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    logger.info(`[Auth] User registered successfully: ${user.email} (ID: ${user._id})`);

    res.status(201).json({
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data provided");
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -refreshToken");
  if (user) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      gender: user.gender,
      dob: user.dob,
      bloodGroup: user.bloodGroup,
      allergies: user.allergies,
      medicalHistory: user.medicalHistory,
      emergencyContact: user.emergencyContact,
      specialization: user.specialization,
      department: user.department,
      licenseNumber: user.licenseNumber,
      status: user.status
    });
  } else {
    res.status(404);
    throw new Error("User profile not found");
  }
});

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshSession = asyncHandler(async (req, res) => {
  const cookieToken = req.cookies.refreshToken;
  
  if (!cookieToken) {
    res.status(401);
    throw new Error("No refresh token supplied, session expired");
  }

  const user = await User.findOne({ refreshToken: cookieToken });
  if (!user) {
    res.status(403);
    throw new Error("Forbidden: Invalid refresh token");
  }

  try {
    const decoded = jwt.verify(cookieToken, process.env.JWT_REFRESH_SECRET || "novacare_super_secure_jwt_refresh_secret_2026");
    
    // Generate new Access Token
    const accessToken = generateAccessToken(decoded.id);
    
    res.json({ token: accessToken });
  } catch (err) {
    logger.warn(`Refresh token validation failed: ${err.message}`);
    res.status(403);
    throw new Error("Forbidden: Token expired or corrupt");
  }
});

// @desc    Logout User & clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie("refreshToken");
  logger.info(`User logged out and cookie cleared: ${req.user.email}`);
  res.json({ message: "Successfully logged out" });
});

// @desc    Google Sign In Integration
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = asyncHandler(async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture, sub } = payload;

    logger.info(`[Google Auth] Login attempt for: ${email}`);

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: `google_oauth_${Math.random().toString(36).slice(-8)}`,
        avatar: picture,
        googleId: sub,
        role: "patient",
        status: "Approved",
      });
      logger.info(`[Google Auth] Registered new user via Google: ${email}`);
    } else {
      if (!user.googleId || !user.avatar) {
        user.googleId = user.googleId || sub;
        user.avatar = user.avatar || picture;
        await user.save();
      }
    }

    if (user.status === "Pending") {
      res.status(403).json({ success: false, message: "Account is pending Admin approval" });
      return;
    }
    if (user.status === "Rejected") {
      res.status(403).json({ success: false, message: "Account registration was rejected" });
      return;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
    });

  } catch (error) {
    logger.error(`[Google Auth Error]: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
});

// @desc    Request Password Reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("No user registered with this email address");
  }

  const otpCode = await generateOtp(user._id);
  await sendOtpEmail(email, otpCode);

  res.json({ message: "Verification OTP code sent to your email", userId: user._id });
});

// @desc    Verify OTP Code
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyUserOtp = asyncHandler(async (req, res) => {
  const { userId, code } = req.body;

  if (!userId || !code) {
    res.status(400);
    throw new Error("Please supply user ID and verification code");
  }

  const isVerified = await confirmOtp(userId, code);

  if (isVerified) {
    res.json({ success: true, message: "OTP verified successfully. You may now reset your password." });
  } else {
    res.status(400);
    throw new Error("OTP verification failed. Invalid or expired code.");
  }
});

// @desc    Reset Password via OTP validation
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    res.status(400);
    throw new Error("Please supply user ID and new password");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  logger.info(`Password reset successfully for user: ${user.email}`);
  res.json({ message: "Password updated successfully. You can now login." });
});
