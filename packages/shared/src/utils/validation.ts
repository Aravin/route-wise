import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { createValidationErrorResponse } from './response';

/**
 * Middleware to validate request body against a Zod schema
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorResponse = createValidationErrorResponse(
          'Validation failed',
          error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          }))
        );
        res.status(422).json(errorResponse);
        return;
      }
      next(error);
    }
  };
}

/**
 * Middleware to validate request query parameters against a Zod schema
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsedQuery = schema.parse(req.query);
      req.query = parsedQuery as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorResponse = createValidationErrorResponse(
          'Query validation failed',
          error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          }))
        );
        res.status(422).json(errorResponse);
        return;
      }
      next(error);
    }
  };
}

/**
 * Middleware to validate request parameters against a Zod schema
 */
export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsedParams = schema.parse(req.params);
      req.params = parsedParams as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorResponse = createValidationErrorResponse(
          'Parameter validation failed',
          error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          }))
        );
        res.status(422).json(errorResponse);
        return;
      }
      next(error);
    }
  };
}

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  objectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number format'),
  pagination: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).refine(n => n > 0, 'Page must be positive'),
    limit: z.string().regex(/^\d+$/).transform(Number).refine(n => n > 0 && n <= 100, 'Limit must be between 1 and 100'),
  }),
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
};
