import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';

interface AuthRequest extends Request {
    user?: any;
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken || req.cookies.token;
        console.log('Protect middleware - Cookies:', req.cookies);
        console.log('Protect middleware - Token found:', !!token);

        if (!token) {
            console.log('Protect middleware - No token provided');
            res.status(401);
            return next(new Error('Not authorized, no token'));
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log('Protect middleware - Token decoded, user ID:', decoded.id);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            console.log('Protect middleware - User not found for ID:', decoded.id);
            res.status(401);
            return next(new Error('Not authorized, user not found'));
        }

        next();
    } catch (error) {
        console.error('Protect middleware error:', error);
        res.status(401); // Standardized to 401 for consistency
        next(new Error('Not authorized, token failed'));
    }
};

export { protect };
