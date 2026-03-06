"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/').get(authMiddleware_1.protect, cartController_1.getCart);
router.route('/add').post(authMiddleware_1.protect, cartController_1.addToCart);
router.route('/remove/:productId').delete(authMiddleware_1.protect, cartController_1.removeFromCart);
router.route('/merge').post(authMiddleware_1.protect, cartController_1.mergeCart);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map