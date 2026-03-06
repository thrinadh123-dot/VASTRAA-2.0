import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './server/models/Product';
import Cart from './server/models/Cart';
import connectDB from './server/config/db';
import { allProducts } from '../frontend/src/data/index';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const clearAndSeed = async () => {
    try {
        await connectDB();

        console.log('Clearing Products, Carts, and Wishlists...');
        await Product.deleteMany({});
        await Cart.deleteMany({});
        // If there's a wishlist model, clear it too
        try {
            const Wishlist = mongoose.model('Wishlist');
            await Wishlist.deleteMany({});
        } catch (e) {
            console.log('Wishlist model not found, skipping...');
        }

        console.log(`Starting to import ${allProducts.length} products from frontend...`);

        const productsToInsert = allProducts.map(p => ({
            _id: p.id,
            name: p.name,
            category: p.category,
            subcategory: p.subcategory,
            price: p.price,
            originalPrice: (p as any).originalPrice || undefined,
            discountPercentage: (p as any).discountPercentage || undefined,
            description: p.description,
            images: p.images,
            stock: 50,
            rating: p.rating,
            numReviews: p.reviews,
            sizes: p.sizes,
            productType: p.productType || 'other',
            isOnSale: p.isOnSale || !!(p as any).discountPercentage || false,
            isBestseller: !!(p as any).isBestseller || (p.rating >= 4.5 && (p.reviews ?? 0) > 50),
            badge: p.badge || ''
        }));

        await Product.insertMany(productsToInsert);

        console.log(`Data Import Completed! ${productsToInsert.length} products added.`);
        process.exit();
    } catch (error) {
        console.error('Error in clearAndSeed:', error);
        process.exit(1);
    }
};

clearAndSeed();
