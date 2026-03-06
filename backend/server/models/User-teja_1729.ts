import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        // Make password optional for users who sign in via Google
        required: function (this: any) {
            return !this.googleId;
        },
    },
    googleId: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    avatar: {
        type: String,
    },
    addresses: [addressSchema],
    sizePreferences: {
        men: {
            tshirt: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL', ''] },
            shirt: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL', ''] },
            jeans: { type: String },
            shoes: { type: String },
        },
        women: {
            top: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', ''] },
            dress: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', ''] },
            waist: { type: String },
            footwear: { type: String },
        }
    },
    loginAttempts: {
        type: Number,
        required: true,
        default: 0,
    },
    lockUntil: {
        type: Date,
    },
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (this: any) {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
