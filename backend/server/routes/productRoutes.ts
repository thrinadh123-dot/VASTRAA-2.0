import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, updateProductStock } from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';
import { authorize } from '../middleware/authorize';

const router = express.Router();

router.route('/').get(getProducts).post(protect, authorize('admin'), createProduct);
router.route('/:id').get(protect, getProductById).put(protect, authorize('admin'), updateProduct).delete(protect, authorize('admin'), deleteProduct);
router.route('/:id/stock').patch(protect, authorize('admin'), updateProductStock);

export default router;
