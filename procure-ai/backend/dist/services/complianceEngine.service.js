import { memoryStore } from './memoryStore.service.js';
import { geminiService } from './gemini.service.js';
export class ComplianceEngineService {
    async verifyVendorCompliance(tenderId, vendorId, verifiedBy = 'ProcureAI Engine v2.4') {
        const tender = memoryStore.getTenderById(tenderId);
        const vendor = memoryStore.getVendorById(vendorId);
        if (!tender) {
            throw new Error(`Tender ${tenderId} not found`);
        }
        if (!vendor) {
            throw new Error(`Vendor ${vendorId} not found`);
        }
        const requirements = memoryStore.getRequirements(tenderId);
        if (requirements.length === 0) {
            throw new Error(`No requirements found for tender ${tenderId}`);
        }
        const vendorDocs = memoryStore.getDocuments(vendorId, tenderId);
        const results = [];
        for (const req of requirements) {
            // Run AI evaluation for each requirement against bidder docs
            const evaluation = await geminiService.evaluateCompliance(req, vendorDocs);
            const result = {
                id: `cr_${tenderId}_${vendorId}_${req.requirementId}`,
                tenderId,
                vendorId,
                requirementId: req.requirementId,
                requirement: req,
                status: evaluation.status,
                confidence: evaluation.confidence,
                confidenceLevel: evaluation.confidenceLevel,
                extractedValue: evaluation.extractedValue,
                expectedValue: evaluation.expectedValue,
                explanation: evaluation.explanation,
                evidenceDocumentName: evaluation.evidenceDocName,
                evidencePage: evaluation.evidencePage,
                evidenceText: evaluation.evidenceText,
                verifiedAt: new Date().toISOString(),
                verifiedBy
            };
            memoryStore.saveComplianceResult(result);
            results.push(result);
        }
        // Mark tender as analyzed
        memoryStore.updateTender(tender.id, { isAnalyzed: true, analyzedAt: new Date().toISOString() });
        // Log to Audit Trail
        memoryStore.logAudit({
            userId: 'system',
            userName: verifiedBy,
            action: 'compliance_check_completed',
            tenderId,
            tenderTitle: tender.title,
            vendorId,
            vendorName: vendor.name,
            details: `Automated AI semantic clause evaluation executed for ${vendor.name}. Analyzed ${results.length} criteria.`
        });
        return results;
    }
    async verifyAllBiddersForTender(tenderId) {
        const tender = memoryStore.getTenderById(tenderId);
        if (!tender)
            throw new Error(`Tender ${tenderId} not found`);
        const vendors = memoryStore.getVendors(tenderId);
        const allResults = {};
        for (const v of vendors) {
            allResults[v.id] = await this.verifyVendorCompliance(tenderId, v.id);
        }
        return allResults;
    }
}
export const complianceEngineService = new ComplianceEngineService();
