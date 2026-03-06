"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
/**
 * @desc    Get dashboard analytics
 * @route   GET /api/dashboard/stats
 * @access  Private/Admin
 */
exports.getDashboardStats = (0, express_async_handler_1.default)(async (req, res) => {
    const totalOrders = await Order_1.default.countDocuments();
    const totalUsers = await User_1.default.countDocuments();
    const totalProducts = await Product_1.default.countDocuments();
    const orders = await Order_1.default.find({ paymentStatus: 'Paid' });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const lowStockProducts = await Product_1.default.find({ stock: { $lt: 5 } }).select('name stock');
    const pendingOrders = await Order_1.default.countDocuments({ deliveryStatus: 'Pending' });
    res.json({
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        pendingOrders,
        lowStockProducts
    });
});
//# sourceMappingURL=dashboardController.js.map