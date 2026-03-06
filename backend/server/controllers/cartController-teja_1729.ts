import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import { ApiResponseHandler } from '../utils/apiResponse';

/**
 * Robustly repairs cart items by mapping legacy 'productId' to the new 'product' field.
 * Filters out items that have neither field, ensuring the document satisfies Mongoose validation.
 */
const repairAndCleanupCart = async (cart: any) => {
    if (!cart || !cart.items) return false;

    const initialCount = cart.items.length;
    let needsSave = false;
    const itemsToKeep: any[] = [];

    for (const item of cart.items) {
        // Repair: Move legacy ID to current field if missing
        if (!item.product && item.productId) {
            item.product = item.productId;
            needsSave = true;
        }

        if (item.product) {
            // Check if product actually exists in DB
            const exists = await Product.exists({ _id: item.product });
            if (exists) {
                itemsToKeep.push(item);
            } else {
                needsSave = true;
                console.warn(`Product ${item.product} not found in DB. Removing from cart.`);
            }
        }
    }

    if (needsSave || itemsToKeep.length !== initialCount) {
        cart.items = itemsToKeep;
        return true;
    }
    return false;
};

/* ─── GET  /api/cart ──────────────────────────────────────────────────────── */
export const getCart = asyncHandler(async (req: any, res: Response) => {
    const cart = await Cart.findOne({ userId: (req as any).user._id })
        .populate('items.product');

    if (cart) {
        if (await repairAndCleanupCart(cart)) {
            await cart.save();
        }
    }

    ApiResponseHandler.success(res, {
        items: cart?.items || []
    }, 'Cart retrieved successfully');
});

/* ─── POST /api/cart/add ──────────────────────────────────────────────────── */
export const addToCart = asyncHandler(async (req: any, res: Response) => {
    const { product: productId, quantity, size, color } = req.body;

    if (!productId) {
        return ApiResponseHandler.error(res, 'Product ID is required', 400);
    }

    let product = await Product.findById(productId);

    if (!product) {
        return ApiResponseHandler.notFound(res, 'Product not found');
    }

    if (product.stock < quantity) {
        return ApiResponseHandler.error(res, 'Insufficient stock', 400);
    }

    // ATOMIC FIND-OR-CREATE using findOneAndUpdate with upsert
    let cart = await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { $setOnInsert: { userId: req.user._id, items: [] } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const existingItem = cart.items.find(
        (item: any) =>
            (item.product?.toString() === productId || item.productId === productId) &&
            (item.size === size) &&
            (item.color === color)
    );

    if (existingItem) {
        existingItem.quantity += quantity;
        // If quantity becomes 0 or negative, remove the item
        if (existingItem.quantity <= 0) {
            cart.items = cart.items.filter(
                (item: any) => item !== existingItem
            ) as any;
        }
    } else if (quantity > 0) {
        cart.items.push({ product: productId, quantity, size, color } as any);
    }

    // Comprehensive repair and cleanup before saving to avoid 500 validation errors
    await repairAndCleanupCart(cart);

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    ApiResponseHandler.success(res, {
        items: updatedCart?.items || []
    }, 'Item added to cart successfully');
});

/* ─── DELETE /api/cart/remove/:productId ───────────────────────────────── */
export const removeFromCart = asyncHandler(async (req: any, res: Response) => {
    const { productId } = req.params;
    const { size, color } = req.query;

    const cart = await Cart.findOne({ userId: (req as any).user._id });
    if (!cart) {
        return ApiResponseHandler.notFound(res, 'Cart not found');
    }

    if (size || color) {
        cart.items = cart.items.filter(
            (item: any) => !((item.product?.toString() === productId || item.productId === productId) && item.size === size && item.color === color)
        ) as any;
    } else {
        cart.items = cart.items.filter(
            (item: any) => (item.product?.toString() !== productId && item.productId !== productId)
        ) as any;
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    ApiResponseHandler.success(res, {
        items: updatedCart?.items || []
    }, 'Item removed from cart successfully');
});

/* ─── POST /api/cart/merge ──────────────────────────────────────────────── */
export const mergeCart = asyncHandler(async (req: any, res: Response) => {
    const { guestItems } = req.body;

    // ATOMIC FIND-OR-CREATE using findOneAndUpdate with upsert
    let cart = await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { $setOnInsert: { userId: req.user._id, items: [] } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (guestItems && Array.isArray(guestItems)) {
        for (const item of guestItems) {
            const existing = cart.items.find(
                (i: any) =>
                    (i.product?.toString() === item.product || i.productId === item.product) &&
                    i.size === item.size &&
                    i.color === item.color
            );

            if (existing) {
                existing.quantity += item.quantity;
                if (existing.quantity <= 0) {
                    cart.items = cart.items.filter((i: any) => i !== existing) as any;
                }
            } else if (item.quantity > 0) {
                cart.items.push({
                    product: item.product,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color
                } as any);
            }
        }
    }

    // Comprehensive repair and cleanup before saving
    await repairAndCleanupCart(cart);

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    ApiResponseHandler.success(res, {
        items: updatedCart?.items || []
    }, 'Cart merged successfully');
});
