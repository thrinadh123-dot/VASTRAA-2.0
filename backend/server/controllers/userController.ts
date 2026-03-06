import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import { ApiResponseHandler } from '../utils/apiResponse';

/**
 * @desc    Get user addresses
 * @route   GET /api/users/addresses
 * @access  Private
 */
export const getAddresses = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        ApiResponseHandler.success(res, user.addresses || [], 'Addresses retrieved successfully');
    } else {
        ApiResponseHandler.notFound(res, 'User not found');
    }
});

/**
 * @desc    Add new address
 * @route   POST /api/users/addresses
 * @access  Private
 */
export const addAddress = asyncHandler(async (req: any, res: Response) => {
    const { fullName, phone, street, city, state, postalCode, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        // If first address, always set as default
        const shouldBeDefault = user.addresses.length === 0 ? true : isDefault;

        if (shouldBeDefault) {
            // Unset other defaults
            user.addresses.forEach((addr: any) => {
                addr.isDefault = false;
            });
        }

        const newAddress = {
            fullName,
            phone,
            street,
            city,
            state,
            postalCode,
            country: country || 'India',
            isDefault: shouldBeDefault
        };

        user.addresses.push(newAddress);
        await user.save();

        ApiResponseHandler.created(res, user.addresses, 'Address added successfully');
    } else {
        ApiResponseHandler.notFound(res, 'User not found');
    }
});

/**
 * @desc    Update address
 * @route   PUT /api/users/addresses/:id
 * @access  Private
 */
export const updateAddress = asyncHandler(async (req: any, res: Response) => {
    const { fullName, phone, street, city, state, postalCode, country, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return ApiResponseHandler.notFound(res, 'Address not found');
        }

        if (isDefault && !address.isDefault) {
            // New default address, unset others
            user.addresses.forEach((addr: any) => {
                addr.isDefault = false;
            });
        }

        address.fullName = fullName || address.fullName;
        address.phone = phone || address.phone;
        address.street = street || address.street;
        address.city = city || address.city;
        address.state = state || address.state;
        address.postalCode = postalCode || address.postalCode;
        address.country = country || address.country;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save();
        ApiResponseHandler.success(res, user.addresses, 'Address updated successfully');
    } else {
        ApiResponseHandler.notFound(res, 'User not found');
    }
});

/**
 * @desc    Delete address
 * @route   DELETE /api/users/addresses/:id
 * @access  Private
 */
export const deleteAddress = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return ApiResponseHandler.notFound(res, 'Address not found');
        }

        const wasDefault = address.isDefault;
        user.addresses.pull(req.params.id);

        // If we deleted the default and there are other addresses, set the first one as default
        if (wasDefault && user.addresses.length > 0 && user.addresses[0]) {
            user.addresses[0]!.isDefault = true;
        }

        await user.save();
        ApiResponseHandler.success(res, user.addresses, 'Address deleted successfully');
    } else {
        ApiResponseHandler.notFound(res, 'User not found');
    }
});

/**
 * @desc    Set default address
 * @route   PUT /api/users/addresses/:id/default
 * @access  Private
 */
export const setDefaultAddress = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return ApiResponseHandler.notFound(res, 'Address not found');
        }

        user.addresses.forEach((addr: any) => {
            if (addr && addr._id) {
                addr.isDefault = addr._id.toString() === req.params.id;
            }
        });

        await user.save();
        ApiResponseHandler.success(res, user.addresses, 'Default address updated');
    } else {
        ApiResponseHandler.notFound(res, 'User not found');
    }
});
