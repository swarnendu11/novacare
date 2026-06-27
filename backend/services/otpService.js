import crypto from "crypto";
import User from "../models/User.js";
import logger from "../utils/logger.js";

export const generateOtp = async (userId) => {
  // Generate random 6 digit numeric code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  await User.findByIdAndUpdate(userId, {
    otp: { code, expiresAt }
  });

  logger.info(`OTP generated for User ID: ${userId}`);
  return code;
};

export const verifyOtp = async (userId, enteredCode) => {
  const user = await User.findById(userId);
  if (!user || !user.otp || !user.otp.code) {
    logger.warn(`OTP verification attempted for user without pending OTP: ${userId}`);
    return false;
  }

  const { code, expiresAt } = user.otp;

  // Check expiration
  if (new Date() > expiresAt) {
    logger.warn(`Expired OTP entered for User ID: ${userId}`);
    // Clear expired OTP
    await User.findByIdAndUpdate(userId, { "otp.code": null, "otp.expiresAt": null });
    return false;
  }

  // Check matching
  if (code !== enteredCode) {
    logger.warn(`Invalid OTP entered for User ID: ${userId}`);
    return false;
  }

  // Clear used OTP on successful verification
  await User.findByIdAndUpdate(userId, { "otp.code": null, "otp.expiresAt": null });
  logger.info(`OTP verified successfully for User ID: ${userId}`);
  return true;
};
