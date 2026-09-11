import type { Request, Response } from 'express';
import { memoryStore } from '../services/memoryStore.service.js';
import { complianceEngineService } from '../services/complianceEngine.service.js';
import type { ComplianceStatus } from '../types/index.js';

export const runVerification = async (req: Request, res: Response) => {
  try {
    const { tenderId, vendorId, useLocalAI } = req.body;
    if (!tenderId) {
      return res.status(400).json({ success: false, error: 'tenderId is required' });
    }

    const officerName = (req as any).user?.name || 'Procurement Officer';

    if (vendorId) {
      const results = await complianceEngineService.verifyVendorCompliance(tenderId, vendorId, officerName, useLocalAI);
      return res.json({ success: true, data: results });
    }

    // If no vendorId, verify all vendors for this tender
    const allResults = await complianceEngineService.verifyAllBiddersForTender(tenderId, useLocalAI);
    res.json({ success: true, data: allResults });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const getResults = (req: Request, res: Response) => {
  try {
    const { tenderId, vendorId } = req.query;
    const results = memoryStore.getComplianceResults(tenderId as string, vendorId as string);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const saveOverride = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'status is required' });
    }

    const reviewedBy = (req as any).user?.name || 'Procurement Officer';
    const updated = memoryStore.overrideComplianceResult(id, {
      status: status as ComplianceStatus,
      reason: reason || 'Manual verification override by Procurement Officer',
      reviewedBy
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Compliance result not found' });
    }

    const vendor = memoryStore.getVendorById(updated.vendorId);
    memoryStore.logAudit({
      userId: (req as any).user?.id || 'officer',
      userName: reviewedBy,
      action: 'compliance_result_overridden',
      tenderId: updated.tenderId,
      vendorId: updated.vendorId,
      vendorName: vendor?.name,
      details: `Officer override on clause ${updated.requirementId}: Marked as ${status.toUpperCase()}. Rationale: "${reason || 'Verified'}"`
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

// Side-by-side compliance matrix comparing all vendors against all tender clauses
export const getMatrix = (req: Request, res: Response) => {
  try {
    const { tenderId } = req.params;
    const requirements = memoryStore.getRequirements(tenderId);
    const vendors = memoryStore.getVendors(tenderId);
    const results = memoryStore.getComplianceResults(tenderId);

    const matrix = requirements.map(req => {
      const vendorResults: Record<string, any> = {};
      vendors.forEach(v => {
        const match = results.find(r => r.vendorId === v.id && r.requirementId === req.requirementId);
        vendorResults[v.id] = match || {
          status: 'manual_review',
          confidence: 0.5,
          explanation: 'Pending document verification'
        };
      });
      return {
        requirement: req,
        results: vendorResults
      };
    });

    res.json({
      success: true,
      data: {
        tenderId,
        requirements,
        vendors,
        matrix
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};
