import Wishlist from '../models/Wishlist';
import Cart from '../models/Cart';
import Product from '../models/Product';
import mongoose from 'mongoose';

/**
 * Service to handle Wishlist database and business logic
 */
class WishlistService {
    
    // Find product by ID
    async findProductById(productId: string) {
        return await Product.findById(productId);
    }

    // Get user wishlist
    async getWishlistByUserId(userId: string) {
        return await Wishlist.findOne({ userId }).populate('products.product') as any;
    }

    // Add product to wishlist
    async addToWishlist(userId: string, productId: string) {
        let wishlist = await Wishlist.findOne({ userId }) as any;

        if (wishlist) {
            const exists = wishlist.products.some((p: any) => p.product.toString() === productId);
            if (!exists) {
                wishlist.products.push({ product: productId } as any);
                await wishlist.save();
            }
        } else {
            wishlist = await Wishlist.create({
                userId,
                products: [{ product: productId }],
            }) as any;
        }

        return await Wishlist.findById(wishlist._id).populate('products.product');
    }

    // Remove product from wishlist
    async removeFromWishlist(userId: string, productId: string) {
        const wishlist = await Wishlist.findOne({ userId }) as any;
        if (wishlist) {
            wishlist.products = wishlist.products.filter(
                (p: any) => p.product.toString() !== productId
            );
            await wishlist.save();
            await wishlist.populate('products.product');
        }
        return wishlist;
    }

    // Get user cart or create one
    async getOrCreateCart(userId: string) {
        let cart = await Cart.findOne({ userId }) as any;
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: []
            }) as any;
        }
        return cart;
    }

    // Move single item from wishlist to cart
    async moveItemToCart(userId: string, productId: string, product: any, selectedSize: string, quantity: number) {
        const cart = await this.getOrCreateCart(userId);
        
        const existingItem = cart.items.find(
            (item: any) => item.product.toString() === productId && item.size === selectedSize
        );

        if (existingItem) {
            existingItem.quantity += quantity;
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

        const wishlist = await Wishlist.findOne({ userId }) as any;
        if (wishlist) {
            wishlist.products = wishlist.products.filter(
                (p: any) => p.product.toString() !== productId // using .product, not .productId
            );
            await wishlist.save();
        }

        return { cart, wishlist };
    }

    // Move all items from wishlist to cart
    async moveAllItemsToCart(userId: string, selectedSize: string) {
        const wishlist = await Wishlist.findOne({ userId }) as any;
        if (!wishlist || (wishlist.products as any[]).length === 0) {
            return null; // indicates empty
        }

        const cart = await this.getOrCreateCart(userId);

        for (const item of wishlist.products) {
            const p = item as any;
            const productIdStr = p.product.toString();
            const idx = cart.items.findIndex(
                (item: any) => item.product.toString() === productIdStr && item.size === selectedSize
            );
            if (idx > -1) {
                (cart as any).items[idx].quantity += 1;
            } else {
                const productInfo = await Product.findById(productIdStr);
                cart.items.push({
                    product: productIdStr,
                    quantity: 1,
                    size: selectedSize,
                    price: productInfo?.price || 0,
                    name: productInfo?.name || 'Unknown Product',
                    image: productInfo?.images?.[0] || '',
                } as any);
            }
        }

        await cart.save();

        // Clear wishlist
        (wishlist as any).products = [];
        await wishlist.save();

        return cart;
    }
}

export const wishlistService = new WishlistService();
