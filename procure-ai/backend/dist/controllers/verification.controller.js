import { memoryStore } from '../services/memoryStore.service.js';
import { complianceEngineService } from '../services/complianceEngine.service.js';
export const runVerification = async (req, res) => {
    try {
        const { tenderId, vendorId } = req.body;
        if (!tenderId) {
            return res.status(400).json({ success: false, error: 'tenderId is required' });
        }
        const officerName = req.user?.name || 'Procurement Officer';
        if (vendorId) {
            const results = await complianceEngineService.verifyVendorCompliance(tenderId, vendorId, officerName);
            return res.json({ success: true, data: results });
        }
        // If no vendorId, verify all vendors for this tender
        const allResults = await complianceEngineService.verifyAllBiddersForTender(tenderId);
        res.json({ success: true, data: allResults });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
export const getResults = (req, res) => {
    try {
        const { tenderId, vendorId } = req.query;
        const results = memoryStore.getComplianceResults(tenderId, vendorId);
        res.json({ success: true, data: results });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
export const saveOverride = (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;
        if (!status) {
            return res.status(400).json({ success: false, error: 'status is required' });
        }
        const reviewedBy = req.user?.name || 'Procurement Officer';
        const updated = memoryStore.overrideComplianceResult(id, {
            status: status,
            reason: reason || 'Manual verification override by Procurement Officer',
            reviewedBy
        });
        if (!updated) {
            return res.status(404).json({ success: false, error: 'Compliance result not found' });
        }
        const vendor = memoryStore.getVendorById(updated.vendorId);
        memoryStore.logAudit({
            userId: req.user?.id || 'officer',
            userName: reviewedBy,
            action: 'compliance_result_overridden',
            tenderId: updated.tenderId,
            vendorId: updated.vendorId,
            vendorName: vendor?.name,
            details: `Officer override on clause ${updated.requirementId}: Marked as ${status.toUpperCase()}. Rationale: "${reason || 'Verified'}"`
        });
        res.json({ success: true, data: updated });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
// Side-by-side compliance matrix comparing all vendors against all tender clauses
export const getMatrix = (req, res) => {
    try {
        const { tenderId } = req.params;
        const requirements = memoryStore.getRequirements(tenderId);
        const vendors = memoryStore.getVendors(tenderId);
        const results = memoryStore.getComplianceResults(tenderId);
        const matrix = requirements.map(req => {
            const vendorResults = {};
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
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
