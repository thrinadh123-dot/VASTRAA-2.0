import express from 'express';
import {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress
} from '../controllers/addressController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .post(protect as any, addAddress)
    .get(protect as any, getAddresses);

router.route('/:id')
    .put(protect as any, updateAddress)
    .delete(protect as any, deleteAddress);

export default router;
