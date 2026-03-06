import { Response } from 'express';
import Wishlist from '../models/Wishlist';
import Cart from '../models/Cart';
import Product from '../models/Product';
import asyncHandler from 'express-async-handler';
import { ApiResponseHandler } from '../utils/apiResponse';

/* ─── GET  /api/wishlist ──────────────────────────────────────────────────── */
export const getWishlist = asyncHandler(async (req: any, res: Response) => {
    const wishlist = await Wishlist.findOne({ userId: (req as any).user._id }) as any;
    ApiResponseHandler.success(res, {
        products: wishlist?.products || []
    }, 'Wishlist retrieved successfully');
});

/* ─── POST /api/wishlist/add ──────────────────────────────────────────────── */
export const addToWishlist = asyncHandler(async (req: any, res: Response) => {
    const { productId } = req.body;

    if (!productId) {
        return ApiResponseHandler.error(res, 'Product ID is required', 400);
    }

    let product = await Product.findById(productId);

    if (!product) {
        // LAZY REGISTRATION: Create product if it doesn't exist but we have info
        const { name, price, description, category, image, images, stock } = req.body;
        if (name && price !== undefined) {
            product = await Product.create({
                _id: productId,
                name,
                price,
                description: description || name,
                category: category || 'Men',
                images: images || [image || ''],
                stock: stock !== undefined ? stock : 10,
                sizes: req.body.sizes || ['M']
            });
            console.log(`Lazy Registered product (Wishlist): ${productId} (${name})`);
        } else {
            return ApiResponseHandler.notFound(res, 'Product not found and no metadata provided for registration');
        }
    }

    let wishlist = await Wishlist.findOne({ userId: (req as any).user._id }) as any;

    if (wishlist) {
        const exists = wishlist.products.some((p: any) => p.productId === productId);
        if (!exists) {
            wishlist.products.push({
                productId,
                name: product.name,
                image: product.images?.[0] || '',
                price: product.price,
                category: product.category,
            } as any);
            await wishlist.save();
        }
    } else {
        wishlist = await Wishlist.create({
            userId: (req as any).user._id,
            products: [{
                productId,
                name: product.name,
                image: product.images?.[0] || '',
                price: product.price,
                category: product.category,
            }],
        }) as any;
    }

    ApiResponseHandler.created(res, {
        products: wishlist.products
    }, 'Item added to wishlist successfully');
});

/* ─── DELETE /api/wishlist/remove/:productId ──────────────────────────────── */
export const removeFromWishlist = asyncHandler(async (req: any, res: Response) => {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: (req as any).user._id }) as any;
    if (wishlist) {
        (wishlist as any).products = wishlist.products.filter(
            (p: any) => p.productId !== productId
        );
        await wishlist.save();
    }

    ApiResponseHandler.success(res, {
        products: wishlist?.products || []
    }, 'Item removed from wishlist successfully');
});

/* ─── POST /api/wishlist/move-to-cart ─────────────────────────────────────── */
export const moveToCart = asyncHandler(async (req: any, res: Response) => {
    const { product: productId, size: selectedSize, quantity = 1 } = req.body;

    if (!productId) {
        return ApiResponseHandler.error(res, 'Product ID is required', 400);
    }

    let product = await Product.findById(productId);

    if (!product) {
        // LAZY REGISTRATION: Create product if it doesn't exist but we have info
        const { name, price, description, category, image, images, stock } = req.body;
        if (name && price !== undefined) {
            product = await Product.create({
                _id: productId,
                name,
                price,
                description: description || name,
                category: category || 'Men',
                images: images || [image || ''],
                stock: stock !== undefined ? stock : 10,
                sizes: req.body.sizes || ['M']
            });
            console.log(`Lazy Registered product (MoveToCart): ${productId} (${name})`);
        } else {
            return ApiResponseHandler.notFound(res, 'Product not found and no metadata provided for registration');
        }
    }

    // Add to cart
    let cart = await Cart.findOne({ userId: (req as any).user._id }) as any;
    if (cart) {
        const idx = cart.items.findIndex(
            (p: any) => (p.product?.toString() === productId) && (p.size === selectedSize)
        );
        if (idx > -1) {
            cart.items[idx].quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                size: selectedSize,
                price: product.price,
                name: product.name,
                image: product.images?.[0] || ''
            } as any);
        }
        await cart.save();
    } else {
        cart = await Cart.create({
            userId: (req as any).user._id,
            items: [{
                product: productId,
                quantity,
                size: selectedSize,
                price: product.price,
                name: product.name,
                image: product.images?.[0] || ''
            }],
        }) as any;
    }

    // Remove from wishlist
    const wishlist = await Wishlist.findOne({ userId: (req as any).user._id }) as any;
    if (wishlist) {
        wishlist.products = wishlist.products.filter(
            (p: any) => p.productId !== productId
        );
        await wishlist.save();
    }

    ApiResponseHandler.success(res, {
        cart: cart?.items || [],
        wishlistProducts: wishlist?.products || [],
    }, 'Item moved to cart successfully');
});

/* ─── POST /api/wishlist/move-all-to-cart ──────────────────────────────────── */
export const moveAllToCart = asyncHandler(async (req: any, res: Response) => {
    const { selectedSize = 'M' } = req.body;

    const wishlist = await Wishlist.findOne({ userId: (req as any).user._id }) as any;
    if (!wishlist || (wishlist.products as any[]).length === 0) {
        return ApiResponseHandler.error(res, 'Wishlist is empty', 400);
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
        cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    for (const product of wishlist.products) {
        const p = product as any;
        const idx = cart.items.findIndex(
            (item: any) => (item.product?.toString() === p.productId || item.productId === p.productId) && (item.size === selectedSize || item.selectedSize === selectedSize)
        );
        if (idx > -1) {
            (cart as any).items[idx].quantity += 1;
        } else {
            cart.items.push({
                product: p.productId,
                quantity: 1,
                size: selectedSize,
                price: p.price,
                name: p.name,
                image: p.image,
            } as any);
        }
    }

    await cart.save();

    // Clear wishlist
    (wishlist as any).products = [];
    await wishlist.save();

    ApiResponseHandler.success(res, {
        cart: cart.items,
        wishlistProducts: [],
    }, 'All items moved to cart successfully');
});
