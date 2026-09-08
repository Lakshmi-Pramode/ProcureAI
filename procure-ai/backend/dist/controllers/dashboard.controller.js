import { memoryStore } from '../services/memoryStore.service.js';
export const getStats = (_req, res) => {
    try {
        const stats = memoryStore.getDashboardStats();
        res.json({ success: true, data: stats });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
