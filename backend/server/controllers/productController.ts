import { Request, Response } from 'express';
import { productService } from '../services/productService';
import asyncHandler from 'express-async-handler';
import { ApiResponseHandler } from '../utils/apiResponse';

export const getProducts = asyncHandler(async (req: any, res: Response) => {
    const result = await productService.getAllProducts(req.query);
    res.json(result);
});

export const getProductById = asyncHandler(async (req: any, res: Response) => {
    const product = await productService.findProductById(req.params.id);
    if (product) {
        let recommendedSize = null;
        const user = req.user;

        // Handle recommendations for logged-in users (exclude Demo User)
        if (user && user.username !== 'Demo User' && user.sizePreferences) {
            const sub = (product.subcategory || '').toLowerCase();
            const cat = (product.category || '').toLowerCase();
            const type = (product.productType || '').toLowerCase();

            let prefSize = null;
            const prefs = user.sizePreferences;

            // Gender-based recommendation logic
            if (cat === 'men') {
                const menPrefs = prefs.men || {};
                if (sub.includes('t-shirt') || sub.includes('hoodie') || type === 'tshirt') {
                    prefSize = menPrefs.tshirt;
                } else if (sub.includes('shirt') || sub.includes('jacket') || sub.includes('dress') || type === 'shirt') {
                    prefSize = menPrefs.shirt;
                } else if (sub.includes('jeans') || sub.includes('trouser') || type === 'jeans') {
                    prefSize = menPrefs.jeans;
                } else if (sub.includes('sneaker') || sub.includes('shoe') || sub.includes('footwear') || type === 'shoes') {
                    prefSize = menPrefs.shoes;
                }
            } else if (cat === 'women') {
                const womenPrefs = prefs.women || {};
                if (sub.includes('top') || sub.includes('t-shirt') || type === 'tshirt') {
                    prefSize = womenPrefs.top;
                } else if (sub.includes('dress') || sub.includes('gown')) {
                    prefSize = womenPrefs.dress;
                } else if (sub.includes('jeans') || sub.includes('trouser') || sub.includes('waist') || type === 'jeans') {
                    prefSize = womenPrefs.waist;
                } else if (sub.includes('sneaker') || sub.includes('shoe') || sub.includes('footwear') || type === 'shoes') {
                    prefSize = womenPrefs.footwear;
                }
            }

            // Validate if the preferred size is available and product is in stock
            if (prefSize && product.sizes.includes(prefSize) && product.stock > 0) {
                recommendedSize = prefSize;
            }
        }

        const productObj = product.toObject();
        (productObj as any).recommendedSize = recommendedSize;

        ApiResponseHandler.success(res, productObj, 'Product retrieved successfully');
    } else {
        ApiResponseHandler.notFound(res, 'Product not found');
    }
});

export const createProduct = asyncHandler(async (req: any, res: Response) => {
    const createdProduct = await productService.createEmptyProduct((req as any).user._id);
    ApiResponseHandler.created(res, createdProduct, 'Product created successfully');
});

export const updateProduct = asyncHandler(async (req: any, res: Response) => {
    const { name, price, description, images, category, sizes, stock, image, countInStock } = req.body;

    const product = await productService.findProductById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        if (images) product.images = images;
        else if (image) product.images = [image];

        if (sizes) product.sizes = sizes;

        product.category = category || product.category;
        product.stock = stock !== undefined ? stock : countInStock;
        if (req.body.isActive !== undefined) {
            product.isActive = req.body.isActive;
        }

        const updatedProduct = await product.save();
        ApiResponseHandler.success(res, updatedProduct, 'Product updated successfully');
    } else {
        ApiResponseHandler.notFound(res, 'Product not found');
    }
});

export const updateProductStock = asyncHandler(async (req: any, res: Response) => {
    const { stock } = req.body;
    const product = await productService.findProductById(req.params.id);

    if (product) {
        if (stock === undefined || stock < 0) {
            return ApiResponseHandler.error(res, 'Valid stock value is required', 400);
        }
        product.stock = stock;
        const updatedProduct = await product.save();
        ApiResponseHandler.success(res, updatedProduct, 'Product stock updated successfully');
    } else {
        ApiResponseHandler.notFound(res, 'Product not found');
    }
});

export const deleteProduct = asyncHandler(async (req: any, res: Response) => {
    const product = await productService.findProductById(req.params.id);

    if (product) {
        await product.deleteOne();
        ApiResponseHandler.success(res, { message: 'Product removed' }, 'Product deleted successfully');
    } else {
        ApiResponseHandler.notFound(res, 'Product not found');
    }
});
