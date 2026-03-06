import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    getSecurityAlert,
    createSecurityAlert,
    dismissSecurityAlert,
} from '../controllers/securityAlertController';

const router = Router();

// GET  /api/security-alert/:userId  — fetch latest active alert (protected)
router.get('/:userId', protect, getSecurityAlert);

// POST /api/security-alert           — create alert (defence framework call)
router.post('/', createSecurityAlert);

// PUT  /api/security-alert/:id/dismiss — dismiss an alert (protected)
router.put('/:id/dismiss', protect, dismissSecurityAlert);

export default router;
