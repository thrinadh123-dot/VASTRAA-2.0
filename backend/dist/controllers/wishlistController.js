"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveAllToCart = exports.moveToCart = exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const Wishlist_1 = __importDefault(require("../models/Wishlist"));
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiResponse_1 = require("../utils/apiResponse");
/* ─── GET  /api/wishlist ──────────────────────────────────────────────────── */
exports.getWishlist = (0, express_async_handler_1.default)(async (req, res) => {
    const wishlist = await Wishlist_1.default.findOne({ userId: req.user._id });
    apiResponse_1.ApiResponseHandler.success(res, {
        products: wishlist?.products || []
    }, 'Wishlist retrieved successfully');
});
/* ─── POST /api/wishlist/add ──────────────────────────────────────────────── */
exports.addToWishlist = (0, express_async_handler_1.default)(async (req, res) => {
    const { productId, name, image, price, category, brand } = req.body;
    if (!productId) {
        return apiResponse_1.ApiResponseHandler.error(res, 'Product ID is required', 400);
    }
    let productName = name;
    let productImage = image;
    let productPrice = price;
    let productCategory = category || '';
    let productBrand = brand || '';
    const product = await Product_1.default.findById(productId);
    if (product) {
        productName = product.name;
        productImage = product.images?.[0] || '';
        productPrice = product.price;
        productCategory = product.category || '';
        productBrand = product.brand || '';
    }
    // Find or create wishlist
    let wishlist = await Wishlist_1.default.findOne({ userId: req.user._id });
    if (wishlist) {
        // Check for duplicates
        const exists = wishlist.products.some((p) => p.productId === productId);
        if (!exists) {
            wishlist.products.push({
                productId,
                name: productName,
                image: productImage,
                price: productPrice,
                category: productCategory,
                brand: productBrand,
            });
            await wishlist.save();
        }
    }
    else {
        wishlist = await Wishlist_1.default.create({
            userId: req.user._id,
            products: [{
                    productId,
                    name: productName,
                    image: productImage,
                    price: productPrice,
                    category: productCategory,
                    brand: productBrand,
                }],
        });
    }
    apiResponse_1.ApiResponseHandler.created(res, {
        products: wishlist.products
    }, 'Item added to wishlist successfully');
});
/* ─── DELETE /api/wishlist/remove/:productId ──────────────────────────────── */
exports.removeFromWishlist = (0, express_async_handler_1.default)(async (req, res) => {
    const { productId } = req.params;
    const wishlist = await Wishlist_1.default.findOne({ userId: req.user._id });
    if (wishlist) {
        wishlist.products = wishlist.products.filter((p) => p.productId !== productId);
        await wishlist.save();
    }
    apiResponse_1.ApiResponseHandler.success(res, {
        products: wishlist?.products || []
    }, 'Item removed from wishlist successfully');
});
/* ─── POST /api/wishlist/move-to-cart ─────────────────────────────────────── */
exports.moveToCart = (0, express_async_handler_1.default)(async (req, res) => {
    const { product: productId, size: selectedSize, quantity = 1, price, name, image, stock } = req.body;
    if (!productId) {
        return apiResponse_1.ApiResponseHandler.error(res, 'Product ID is required', 400);
    }
    let productPrice = price;
    let productName = name;
    let productImage = image;
    let productStock = stock || 10;
    const product = await Product_1.default.findById(productId);
    if (product) {
        productPrice = product.price;
        productName = product.name;
        productImage = product.images?.[0] || '';
        productStock = product.stock;
    }
    // Add to cart
    let cart = await Cart_1.default.findOne({ userId: req.user._id });
    if (cart) {
        const idx = cart.items.findIndex((p) => (p.product?.toString() === productId || p.productId === productId) && (p.size === selectedSize || p.selectedSize === selectedSize));
        if (idx > -1) {
            cart.items[idx].quantity += quantity;
            cart.items[idx].price = productPrice;
            cart.items[idx].name = productName;
            cart.items[idx].image = productImage;
        }
        else {
            cart.items.push({ product: productId, quantity, size: selectedSize, price: productPrice, name: productName, image: productImage });
        }
        await cart.save();
    }
    else {
        cart = await Cart_1.default.create({
            userId: req.user._id,
            items: [{ product: productId, quantity, size: selectedSize, price: productPrice, name: productName, image: productImage }],
        });
    }
    // Remove from wishlist
    const wishlist = await Wishlist_1.default.findOne({ userId: req.user._id });
    if (wishlist) {
        wishlist.products = wishlist.products.filter((p) => p.productId !== productId);
        await wishlist.save();
    }
    apiResponse_1.ApiResponseHandler.success(res, {
        cart: cart.items,
        wishlistProducts: wishlist?.products || [],
    }, 'Item moved to cart successfully');
});
/* ─── POST /api/wishlist/move-all-to-cart ──────────────────────────────────── */
exports.moveAllToCart = (0, express_async_handler_1.default)(async (req, res) => {
    const { selectedSize = 'M' } = req.body;
    const wishlist = await Wishlist_1.default.findOne({ userId: req.user._id });
    if (!wishlist || wishlist.products.length === 0) {
        return apiResponse_1.ApiResponseHandler.error(res, 'Wishlist is empty', 400);
    }
    let cart = await Cart_1.default.findOne({ userId: req.user._id });
    if (!cart) {
        cart = await Cart_1.default.create({ userId: req.user._id, items: [] });
    }
    for (const product of wishlist.products) {
        const p = product;
        const idx = cart.items.findIndex((item) => (item.product?.toString() === p.productId || item.productId === p.productId) && (item.size === selectedSize || item.selectedSize === selectedSize));
        if (idx > -1) {
            cart.items[idx].quantity += 1;
        }
        else {
            cart.items.push({
                product: p.productId,
                quantity: 1,
                size: selectedSize,
                price: p.price,
                name: p.name,
                image: p.image,
            });
        }
    }
    await cart.save();
    // Clear wishlist
    wishlist.products = [];
    await wishlist.save();
    apiResponse_1.ApiResponseHandler.success(res, {
        cart: cart.items,
        wishlistProducts: [],
    }, 'All items moved to cart successfully');
});
//# sourceMappingURL=wishlistController.js.map