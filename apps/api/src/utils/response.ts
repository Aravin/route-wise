import { Request, Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
  links?: ApiLinks;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
}

export interface ApiMeta {
  pagination?: PaginationMeta;
  timestamp: string;
  requestId: string;
  version?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiLinks {
  self: string;
  next?: string;
  prev?: string;
  first?: string;
  last?: string;
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  BOOKING_CONFLICT = 'BOOKING_CONFLICT',
}

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

export function createNotFoundResponse(resource: string): ApiResponse {
  return createErrorResponse({
    code: ApiErrorCode.RESOURCE_NOT_FOUND,
    message: `${resource} not found`,
  }, HttpStatus.NOT_FOUND);
}

export function createUnauthorizedResponse(message: string = 'Authentication required'): ApiResponse {
  return createErrorResponse({
    code: ApiErrorCode.AUTHENTICATION_FAILED,
    message,
  }, HttpStatus.UNAUTHORIZED);
}

export function createForbiddenResponse(message: string = 'Access denied'): ApiResponse {
  return createErrorResponse({
    code: ApiErrorCode.AUTHORIZATION_FAILED,
    message,
  }, HttpStatus.FORBIDDEN);
}

export function createConflictResponse(message: string): ApiResponse {
  return createErrorResponse({
    code: ApiErrorCode.RESOURCE_ALREADY_EXISTS,
    message,
  }, HttpStatus.CONFLICT);
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
