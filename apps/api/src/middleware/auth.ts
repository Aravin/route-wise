import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User';
import { verifyAccessToken } from '../utils/jwt';
import { createUnauthorizedResponse, createForbiddenResponse } from '../utils/response';

export interface AuthRequest extends Request {
  user?: any;
  tenantId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const errorResponse = createUnauthorizedResponse('Access token required');
      res.status(401).json(errorResponse);
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = verifyAccessToken(token);
      
      // Find user and populate tenant info
      const user = await UserModel.findById(decoded.userId)
        .populate('tenantId', 'name slug status')
        .select('-password');
      
      if (!user) {
        const errorResponse = createUnauthorizedResponse('User not found');
        res.status(401).json(errorResponse);
        return;
      }

      if (user.status !== 'active') {
        const errorResponse = createUnauthorizedResponse('Account is inactive');
        res.status(401).json(errorResponse);
        return;
      }

      req.user = user;
      req.tenantId = user.tenantId?._id?.toString();
      next();
    } catch (tokenError) {
      const errorResponse = createUnauthorizedResponse('Invalid or expired token');
      res.status(401).json(errorResponse);
      return;
    }
  } catch (error) {
    const errorResponse = createUnauthorizedResponse('Authentication failed');
    res.status(401).json(errorResponse);
    return;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const errorResponse = createUnauthorizedResponse('Authentication required');
      res.status(401).json(errorResponse);
      return;
    }

    if (!roles.includes(req.user.role)) {
      const errorResponse = createForbiddenResponse('Insufficient permissions');
      res.status(403).json(errorResponse);
      return;
    }

    next();
  };
};

export const requireTenant = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.tenantId) {
    const errorResponse = createForbiddenResponse('Tenant access required');
    res.status(403).json(errorResponse);
    return;
  }
  next();
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyAccessToken(token);
      const user = await UserModel.findById(decoded.userId)
        .populate('tenantId', 'name slug status')
        .select('-password');
      
      if (user && user.status === 'active') {
        req.user = user;
        req.tenantId = user.tenantId?._id?.toString();
      }
    } catch (tokenError) {
      // Token is invalid, but we continue without authentication
    }
    
    next();
  } catch (error) {
    next();
  }
};
