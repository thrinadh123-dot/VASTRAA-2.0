import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../server/models/Product';

dotenv.config({ path: path.join(__dirname, '../.env') });

const visualVerify = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI!);

        const count = await Product.countDocuments();
        console.log(`Total Documents in 'vastraa.products': ${count}`);

        if (count === 0) {
            console.log('❌ Database is empty! Seeding may have failed.');
            process.exit(1);
        }

        console.log('\n--- SAMPLE PRODUCT DOCUMENTS (Visual Verification) ---\n');
        const samples = await Product.find().limit(5).lean();

        samples.forEach((doc, index) => {
            console.log(`[Product ${index + 1}]`);
            console.log(JSON.stringify(doc, null, 2));
            console.log('-----------------------------------\n');
        });

        process.exit(0);
    } catch (error: any) {
        console.error('Verification failed:', error.message);
        process.exit(1);
    }
};

visualVerify();
