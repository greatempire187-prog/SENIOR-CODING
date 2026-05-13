import pool from '../../config/database';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'staff' | 'teacher' | 'student';
};

type DbUserRow = {
  id: string;
  email: string;
  password_hash: string;
  role: UserRecord['role'];
};

const mapRow = (row: DbUserRow): UserRecord => ({
  id: row.id,
  email: row.email,
  passwordHash: row.password_hash,
  role: row.role,
});

export class AuthRepository {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    if (!rows.length) return null;
    return mapRow(rows[0] as DbUserRow);
  }

  async createUser(email: string, password: string, role: UserRecord['role']): Promise<UserRecord> {
    const passwordHash = await argon2.hash(password);
    const id = uuidv4();
    const { rows } = await pool.query(
      `INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [id, email, passwordHash, role],
    );
    return mapRow(rows[0] as DbUserRow);
  }

  async validateCredentials(email: string, password: string): Promise<UserRecord | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const isValid = await argon2.verify(user.passwordHash, password);
    return isValid ? user : null;
  }
}
