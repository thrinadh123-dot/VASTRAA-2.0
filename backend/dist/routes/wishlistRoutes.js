"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlistController_1 = require("../controllers/wishlistController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/').get(authMiddleware_1.protect, wishlistController_1.getWishlist);
router.route('/add').post(authMiddleware_1.protect, wishlistController_1.addToWishlist);
router.route('/remove/:productId').delete(authMiddleware_1.protect, wishlistController_1.removeFromWishlist);
router.route('/move-to-cart').post(authMiddleware_1.protect, wishlistController_1.moveToCart);
router.route('/move-all-to-cart').post(authMiddleware_1.protect, wishlistController_1.moveAllToCart);
exports.default = router;
//# sourceMappingURL=wishlistRoutes.js.map