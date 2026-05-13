import { StudentsService } from './students-service';
import { Request, Response } from 'express';
import { z } from 'zod';

const service = new StudentsService();

const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  classId: z.string().min(1, 'Class ID is required'),
});

const updateStudentSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  classId: z.string().min(1).optional(),
});

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { limit = '10', offset = '0' } = req.query;
    const students = await service.getAllStudents(parseInt(limit as string), parseInt(offset as string));
    res.json({ data: students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await service.getStudentById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ data: student });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const validatedData = createStudentSchema.parse(req.body);
    const student = await service.createStudent(validatedData);
    res.status(201).json({ data: student });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateStudentSchema.parse(req.body);
    const student = await service.updateStudent(id, validatedData);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ data: student });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await service.deleteStudent(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};