import request from 'supertest';
import express from 'express';
import studentsRouter from '../src/routes/students';
import { StudentsService } from '../src/modules/students/students-service';

const app = express();
app.use(express.json());
app.use('/api/students', studentsRouter);

// Mock the service
jest.mock('../src/modules/students/students-service');

const mockStudentsService = StudentsService as jest.MockedClass<typeof StudentsService>;

describe('Students API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/students', () => {
    it('should return list of students', async () => {
      const mockStudents = [
        { id: '1', name: 'John Doe', email: 'john@example.com', classId: 'class1', createdAt: new Date(), updatedAt: new Date() },
      ];
      mockStudentsService.prototype.getAllStudents.mockResolvedValue(mockStudents);

      const response = await request(app).get('/api/students');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockStudents);
      expect(mockStudentsService.prototype.getAllStudents).toHaveBeenCalledWith(10, 0);
    });

    it('should handle pagination', async () => {
      const mockStudents = [];
      mockStudentsService.prototype.getAllStudents.mockResolvedValue(mockStudents);

      const response = await request(app).get('/api/students?limit=5&offset=10');

      expect(response.status).toBe(200);
      expect(mockStudentsService.prototype.getAllStudents).toHaveBeenCalledWith(5, 10);
    });
  });

  describe('GET /api/students/:id', () => {
    it('should return a student', async () => {
      const mockStudent = { id: '1', name: 'John Doe', email: 'john@example.com', classId: 'class1', createdAt: new Date(), updatedAt: new Date() };
      mockStudentsService.prototype.getStudentById.mockResolvedValue(mockStudent);

      const response = await request(app).get('/api/students/1');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockStudent);
      expect(mockStudentsService.prototype.getStudentById).toHaveBeenCalledWith('1');
    });

    it('should return 404 if student not found', async () => {
      mockStudentsService.prototype.getStudentById.mockResolvedValue(null);

      const response = await request(app).get('/api/students/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Student not found');
    });
  });

  describe('POST /api/students', () => {
    it('should create a student', async () => {
      const newStudent = { name: 'Jane Doe', email: 'jane@example.com', classId: 'class1' };
      const createdStudent = { ...newStudent, id: '2', createdAt: new Date(), updatedAt: new Date() };
      mockStudentsService.prototype.createStudent.mockResolvedValue(createdStudent);

      const response = await request(app).post('/api/students').send(newStudent);

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(createdStudent);
      expect(mockStudentsService.prototype.createStudent).toHaveBeenCalledWith(newStudent);
    });

    it('should validate input', async () => {
      const invalidStudent = { name: '', email: 'invalid-email', classId: '' };

      const response = await request(app).post('/api/students').send(invalidStudent);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/students/:id', () => {
    it('should update a student', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedStudent = { id: '1', name: 'Updated Name', email: 'john@example.com', classId: 'class1', createdAt: new Date(), updatedAt: new Date() };
      mockStudentsService.prototype.updateStudent.mockResolvedValue(updatedStudent);

      const response = await request(app).put('/api/students/1').send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(updatedStudent);
      expect(mockStudentsService.prototype.updateStudent).toHaveBeenCalledWith('1', updateData);
    });

    it('should return 404 if student not found', async () => {
      mockStudentsService.prototype.updateStudent.mockResolvedValue(null);

      const response = await request(app).put('/api/students/999').send({ name: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Student not found');
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('should delete a student', async () => {
      mockStudentsService.prototype.deleteStudent.mockResolvedValue(true);

      const response = await request(app).delete('/api/students/1');

      expect(response.status).toBe(204);
      expect(mockStudentsService.prototype.deleteStudent).toHaveBeenCalledWith('1');
    });

    it('should return 404 if student not found', async () => {
      mockStudentsService.prototype.deleteStudent.mockResolvedValue(false);

      const response = await request(app).delete('/api/students/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Student not found');
    });
  });
});