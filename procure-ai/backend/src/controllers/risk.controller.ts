import type { Request, Response } from 'express';
import { memoryStore } from '../services/memoryStore.service.js';
import { riskEngineService } from '../services/riskEngine.service.js';

export const getRiskAssessments = (req: Request, res: Response) => {
  try {
    const { tenderId } = req.query;
    const assessments = memoryStore.getRiskAssessments(tenderId as string);
    res.json({ success: true, data: assessments });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const getVendorRisk = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    const { tenderId } = req.query;
    const targetTenderId = (tenderId as string) || 'tender_001';

    let assessment = memoryStore.getRiskAssessmentByVendor(vendorId, targetTenderId);
    if (!assessment) {
      assessment = await riskEngineService.assessVendorRisk(targetTenderId, vendorId);
    }

    res.json({ success: true, data: assessment });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const recalculateRisk = async (req: Request, res: Response) => {
  try {
    const { tenderId, vendorId } = req.body;
    if (!tenderId || !vendorId) {
      return res.status(400).json({ success: false, error: 'tenderId and vendorId are required' });
    }

    const assessment = await riskEngineService.assessVendorRisk(tenderId, vendorId);
    res.json({ success: true, data: assessment });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};
