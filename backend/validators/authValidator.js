import logger from "../utils/logger.js";

export const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  const validRoles = [
    "patient", "doctor", "admin", "receptionist", 
    "nurse", "wardboy", "pharmacy", "lab_technician", "ambulance_staff"
  ];
  if (role && !validRoles.includes(role)) {
    errors.role = `Invalid role. Allowed roles are: ${validRoles.join(", ")}`;
  }

  if (Object.keys(errors).length > 0) {
    logger.warn(`Register validation failed for ${email || "unknown"}:`, errors);
    return res.status(400).json({ message: "Validation failure", errors });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;
  const errors = {};

  if (!identifier) {
    errors.identifier = "Please enter your email address";
  }

  if (!password) {
    errors.password = "Please enter your password";
  }

  if (Object.keys(errors).length > 0) {
    logger.warn(`Login validation failed:`, errors);
    return res.status(400).json({ message: "Validation failure", errors });
  }

  next();
};
