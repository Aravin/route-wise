import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { generateTokens, verifyRefreshToken, generatePasswordResetToken, verifyPasswordResetToken } from '../utils/jwt';
// Import response utilities locally
import { createSuccessResponse, createErrorResponse, createConflictResponse, createUnauthorizedResponse, createNotFoundResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, profile } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        const errorResponse = createConflictResponse('User with this email already exists');
        res.status(409).json(errorResponse);
        return;
      }

      // Create new user
      const user = new UserModel({
        email,
        password,
        profile,
      });

      await user.save();

      // Generate tokens
      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        tenantId: user.tenantId?.toString(),
      });

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      logger.info('User registered successfully', { userId: user._id, email: user.email });

      const response = createSuccessResponse({
        user: user.toJSON(),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      }, 201);

      res.status(201).json(response);
    } catch (error) {
      logger.error('Registration error:', error);
      const errorResponse = createErrorResponse({
        code: 'REGISTRATION_FAILED',
        message: 'Failed to register user',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json(errorResponse);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, rememberMe } = req.body;

      // Find user and populate tenant info
      const user = await UserModel.findOne({ email })
        .populate('tenantId', 'name slug status');

      if (!user) {
        const errorResponse = createUnauthorizedResponse('Invalid email or password');
        res.status(401).json(errorResponse);
        return;
      }

      // Check if user is active
      if (user.status !== 'active') {
        const errorResponse = createUnauthorizedResponse('Account is inactive');
        res.status(401).json(errorResponse);
        return;
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        const errorResponse = createUnauthorizedResponse('Invalid email or password');
        res.status(401).json(errorResponse);
        return;
      }

      // Generate tokens
      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        tenantId: user.tenantId?._id?.toString(),
      });

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      logger.info('User logged in successfully', { userId: user._id, email: user.email });

      const response = createSuccessResponse({
        user: user.toJSON(),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      });

      res.json(response);
    } catch (error) {
      logger.error('Login error:', error);
      const errorResponse = createErrorResponse({
        code: 'LOGIN_FAILED',
        message: 'Failed to login',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json(errorResponse);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        const errorResponse = createUnauthorizedResponse('Refresh token required');
        res.status(401).json(errorResponse);
        return;
      }

      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Find user
      const user = await UserModel.findById(decoded.userId)
        .populate('tenantId', 'name slug status');

      if (!user || user.status !== 'active') {
        const errorResponse = createUnauthorizedResponse('Invalid refresh token');
        res.status(401).json(errorResponse);
        return;
      }

      // Generate new tokens
      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        tenantId: user.tenantId?._id?.toString(),
      });

      const response = createSuccessResponse({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      });

      res.json(response);
    } catch (error) {
      logger.error('Token refresh error:', error);
      const errorResponse = createUnauthorizedResponse('Invalid refresh token');
      res.status(401).json(errorResponse);
    }
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return a success response
      logger.info('User logged out', { userId: req.user?._id });

      const response = createSuccessResponse({
        message: 'Logged out successfully',
      });

      res.json(response);
    } catch (error) {
      logger.error('Logout error:', error);
      const errorResponse = createErrorResponse({
        code: 'LOGOUT_FAILED',
        message: 'Failed to logout',
      });
      res.status(500).json(errorResponse);
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        // Don't reveal if email exists or not
        const response = createSuccessResponse({
          message: 'If the email exists, a password reset link has been sent',
        });
        res.json(response);
        return;
      }

      // Generate password reset token
      const resetToken = generatePasswordResetToken(user._id.toString());

      // In a real application, you would send an email here
      // For now, we'll just log the token (in development)
      if (process.env.NODE_ENV === 'development') {
        logger.info('Password reset token generated', { 
          userId: user._id, 
          email: user.email,
          resetToken 
        });
      }

      // TODO: Send email with reset token
      // await emailService.sendPasswordResetEmail(user.email, resetToken);

      const response = createSuccessResponse({
        message: 'If the email exists, a password reset link has been sent',
      });

      res.json(response);
    } catch (error) {
      logger.error('Forgot password error:', error);
      const errorResponse = createErrorResponse({
        code: 'FORGOT_PASSWORD_FAILED',
        message: 'Failed to process password reset request',
      });
      res.status(500).json(errorResponse);
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;

      // Verify reset token
      const { userId } = verifyPasswordResetToken(token);

      // Find user
      const user = await UserModel.findById(userId);
      if (!user) {
        const errorResponse = createNotFoundResponse('User');
        res.status(404).json(errorResponse);
        return;
      }

      // Update password
      user.password = password;
      await user.save();

      logger.info('Password reset successfully', { userId: user._id, email: user.email });

      const response = createSuccessResponse({
        message: 'Password reset successfully',
      });

      res.json(response);
    } catch (error) {
      logger.error('Reset password error:', error);
      const errorResponse = createErrorResponse({
        code: 'RESET_PASSWORD_FAILED',
        message: 'Invalid or expired reset token',
      });
      res.status(400).json(errorResponse);
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const errorResponse = createUnauthorizedResponse('Authentication required');
        res.status(401).json(errorResponse);
        return;
      }

      const response = createSuccessResponse({
        user: req.user.toJSON(),
      });

      res.json(response);
    } catch (error) {
      logger.error('Get profile error:', error);
      const errorResponse = createErrorResponse({
        code: 'GET_PROFILE_FAILED',
        message: 'Failed to get user profile',
      });
      res.status(500).json(errorResponse);
    }
  }
}
