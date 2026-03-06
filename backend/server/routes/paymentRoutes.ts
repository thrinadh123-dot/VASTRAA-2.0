import express from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);

export default router;
