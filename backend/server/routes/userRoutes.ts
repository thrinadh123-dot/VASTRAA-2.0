import express from 'express';
import {
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress,
    getUserAddresses
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/addresses')
    .get(protect, getUserAddresses)
    .post(protect, addUserAddress);

router.route('/addresses/:id')
    .put(protect, updateUserAddress)
    .delete(protect, deleteUserAddress);

router.route('/addresses/:id/default')
    .patch(protect, setDefaultAddress);

export default router;
