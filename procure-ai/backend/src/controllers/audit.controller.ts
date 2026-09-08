import type { Request, Response } from 'express';
import { memoryStore } from '../services/memoryStore.service.js';

export const getAuditTrail = (req: Request, res: Response) => {
  try {
    const { action, limit } = req.query;
    const entries = memoryStore.getAuditTrail(
      limit ? parseInt(limit as string, 10) : 100,
      action as string
    );
    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const logEntry = (req: Request, res: Response) => {
  try {
    const { action, details, tenderId, vendorId, metadata } = req.body;
    if (!action || !details) {
      return res.status(400).json({ success: false, error: 'Action and details are required' });
    }

    const entry = memoryStore.logAudit({
      userId: (req as any).user?.id || 'officer',
      userName: (req as any).user?.name || 'Procurement Officer',
      action,
      details,
      tenderId,
      vendorId,
      metadata
    });

    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};
