"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const wishlistItemSchema = new mongoose_1.default.Schema({
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
const wishlistSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    products: [wishlistItemSchema],
}, {
    timestamps: true,
});
const Wishlist = mongoose_1.default.model('Wishlist', wishlistSchema);
exports.default = Wishlist;
//# sourceMappingURL=Wishlist.js.map