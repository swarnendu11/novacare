import Notification from "../models/Notification.js";
import logger from "../utils/logger.js";
import { getIO } from "../sockets/socketHandler.js"; // We will build this next!

export const createNotification = async ({ recipientId, title, message, type, role }) => {
  try {
    const notification = new Notification({
      recipientId,
      title,
      message,
      type,
      role
    });

    const saved = await notification.save();
    logger.info(`Notification persistent log saved for Recipient ID: ${recipientId}`);

    // Push real-time event via Socket.IO if connection is live
    try {
      const io = getIO();
      if (io) {
        // Emit to specific user room
        io.to(recipientId.toString()).emit("notification:new", {
          id: saved._id,
          title,
          message,
          type,
          read: false,
          createdAt: saved.createdAt
        });
        
        // Emit to role room if specified
        if (role) {
          io.to(`role:${role}`).emit("notification:new", {
            id: saved._id,
            title,
            message,
            type,
            read: false,
            createdAt: saved.createdAt
          });
        }
      }
    } catch (socketErr) {
      // Graceful fallback if Socket.IO is not initialized yet (e.g. startup or testing)
      logger.debug(`Real-time push skipped (Socket.IO offline): ${socketErr.message}`);
    }

    return saved;
  } catch (error) {
    logger.error(`Failed to create notification: ${error.message}`);
    throw error;
  }
};
