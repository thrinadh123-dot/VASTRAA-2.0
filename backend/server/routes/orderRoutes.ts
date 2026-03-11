import express from 'express';
import { createOrder, getOrderById, getMyOrders, getOrders, updateOrderStatus, cancelOrder, reorder } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';
import { authorize } from '../middleware/authorize';

const router = express.Router();

router.route('/my-orders').get(protect, getMyOrders);
router.route('/').post(protect, createOrder).get(protect, authorize('admin'), getOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);
router.route('/:id/cancel').patch(protect, cancelOrder);
router.route('/:id/reorder').post(protect, reorder);

export default router;
