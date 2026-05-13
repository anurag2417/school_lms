import express from 'express';
import { 
  createCourse, 
  getCourses, 
  getCourseById, 
  updateCourse, 
  deleteCourse, 
  addChapter, 
  addLesson 
} from '../controllers/course.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All course routes require authentication
router.use(verifyToken);

router.post('/', requireRole(['TEACHER', 'SUPERADMIN']), createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id', requireRole(['TEACHER', 'SUPERADMIN']), updateCourse);
router.delete('/:id', requireRole(['TEACHER', 'SUPERADMIN']), deleteCourse);

router.post('/:id/chapters', requireRole(['TEACHER', 'SUPERADMIN']), addChapter);
router.post('/:id/chapters/:chapterId/lessons', requireRole(['TEACHER', 'SUPERADMIN']), addLesson);

export default router;
