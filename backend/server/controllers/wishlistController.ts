import mongoose from 'mongoose';
import { Response } from 'express';
import { wishlistService } from '../services/wishlistService';
import asyncHandler from 'express-async-handler';
import { ApiResponseHandler } from '../utils/apiResponse';

/* ─── GET  /api/wishlist ──────────────────────────────────────────────────── */
export const getWishlist = asyncHandler(async (req: any, res: Response) => {
    const wishlist = await wishlistService.getWishlistByUserId(req.user._id);
    ApiResponseHandler.success(res, {
        products: wishlist?.products || []
    }, 'Wishlist retrieved successfully');
});

/* ─── POST /api/wishlist ─────────────────────────────────────────────────── */
export const addToWishlist = asyncHandler(async (req: any, res: Response) => {
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return ApiResponseHandler.error(res, 'Invalid product ID', 400);
    }

    const product = await wishlistService.findProductById(productId);
    if (!product) {
        return ApiResponseHandler.notFound(res, 'Product not found');
    }

    const updatedWishlist = await wishlistService.addToWishlist(req.user._id, productId);

    ApiResponseHandler.created(res, {
        products: updatedWishlist?.products || []
    }, 'Item added to wishlist successfully');
});

/* ─── DELETE /api/wishlist/:productId ─────────────────────────────────────── */
export const removeFromWishlist = asyncHandler(async (req: any, res: Response) => {
    const { productId } = req.params;

    const wishlist = await wishlistService.removeFromWishlist(req.user._id, productId);

    ApiResponseHandler.success(res, {
        products: wishlist?.products || []
    }, 'Item removed from wishlist successfully');
});

/* ─── POST /api/wishlist/move-to-cart ─────────────────────────────────────── */
export const moveWishlistItemToCart = asyncHandler(async (req: any, res: Response) => {
    const { productId, size: selectedSize = 'M', quantity = 1 } = req.body;

    if (!productId) {
        return ApiResponseHandler.error(res, 'Product ID is required', 400);
    }

    try {
        let product = await wishlistService.findProductById(productId);

        if (!product) {
            return ApiResponseHandler.notFound(res, 'Product not found');
        }

        // Add to cart
        const { cart, wishlist } = await wishlistService.moveItemToCart(req.user._id, productId, product, selectedSize, quantity);

        ApiResponseHandler.success(res, {
            success: true,
            cart: cart.items,
            wishlistProducts: wishlist?.products || [],
        }, 'Moved to cart successfully');
    } catch (error) {
        console.error('Move to cart error:', error);
        ApiResponseHandler.error(res, 'Server error', 500);
    }
});

/* ─── POST /api/wishlist/move-all-to-cart ──────────────────────────────────── */
export const moveAllToCart = asyncHandler(async (req: any, res: Response) => {
    const { selectedSize = 'M' } = req.body;

    const cart = await wishlistService.moveAllItemsToCart(req.user._id, selectedSize);
    
    if (!cart) {
        return ApiResponseHandler.error(res, 'Wishlist is empty', 400);
    }

    ApiResponseHandler.success(res, {
        cart: cart.items,
        wishlistProducts: [],
    }, 'All items moved to cart successfully');
});
