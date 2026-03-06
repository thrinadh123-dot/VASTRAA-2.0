"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProductStock = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiResponse_1 = require("../utils/apiResponse");
exports.getProducts = (0, express_async_handler_1.default)(async (req, res) => {
    const products = await Product_1.default.find({});
    apiResponse_1.ApiResponseHandler.success(res, products, 'Products retrieved successfully');
});
exports.getProductById = (0, express_async_handler_1.default)(async (req, res) => {
    const product = await Product_1.default.findById(req.params.id);
    if (product) {
        apiResponse_1.ApiResponseHandler.success(res, product, 'Product retrieved successfully');
    }
    else {
        apiResponse_1.ApiResponseHandler.notFound(res, 'Product not found');
    }
});
exports.createProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const product = new Product_1.default({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        images: ['/images/sample.jpg'],
        sizes: ['M'],
        category: 'Men',
        stock: 0,
        rating: 0,
        description: 'Sample description',
    });
    const createdProduct = await product.save();
    apiResponse_1.ApiResponseHandler.created(res, createdProduct, 'Product created successfully');
});
exports.updateProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, price, description, images, category, sizes, stock, image, countInStock } = req.body;
    const product = await Product_1.default.findById(req.params.id);
    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        if (images)
            product.images = images;
        else if (image)
            product.images = [image];
        if (sizes)
            product.sizes = sizes;
        product.category = category || product.category;
        product.stock = stock !== undefined ? stock : countInStock;
        if (req.body.isActive !== undefined) {
            product.isActive = req.body.isActive;
        }
        const updatedProduct = await product.save();
        apiResponse_1.ApiResponseHandler.success(res, updatedProduct, 'Product updated successfully');
    }
    else {
        apiResponse_1.ApiResponseHandler.notFound(res, 'Product not found');
    }
});
exports.updateProductStock = (0, express_async_handler_1.default)(async (req, res) => {
    const { stock } = req.body;
    const product = await Product_1.default.findById(req.params.id);
    if (product) {
        if (stock === undefined || stock < 0) {
            return apiResponse_1.ApiResponseHandler.error(res, 'Valid stock value is required', 400);
        }
        product.stock = stock;
        const updatedProduct = await product.save();
        apiResponse_1.ApiResponseHandler.success(res, updatedProduct, 'Product stock updated successfully');
    }
    else {
        apiResponse_1.ApiResponseHandler.notFound(res, 'Product not found');
    }
});
exports.deleteProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const product = await Product_1.default.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        apiResponse_1.ApiResponseHandler.success(res, { message: 'Product removed' }, 'Product deleted successfully');
    }
    else {
        apiResponse_1.ApiResponseHandler.notFound(res, 'Product not found');
    }
});
//# sourceMappingURL=productController.js.map