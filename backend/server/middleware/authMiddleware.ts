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

        if (!token) {
            res.status(401);
            return next(new Error('Not authorized, no token'));
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            res.status(401);
            return next(new Error('Not authorized, user not found'));
        }

        next();
    } catch (error) {
        console.error('Protect middleware error:', error);
        res.status(403);
        next(new Error('Not authorized, token failed'));
    }
};

export { protect };
