/* eslint-disable prettier/prettier */
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

// Helper function to ensure secret exists
const getSecret = (secret?: string): Secret => {
  if (!secret) throw new Error('JWT secret not configured');
  return secret;
};

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(
    payload,
    getSecret(process.env.JWT_SECRET),
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '15m'
    } as SignOptions
  );
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(
    payload,
    getSecret(process.env.REFRESH_TOKEN_SECRET),
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '7d'
    } as SignOptions
  );
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, getSecret(process.env.JWT_SECRET));
    return typeof decoded === 'object' ? decoded : null;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, getSecret(process.env.REFRESH_TOKEN_SECRET));
    return typeof decoded === 'object' ? decoded : null;
  } catch {
    return null;
  }
};