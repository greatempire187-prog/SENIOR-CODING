import { NoticesService } from './notices-service';
import { Request, Response } from 'express';
import { z } from 'zod';

const service = new NoticesService();

const createNoticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export const getNotices = async (req: Request, res: Response) => {
  try {
    const notices = await service.getAllNotices();
    res.json({ data: notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createNotice = async (req: Request, res: Response) => {
  try {
    const validatedData = createNoticeSchema.parse(req.body);
    const notice = await service.createNotice(validatedData);
    res.status(201).json({ data: notice });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating notice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};