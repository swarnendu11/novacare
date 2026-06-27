import { Server } from "socket.io";
import logger from "../utils/logger.js";

let ioInstance = null;

export const initSocket = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: "*", // Simple wildcard for development, standard whitelisting in app.js
      methods: ["GET", "POST"]
    }
  });

  ioInstance.on("connection", (socket) => {
    logger.info(`Websocket client connected: ${socket.id}`);

    // Join personal room based on User ID
    socket.on("join:user", (userId) => {
      socket.join(userId);
      logger.info(`Socket ${socket.id} joined personal room: ${userId}`);
    });

    // Join role-specific broadcast room
    socket.on("join:role", (role) => {
      socket.join(`role:${role}`);
      logger.info(`Socket ${socket.id} joined role channel: role:${role}`);
    });

    // Ambulance GPS tracking channel updates
    socket.on("ambulance:location:update", (data) => {
      const { ambulanceId, driverName, location } = data;
      logger.debug(`Ambulance Location Update [${ambulanceId}] GPS:`, location);
      
      // Broadcast this update to all clients listening in tracking room
      socket.to("ambulance:tracking").emit("ambulance:location:broadcast", {
        ambulanceId,
        driverName,
        location,
        timestamp: new Date()
      });
    });

    // Join tracking room (typically Receptionists or Patients looking at map)
    socket.on("ambulance:tracking:join", () => {
      socket.join("ambulance:tracking");
      logger.info(`Socket ${socket.id} joined ambulance live GPS tracking room`);
    });

    socket.on("disconnect", () => {
      logger.info(`Websocket client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO has not been initialized yet!");
  }
  return ioInstance;
};
