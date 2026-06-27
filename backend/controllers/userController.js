import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

// @desc    Get all users (Admin only, or staff looking up profiles)
// @route   GET /api/users
// @access  Private
export const getUsers = asyncHandler(async (req, res) => {
  const { role, department, status } = req.query;
  const filter = {};

  if (role) filter.role = role;
  if (department) filter.department = department;
  if (status) filter.status = status;

  const users = await User.find(filter).select("-password -refreshToken");
  res.json(users);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password -refreshToken");
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Create a new user (Admin portal staff creation)
// @route   POST /api/users
// @access  Private (Admin only)
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, gender, dob, specialization, department, licenseNumber } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("A user with this email address already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    gender,
    dob,
    specialization,
    department,
    licenseNumber
  });

  if (user) {
    logger.info(`Admin created new staff/user profile: ${user.email} with role ${user.role}`);
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data provided");
  }
});

// @desc    Update a user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.gender = req.body.gender || user.gender;
    user.dob = req.body.dob || user.dob;
    user.address = req.body.address || user.address;

    // Staff/Patient specific
    if (req.body.bloodGroup) user.bloodGroup = req.body.bloodGroup;
    if (req.body.allergies) user.allergies = req.body.allergies;
    if (req.body.specialization) user.specialization = req.body.specialization;
    if (req.body.department) user.department = req.body.department;
    if (req.body.licenseNumber) user.licenseNumber = req.body.licenseNumber;
    if (req.body.status) user.status = req.body.status;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    logger.info(`User profile updated: ${updatedUser.email}`);
    
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone
    });
  } else {
    res.status(404);
    throw new Error("User profile not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    logger.info(`User profile deleted: ${user.email}`);
    res.json({ message: "User profile successfully removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
