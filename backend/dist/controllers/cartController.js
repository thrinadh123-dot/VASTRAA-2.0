"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeCart = exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiResponse_1 = require("../utils/apiResponse");
/* ─── GET  /api/cart ──────────────────────────────────────────────────────── */
exports.getCart = (0, express_async_handler_1.default)(async (req, res) => {
    const cart = await Cart_1.default.findOne({ userId: req.user._id })
        .populate('items.product');
    apiResponse_1.ApiResponseHandler.success(res, {
        items: cart?.items || []
    }, 'Cart retrieved successfully');
});
/* ─── POST /api/cart/add ──────────────────────────────────────────────────── */
exports.addToCart = (0, express_async_handler_1.default)(async (req, res) => {
    const { productId, quantity, size, color } = req.body;
    if (!productId) {
        return apiResponse_1.ApiResponseHandler.error(res, 'Product ID is required', 400);
    }
    const product = await Product_1.default.findById(productId);
    if (!product) {
        return apiResponse_1.ApiResponseHandler.notFound(res, 'Product not found');
    }
    if (product.stock < quantity) {
        return apiResponse_1.ApiResponseHandler.error(res, 'Insufficient stock', 400);
    }
    let cart = await Cart_1.default.findOne({ userId: req.user._id });
    if (!cart) {
        cart = new Cart_1.default({ userId: req.user._id, items: [] });
    }
    const existingItem = cart.items.find((item) => (item.product?.toString() === productId || item.productId === productId) &&
        (item.size === size) &&
        (item.color === color));
    if (existingItem) {
        existingItem.quantity += quantity;
    }
    else {
        cart.items.push({ product: productId, quantity, size, color });
    }
    await cart.save();
    // Return populated cart to keep frontend in sync with full product data
    const updatedCart = await Cart_1.default.findById(cart._id).populate('items.product');
    apiResponse_1.ApiResponseHandler.success(res, {
        items: updatedCart?.items || []
    }, 'Item added to cart successfully');
});
/* ─── DELETE /api/cart/remove/:productId ───────────────────────────────── */
exports.removeFromCart = (0, express_async_handler_1.default)(async (req, res) => {
    const { productId } = req.params;
    const { size, color } = req.query;
    const cart = await Cart_1.default.findOne({ userId: req.user._id });
    if (!cart) {
        return apiResponse_1.ApiResponseHandler.notFound(res, 'Cart not found');
    }
    if (size || color) {
        cart.items = cart.items.filter((item) => !(item.product.toString() === productId && item.size === size && item.color === color));
    }
    else {
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    }
    await cart.save();
    const updatedCart = await Cart_1.default.findById(cart._id).populate('items.product');
    apiResponse_1.ApiResponseHandler.success(res, {
        items: updatedCart?.items || []
    }, 'Item removed from cart successfully');
});
/* ─── POST /api/cart/merge ──────────────────────────────────────────────── */
exports.mergeCart = (0, express_async_handler_1.default)(async (req, res) => {
    const { guestItems } = req.body;
    let cart = await Cart_1.default.findOne({ userId: req.user._id });
    if (!cart) {
        cart = new Cart_1.default({ userId: req.user._id, items: [] });
    }
    if (guestItems && Array.isArray(guestItems)) {
        for (const item of guestItems) {
            const existing = cart.items.find((i) => i.product.toString() === item.product &&
                i.size === item.size &&
                i.color === item.color);
            if (existing) {
                existing.quantity += item.quantity;
            }
            else {
                cart.items.push({
                    product: item.product,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color
                });
            }
        }
    }
    await cart.save();
    const updatedCart = await Cart_1.default.findById(cart._id).populate('items.product');
    apiResponse_1.ApiResponseHandler.success(res, {
        items: updatedCart?.items || []
    }, 'Cart merged successfully');
});
//# sourceMappingURL=cartController.js.map