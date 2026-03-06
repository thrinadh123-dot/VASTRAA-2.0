import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../server/models/Product';
import User from '../server/models/User';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI!);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const names = ['Arjun Mehta', 'Priya Sharma', 'Rohan Das', 'Ananya Singh', 'Vikram Malhotra', 'Sanya Gupta', 'Amitabh Bachchan', 'Deepika Padukone', 'Ranveer Singh', 'Alia Bhatt', 'Shah Rukh Khan', 'Priyanka Chopra', 'Virat Kohli', 'MS Dhoni', 'Sachin Tendulkar'];

// Rating Distribution (0-100)
// 50-60% -> 5★
// 20-30% -> 4★
// 10-15% -> 3★
// 0-5%   -> 2★
// 0-3%   -> 1★
const getRandomRating = (): number => {
    const rand = Math.random() * 100;
    if (rand < 55) return 5;
    if (rand < 85) return 4;
    if (rand < 95) return 3;
    if (rand < 98) return 2;
    return 1;
};

// Date Generation Spread Across Past 90 Days
const usedDates = new Set<number>();
const getRandomDate = (): Date => {
    let timestamp;
    do {
        const past90Days = 90 * 24 * 60 * 60 * 1000;
        timestamp = Date.now() - Math.floor(Math.random() * past90Days);
    } while (usedDates.has(timestamp));
    usedDates.add(timestamp);
    return new Date(timestamp);
};

// Dynamic Comment Generation
const aspects = ['fabric quality', 'fit & sizing', 'comfort level', 'packaging', 'delivery speed', 'value for money', 'color accuracy', 'durability', 'brand feel', 'occasion wear suitability'];

const snippets = {
    5: [
        "Absolutely love the {aspect}! Will definitely buy again.",
        "The {aspect} exceeded my expectations. Worth every penny.",
        "A fantastic purchase. Highly impressed by the {aspect}.",
        "Couldn't be happier with the {aspect}. Highly recommended!",
        "Stunning piece! The {aspect} makes it feel incredibly premium.",
        "Best purchase this season, particularly because of the {aspect}.",
        "Perfect for gifting. The {aspect} alone is top-notch."
    ],
    4: [
        "Really like the {aspect}, but could be slightly better.",
        "Good {aspect}. Overall a great purchase.",
        "Happy with the {aspect}. It matches the description well.",
        "Solid {aspect}, just took a bit long to arrive.",
        "Premium feel! The {aspect} is good, though sizing is slightly snug.",
        "Comfortable for all-day wear. The {aspect} is nice.",
        "Wait for a sale if you find it costly, but you won't regret the {aspect}."
    ],
    3: [
        "The {aspect} is fine, but not exactly what I expected.",
        "Average {aspect}. Nothing too special, but it works.",
        "Fair for the price point, but room for improvement on the {aspect}.",
        "The {aspect} is acceptable. Might try another style next time.",
        "It's a mixed bag. Loved the look but {aspect} is mediocre.",
        "Not bad, but the {aspect} is slightly different than shown.",
        "It's an okay product, mostly let down by the {aspect}."
    ],
    2: [
        "Disappointed with the {aspect}. Feels a bit cheap.",
        "Not very happy with the {aspect}. I expected better quality from Vastraa.",
        "The {aspect} didn't meet my expectations at all.",
        "I wouldn't repurchase. The {aspect} seems off.",
        "Subpar {aspect}. Expected much more for this price.",
        "Issues with {aspect} ruined the experience for me.",
        "Not worth the hype. The {aspect} is very disappointing."
    ],
    1: [
        "Terrible {aspect}. Wouldn't recommend this at all.",
        "Very poor {aspect}. Totally unacceptable quality.",
        "Regret buying this because of the {aspect}. Complete waste of money.",
        "The photos are misleading. Extremely disappointed with the {aspect}.",
        "Worst purchase ever. The {aspect} is a joke.",
        "Do not buy! The {aspect} is horrendous.",
        "1 star due to the awful {aspect}."
    ]
};

const generateUniqueComment = (rating: number, usedComments: Set<string>): string => {
    let comment = "";
    let attempts = 0;
    do {
        const aspect = aspects[Math.floor(Math.random() * aspects.length)];
        const templateArray = snippets[rating as keyof typeof snippets];
        const template = templateArray[Math.floor(Math.random() * templateArray.length)];

        // Capitalize the first letter of aspect if it starts a sentence, else keep it lower
        // In our templates, mostly it's mid-sentence so lowercase aspect is fine.
        comment = template.replace('{aspect}', aspect);
        attempts++;
    } while (usedComments.has(comment) && attempts < 100);

    // Fallback if loop exhausts without unique combination
    if (usedComments.has(comment)) {
        comment = `${comment} - Unique ID: ${Math.random().toString(36).substring(7)}`;
    }

    usedComments.add(comment);
    return comment;
};

const seedReviews = async () => {
    try {
        await connectDB();

        const products = await Product.find({});
        const users = await User.find({ role: 'user' }).limit(30);

        if (users.length === 0) {
            console.error('No users found to seed reviews.');
            process.exit(1);
        }

        for (const product of products) {
            // Shuffle users to ensure randomness and distinctness per product
            const shuffledUsers = [...users].sort(() => 0.5 - Math.random());

            // Limit reviews to number of available users to ensure distinct reviewer objects
            const maxPossibleReviews = Math.min(shuffledUsers.length, 25);
            const numReviewsToSeed = Math.floor(Math.random() * (maxPossibleReviews - 5 + 1)) + 5;

            const sessionReviews = [];
            const usedComments = new Set<string>();

            for (let i = 0; i < numReviewsToSeed; i++) {
                const randomUser = shuffledUsers[i];
                if (!randomUser) continue;

                const rating = getRandomRating();
                const comment = generateUniqueComment(rating, usedComments);

                sessionReviews.push({
                    name: randomUser.name || names[i % names.length] || 'Verified Buyer',
                    rating,
                    comment,
                    user: randomUser._id,
                    createdAt: getRandomDate()
                });
            }

            const totalRating = sessionReviews.reduce((acc, r) => acc + r.rating, 0);
            await Product.findByIdAndUpdate(product._id, {
                reviews: sessionReviews,
                numReviews: sessionReviews.length,
                rating: Number((totalRating / sessionReviews.length).toFixed(1))
            });
            console.log(`✅ Seeded ${sessionReviews.length} unique reviews for: ${product.name}`);
        }

        console.log('🚀 Realistic Review Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedReviews();
