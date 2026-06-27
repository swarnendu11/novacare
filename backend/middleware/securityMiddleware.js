import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

// Setup customized CORS options
const corsOptions = {
  origin: [
    "http://localhost:3000", // Launchpad
    "http://localhost:3001", // Admin
    "http://localhost:3002", // Doctor
    "http://localhost:3003", // Patient
    "http://localhost:3004", // Reception
    "http://localhost:3005", // Nurse
    "http://localhost:3006", // Wardboy
    "http://localhost:3007", // Pharmacy
    "http://localhost:3008", // Ambulance
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003",
    "http://127.0.0.1:3004",
    "http://127.0.0.1:3005",
    "http://127.0.0.1:3006",
    "http://127.0.0.1:3007",
    "http://127.0.0.1:3008"
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Rate limiter for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  message: {
    message: "Too many requests from this IP. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for auth routes (login / register / OTP)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per window
  message: {
    message: "Too many authentication requests from this IP. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const applySecurityMiddleware = (app) => {
  // Use Helmet for headers protection
  app.use(helmet());

  // Enable CORS with secure options
  app.use(cors(corsOptions));

  // Sanitize data to prevent NoSQL query injection
  app.use(mongoSanitize());

  // Apply general rate limiter
  app.use("/api/", apiLimiter);
};
