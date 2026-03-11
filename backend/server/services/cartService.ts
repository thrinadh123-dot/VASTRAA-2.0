import Cart from '../models/Cart';
import Product from '../models/Product';
import mongoose from 'mongoose';

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

/**
 * Service to handle Cart database and business logic
 */
class CartService {
    
    // Get user cart by user ID
    async getCartByUserId(userId: string) {
        const cart = await Cart.findOne({ userId })
            .populate('items.product');

        if (cart) {
            if (await repairAndCleanupCart(cart)) {
                await cart.save();
            }
        }
        return cart;
    }

    // Find or create cart for user
    async findOrCreateCart(userId: string) {
        return await Cart.findOneAndUpdate(
            { userId },
            { $setOnInsert: { userId, items: [] } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
    }
    
    // Get cart by ID with populated items
    async getCartByIdPopulated(cartId: string) {
        return await Cart.findById(cartId).populate('items.product');
    }

    // Check if product exists
    async checkProductExists(productId: string) {
        return await Product.findById(productId);
    }

    // Repair and cleanup cart items
    async repairCart(cart: any) {
        return await repairAndCleanupCart(cart);
    }
}

export const cartService = new CartService();
