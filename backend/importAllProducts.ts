import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './server/models/Product';
import connectDB from './server/config/db';

// Use tsx or ts-node to import from frontend without compiling
import { allProducts } from '../frontend/src/data/index';

dotenv.config();

const importAllProducts = async () => {
    try {
        await connectDB();

        console.log(`Starting to import ${allProducts.length} products from frontend...`);

        let count = 0;
        for (const p of allProducts) {
            const exists = await Product.findById(p.id);
            if (!exists) {
                await Product.create({
                    _id: p.id,
                    name: p.name,
                    category: p.category,
                    subcategory: p.subcategory,
                    price: p.price,
                    description: p.description,
                    images: p.images,
                    stock: 50, // default stock
                    rating: p.rating,
                    numReviews: p.reviews,
                    sizes: p.sizes,
                    productType: p.productType || 'other',
                    isOnSale: p.isOnSale || false,
                    badge: p.badge || ''
                });
                console.log(`Product ${p.id} created.`);
                count++;
            }
        }

        console.log(`Data Import Completed! ${count} new products added.`);
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

importAllProducts();
