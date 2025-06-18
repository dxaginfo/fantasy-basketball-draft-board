import { Request, Response, NextFunction } from 'express';

// Handle 404 errors
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Custom error class with optional status code
export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

interface CustomError extends Error {
  statusCode?: number;
  kind?: string; // For mongoose errors
  code?: number; // For other errors
}

// Error handler middleware
export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  // Set default status code
  const statusCode = err.statusCode || res.statusCode || 500;
  
  // Format message based on environment
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Server Error'
    : err.message;
  
  // Send error response
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};