import express from 'express';
import { getCart, addToCart, removeFromCart, mergeCart } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getCart);
router.route('/add').post(protect, addToCart);
router.route('/remove/:productId').delete(protect, removeFromCart);
router.route('/merge').post(protect, mergeCart);

export default router;
