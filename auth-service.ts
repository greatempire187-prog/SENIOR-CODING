import jwt from 'jsonwebtoken';
import { AuthRepository, UserRecord } from './auth-repository';
import { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../../config/env';

const repository = new AuthRepository();

export class AuthService {
  async register(email: string, password: string, role: UserRecord['role']): Promise<UserRecord> {
    const existing = await repository.findByEmail(email);
    if (existing) {
      throw new Error('Email already exists');
    }
    return repository.createUser(email, password, role);
  }

  async authenticate(email: string, password: string) {
    const user = await repository.validateCredentials(email, password);
    if (!user) {
      return null;
    }
    const payload = { userId: user.id, role: user.role } as const;

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

    return { accessToken, refreshToken, userId: user.id, role: user.role };
  }
}
