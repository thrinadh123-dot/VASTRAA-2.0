import Order from '../models/Order';
import Product from '../models/Product';
import Cart from '../models/Cart';

/**
 * Service to handle Order database and business logic
 */
class OrderService {
    
    // Check if product exists and return it
    async getProductForOrder(productId: string) {
        return await Product.findById(productId);
    }
    
    // Decrease product stock
    async decreaseProductStock(productId: string, quantity: number) {
        return await Product.findByIdAndUpdate(productId, {
            $inc: { stock: -quantity }
        });
    }

    // Increase product stock
    async increaseProductStock(productId: string, quantity: number) {
        return await Product.findByIdAndUpdate(productId, {
            $inc: { stock: quantity }
        });
    }

    // Clear user cart
    async clearUserCart(userId: string) {
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = [] as any;
            await cart.save();
        }
        return cart;
    }

    // Get order by ID with populated fields
    async getOrderById(orderId: string) {
        return await Order.findById(orderId)
            .populate('user', 'username email')
            .populate('orderItems.product');
    }

    // Get orders for a specific user
    async getOrdersByUser(userId: string) {
        return await Order.find({ user: userId }).sort({ createdAt: -1 });
    }

    // Get all orders (for admin)
    async getAllOrders() {
        return await Order.find({}).populate('user', 'username email').sort({ createdAt: -1 });
    }
    
    // Find plain order by ID
    async findOrderById(orderId: string) {
        return await Order.findById(orderId);
    }
}

export const orderService = new OrderService();
