import express from "express";
import {
  loginUser,
  registerUser,
  getMe,
  refreshSession,
  logoutUser,
  googleLogin,
  forgotPassword,
  verifyUserOtp,
  resetPassword
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateLogin, validateRegister } from "../validators/authValidator.js";
import { authLimiter } from "../middleware/securityMiddleware.js";

const router = express.Router();

router.post("/login", authLimiter, validateLogin, loginUser);
router.post("/register", authLimiter, validateRegister, registerUser);
router.post("/refresh", refreshSession);
router.post("/logout", protect, logoutUser);
router.post("/google", googleLogin);

// OTP password recovery routes
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/verify-otp", authLimiter, verifyUserOtp);
router.post("/reset-password", authLimiter, resetPassword);

router.get("/me", protect, getMe);

export default router;
