import { memoryStore } from '../services/memoryStore.service.js';
export const getAuditTrail = (req, res) => {
    try {
        const { action, limit } = req.query;
        const entries = memoryStore.getAuditTrail(limit ? parseInt(limit, 10) : 100, action);
        res.json({ success: true, data: entries });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
export const logEntry = (req, res) => {
    try {
        const { action, details, tenderId, vendorId, metadata } = req.body;
        if (!action || !details) {
            return res.status(400).json({ success: false, error: 'Action and details are required' });
        }
        const entry = memoryStore.logAudit({
            userId: req.user?.id || 'officer',
            userName: req.user?.name || 'Procurement Officer',
            action,
            details,
            tenderId,
            vendorId,
            metadata
        });
        res.status(201).json({ success: true, data: entry });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
