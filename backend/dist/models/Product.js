"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, { timestamps: true });
const productSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: true,
        default: () => new mongoose_1.default.Types.ObjectId().toHexString(),
    },
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
    price: {
        type: Number,
        required: true,
        default: 0,
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
    isActive: {
        type: Boolean,
        default: true
    },
    reviews: [reviewSchema],
}, {
    timestamps: true,
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
//# sourceMappingURL=Product.js.map