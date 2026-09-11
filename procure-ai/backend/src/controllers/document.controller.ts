import type { Request, Response } from 'express';
import path from 'path';
import { memoryStore } from '../services/memoryStore.service.js';
import { documentParserService } from '../services/documentParser.service.js';
import { geminiService } from '../services/gemini.service.js';
import type { VendorDocument, DocumentType } from '../types/index.js';

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { vendorId, tenderId, documentType } = req.body;
    const docType: DocumentType = (documentType as DocumentType) || 'Other';
    const targetVendorId = vendorId || 'vendor_001';
    const targetTenderId = tenderId || 'tender_001';

    const docId = `vdoc_${Date.now()}`;

    // Create document in initial uploaded state
    const newDoc: VendorDocument = {
      id: docId,
      vendorId: targetVendorId,
      tenderId: targetTenderId,
      documentType: docType,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      filePath: file.path,
      uploadedAt: new Date().toISOString(),
      status: 'extracting'
    };

    memoryStore.addDocument(newDoc);

    // Extract text asynchronously/in-line
    const { text, pages } = await documentParserService.extractTextFromFile(file.path, file.mimetype);

    // Run AI Entity extraction via Gemini or heuristic
    const extractedFields = await geminiService.extractDocumentFields(text, docType);

    // Update document with extracted data
    const readyDoc = memoryStore.updateDocument(docId, {
      status: 'ready',
      extractedData: {
        fields: extractedFields,
        sourcePage: pages || 1,
        confidence: 0.95,
        rawText: text.slice(0, 1000)
      }
    });

    const vendor = memoryStore.getVendorById(targetVendorId);
    memoryStore.logAudit({
      userId: (req as any).user?.id || 'officer',
      userName: (req as any).user?.name || 'Procurement Officer',
      action: 'vendor_document_uploaded',
      tenderId: targetTenderId,
      vendorId: targetVendorId,
      vendorName: vendor?.name,
      documentId: docId,
      documentName: file.originalname,
      details: `Uploaded & extracted "${file.originalname}" (${docType}) for ${vendor?.name || 'Bidder'}`
    });

    res.status(201).json({
      success: true,
      data: readyDoc || newDoc
    });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const getDocuments = (req: Request, res: Response) => {
  try {
    const { vendorId, tenderId } = req.query;
    const docs = memoryStore.getDocuments(vendorId as string, tenderId as string);
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const getDocumentById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = memoryStore.getDocumentById(id);
    if (!doc) return res.status(404).json({ success: false, error: 'Document not found' });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const deleteDocument = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = memoryStore.deleteDocument(id);
    if (!success) return res.status(404).json({ success: false, error: 'Document not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};
