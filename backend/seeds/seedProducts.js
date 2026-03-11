/**
 * Database Seed Script
 * Populates MongoDB with initial product data
 * Run: node seedProducts.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

// Product data - converted from frontend TypeScript format
const productsData = [
    // ── MEN'S T-SHIRTS ──
    {
        name: 'Essential White Crew Tee',
        category: 'Men',
        price: 1499,
        description: 'Heavyweight 220 GSM combed cotton with a ribbed crew neck. The perfect canvas for any outfit.',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        images: ['https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=800&auto=format&fit=crop&q=80'],
        rating: 4.5,
        stock: 50,
    },
    {
        name: 'Oversized Drop-Shoulder Tee',
        category: 'Men',
        price: 1799,
        description: 'Relaxed drop-shoulder silhouette in 200 GSM cotton jersey. Minimal branding, maximum comfort.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        images: ['https://images.unsplash.com/photo-1666358085449-a10a39f33942?w=800&auto=format&fit=crop&q=80'],
        rating: 4.3,
        stock: 45,
    },
    {
        name: 'Striped Breton Tee',
        category: 'Men',
        price: 1259,
        originalPrice: 1799,
        discountPercentage: 30,
        isOnSale: true,
        badge: 'SALE',
        description: 'Classic French Breton stripe in 100% ring-spun cotton. Heritage design built to last.',
        sizes: ['S', 'M', 'L', 'XL'],
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1Ci3pG-GfvuJbDfbJfvqZJ-jczec-_8AGsg&s'],
        rating: 4.4,
        stock: 40,
    },
    {
        name: 'Henley Long-Sleeve Tee',
        category: 'Men',
        price: 2199,
        description: 'Ribbed Henley placket in waffle-knit cotton. Wear alone or beneath a flannel shirt.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        images: ['https://images.unsplash.com/photo-1565128354282-a6390fc125b2?w=800&auto=format&fit=crop&q=80'],
        rating: 4.5,
        stock: 35,
    },
    {
        name: 'Crew Neck Pocket Tee',
        category: 'Men',
        price: 1119,
        originalPrice: 1599,
        discountPercentage: 30,
        isOnSale: true,
        badge: 'SALE',
        description: '180 GSM cotton with a single chest pocket. A classic casual staple.',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        images: ['https://plus.unsplash.com/premium_photo-1683134099563-4b6f06329586?w=800&auto=format&fit=crop&q=80'],
        rating: 4.2,
        stock: 60,
    },
    {
        name: 'Waffle Knit Thermal Top',
        category: 'Men',
        price: 1609,
        originalPrice: 2299,
        discountPercentage: 30,
        isOnSale: true,
        badge: 'SALE',
        description: 'Waffle-stitch cotton-modal blend with a crew neck. Lightweight layering.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        images: ['https://plus.unsplash.com/premium_photo-1705495968134-0d842e74c601?w=800&auto=format&fit=crop&q=80'],
        rating: 4.4,
        stock: 38,
    },

    // ── WOMEN'S T-SHIRTS ──
    {
        name: 'Fitted Baby Tee',
        category: 'Women',
        price: 1299,
        description: 'Fitted silhouette in 150 GSM cotton. Cropped length with a flattering crew neck.',
        sizes: ['XS', 'S', 'M', 'L'],
        images: ['https://images.unsplash.com/photo-1532070255769-c1d0b6fabe33?w=800&auto=format&fit=crop&q=80'],
        rating: 4.6,
        stock: 70,
    },
    {
        name: 'Oversized Boyfriend Tee',
        category: 'Women',
        price: 1119,
        originalPrice: 1599,
        discountPercentage: 30,
        isOnSale: true,
        badge: 'SALE',
        description: 'Relaxed boyfriend fit in 200 GSM cotton. Dropped sleeves and longer length.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        images: ['https://images.unsplash.com/photo-1521513131196-5da6c7f26b0f?w=800&auto=format&fit=crop&q=80'],
        rating: 4.5,
        stock: 55,
    },
    {
        name: 'V-Neck Essential Tee',
        category: 'Women',
        price: 1399,
        description: 'Classic V-neck in 180 GSM cotton. Versatile layering piece.',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        images: ['https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=800&auto=format&fit=crop&q=80'],
        rating: 4.4,
        stock: 65,
    },
    {
        name: 'Ribbed Long Sleeve Tee',
        category: 'Women',
        price: 1329,
        originalPrice: 1899,
        discountPercentage: 30,
        isOnSale: true,
        badge: 'SALE',
        description: 'Fitted ribbed long sleeve in cotton-spandex blend. Sculpting silhouette.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        images: ['https://images.unsplash.com/photo-1503793087982-944199ea570f?w=800&auto=format&fit=crop&q=80'],
        rating: 4.3,
        stock: 48,
    },
    {
        name: 'Crop Tank Top',
        category: 'Women',
        price: 699,
        originalPrice: 999,
        discountPercentage: 30,
        isOnSale: true,
        badge: 'SALE',
        description: 'Cropped tank in 140 GSM cotton. Minimal and versatile.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        images: ['https://images.unsplash.com/photo-1506629082632-cccce02b6239?w=800&auto=format&fit=crop&q=80'],
        rating: 4.2,
        stock: 80,
    },
    {
        name: 'Wrap Front Tee',
        category: 'Women',
        price: 1699,
        description: 'Asymmetric wrap front in cotton jersey. Flattering and feminine.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        images: ['https://images.unsplash.com/photo-1540551489-acca60cb6e3b?w=800&auto=format&fit=crop&q=80'],
        rating: 4.5,
        stock: 42,
    },

    // ── KIDS' T-SHIRTS ──
    {
        name: 'Kids Colorful Graphic Tee',
        category: 'Kids',
        price: 629,
        originalPrice: 899,
        discountPercentage: 30,
        isOnSale: true,
        badge: 'SALE',
        description: 'Fun graphic print in soft 150 GSM cotton. Machine washable.',
        sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
        images: ['https://images.unsplash.com/photo-1556821552-5f694e3f90bf?w=800&auto=format&fit=crop&q=80'],
        rating: 4.4,
        stock: 100,
    },
    {
        name: 'Striped Kids Tee',
        category: 'Kids',
        price: 799,
        description: 'Classic stripes in comfortable cotton blend. Easy care fabric.',
        sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y'],
        images: ['https://images.unsplash.com/photo-1556821552-5f694e3f90bf?w=800&auto=format&fit=crop&q=80'],
        rating: 4.3,
        stock: 95,
    },
    {
        name: 'Superhero Kids Tee',
        category: 'Kids',
        price: 769,
        originalPrice: 1099,
        discountPercentage: 30,
        isOnSale: true,
        badge: 'SALE',
        description: 'Superhero print that kids love. 100% cotton jersey.',
        sizes: ['3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y'],
        images: ['https://images.unsplash.com/photo-1556821552-5f694e3f90bf?w=800&auto=format&fit=crop&q=80'],
        rating: 4.5,
        stock: 75,
    },
    {
        name: 'Soft Pastel Kids Tee',
        category: 'Kids',
        price: 799,
        description: 'Soft pastel colors in breathable cotton. Perfect for sensitive skin.',
        sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
        images: ['https://images.unsplash.com/photo-1556821552-5f694e3f90bf?w=800&auto=format&fit=crop&q=80'],
        rating: 4.2,
        stock: 90,
    },

    // Add more products to reach minimum viable dataset
    {
        name: 'Classic Denim Jacket (Men)',
        category: 'Men',
        price: 3499,
        originalPrice: 4999,
        discountPercentage: 30,
        isOnSale: true,
        badge: 'SALE',
        description: 'Timeless indigo denim with button front. Built to last.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        images: ['https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=800&auto=format&fit=crop&q=80'],
        rating: 4.6,
        stock: 30,
    },
    {
        name: 'Black Joggers (Men)',
        category: 'Men',
        price: 2299,
        description: 'Comfortable joggers in 280 GSM cotton. Tapered legs with cuffed ankles.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        images: ['https://images.unsplash.com/photo-1624441828904-eecff549bf35?w=800&auto=format&fit=crop&q=80'],
        rating: 4.4,
        stock: 50,
    },
    {
        name: 'Summer Floral Dress (Women)',
        category: 'Women',
        price: 2309,
        originalPrice: 3299,
        discountPercentage: 30,
        isOnSale: true,
        badge: 'SALE',
        description: 'Lightweight floral print dress. Perfect for warm weather.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        images: ['https://images.unsplash.com/photo-1595777707802-8d9bd4ee4b0e?w=800&auto=format&fit=crop&q=80'],
        rating: 4.5,
        stock: 25,
    },
    {
        name: 'White Sneakers (Women)',
        category: 'Women',
        price: 3999,
        description: 'Classic white canvas sneakers. Versatile and timeless.',
        sizes: ['5', '6', '7', '8', '9', '10'],
        images: ['https://images.unsplash.com/photo-1549298881-fdef8fc8afb5?w=800&auto=format&fit=crop&q=80'],
        rating: 4.7,
        stock: 40,
    },
    {
        name: 'School Backpack (Kids)',
        category: 'Kids',
        price: 1399,
        originalPrice: 1999,
        discountPercentage: 30,
        isOnSale: true,
        badge: 'SALE',
        description: 'Durable school backpack with multiple compartments.',
        sizes: ['One Size'],
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'],
        rating: 4.3,
        stock: 60,
    },
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Define Product Schema inline (since we can't import TS)
        const productSchema = new mongoose.Schema({
            _id: {
                type: String,
                required: true,
                default: () => new mongoose.Types.ObjectId().toHexString(),
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
            originalPrice: {
                type: Number,
            },
            discountPercentage: {
                type: Number,
            },
            isOnSale: {
                type: Boolean,
                default: false,
            },
            badge: {
                type: String,
                enum: ['NEW', 'SALE', 'LIMITED', ''],
                default: '',
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
        }, {
            timestamps: true,
        });

        const Product = mongoose.model('Product', productSchema);

        // Clear existing products
        console.log('🧹 Clearing existing products...');
        await Product.deleteMany({});

        // Insert new products
        console.log('📦 Inserting products...');
        const result = await Product.insertMany(productsData);
        console.log(`✅ Successfully seeded ${result.length} products!`);

        // Display summary
        const categories = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        console.log('\n📊 Products by category:');
        categories.forEach(cat => {
            console.log(`   ${cat._id}: ${cat.count} products`);
        });

        const totalCount = await Product.countDocuments();
        console.log(`\n📈 Total products in database: ${totalCount}`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

// Run the seed
seedDatabase();
