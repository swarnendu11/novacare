import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./sockets/socketHandler.js";
import logger from "./utils/logger.js";

// Load configuration
dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize Database connection
await connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server
initSocket(server);

// Start server listening
server.listen(PORT, () => {
  logger.info(`================================================================`);
  logger.info(`  Novacare Central Enterprise Backend running in ${process.env.NODE_ENV || "development"} mode`);
  logger.info(`  Local Server address: http://localhost:${PORT}`);
  logger.info(`  Websockets status: ONLINE`);
  logger.info(`================================================================`);
});

// Handle uncaught exceptions and unhandled promise rejections gracefully
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Promise Rejection: ${err.message}`, { stack: err.stack });
  // Keep server running in development, but exit in production if needed
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught System Exception: ${err.message}`, { stack: err.stack });
  process.exit(1);
});
