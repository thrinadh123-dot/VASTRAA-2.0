import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist, moveToCart, moveAllToCart } from '../controllers/wishlistController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getWishlist);
router.route('/add').post(protect, addToWishlist);
router.route('/remove/:productId').delete(protect, removeFromWishlist);
router.route('/move-to-cart').post(protect, moveToCart);
router.route('/move-all-to-cart').post(protect, moveAllToCart);

export default router;
