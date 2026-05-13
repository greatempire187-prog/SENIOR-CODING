import { Router } from 'express';
import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../modules/students/students-controller';
import { requireAuth, allowRoles } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, allowRoles('admin', 'staff', 'teacher'), getStudents);
router.get('/:id', requireAuth, allowRoles('admin', 'staff', 'teacher', 'student'), getStudent);
router.post('/', requireAuth, allowRoles('admin', 'staff'), createStudent);
router.put('/:id', requireAuth, allowRoles('admin', 'staff'), updateStudent);
router.delete('/:id', requireAuth, allowRoles('admin'), deleteStudent);

export default router;