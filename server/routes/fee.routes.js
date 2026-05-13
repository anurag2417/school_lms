import express from 'express';
import { createFeeStructure, getFeeStructures, getStudentFees, processPayment } from '../controllers/fee.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/structure', requireRole(['SUPERADMIN']), createFeeStructure);
router.get('/structure', requireRole(['SUPERADMIN']), getFeeStructures);
router.get('/student', requireRole(['STUDENT']), getStudentFees);
router.post('/payment/:paymentId', requireRole(['STUDENT', 'PARENT']), processPayment);

export default router;
