import express from 'express';
import { createSession, getCourseSessions, updateRecord, getStudentAttendance } from '../controllers/attendance.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/session', requireRole(['TEACHER', 'SUPERADMIN']), createSession);
router.get('/session/:courseId', requireRole(['TEACHER', 'SUPERADMIN']), getCourseSessions);
router.put('/record/:recordId', requireRole(['TEACHER', 'SUPERADMIN']), updateRecord);
router.get('/student', requireRole(['STUDENT']), getStudentAttendance);

export default router;
