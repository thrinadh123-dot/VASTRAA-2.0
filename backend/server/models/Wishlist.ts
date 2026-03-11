import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
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
