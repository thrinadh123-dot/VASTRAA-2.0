import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Import the Product model
import Product from '../server/models/Product';

// Using ts-node or tsx can cause issues with importing relative paths that don't end in .js
// depending on tsconfig. To make this robust, we'll import the data files.
import { allProducts } from '../../frontend/src/data/index';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI!, {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const seedProducts = async () => {
    try {
        await connectDB();

        console.log(`Found ${allProducts.length} products to seed from frontend data.`);

        const ops = allProducts.map(product => {
            const mappedProduct = {
                frontendId: product.id,
                name: product.name,
                description: product.description,
                category: product.category,
                productType: product.subcategory.toLowerCase().includes('t-shirt') ? 'tshirt' :
                    product.subcategory.toLowerCase().includes('shirt') ? 'shirt' :
                        product.subcategory.toLowerCase().includes('jeans') ? 'jeans' :
                            product.subcategory.toLowerCase().includes('sneaker') || product.subcategory.toLowerCase().includes('footwear') ? 'shoes' : 'other',
                subcategory: product.subcategory,
                badge: product.badge || '',
                price: product.price,
                originalPrice: product.originalPrice,
                isOnSale: product.isOnSale || false,
                sizes: product.sizes,
                stock: 100,
                images: product.images,
                rating: product.rating || 0,
                numReviews: product.reviews || 0,
                isActive: true,
                // Enrichment logic matching frontend/src/data/index.ts
                styleTags: product.subcategory.toLowerCase().includes('t-shirt') ? ['lightweight', 'breathable', 'summer', 'casual'] :
                    product.subcategory.toLowerCase().includes('top') ? ['lightweight', 'breathable', 'summer', 'casual'] :
                        product.subcategory.toLowerCase().includes('dress') ? ['lightweight', 'breathable', 'summer', 'casual', 'party', 'ethnic'] :
                            product.subcategory.toLowerCase().includes('skirt') ? ['lightweight', 'summer', 'casual', 'party'] :
                                product.subcategory.toLowerCase().includes('footwear') || product.subcategory.toLowerCase().includes('sneaker') ? ['casual'] :
                                    product.subcategory.toLowerCase().includes('accessory') ? ['casual', 'seasonal', 'ethnic'] :
                                        product.subcategory.toLowerCase().includes('formal shirt') ? ['formal', 'breathable'] :
                                            product.subcategory.toLowerCase().includes('jean') ? ['casual'] :
                                                product.subcategory.toLowerCase().includes('hoodie') ? ['knitwear', 'winter', 'casual'] :
                                                    product.subcategory.toLowerCase().includes('jacket') ? ['jackets', 'outerwear', 'winter'] :
                                                        product.subcategory.toLowerCase().includes('blazer') ? ['formal', 'party', 'jackets', 'outerwear', 'seasonal'] : ['casual'],
                season: product.subcategory.toLowerCase().includes('t-shirt') || product.subcategory.toLowerCase().includes('top') || product.subcategory.toLowerCase().includes('dress') || product.subcategory.toLowerCase().includes('skirt') ? 'summer' :
                    product.subcategory.toLowerCase().includes('hoodie') || product.subcategory.toLowerCase().includes('jacket') ? 'winter' : 'all',
                isBestseller: product.badge === '' && (product.reviews || 0) > 200,
                isNewDrop: product.badge === 'NEW',
            };

            return {
                updateOne: {
                    filter: { frontendId: mappedProduct.frontendId },
                    update: { $set: mappedProduct },
                    upsert: true
                }
            };
        });

        console.log('Upserting products via bulkWrite...');
        const result = await Product.bulkWrite(ops);

        console.log(`✅ Seeded products successfully!`);
        console.log(`- Matched: ${result.matchedCount}`);
        console.log(`- Upserted: ${result.upsertedCount}`);
        console.log(`- Modified: ${result.modifiedCount}`);
        process.exit(0);
    } catch (error: any) {
        console.error(`Error seeding products:`, error);
        if (error.errors) {
            console.error('Validation errors:', error.errors);
        }
        process.exit(1);
    }
};

seedProducts();
