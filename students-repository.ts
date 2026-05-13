import pool from '../../config/database';
import { z } from 'zod';

const studentSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  classId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Student = z.infer<typeof studentSchema>;

const createStudentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  classId: z.string().min(1),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

export class StudentsRepository {
  async findAll(limit = 10, offset = 0): Promise<Student[]> {
    const query = 'SELECT * FROM students ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await pool.query(query, [limit, offset]);
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      classId: row.class_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async findById(id: string): Promise<Student | null> {
    const query = 'SELECT * FROM students WHERE id = $1';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      classId: row.class_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findByEmail(email: string): Promise<Student | null> {
    const query = 'SELECT * FROM students WHERE email = $1 LIMIT 1';
    const result = await pool.query(query, [email]);
    if (!result.rows.length) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      classId: row.class_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async create(input: CreateStudentInput): Promise<Student> {
    const query = `
      INSERT INTO students (name, email, class_id, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [input.name, input.email, input.classId]);
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      classId: row.class_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async update(id: string, input: Partial<CreateStudentInput>): Promise<Student | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (input.name) {
      fields.push(`name = $${paramIndex++}`);
      values.push(input.name);
    }
    if (input.email) {
      fields.push(`email = $${paramIndex++}`);
      values.push(input.email);
    }
    if (input.classId) {
      fields.push(`class_id = $${paramIndex++}`);
      values.push(input.classId);
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE students SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      classId: row.class_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM students WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }
}