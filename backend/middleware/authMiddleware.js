import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

// Verify JWT token in headers and fetch authenticated user
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "novacare_super_secure_jwt_secret_2026"
      );

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user profile not found");
      }
      
      next();
    } catch (error) {
      logger.warn(`JWT Token verification failed: ${error.message}`);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});

// Authorize roles check (RBAC)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, session missing");
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Access Denied: User ${req.user.email} (role: ${req.user.role}) attempted to access resource requiring [${roles.join(", ")}]`);
      res.status(403);
      throw new Error(`Forbidden: Role '${req.user.role}' is not authorized to access this resource`);
    }

    next();
  };
};
