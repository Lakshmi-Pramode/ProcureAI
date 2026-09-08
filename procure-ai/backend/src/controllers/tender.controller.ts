import type { Request, Response } from 'express';
import { memoryStore } from '../services/memoryStore.service.js';
import { geminiService } from '../services/gemini.service.js';
import type { Tender, Requirement } from '../types/index.js';

export const getTenders = (_req: Request, res: Response) => {
  try {
    const tenders = memoryStore.getTenders();
    res.json({ success: true, data: tenders });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const getTenderById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tender = memoryStore.getTenderById(id);
    if (!tender) {
      return res.status(404).json({ success: false, error: 'Tender not found' });
    }

    const requirements = memoryStore.getRequirements(tender.id);
    const vendors = memoryStore.getVendors(tender.id);
    const scores = memoryStore.getVendorScores(tender.id);

    res.json({
      success: true,
      data: {
        ...tender,
        requirements,
        vendors,
        vendorScores: scores
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const createTender = async (req: Request, res: Response) => {
  try {
    const {
      title, department, organization, category,
      submissionDeadline, description, requirements: initialReqs
    } = req.body;

    if (!title || !department) {
      return res.status(400).json({ success: false, error: 'Title and department are required' });
    }

    const tenderNum = Math.floor(1000 + Math.random() * 9000);
    const id = `tender_${Date.now()}`;
    const tenderId = `TND-2026-${tenderNum}`;

    const newRequirements: Requirement[] = (initialReqs || []).map((r: any, idx: number) => ({
      id: `req_${Date.now()}_${idx}`,
      tenderId: id,
      requirementId: r.requirementId || `R${String(idx + 1).padStart(3, '0')}`,
      description: r.description,
      category: r.category || 'Legal',
      condition: r.condition || '',
      mandatory: r.mandatory !== false,
      sourcePage: r.sourcePage || 1,
      sourceText: r.sourceText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    newRequirements.forEach(reqObj => memoryStore.createRequirement(reqObj));

    const newTender: Tender = {
      id,
      tenderId,
      title,
      department,
      organization: organization || 'Government Procurement Dept',
      category: category || 'General',
      submissionDeadline: submissionDeadline || new Date(Date.now() + 30 * 86400000).toISOString(),
      description: description || '',
      status: 'published',
      documents: [],
      requirements: newRequirements,
      vendors: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: (req as any).user?.name || 'Procurement Officer',
      isAnalyzed: false
    };

    memoryStore.createTender(newTender);

    memoryStore.logAudit({
      userId: (req as any).user?.id || 'officer',
      userName: (req as any).user?.name || 'Procurement Officer',
      action: 'tender_created',
      tenderId: newTender.id,
      tenderTitle: newTender.title,
      details: `Created tender "${newTender.title}" with ${newRequirements.length} clauses.`
    });

    res.status(201).json({ success: true, data: newTender });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const updateTender = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = memoryStore.updateTender(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Tender not found' });
    }

    memoryStore.logAudit({
      userId: (req as any).user?.id || 'officer',
      userName: (req as any).user?.name || 'Procurement Officer',
      action: 'tender_updated',
      tenderId: updated.id,
      tenderTitle: updated.title,
      details: `Updated tender specifications or status for "${updated.title}"`
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const deleteTender = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = memoryStore.deleteTender(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Tender not found' });
    }
    res.json({ success: true, message: 'Tender deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

// AI Clause Extraction from Tender Document text
export const extractRequirements = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const tender = memoryStore.getTenderById(id);
    if (!tender) return res.status(404).json({ success: false, error: 'Tender not found' });

    const clauses = await geminiService.extractRequirementsFromText(
      text || tender.description || 'General procurement criteria',
      tender.title
    );

    const savedClauses: Requirement[] = [];
    for (const c of clauses) {
      const newReq = memoryStore.createRequirement({
        id: `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        tenderId: tender.id,
        requirementId: c.requirementId,
        description: c.description,
        category: c.category,
        condition: c.condition,
        mandatory: c.mandatory,
        sourcePage: c.sourcePage,
        sourceText: c.sourceText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      savedClauses.push(newReq);
    }

    memoryStore.logAudit({
      userId: (req as any).user?.id || 'officer',
      userName: (req as any).user?.name || 'Procurement Officer',
      action: 'requirement_extracted',
      tenderId: tender.id,
      tenderTitle: tender.title,
      details: `AI extracted ${savedClauses.length} clauses from tender documentation.`
    });

    res.json({ success: true, data: savedClauses });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};
