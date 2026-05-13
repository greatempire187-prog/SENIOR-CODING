import { StudentsRepository, Student, CreateStudentInput } from './students-repository';

const repository = new StudentsRepository();

export class StudentsService {
  async getAllStudents(limit = 10, offset = 0): Promise<Student[]> {
    return repository.findAll(limit, offset);
  }

  async getStudentById(id: string): Promise<Student | null> {
    return repository.findById(id);
  }

  async createStudent(input: CreateStudentInput): Promise<Student> {
    const existing = await repository.findByEmail(input.email);
    if (existing) {
      throw new Error('Student with this email already exists');
    }
    return repository.create(input);
  }

  async updateStudent(id: string, input: Partial<CreateStudentInput>): Promise<Student | null> {
    return repository.update(id, input);
  }

  async deleteStudent(id: string): Promise<boolean> {
    return repository.delete(id);
  }
}