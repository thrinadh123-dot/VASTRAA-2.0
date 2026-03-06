import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './server/models/Product';
import connectDB from './server/config/db';

dotenv.config();

const debug = async () => {
    try {
        await connectDB();
        const p = await Product.findById('wmn-001');
        console.log('Product wmn-001:', JSON.stringify(p, null, 2));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debug();
