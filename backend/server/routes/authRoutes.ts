import express from 'express';
import passport from 'passport';
import { authUser, registerUser, getUserProfile, getUsers, refreshTokens, logoutUser, setTokenCookies, deleteUser, updateUserRole, updateUserProfile, updateUserSizes, deleteMyAccount } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { authorize } from '../middleware/authorize';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, authUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshTokens);

// Initiate Google OAuth Flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Google OAuth Callback
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:5173/login?error=GoogleAuthFailed',
        session: false,
    }),
    (req, res) => {
        // Successful authentication
        const user: any = req.user;

        setTokenCookies(res, user);

        // Redirect back to frontend
        res.redirect('http://localhost:5173');
    }
);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/me').get(protect, getUserProfile).delete(protect, deleteMyAccount);
router.route('/sizes').put(protect, updateUserSizes);
router.route('/').get(protect, authorize('admin'), getUsers);
router.route('/:id').delete(protect, authorize('admin'), deleteUser);
router.route('/:id/role').put(protect, authorize('admin'), updateUserRole);

export default router;
