import express from 'express';
import { getStudents } from '../controllers/user.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);
router.get('/students', requireRole(['SUPERADMIN', 'TEACHER']), getStudents);

export default router;
