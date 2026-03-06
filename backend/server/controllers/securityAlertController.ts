import { Request, Response } from 'express';
import mongoose from 'mongoose';
import SecurityAlert from '../models/SecurityAlert';

// @desc    Get latest active security alert for a user
// @route   GET /api/security-alert/:userId
// @access  Private
export const getSecurityAlert = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const alert = await SecurityAlert.findOne({ userId, active: true })
            .sort({ createdAt: -1 })
            .lean();

        if (!alert) {
            res.json({ active: false });
            return;
        }

        res.json({
            _id: alert._id,
            ip: alert.ip,
            attempts: alert.attempts,
            time: alert.time,
            message: alert.message,
            active: alert.active,
            createdAt: alert.createdAt,
        });
    } catch (error: any) {
        console.error('Error fetching security alert:', error.message);
        res.status(500).json({ message: 'Server error fetching security alert' });
    }
};

// @desc    Create a new security alert (called by defence framework)
// @route   POST /api/security-alert
// @access  Public (framework-to-framework)
export const createSecurityAlert = async (req: Request, res: Response) => {
    console.log(`[${new Date().toLocaleTimeString()}] incoming security alert request for userId: ${req.body.userId}`);
    try {
        const { userId, ip, attempts, time, message } = req.body;

        if (!userId || !ip || !attempts || !time) {
            res.status(400).json({ message: 'userId, ip, attempts, and time are required' });
            return;
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid userId format. Must be a 24-character hex string (MongoDB ObjectId).' });
            return;
        }

        const alert = await SecurityAlert.create({
            userId,
            ip,
            attempts,
            time,
            message: message || 'Suspicious login activity detected on your account.',
        });

        res.status(201).json(alert);
    } catch (error: any) {
        console.error('CRITICAL: Error creating security alert:', error);
        res.status(500).json({ message: `Server error creating security alert: ${error.message}` });
    }
};

// @desc    Dismiss a security alert
// @route   PUT /api/security-alert/:id/dismiss
// @access  Private
export const dismissSecurityAlert = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const alert = await SecurityAlert.findByIdAndUpdate(
            id,
            { active: false },
            { new: true }
        );

        if (!alert) {
            res.status(404).json({ message: 'Alert not found' });
            return;
        }

        res.json({ message: 'Alert dismissed', alert });
    } catch (error: any) {
        console.error('Error dismissing security alert:', error.message);
        res.status(500).json({ message: 'Server error dismissing alert' });
    }
};
