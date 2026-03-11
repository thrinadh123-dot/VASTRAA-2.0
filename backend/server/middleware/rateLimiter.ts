import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

// In development, bypass rate limiting entirely
const dummyLimiter = (req: any, res: any, next: any) => next();

// Global API Limiter
export const apiLimiter = isDev
    ? dummyLimiter
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again after 15 minutes',
        standardHeaders: true,
        legacyHeaders: false,
    });

// Auth API Limiter
export const authLimiter = isDev
    ? dummyLimiter
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 7,
        message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
        standardHeaders: true,
        legacyHeaders: false,
    });
