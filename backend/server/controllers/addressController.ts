import { Request, Response } from 'express';
import Address from '../models/Address';

// @desc    Add a new address
// @route   POST /api/addresses
// @access  Private
export const addAddress = async (req: Request, res: Response) => {
    try {
        // If this is set as default, unset any existing default address
        if (req.body.isDefault) {
            await Address.updateMany(
                { user: (req as any).user._id },
                { isDefault: false }
            );
        }

        const address = new Address({
            user: (req as any).user._id,
            ...req.body,
        });

        const createdAddress = await address.save();
        res.status(201).json(createdAddress);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req: Request, res: Response) => {
    try {
        const addresses = await Address.find({ user: (req as any).user._id }).sort({ isDefault: -1, createdAt: -1 });
        res.json(addresses);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req: Request, res: Response) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            res.status(404);
            throw new Error('Address not found');
        }

        // Ensure this address belongs to the user
        if (address.user.toString() !== (req as any).user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this address');
        }

        // If this is set as default, unset any existing default address
        if (req.body.isDefault && !address.isDefault) {
            await Address.updateMany(
                { user: (req as any).user._id, _id: { $ne: address._id } },
                { isDefault: false }
            );
        }

        address.fullName = req.body.fullName || address.fullName;
        address.phone = req.body.phone || address.phone;
        address.street = req.body.street || address.street;
        address.city = req.body.city || address.city;
        address.state = req.body.state || address.state;
        address.postalCode = req.body.postalCode || address.postalCode;
        address.country = req.body.country || address.country;
        if (req.body.isDefault !== undefined) {
            address.isDefault = req.body.isDefault;
        }

        const updatedAddress = await address.save();
        res.json(updatedAddress);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            res.status(404);
            throw new Error('Address not found');
        }

        // Ensure this address belongs to the user
        if (address.user.toString() !== (req as any).user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this address');
        }

        await Address.deleteOne({ _id: address._id });
        res.json({ message: 'Address removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
