"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.deleteUser = exports.getUsers = exports.getUserProfile = exports.logoutUser = exports.refreshTokens = exports.registerUser = exports.authUser = exports.setTokenCookies = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateTokens_1 = require("../utils/generateTokens");
const cookieOptions_1 = require("../config/cookieOptions");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiResponse_1 = require("../utils/apiResponse");
const setTokenCookies = (res, user) => {
    const accessToken = (0, generateTokens_1.generateAccessToken)(user._id.toString());
    const refreshToken = (0, generateTokens_1.generateRefreshToken)(user._id.toString());
    res.cookie('accessToken', accessToken, cookieOptions_1.cookieOptionsAccess);
    res.cookie('refreshToken', refreshToken, cookieOptions_1.cookieOptionsRefresh);
};
exports.setTokenCookies = setTokenCookies;
exports.authUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user) {
        return apiResponse_1.ApiResponseHandler.unauthorized(res, 'Invalid email or password');
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
        return apiResponse_1.ApiResponseHandler.forbidden(res, 'Account temporarily locked. Please try again later.');
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        user.loginAttempts += 1;
        if (user.loginAttempts >= 5) {
            user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes lockout
        }
        await user.save();
        return apiResponse_1.ApiResponseHandler.unauthorized(res, 'Invalid email or password');
    }
    // Reset lockout parameters on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();
    (0, exports.setTokenCookies)(res, user);
    apiResponse_1.ApiResponseHandler.success(res, {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    }, 'Login successful');
});
exports.registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { username, email, password } = req.body;
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        return apiResponse_1.ApiResponseHandler.error(res, 'User already exists', 400);
    }
    const user = await User_1.default.create({
        username,
        email,
        password,
    });
    if (user) {
        (0, exports.setTokenCookies)(res, user);
        apiResponse_1.ApiResponseHandler.created(res, {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }, 'User registered successfully');
    }
    else {
        apiResponse_1.ApiResponseHandler.error(res, 'Invalid user data', 400);
    }
});
exports.refreshTokens = (0, express_async_handler_1.default)(async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return apiResponse_1.ApiResponseHandler.unauthorized(res, 'No refresh token provided');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = (0, generateTokens_1.generateAccessToken)(decoded.id);
        const newRefreshToken = (0, generateTokens_1.generateRefreshToken)(decoded.id); // Rotating refresh token
        res.cookie("accessToken", newAccessToken, cookieOptions_1.cookieOptionsAccess);
        res.cookie("refreshToken", newRefreshToken, cookieOptions_1.cookieOptionsRefresh);
        apiResponse_1.ApiResponseHandler.success(res, {
            message: 'Tokens refreshed'
        }, 'Tokens refreshed successfully');
    }
    catch {
        apiResponse_1.ApiResponseHandler.forbidden(res, 'Invalid refresh token');
    }
});
const logoutUser = (req, res) => {
    res.clearCookie("accessToken", cookieOptions_1.cookieOptionsAccess);
    res.clearCookie("refreshToken", cookieOptions_1.cookieOptionsRefresh);
    apiResponse_1.ApiResponseHandler.success(res, { message: "Logged out securely" }, 'Logged out successfully');
};
exports.logoutUser = logoutUser;
exports.getUserProfile = (0, express_async_handler_1.default)(async (req, res) => {
    const user = await User_1.default.findById(req.user._id).select('-password');
    if (user) {
        apiResponse_1.ApiResponseHandler.success(res, user, 'User profile retrieved successfully');
    }
    else {
        apiResponse_1.ApiResponseHandler.notFound(res, 'User not found');
    }
});
exports.getUsers = (0, express_async_handler_1.default)(async (req, res) => {
    const users = await User_1.default.find({}).select('-password');
    apiResponse_1.ApiResponseHandler.success(res, users, 'Users retrieved successfully');
});
/**
 * @desc    Delete user
 * @route   DELETE /api/auth/:id
 * @access  Private/Admin
 */
exports.deleteUser = (0, express_async_handler_1.default)(async (req, res) => {
    const user = await User_1.default.findById(req.params.id);
    if (user) {
        if (user.role === 'admin') {
            return apiResponse_1.ApiResponseHandler.error(res, 'Cannot delete an admin user', 400);
        }
        await user.deleteOne();
        apiResponse_1.ApiResponseHandler.success(res, { message: 'User removed' }, 'User deleted successfully');
    }
    else {
        apiResponse_1.ApiResponseHandler.notFound(res, 'User not found');
    }
});
/**
 * @desc    Update user role
 * @route   PUT /api/auth/:id/role
 * @access  Private/Admin
 */
exports.updateUserRole = (0, express_async_handler_1.default)(async (req, res) => {
    const { role } = req.body;
    const user = await User_1.default.findById(req.params.id);
    if (user) {
        user.role = role || user.role;
        const updatedUser = await user.save();
        apiResponse_1.ApiResponseHandler.success(res, {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
        }, 'User role updated successfully');
    }
    else {
        apiResponse_1.ApiResponseHandler.notFound(res, 'User not found');
    }
});
//# sourceMappingURL=authController.js.map