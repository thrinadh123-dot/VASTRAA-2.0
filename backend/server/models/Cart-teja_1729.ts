import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: String,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    size: String,
    color: String,
    originalPrice: Number,
    discountPercentage: Number,
    productId: String, // Legacy support field for data migration
}, { _id: false });

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    items: [cartItemSchema],
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
