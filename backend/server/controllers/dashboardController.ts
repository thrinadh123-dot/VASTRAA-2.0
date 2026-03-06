import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/dashboard/stats
 * @access  Private/Admin
 */
export const getDashboardStats = asyncHandler(async (req: any, res: Response) => {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find({ paymentStatus: 'Paid' });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    const lowStockProducts = await Product.find({ stock: { $lt: 5 } }).select('name stock');

    const pendingOrders = await Order.countDocuments({ deliveryStatus: 'Pending' });

    res.json({
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        pendingOrders,
        lowStockProducts
    });
});
