import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../server/models/Product';

dotenv.config({ path: path.join(__dirname, '../.env') });

const testConnection = async () => {
    try {
        console.log('Connecting to MongoDB at:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI!, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Connected successfully!');

        const count = await Product.countDocuments();
        console.log('Product count:', count);

        process.exit(0);
    } catch (error: any) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
};

testConnection();
