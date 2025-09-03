import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { createErrorResponse, ApiErrorCode, HttpStatus } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  let message = error.message || 'Internal Server Error';
  let code = error.code || ApiErrorCode.INTERNAL_SERVER_ERROR;

  // Log error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    code = ApiErrorCode.VALIDATION_ERROR;
    message = 'Validation failed';
  } else if (error.name === 'CastError') {
    statusCode = HttpStatus.BAD_REQUEST;
    code = ApiErrorCode.RESOURCE_NOT_FOUND;
    message = 'Invalid ID format';
  } else if (error.name === 'MongoError' && (error as any).code === 11000) {
    statusCode = HttpStatus.CONFLICT;
    code = ApiErrorCode.RESOURCE_ALREADY_EXISTS;
    message = 'Resource already exists';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = HttpStatus.UNAUTHORIZED;
    code = ApiErrorCode.AUTHENTICATION_FAILED;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = HttpStatus.UNAUTHORIZED;
    code = ApiErrorCode.AUTHENTICATION_FAILED;
    message = 'Token expired';
  }

  const errorResponse = createErrorResponse({
    code,
    message,
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });

  res.status(statusCode).json(errorResponse);
};

export const createAppError = (
  message: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  code: string = ApiErrorCode.INTERNAL_SERVER_ERROR
): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.code = code;
  error.isOperational = true;
  return error;
};
