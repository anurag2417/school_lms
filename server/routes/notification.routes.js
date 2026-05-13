import express from 'express';
import { createNotification, getMyNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', requireRole(['SUPERADMIN', 'TEACHER']), createNotification);
router.get('/', getMyNotifications);
router.post('/read-all', markAllAsRead);
router.post('/:id/read', markAsRead);

export default router;
