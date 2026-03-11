import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import { ApiResponseHandler } from '../utils/apiResponse';

/**
 * @desc    Get user addresses
 * @route   GET /api/users/addresses
 * @access  Private
 */
export const getUserAddresses = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json(user.addresses || []);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

/**
 * @desc    Add new address
 * @route   POST /api/users/addresses
 * @access  Private
 */
export const addUserAddress = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const addressData = req.body;

        // If first address, or explicitly set, make it default
        const isDefault = user.addresses.length === 0 ? true : !!addressData.isDefault;

        if (isDefault) {
            user.addresses.forEach((addr: any) => { addr.isDefault = false; });
        }

        user.addresses.push({ ...addressData, isDefault });
        await user.save();

        res.json(user.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

/**
 * @desc    Delete address
 * @route   DELETE /api/users/addresses/:id
 * @access  Private
 */
export const deleteUserAddress = asyncHandler(async (req: any, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    if (user) {
        user.addresses = user.addresses.filter(
            (addr: any) => addr._id.toString() !== id
        ) as any;

        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

/**
 * @desc    Update address
 * @route   PUT /api/users/addresses/:id
 */
export const updateUserAddress = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const address = (user.addresses as any).id(req.params.id);
        if (address) {
            Object.assign(address, req.body);
            if (req.body.isDefault) {
                user.addresses.forEach((addr: any) => {
                    if (addr._id.toString() !== req.params.id) addr.isDefault = false;
                });
            }
            await user.save();
            res.json(user.addresses);
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

/**
 * @desc    Set default address
 * @route   PATCH /api/users/addresses/:id/default
 * @access  Private
 */
export const setDefaultAddress = asyncHandler(async (req: any, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    if (user) {
        user.addresses.forEach((addr: any) => {
            addr.isDefault = addr._id.toString() === id;
        });

        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


