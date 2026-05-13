import pool from '../../config/database';
import { z } from 'zod';

const noticeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Notice = z.infer<typeof noticeSchema>;

const createNoticeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;

export class NoticesRepository {
  async findAll(): Promise<Notice[]> {
    const query = 'SELECT * FROM notices ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async create(input: CreateNoticeInput): Promise<Notice> {
    const query = `
      INSERT INTO notices (title, description, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [input.title, input.description]);
    const row = result.rows[0];
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}