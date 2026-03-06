import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import asyncHandler from 'express-async-handler';
import { ApiResponseHandler } from '../utils/apiResponse';

/**
 * @desc    Create new order derived from user's DB Cart
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = asyncHandler(async (req: any, res: Response) => {
    const { transactionId, shippingAddress, paymentMethod, orderItems: bodyOrderItems } = req.body;

    // Step 6: Debug Logging (Temporary)
    console.log('Incoming Order Items:', JSON.stringify(bodyOrderItems, null, 2));

    if (!bodyOrderItems || !Array.isArray(bodyOrderItems) || bodyOrderItems.length === 0) {
        return ApiResponseHandler.error(res, 'No items in order', 400);
    }

    const validatedItems: any[] = [];
    let itemsPrice = 0;

    // A. Validate Product IDs and B. Verify Product Exists & Stock
    for (const item of bodyOrderItems) {
        // Product ID validation (relaxed for custom string IDs)
        if (!item.product) {
            return ApiResponseHandler.error(res, `Missing product ID`, 400);
        }

        const product = await Product.findById(item.product);

        // Step 2B: Verify Product Exists
        if (!product) {
            return ApiResponseHandler.error(res, `Product not found: ${item.product}`, 404);
        }

        // Step 3: Implement Stock Reduction (Check first)
        const qty = item.qty || item.quantity; // Support both naming variants from frontend
        if (product.stock < qty) {
            return ApiResponseHandler.error(res, `Insufficient stock for ${product.name}`, 400);
        }

        validatedItems.push({
            product: product._id,
            name: product.name,
            image: product.images?.[0] || '',
            quantity: qty,
            size: item.size,
            price: product.originalPrice && product.discountPercentage
                ? Math.round(product.originalPrice * (1 - product.discountPercentage / 100))
                : product.price,
            originalPrice: product.originalPrice,
            discountPercentage: product.discountPercentage,
        });

        const effectivePrice = product.originalPrice && product.discountPercentage
            ? Math.round(product.originalPrice * (1 - product.discountPercentage / 100))
            : product.price;

        itemsPrice += effectivePrice * qty;
    }

    // Process Stock Decrement (Step 3 - Finalize)
    for (const item of validatedItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
        });
    }

    const shippingPrice = itemsPrice > 1000 ? 0 : 100;
    const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
    const totalAmount = itemsPrice + shippingPrice + taxPrice;

    // Step 5: Create Order Safely
    const order = new Order({
        user: (req as any).user._id,
        orderItems: validatedItems,
        shippingAddress: {
            fullName: shippingAddress.fullName || `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            pincode: shippingAddress.pincode || shippingAddress.postalCode,
            state: shippingAddress.state || 'N/A'
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice: totalAmount,
        totalAmount,
        paymentStatus: transactionId ? 'Paid' : 'Pending',
        status: 'processing',
        transactionId,
    });

    const createdOrder = await order.save();

    // Clear the cart after successful order
    const cart = await Cart.findOne({ userId: (req as any).user._id });
    if (cart) {
        (cart.items as any) = [];
        await cart.save();
    }

    return ApiResponseHandler.created(res, createdOrder, 'Order created successfully');
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req: any, res: Response) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'username email')
        .populate('orderItems.product');

    if (!order) {
        return ApiResponseHandler.notFound(res, 'Order not found');
    }

    // Ensure user can only see their own order
    if ((order.user as any)._id.toString() !== (req as any).user._id.toString() && (req as any).user.role !== 'admin') {
        return ApiResponseHandler.forbidden(res, 'Not authorized to view this order');
    }

    return ApiResponseHandler.success(res, order, 'Order retrieved successfully');
});

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req: any, res: Response) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return ApiResponseHandler.success(res, orders, 'Orders retrieved successfully');
});

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await Order.find({}).populate('user', 'username email').sort({ createdAt: -1 });
    return ApiResponseHandler.success(res, orders, 'All orders retrieved successfully');
});

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        return ApiResponseHandler.notFound(res, 'Order not found');
    }

    order.status = status || order.status;
    if (status === 'delivered') {
        order.deliveredAt = new Date();
    }
    const updatedOrder = await order.save();
    return ApiResponseHandler.success(res, updatedOrder, 'Order status updated successfully');
});

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
export const cancelOrder = asyncHandler(async (req: any, res: Response) => {
    const { reason, note } = req.body;

    if (!reason) {
        return ApiResponseHandler.error(res, 'Cancellation reason is required', 400);
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
        return ApiResponseHandler.notFound(res, 'Order not found');
    }

    // 1. Authorization: Ensure user can cancel only their own order
    if (order.user.toString() !== (req as any).user._id.toString() && (req as any).user.role !== 'admin') {
        return ApiResponseHandler.forbidden(res, 'Not authorized to cancel this order');
    }

    // 2. Validation: Reject if already shipped/delivered or cancelled
    const restrictedStatuses = ['shipped', 'out_for_delivery', 'delivered', 'cancelled'];
    if (restrictedStatuses.includes(order.status)) {
        return ApiResponseHandler.error(res, `Cannot cancel order in ${order.status} state`, 400);
    }

    // 3. Capture Reason & Details
    order.status = 'cancelled';
    order.cancellationReason = reason;
    order.cancellationNote = note || '';
    order.cancelledAt = new Date();
    order.cancelledBy = (req as any).user._id;

    // 4. Refund Simulation
    // If it was paid (Prepaid), initiate refund. If COD (Pending), no refund.
    if (order.paymentStatus === 'Paid') {
        order.refundStatus = 'Initiated';
    } else {
        order.refundStatus = 'None';
    }

    // 5. Restore Inventory Stock
    for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity }
        });
    }

    const updatedOrder = await order.save();
    return ApiResponseHandler.success(res, updatedOrder, 'Order cancelled successfully');
});

/**
 * @desc    Reorder items from a past order
 * @route   POST /api/orders/:id/reorder
 * @access  Private
 */
export const reorder = asyncHandler(async (req: any, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return ApiResponseHandler.notFound(res, 'Order not found');
    }

    // We don't necessarily need to check ownership if we just want to add items to cart, 
    // but the requirement says "Validate user ownership"
    if (order.user.toString() !== (req as any).user._id.toString()) {
        return ApiResponseHandler.forbidden(res, 'Not authorized');
    }

    // Add items to user's cart
    const cart = await Cart.findOne({ userId: (req as any).user._id });
    if (!cart) {
        return ApiResponseHandler.error(res, 'Cart not found', 404);
    }

    for (const item of order.orderItems) {
        const productIndex = cart.items.findIndex((i: any) => i.product.toString() === item.product.toString() && i.size === item.size);
        if (productIndex > -1 && cart.items[productIndex]) {
            cart.items[productIndex]!.quantity += item.quantity;
        } else {
            cart.items.push({
                product: item.product,
                quantity: item.quantity,
                size: item.size
            });
        }
    }

    await cart.save();
    return ApiResponseHandler.success(res, null, 'Items added to cart for reorder');
});
