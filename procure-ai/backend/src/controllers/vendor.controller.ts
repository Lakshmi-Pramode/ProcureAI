import type { Request, Response } from 'express';
import { memoryStore } from '../services/memoryStore.service.js';
import type { Vendor } from '../types/index.js';

export const getVendors = (req: Request, res: Response) => {
  try {
    const { tenderId } = req.query;
    const vendors = memoryStore.getVendors(tenderId as string);

    // If tenderId is provided, also attach compliance score for this tender
    if (tenderId) {
      const scores = memoryStore.getVendorScores(tenderId as string);
      const vendorsWithScores = vendors.map(v => {
        const score = scores.find(s => s.vendorId === v.id);
        return {
          ...v,
          score
        };
      });
      return res.json({ success: true, data: vendorsWithScores });
    }

    res.json({ success: true, data: vendors });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const getVendorById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenderId } = req.query;
    const vendor = memoryStore.getVendorById(id);
    if (!vendor) return res.status(404).json({ success: false, error: 'Vendor not found' });

    const documents = memoryStore.getDocuments(vendor.id, tenderId as string);
    const complianceResults = memoryStore.getComplianceResults(tenderId as string, vendor.id);
    const riskAssessment = memoryStore.getRiskAssessmentByVendor(vendor.id, tenderId as string);

    res.json({
      success: true,
      data: {
        ...vendor,
        documents,
        complianceResults,
        riskAssessment
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const createVendor = (req: Request, res: Response) => {
  try {
    const {
      name, contactPerson, email, phone, address,
      registrationNumber, gstNumber, panNumber, tenderId
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Vendor name and email are required' });
    }

    const num = Math.floor(100 + Math.random() * 900);
    const id = `vendor_${Date.now()}`;
    const vendorId = `VND${num}`;

    const newVendor: Vendor = {
      id,
      vendorId,
      name,
      contactPerson: contactPerson || 'Authorized Signatory',
      email,
      phone: phone || '',
      address: address || '',
      registrationNumber: registrationNumber || `REG-${Date.now()}`,
      gstNumber,
      panNumber,
      tenderIds: tenderId ? [tenderId] : ['tender_001'],
      documents: [],
      bidSubmissionDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    memoryStore.createVendor(newVendor);

    // If tenderId, add to tender's vendor list
    if (tenderId) {
      const tender = memoryStore.getTenderById(tenderId);
      if (tender && !tender.vendors.includes(id)) {
        memoryStore.updateTender(tender.id, {
          vendors: [...tender.vendors, id]
        });
      }
    }

    memoryStore.logAudit({
      userId: (req as any).user?.id || 'officer',
      userName: (req as any).user?.name || 'Procurement Officer',
      action: 'vendor_added',
      vendorId: newVendor.id,
      vendorName: newVendor.name,
      details: `Registered bidder "${newVendor.name}" with registration ${newVendor.registrationNumber}`
    });

    res.status(201).json({ success: true, data: newVendor });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const updateVendor = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = memoryStore.updateVendor(id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Vendor not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const getVendorScores = (req: Request, res: Response) => {
  try {
    const { tenderId } = req.params;
    const scores = memoryStore.getVendorScores(tenderId);
    res.json({ success: true, data: scores });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};
