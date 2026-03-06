import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens';
import { cookieOptionsAccess, cookieOptionsRefresh } from '../config/cookieOptions';
import asyncHandler from 'express-async-handler';
import { ApiResponseHandler } from '../utils/apiResponse';

export const setTokenCookies = (res: Response, user: any) => {
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie('accessToken', accessToken, cookieOptionsAccess);
    res.cookie('refreshToken', refreshToken, cookieOptionsRefresh);
};

export const authUser = asyncHandler(async (req: any, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return ApiResponseHandler.unauthorized(res, 'Invalid email or password');
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
        return ApiResponseHandler.forbidden(res, 'Account temporarily locked. Please try again later.');
    }

    const isMatch = await (user as any).matchPassword(password);

    if (!isMatch) {
        user.loginAttempts += 1;
        if (user.loginAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes lockout
        }
        await user.save();

        return ApiResponseHandler.unauthorized(res, 'Invalid email or password');
    }

    // Reset lockout parameters on successful login
    user.loginAttempts = 0;
    user.lockUntil = null as any;
    await user.save();

    setTokenCookies(res, user);

    ApiResponseHandler.success(res, {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    }, 'Login successful');
});

export const registerUser = asyncHandler(async (req: any, res: Response) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return ApiResponseHandler.error(res, 'User already exists', 400);
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        setTokenCookies(res, user);

        ApiResponseHandler.created(res, {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }, 'User registered successfully');
    } else {
        ApiResponseHandler.error(res, 'Invalid user data', 400);
    }
});

export const refreshTokens = asyncHandler(async (req: any, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return ApiResponseHandler.unauthorized(res, 'No refresh token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;

        const newAccessToken = generateAccessToken(decoded.id);
        const newRefreshToken = generateRefreshToken(decoded.id); // Rotating refresh token

        res.cookie("accessToken", newAccessToken, cookieOptionsAccess);
        res.cookie("refreshToken", newRefreshToken, cookieOptionsRefresh);

        ApiResponseHandler.success(res, {
            message: 'Tokens refreshed'
        }, 'Tokens refreshed successfully');
    } catch {
        ApiResponseHandler.forbidden(res, 'Invalid refresh token');
    }
});

export const logoutUser = (req: any, res: Response) => {
    res.clearCookie("accessToken", cookieOptionsAccess);
    res.clearCookie("refreshToken", cookieOptionsRefresh);
    ApiResponseHandler.success(res, { message: "Logged out securely" }, 'Logged out successfully');
};

export const getUserProfile = asyncHandler(async (req: any, res: Response) => {
    // If protect middleware already fetched the user, we can use it directly
    // Otherwise, fetch it (fallback)
    const user = req.user && req.user.toObject ? req.user : await User.findById(req.user._id).select('-password');

    if (user) {
        // Step 1: Migration Logic for backward compatibility
        let modified = false;

        // Ensure we are working with a document if we need to save
        const isDocument = typeof user.save === 'function';

        // If user has old flat structure (tshirt exists outside men/women)
        const sizePrefs = (user as any).sizePreferences;
        if (sizePrefs && !sizePrefs.men && sizePrefs.tshirt !== undefined) {
            (user as any).sizePreferences = {
                men: {
                    tshirt: sizePrefs.tshirt || '',
                    shirt: sizePrefs.shirt || '',
                    jeans: sizePrefs.jeans || '',
                    shoes: sizePrefs.shoes || '',
                },
                women: {
                    top: '',
                    dress: '',
                    waist: '',
                    footwear: '',
                }
            };
            modified = true;
        }

        if (modified && isDocument) {
            await user.save();
        }

        ApiResponseHandler.success(res, user, 'User profile retrieved successfully');
    } else {
        ApiResponseHandler.notFound(res, 'User not found');
    }
});

export const getUsers = asyncHandler(async (req: any, res: Response) => {
    const users = await User.find({}).select('-password');
    ApiResponseHandler.success(res, users, 'Users retrieved successfully');
});

/**
 * @desc    Delete user
 * @route   DELETE /api/auth/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin') {
            return ApiResponseHandler.error(res, 'Cannot delete an admin user', 400);
        }
        await user.deleteOne();
        ApiResponseHandler.success(res, { message: 'User removed' }, 'User deleted successfully');
    } else {
        ApiResponseHandler.notFound(res, 'User not found');
    }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        (user as any).name = req.body.name || (user as any).name;
        (user as any).phone = req.body.phone || (user as any).phone;
        (user as any).avatar = req.body.avatar || (user as any).avatar;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        ApiResponseHandler.success(res, {
            _id: updatedUser._id,
            username: updatedUser.username,
            name: (updatedUser as any).name,
            email: updatedUser.email,
            phone: (updatedUser as any).phone,
            avatar: (updatedUser as any).avatar,
            role: updatedUser.role,
            sizePreferences: (updatedUser as any).sizePreferences,
        }, 'Profile updated successfully');
    } else {
        ApiResponseHandler.notFound(res, 'User not found');
    }
});

/**
 * @desc    Update user size preferences
 * @route   PUT /api/auth/sizes
 * @access  Private
 */
export const updateUserSizes = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { gender, data } = req.body;

        if (!gender || !['men', 'women'].includes(gender)) {
            return ApiResponseHandler.error(res, 'Valid gender (men/women) is required', 400);
        }

        // Initialize if not exists (safety)
        if (!user.sizePreferences) {
            (user as any).sizePreferences = { men: {}, women: {} };
        }

        // Update only the specific block
        (user as any).sizePreferences[gender] = {
            ...(user as any).sizePreferences[gender],
            ...data
        };

        const updatedUser = await user.save();
        ApiResponseHandler.success(res, {
            _id: updatedUser._id,
            username: updatedUser.username,
            name: (updatedUser as any).name,
            email: updatedUser.email,
            phone: (updatedUser as any).phone,
            avatar: (updatedUser as any).avatar,
            role: updatedUser.role,
            sizePreferences: (updatedUser as any).sizePreferences,
        }, 'Size preferences updated successfully');
    } else {
        ApiResponseHandler.notFound(res, 'User not found');
    }
});

/**
 * @desc    Delete own account
 * @route   DELETE /api/auth/me
 * @access  Private
 */
export const deleteMyAccount = asyncHandler(async (req: any, res: Response) => {
    const user = await User.findById(req.user._id);
    if (user) {
        await user.deleteOne();
        res.clearCookie("accessToken", cookieOptionsAccess);
        res.clearCookie("refreshToken", cookieOptionsRefresh);
        ApiResponseHandler.success(res, null, 'Account deleted successfully');
    } else {
        ApiResponseHandler.notFound(res, 'User not found');
    }
});

/**
 * @desc    Update user role
 * @route   PUT /api/auth/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = asyncHandler(async (req: any, res: Response) => {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
        user.role = role || user.role;
        const updatedUser = await user.save();
        ApiResponseHandler.success(res, {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
        }, 'User role updated successfully');
    } else {
        ApiResponseHandler.notFound(res, 'User not found');
    }
});
