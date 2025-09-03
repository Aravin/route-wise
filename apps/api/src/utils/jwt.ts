import jwt from 'jsonwebtoken';
import { JwtPayload } from '@route-wise/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const generateTokens = (payload: Omit<JwtPayload, 'iat' | 'exp'>): TokenPair => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });

  // Calculate expiration time in seconds
  const expiresIn = 15 * 60; // 15 minutes in seconds

  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const generatePasswordResetToken = (userId: string): string => {
  return jwt.sign(
    { userId, type: 'password-reset' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const verifyPasswordResetToken = (token: string): { userId: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type !== 'password-reset') {
      throw new Error('Invalid token type');
    }
    return { userId: decoded.userId };
  } catch (error) {
    throw new Error('Invalid or expired password reset token');
  }
};
