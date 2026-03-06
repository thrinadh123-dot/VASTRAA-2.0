import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import razorpay from '../config/razorpay';
import Cart from '../models/Cart';
import Order from '../models/Order';
import Product from '../models/Product';

/**
 * @desc    Create Razorpay Order
 * @route   POST /api/payment/order
 * @access  Private
 */
export const createPaymentOrder = asyncHandler(async (req: any, res: Response) => {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error('Cart is empty');
    }

    let itemsPrice = 0;
    for (const item of cart.items) {
        const product = item.product as any;
        if (product) {
            itemsPrice += product.price * item.quantity;
        }
    }

    const shippingPrice = itemsPrice > 1000 ? 0 : 100;
    const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
    const totalAmount = itemsPrice + shippingPrice + taxPrice;

    const options = {
        amount: Math.round(totalAmount * 100), // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(201).json({
            success: true,
            orderId: order.id,
            amount: totalAmount,
            currency: 'INR',
        });
    } catch (error: any) {
        res.status(500);
        throw new Error(error.message || 'Razorpay order creation failed');
    }
});

/**
 * @desc    Verify Razorpay Payment and Create Final Order
 * @route   POST /api/payment/verify
 * @access  Private
 */
export const verifyPayment = asyncHandler(async (req: any, res: Response) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        shippingAddress,
        paymentMethod
    } = req.body;

    // 1. Verify Signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {
        res.status(400);
        throw new Error('Invalid payment signature (Security alert)');
    }

    // 2. Final re-fetch of Cart after payment success
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.product') as any;
    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error('Cart expired or empty during processing');
    }

    // 3. Stock Check & Items Preparation
    const orderItems: any[] = [];
    let itemsPrice = 0;

    for (const item of cart.items) {
        const product = item.product as any;
        if (!product || product.stock < item.quantity) {
            res.status(400);
            throw new Error(`Stock mismatch for ${product?.name || 'Product'}. Please contact support.`);
        }

        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            size: item.size,
            priceAtPurchase: product.price,
        });
        itemsPrice += product.price * item.quantity;
    }

    const shippingPrice = itemsPrice > 1000 ? 0 : 100;
    const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
    const totalAmount = itemsPrice + shippingPrice + taxPrice;

    // 4. Atomic Stock Decrement
    for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: { stock: -item.quantity }
        });
    }

    // 5. Create Order Record
    const order = new Order({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'Razorpay',
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalAmount,
        paymentStatus: 'Paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
    });

    const createdOrder = await order.save();

    // 6. Clear Cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
        success: true,
        order: createdOrder
    });
});
