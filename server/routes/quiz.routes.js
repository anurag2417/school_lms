import express from 'express';
import { createQuiz, getQuizzesByCourse, attemptQuiz, getTeacherQuizzes, getStudentQuizzes, getQuiz } from '../controllers/quiz.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', requireRole(['TEACHER', 'SUPERADMIN']), createQuiz);
router.get('/teacher', requireRole(['TEACHER']), getTeacherQuizzes);
router.get('/student', requireRole(['STUDENT']), getStudentQuizzes);
router.get('/course/:courseId', getQuizzesByCourse);
router.get('/:id', getQuiz);
router.post('/:id/attempt', requireRole(['STUDENT']), attemptQuiz);

export default router;
