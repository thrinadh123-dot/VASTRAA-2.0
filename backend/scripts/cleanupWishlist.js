const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const cleanup = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vastraa';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const wishlistCollection = mongoose.connection.collection('wishlists');

        const result = await wishlistCollection.updateMany(
            {},
            {
                $pull: {
                    products: {
                        $or: [
                            { productId: { $type: "string" } },
                            { product: { $type: "string" } }
                        ]
                    }
                }
            }
        );

        console.log(`Matched ${result.matchedCount} wishlists and cleaned ${result.modifiedCount} of them.`);
        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
};

cleanup();
