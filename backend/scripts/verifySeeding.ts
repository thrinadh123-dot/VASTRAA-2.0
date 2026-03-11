import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../server/models/Product';

dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const count = await Product.countDocuments();
        console.log(`Verified: ${count} products found in database.`);

        if (count > 0) {
            const first = await Product.findOne();
            console.log('Sample Product:', JSON.stringify({
                name: first?.name,
                category: first?.category,
                frontendId: (first as any)?.frontendId,
                images: first?.images?.[0]
            }, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
};

verifyProducts();
