import { Request, Response } from 'express';
import { cartService } from '../services/cartService';
import asyncHandler from 'express-async-handler';
import { ApiResponseHandler } from '../utils/apiResponse';

/* ─── GET  /api/cart ──────────────────────────────────────────────────────── */
export const getCart = asyncHandler(async (req: any, res: Response) => {
    const cart = await cartService.getCartByUserId((req as any).user._id);

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

    let product = await cartService.checkProductExists(productId);

    if (!product) {
        return ApiResponseHandler.notFound(res, 'Product not found');
    }

    if (product.stock < quantity) {
        return ApiResponseHandler.error(res, 'Insufficient stock', 400);
    }

    // ATOMIC FIND-OR-CREATE using findOneAndUpdate with upsert
    let cart = await cartService.findOrCreateCart(req.user._id);

    const existingItem = cart.items.find(
        (item: any) =>
            (item.product?.toString() === productId || item.productId === productId) &&
            (item.size === size) &&
            (item.color === color)
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({ product: productId, quantity, size, color } as any);
    }

    // Comprehensive repair and cleanup before saving to avoid 500 validation errors
    await cartService.repairCart(cart);

    await cart.save();

    const updatedCart = await cartService.getCartByIdPopulated(cart._id.toString());
    ApiResponseHandler.success(res, {
        items: updatedCart?.items || []
    }, 'Item added to cart successfully');
});

export const removeCartItem = asyncHandler(async (req: any, res: Response) => {
    const { productId } = req.params;
    const { size, color } = req.query;

    const cart = await cartService.getCartByUserId(req.user._id);
    if (!cart) {
        return ApiResponseHandler.notFound(res, 'Cart not found');
    }

    if (size || color) {
        cart.items = cart.items.filter(
            (item: any) => !((item.product?.toString() === productId) &&
                (!size || item.size === size) &&
                (!color || item.color === color))
        ) as any;
    } else {
        cart.items = cart.items.filter(
            (item: any) => item.product?.toString() !== productId
        ) as any;
    }

    await cart.save();
    const updatedCart = await cartService.getCartByIdPopulated(cart._id.toString());
    ApiResponseHandler.success(res, {
        success: true,
        items: updatedCart?.items || []
    }, 'Item removed from cart successfully');
});

/* ─── POST /api/cart/merge ──────────────────────────────────────────────── */
export const mergeCart = asyncHandler(async (req: any, res: Response) => {
    const { guestItems } = req.body;

    // ATOMIC FIND-OR-CREATE using findOneAndUpdate with upsert
    let cart = await cartService.findOrCreateCart(req.user._id);

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
            } else {
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
    await cartService.repairCart(cart);

    await cart.save();
    const updatedCart = await cartService.getCartByIdPopulated(cart._id.toString());
    ApiResponseHandler.success(res, {
        items: updatedCart?.items || []
    }, 'Cart merged successfully');
});
