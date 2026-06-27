import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  logger.error(`API Error: ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    status: statusCode,
    stack: err.stack,
  });

  res.status(statusCode).json({
    message: err.message || "An unexpected server error occurred",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
