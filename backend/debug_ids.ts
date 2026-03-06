import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './server/models/Product';
import connectDB from './server/config/db';

dotenv.config({ path: 'backend/.env' });

const debug = async () => {
    try {
        await connectDB();
        const total = await Product.countDocuments();
        console.log(`Total products: ${total}`);
        const sample = await Product.find({}).limit(10).select('_id name');
        console.log('Sample Product IDs:');
        sample.forEach(p => console.log(`- ${p._id}: ${p.name}`));

        const hexId = '69a058686e30eb78ee612355';
        const found = await Product.findById(hexId);
        console.log(`Searching for ${hexId}: ${found ? 'FOUND' : 'NOT FOUND'}`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debug();
