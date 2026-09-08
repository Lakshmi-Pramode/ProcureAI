import type { Request, Response } from 'express';
import { geminiService } from '../services/gemini.service.js';
import { memoryStore } from '../services/memoryStore.service.js';

export const chat = async (req: Request, res: Response) => {
  try {
    const { query, tenderId, vendorId } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }

    let context = '';
    if (tenderId) {
      const tender = memoryStore.getTenderById(tenderId);
      const reqs = memoryStore.getRequirements(tenderId);
      context += `Tender: ${tender?.title}\nClauses: ${reqs.map(r => `${r.requirementId}: ${r.condition}`).join('; ')}\n`;
    }
    if (vendorId) {
      const vendor = memoryStore.getVendorById(vendorId);
      const risk = memoryStore.getRiskAssessmentByVendor(vendorId, tenderId);
      context += `Bidder: ${vendor?.name} (${vendor?.registrationNumber})\nRisk Level: ${risk?.riskLevel}, Score: ${risk?.overallScore}\n`;
    }

    const answer = await geminiService.answerProcurementQuestion(query, context);

    res.json({
      success: true,
      data: {
        query,
        answer,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};
