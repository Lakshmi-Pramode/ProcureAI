import { memoryStore } from '../services/memoryStore.service.js';
import { geminiService } from '../services/gemini.service.js';
export const getTenders = (_req, res) => {
    try {
        const tenders = memoryStore.getTenders();
        res.json({ success: true, data: tenders });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
export const getTenderById = (req, res) => {
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
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
export const createTender = async (req, res) => {
    try {
        const { title, department, organization, category, submissionDeadline, description, requirements: initialReqs } = req.body;
        if (!title || !department) {
            return res.status(400).json({ success: false, error: 'Title and department are required' });
        }
        const tenderNum = Math.floor(1000 + Math.random() * 9000);
        const id = `tender_${Date.now()}`;
        const tenderId = `TND-2026-${tenderNum}`;
        const newRequirements = (initialReqs || []).map((r, idx) => ({
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
        const newTender = {
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
            createdBy: req.user?.name || 'Procurement Officer',
            isAnalyzed: false
        };
        memoryStore.createTender(newTender);
        memoryStore.logAudit({
            userId: req.user?.id || 'officer',
            userName: req.user?.name || 'Procurement Officer',
            action: 'tender_created',
            tenderId: newTender.id,
            tenderTitle: newTender.title,
            details: `Created tender "${newTender.title}" with ${newRequirements.length} clauses.`
        });
        res.status(201).json({ success: true, data: newTender });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
export const updateTender = (req, res) => {
    try {
        const { id } = req.params;
        const updated = memoryStore.updateTender(id, req.body);
        if (!updated) {
            return res.status(404).json({ success: false, error: 'Tender not found' });
        }
        memoryStore.logAudit({
            userId: req.user?.id || 'officer',
            userName: req.user?.name || 'Procurement Officer',
            action: 'tender_updated',
            tenderId: updated.id,
            tenderTitle: updated.title,
            details: `Updated tender specifications or status for "${updated.title}"`
        });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
export const deleteTender = (req, res) => {
    try {
        const { id } = req.params;
        const success = memoryStore.deleteTender(id);
        if (!success) {
            return res.status(404).json({ success: false, error: 'Tender not found' });
        }
        res.json({ success: true, message: 'Tender deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
// AI Clause Extraction from Tender Document text
export const extractRequirements = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const tender = memoryStore.getTenderById(id);
        if (!tender)
            return res.status(404).json({ success: false, error: 'Tender not found' });
        const clauses = await geminiService.extractRequirementsFromText(text || tender.description || 'General procurement criteria', tender.title);
        const savedClauses = [];
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
            userId: req.user?.id || 'officer',
            userName: req.user?.name || 'Procurement Officer',
            action: 'requirement_extracted',
            tenderId: tender.id,
            tenderTitle: tender.title,
            details: `AI extracted ${savedClauses.length} clauses from tender documentation.`
        });
        res.json({ success: true, data: savedClauses });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
