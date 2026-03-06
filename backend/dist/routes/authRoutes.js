"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const authorize_1 = require("../middleware/authorize");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = express_1.default.Router();
router.post('/register', rateLimiter_1.authLimiter, authController_1.registerUser);
router.post('/login', rateLimiter_1.authLimiter, authController_1.authUser);
router.post('/logout', authController_1.logoutUser);
router.post('/refresh', authController_1.refreshTokens);
// Initiate Google OAuth Flow
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'], session: false }));
// Google OAuth Callback
router.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login?error=GoogleAuthFailed',
    session: false,
}), (req, res) => {
    // Successful authentication
    const user = req.user;
    (0, authController_1.setTokenCookies)(res, user);
    // Redirect back to frontend
    res.redirect('http://localhost:5173');
});
router.route('/profile').get(authMiddleware_1.protect, authController_1.getUserProfile);
router.route('/me').get(authMiddleware_1.protect, authController_1.getUserProfile);
router.route('/').get(authMiddleware_1.protect, (0, authorize_1.authorize)('admin'), authController_1.getUsers);
router.route('/:id').delete(authMiddleware_1.protect, (0, authorize_1.authorize)('admin'), authController_1.deleteUser);
router.route('/:id/role').put(authMiddleware_1.protect, (0, authorize_1.authorize)('admin'), authController_1.updateUserRole);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map