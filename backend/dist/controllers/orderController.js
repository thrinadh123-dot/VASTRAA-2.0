"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrders = exports.getMyOrders = exports.getOrderById = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiResponse_1 = require("../utils/apiResponse");
/**
 * @desc    Create new order derived from user's DB Cart
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = (0, express_async_handler_1.default)(async (req, res) => {
    // We derive everything from the current cart in DB to prevent price tampering
    const cart = await Cart_1.default.findOne({ userId: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
        return apiResponse_1.ApiResponseHandler.error(res, 'No items in cart', 400);
    }
    const orderItems = [];
    let itemsPrice = 0;
    // Validate stock and verify prices for all items
    for (const item of cart.items) {
        const product = item.product;
        if (!product) {
            return apiResponse_1.ApiResponseHandler.notFound(res, 'Product not found for item in cart');
        }
        if (product.stock < item.quantity) {
            return apiResponse_1.ApiResponseHandler.error(res, `Insufficient stock for ${product.name}`, 400);
        }
        // Add to order items with "snapshot" price
        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            size: item.size,
            priceAtPurchase: product.price,
        });
        itemsPrice += product.price * item.quantity;
    }
    const shippingPrice = itemsPrice > 1000 ? 0 : 100; // Example logic: Free shipping over ₹1000
    const taxPrice = Number((0.18 * itemsPrice).toFixed(2)); // 18% GST standard
    const totalAmount = itemsPrice + shippingPrice + taxPrice;
    // Process Stock Decrement (Atomic sequence)
    for (const item of cart.items) {
        await Product_1.default.findByIdAndUpdate(item.product._id, {
            $inc: { stock: -item.quantity }
        });
    }
    const { transactionId, shippingAddress, paymentMethod } = req.body;
    const order = new Order_1.default({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalAmount,
        paymentStatus: transactionId ? 'Paid' : 'Pending',
        deliveryStatus: 'Pending',
        transactionId,
    });
    const createdOrder = await order.save();
    // Clear the cart after successful order
    cart.items = [];
    await cart.save();
    return apiResponse_1.ApiResponseHandler.created(res, createdOrder, 'Order created successfully');
});
/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = (0, express_async_handler_1.default)(async (req, res) => {
    const order = await Order_1.default.findById(req.params.id)
        .populate('user', 'username email')
        .populate('items.product');
    if (!order) {
        return apiResponse_1.ApiResponseHandler.notFound(res, 'Order not found');
    }
    // Ensure user can only see their own order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return apiResponse_1.ApiResponseHandler.forbidden(res, 'Not authorized to view this order');
    }
    return apiResponse_1.ApiResponseHandler.success(res, order, 'Order retrieved successfully');
});
/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
exports.getMyOrders = (0, express_async_handler_1.default)(async (req, res) => {
    const orders = await Order_1.default.find({ user: req.user._id }).sort({ createdAt: -1 });
    return apiResponse_1.ApiResponseHandler.success(res, orders, 'Orders retrieved successfully');
});
/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
exports.getOrders = (0, express_async_handler_1.default)(async (req, res) => {
    const orders = await Order_1.default.find({}).populate('user', 'username email').sort({ createdAt: -1 });
    return apiResponse_1.ApiResponseHandler.success(res, orders, 'All orders retrieved successfully');
});
/**
 * @desc    Update order delivery status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = (0, express_async_handler_1.default)(async (req, res) => {
    const { deliveryStatus } = req.body;
    const order = await Order_1.default.findById(req.params.id);
    if (!order) {
        return apiResponse_1.ApiResponseHandler.notFound(res, 'Order not found');
    }
    order.deliveryStatus = deliveryStatus || order.deliveryStatus;
    const updatedOrder = await order.save();
    return apiResponse_1.ApiResponseHandler.success(res, updatedOrder, 'Order status updated successfully');
});
//# sourceMappingURL=orderController.js.map