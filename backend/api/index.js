import app from "../app.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

// Load configuration
dotenv.config();

// Initialize Database connection
// Note: Mongoose will queue operations until the connection is established.
connectDB();

// Export the Express API for Vercel Serverless Function
export default app;
