import rateLimit from 'express-rate-limit';

// Global API Limiter: max 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth API Limiter: strict limits for login/register/refresh
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 7, // Allow 7 attempts for auth routes
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
