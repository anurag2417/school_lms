import express from 'express';
import { 
  createAssignment, 
  getAssignmentsByCourse, 
  submitAssignment, 
  getSubmissions, 
  gradeSubmission,
  getTeacherAssignments,
  getStudentAssignments
} from '../controllers/assignment.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

// Teacher/Admin routes
router.post('/', requireRole(['TEACHER', 'SUPERADMIN']), createAssignment);
router.get('/teacher', requireRole(['TEACHER']), getTeacherAssignments);
router.get('/:id/submissions', requireRole(['TEACHER', 'SUPERADMIN']), getSubmissions);
router.put('/submissions/:submissionId/grade', requireRole(['TEACHER', 'SUPERADMIN']), gradeSubmission);

// Student routes
router.get('/student', requireRole(['STUDENT']), getStudentAssignments);
router.post('/:id/submit', requireRole(['STUDENT']), submitAssignment);

// General route
router.get('/course/:courseId', getAssignmentsByCourse);

export default router;
