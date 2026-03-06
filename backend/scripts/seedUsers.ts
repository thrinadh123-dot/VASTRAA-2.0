import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
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

const firstNames = ['Arjun', 'Priya', 'Rohan', 'Ananya', 'Vikram', 'Sanya', 'Amit', 'Deepika', 'Rahul', 'Sneha', 'Karan', 'Isha', 'Varun', 'Meera', 'Aditya', 'Tanvi', 'Ishaan', 'Riya', 'Sameer', 'Kiara'];
const lastNames = ['Mehta', 'Sharma', 'Das', 'Singh', 'Malhotra', 'Gupta', 'Kapoor', 'Verma', 'Joshi', 'Reddy', 'Chopra', 'Nair', 'Patel', 'Bose', 'Dutta', 'Saini', 'Bajaj', 'Thakur', 'Kulkarni', 'Misra'];

const seedUsers = async () => {
    try {
        await connectDB();

        // Count existing users to avoid duplicates if possible or just add more
        const existingCount = await User.countDocuments({ role: 'user' });
        console.log(`Found ${existingCount} existing users.`);

        const usersToCreate = 50;
        const password = await bcrypt.hash('password123', 10);

        const newUsers = [];
        for (let i = 0; i < usersToCreate; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const name = `${firstName} ${lastName}`;
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${Math.floor(Math.random() * 10000)}@example.com`;

            newUsers.push({
                name,
                username: email.split('@')[0],
                email,
                password,
                role: 'user'
            });
        }

        await User.insertMany(newUsers);
        console.log(`✅ Seeded ${usersToCreate} demo users successfully!`);
        process.exit();
    } catch (error) {
        console.error(`Error seeding users: ${error}`);
        process.exit(1);
    }
};

seedUsers();
