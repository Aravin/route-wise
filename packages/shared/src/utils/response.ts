import { Request } from 'express';
import { ApiResponse, ApiError, ApiMeta, ApiLinks, HttpStatus, ApiErrorCode } from '../types/api';

/**
 * Creates a successful API response
 */
export function createSuccessResponse<T>(
  data: T,
  statusCode: number = HttpStatus.OK,
  meta?: Partial<ApiMeta>,
  links?: Partial<ApiLinks>
): ApiResponse<T> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      ...meta,
    },
  };

  if (links) {
    response.links = {
      self: '',
      ...links,
    };
  }

  return response;
}

/**
 * Creates an error API response
 */
export function createErrorResponse(
  error: ApiError,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
): ApiResponse {
  return {
    success: false,
    error,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };
}

/**
 * Creates a validation error response
 */
export function createValidationErrorResponse(
  message: string,
  details?: any,
  field?: string
): ApiResponse {
  const error: ApiError = {
    code: ApiErrorCode.VALIDATION_ERROR,
    message,
    details,
  };
  
  if (field) {
    error.field = field;
  }
  
  return createErrorResponse(error, HttpStatus.UNPROCESSABLE_ENTITY);
}

/**
 * Creates a not found error response
 */
export function createNotFoundResponse(resource: string): ApiResponse {
  return createErrorResponse({
    code: ApiErrorCode.RESOURCE_NOT_FOUND,
    message: `${resource} not found`,
  }, HttpStatus.NOT_FOUND);
}

/**
 * Creates an unauthorized error response
 */
export function createUnauthorizedResponse(message: string = 'Authentication required'): ApiResponse {
  return createErrorResponse({
    code: ApiErrorCode.AUTHENTICATION_FAILED,
    message,
  }, HttpStatus.UNAUTHORIZED);
}

/**
 * Creates a forbidden error response
 */
export function createForbiddenResponse(message: string = 'Access denied'): ApiResponse {
  return createErrorResponse({
    code: ApiErrorCode.AUTHORIZATION_FAILED,
    message,
  }, HttpStatus.FORBIDDEN);
}

/**
 * Creates a conflict error response
 */
export function createConflictResponse(message: string): ApiResponse {
  return createErrorResponse({
    code: ApiErrorCode.RESOURCE_ALREADY_EXISTS,
    message,
  }, HttpStatus.CONFLICT);
}

/**
 * Creates pagination links
 */
export function createPaginationLinks(
  baseUrl: string,
  page: number,
  limit: number,
  total: number
): ApiLinks {
  const totalPages = Math.ceil(total / limit);
  
  const links: ApiLinks = {
    self: `${baseUrl}?page=${page}&limit=${limit}`,
    first: `${baseUrl}?page=1&limit=${limit}`,
    last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
  };
  
  if (page < totalPages) {
    links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
  }
  
  if (page > 1) {
    links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
  }
  
  return links;
}

/**
 * Generates a unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extracts pagination parameters from request
 */
export function getPaginationParams(req: Request): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query['limit'] as string) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
