import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import logger from "../utils/logger.js";

let mongoServerInstance = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    try {
      if (uri && !uri.includes("YOUR_PASSWORD")) {
        const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        logger.info(`MongoDB Connected successfully: ${conn.connection.host}`);
        return;
      }
    } catch (err) {
      logger.warn(`Primary MongoDB connection failed. Falling back to In-Memory Database.`);
    }

    logger.info("Initializing in-memory MongoDB server as fallback...");
    mongoServerInstance = await MongoMemoryServer.create();
    const fallbackUri = mongoServerInstance.getUri();
    
    const conn = await mongoose.connect(fallbackUri);
    logger.info(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Database connection critical error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServerInstance) {
      await mongoServerInstance.stop();
      logger.info("In-memory MongoDB Server stopped.");
    }
  } catch (error) {
    logger.error(`Error disconnecting database: ${error.message}`);
  }
};

export default connectDB;
