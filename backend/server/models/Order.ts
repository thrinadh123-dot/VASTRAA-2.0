import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, default: 'India' },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalAmount: { // keeping for backward compatibility
        type: Number,
        default: 0.0,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
        required: true,
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
    status: {
        type: String,
        enum: ['processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'processing',
        required: true,
    },
    trackingId: {
        type: String,
        default: function (this: any) {
            return `VAS${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        }
    },
    deliveredAt: Date,
    transactionId: String,
    cancelledAt: Date,
    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    cancelReason: {
        type: String,
        enum: [
            'ordered_by_mistake',
            'found_cheaper',
            'delivery_too_slow',
            'changed_mind',
            'other'
        ],
    },
    cancelNote: {
        type: String,
    },
    refundStatus: {
        type: String,
        enum: ['None', 'Initiated', 'Completed', 'Failed'],
        default: 'None',
    },
}, {
    timestamps: true, // Handles createdAt
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
