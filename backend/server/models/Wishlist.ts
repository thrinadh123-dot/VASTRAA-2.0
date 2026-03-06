import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
    productId: {
        type: String, // Supports both MongoDB ObjectIds and custom string IDs
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        default: '',
    },
    brand: {
        type: String,
        default: '',
    },
});

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    products: [wishlistItemSchema],
}, {
    timestamps: true,
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
