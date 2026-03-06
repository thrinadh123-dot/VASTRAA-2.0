import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Kids'],
    },
    productType: {
        type: String,
        enum: ['tshirt', 'shirt', 'jeans', 'shoes', 'other'],
        default: 'other',
    },
    subcategory: {
        type: String,
    },
    badge: {
        type: String,
        enum: ['NEW', 'SALE', 'LIMITED', ''],
        default: '',
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    originalPrice: {
        type: Number,
    },
    isOnSale: {
        type: Boolean,
        default: false,
    },
    sizes: [{
        type: String,
        required: true,
    }],
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    images: [{
        type: String,
        required: true,
    }],
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    reviews: [reviewSchema],
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
export default Product;
