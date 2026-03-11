import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist, moveWishlistItemToCart, moveAllToCart } from '../controllers/wishlistController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getWishlist).post(protect, addToWishlist);
router.route('/:productId').delete(protect, removeFromWishlist);
router.route('/move-to-cart').post(protect, moveWishlistItemToCart);
router.route('/move-all-to-cart').post(protect, moveAllToCart);

export default router;
