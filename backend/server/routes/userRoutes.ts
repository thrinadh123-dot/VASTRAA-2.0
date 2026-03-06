import express from 'express';
import {
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getAddresses
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/addresses')
    .get(protect, getAddresses)
    .post(protect, addAddress);

router.route('/addresses/:id')
    .put(protect, updateAddress)
    .delete(protect, deleteAddress);

router.route('/addresses/:id/default')
    .put(protect, setDefaultAddress);

export default router;
