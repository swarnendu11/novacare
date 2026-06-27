import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Global middlewares & Security
import { applySecurityMiddleware } from "./middleware/securityMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Core routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

// Modular role-specific routes
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import nurseRoutes from "./routes/nurse.routes.js";
import receptionRoutes from "./routes/reception.routes.js";
import pharmacyRoutes from "./routes/pharmacy.routes.js";
import labRoutes from "./routes/lab.routes.js";
import ambulanceRoutes from "./routes/ambulance.routes.js";

const app = express();

// Set up parsing and logger middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Apply Helmet, CORS, Rate Limiters and Mongo Query Sanitize
applySecurityMiddleware(app);

// Mount Core API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);

// Mount Modular role-specific routes
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/nurse", nurseRoutes);
app.use("/api/reception", receptionRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/ambulance", ambulanceRoutes);

// Health check API endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Novacare Centralized Enterprise ERP Backend",
    message: "Server is fully operational and healthy",
    timestamp: new Date()
  });
});

// Wildcard not-found and global error handler middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
