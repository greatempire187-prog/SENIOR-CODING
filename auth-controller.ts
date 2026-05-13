import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from './auth-service';
import { badRequest, created, ok } from '../../shared/api-response';

const service = new AuthService();

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'staff', 'teacher', 'student']),
});

export const login = async (req: Request, res: Response) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const result = await service.authenticate(credentials.email, credentials.password);
    if (!result) {
      return badRequest(res, 'Invalid credentials');
    }
    return ok(res, result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return badRequest(res, error.errors);
    }
    console.error('Login failed:', error);
    return badRequest(res, 'Unable to complete login');
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);
    const user = await service.register(body.email, body.password, body.role);
    return created(res, { id: user.id, email: user.email, role: user.role });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return badRequest(res, error.errors);
    }
    return badRequest(res, error instanceof Error ? error.message : 'Unable to register');
  }
};
