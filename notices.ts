import { Router } from 'express';
import { getNotices, createNotice } from '../modules/notices/notices-controller';
import { requireAuth, allowRoles } from '../middlewares/auth';

const router = Router();

router.get('/', requireAuth, allowRoles('admin', 'staff', 'teacher', 'student'), getNotices);
router.post('/', requireAuth, allowRoles('admin', 'staff'), createNotice);

export default router;