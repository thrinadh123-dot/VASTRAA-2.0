import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';
import connectDB from '../config/db';

// This is a simplified version of the data. 
// Ideally we'd import from the frontend files, but since we are on the server 
// and those files use ESM/TS with different configs, we'll define a few key ones or a generic mapper.

dotenv.config();

const products = [
    {
        _id: 'men-001',
        name: 'Essential White Crew Tee',
        category: 'Men',
        price: 1499,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        description: 'Heavyweight 220 GSM combed cotton with a ribbed crew neck. The perfect canvas for any outfit.',
        images: ['https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=800&auto=format&fit=crop&q=80'],
        stock: 50,
        rating: 4.5
    },
    {
        _id: 'men-019',
        name: 'Merino V-Neck Cardigan',
        category: 'Men',
        price: 4499,
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Fine-gauge merino cardigan with a button closure and ribbed trim.',
        images: ['https://images.hawesandcurtis.com/tr:w-600,q-80/JW/JWPWH007-F01-205970-800px-1040px.jpg'],
        stock: 15,
        rating: 4.7
    },
    {
        _id: 'men-024',
        name: 'Utility Field Jacket',
        category: 'Men',
        price: 4499,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Waxed cotton field jacket with four bellows pockets and a storm-flap collar.',
        images: ['https://d1pdzcnm6xgxlz.cloudfront.net/tops/8905875530916-9.jpg'],
        stock: 25,
        rating: 4.6
    },
    {
        _id: 'wmn-001',
        name: 'Ribbed Knit Midi Dress',
        category: 'Women',
        price: 2799,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        description: 'Viscose-rib midi dress with a V-neckline and a self-tie waist. Effortlessly versatile.',
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJeu5-nOxuIHkKPgfYmEtEg__MT0OR17V4zg&s'],
        stock: 30,
        rating: 4.7
    },
    {
        _id: 'wmn-024',
        name: 'Oversized Wool Tailored Coat',
        category: 'Women',
        price: 4999,
        sizes: ['XS', 'S', 'M', 'L'],
        description: 'Heavyweight Italian wool in a dramatic, sweeping silhouette.',
        images: ['https://images.unsplash.com/photo-1741174174065-a1312dfa9c0a?w=800&auto=format&fit=crop&q=80'],
        stock: 10,
        rating: 4.9
    }
];

const importData = async () => {
    try {
        await connectDB();

        // Check if these specifically exist, if not, create them
        for (const p of products) {
            const exists = await Product.findById(p._id);
            if (!exists) {
                await Product.create(p);
                console.log(`Product ${p._id} created.`);
            } else {
                console.log(`Product ${p._id} already exists.`);
            }
        }

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
