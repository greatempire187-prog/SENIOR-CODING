import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || '3001';
export const DB_HOST = process.env.DB_HOST || 'db';
export const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
export const DB_NAME = process.env.DB_NAME || 'student_management';
export const DB_USER = process.env.DB_USER || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
export const JWT_SECRET = process.env.JWT_SECRET || 'change-me-securely';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
export const CSRF_SECRET = process.env.CSRF_SECRET || 'csrf-secret';
export const NODE_ENV = process.env.NODE_ENV || 'development';
