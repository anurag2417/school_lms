import express from 'express';
import { 
  enrollStudent, 
  getStudentEnrollments, 
  updateProgress, 
  getCourseProgress,
  getCourseEnrollments
} from '../controllers/enrollment.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', requireRole(['SUPERADMIN', 'TEACHER']), enrollStudent);
router.get('/student/:studentId', getStudentEnrollments);
router.get('/course/:courseId', requireRole(['SUPERADMIN', 'TEACHER']), getCourseEnrollments);
router.put('/progress', requireRole(['STUDENT']), updateProgress);
router.get('/progress/:studentId/:courseId', getCourseProgress);

export default router;
