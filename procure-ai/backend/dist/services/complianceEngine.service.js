import { memoryStore } from './memoryStore.service.js';
import { geminiService } from './gemini.service.js';
export class ComplianceEngineService {
    async verifyVendorCompliance(tenderId, vendorId, verifiedBy = 'ProcureAI Engine v2.4', useLocalAI = false) {
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
        const results = await Promise.all(requirements.map(async (req) => {
            let evaluation;
            // Hybrid Rule Engine: Deterministic checks for known numerical/boolean fields
            let ruleEngineHandled = false;
            const extractedFields = vendorDocs.map(d => d.extractedData?.fields || {}).reduce((acc, curr) => ({ ...acc, ...curr }), {});
            if (req.category === 'Financial' && req.condition.includes('₹10 Crore')) {
                // Example deterministic rule for turnover
                const requiredTurnoverCr = 10.0;
                const vendorTurnoverStr = extractedFields.averageTurnover || '';
                const vendorTurnoverMatch = vendorTurnoverStr.match(/(\d+\.?\d*)/);
                if (vendorTurnoverMatch) {
                    const vendorTurnoverCr = parseFloat(vendorTurnoverMatch[1]);
                    ruleEngineHandled = true;
                    evaluation = {
                        status: vendorTurnoverCr >= requiredTurnoverCr ? 'compliant' : 'non_compliant',
                        confidence: 100,
                        confidenceLevel: 'high',
                        extractedValue: `₹${vendorTurnoverCr} Crore`,
                        expectedValue: req.condition,
                        explanation: vendorTurnoverCr >= requiredTurnoverCr
                            ? `Turnover of ₹${vendorTurnoverCr} Crore meets the ₹${requiredTurnoverCr} Crore requirement.`
                            : `Vendor turnover (₹${vendorTurnoverCr} Crore) is below required threshold (₹${requiredTurnoverCr} Crore).`,
                        evidenceDocName: vendorDocs.find(d => d.documentType === 'Financial Statement')?.fileName || 'Extracted Data',
                        evidencePage: 1,
                        evidenceText: `Extracted turnover: ${vendorTurnoverStr}`
                    };
                }
            }
            else if (req.category === 'Legal' && req.condition.toLowerCase().includes('gst')) {
                if (extractedFields.gstin) {
                    ruleEngineHandled = true;
                    evaluation = {
                        status: 'compliant',
                        confidence: 100,
                        confidenceLevel: 'high',
                        extractedValue: `GSTIN: ${extractedFields.gstin}`,
                        expectedValue: req.condition,
                        explanation: `Valid GSTIN found in vendor documents.`,
                        evidenceDocName: vendorDocs.find(d => d.extractedData?.fields?.gstin)?.fileName || 'Extracted Data',
                        evidencePage: 1,
                        evidenceText: `GSTIN: ${extractedFields.gstin}`
                    };
                }
            }
            // Fallback to AI evaluation for semantic matching
            if (!ruleEngineHandled) {
                evaluation = await geminiService.evaluateCompliance(req, vendorDocs, useLocalAI);
            }
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
            return result;
        }));
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
    async verifyAllBiddersForTender(tenderId, useLocalAI = false) {
        const tender = memoryStore.getTenderById(tenderId);
        if (!tender)
            throw new Error(`Tender ${tenderId} not found`);
        const vendors = memoryStore.getVendors(tenderId);
        const allResults = {};
        await Promise.all(vendors.map(async (v) => {
            allResults[v.id] = await this.verifyVendorCompliance(tenderId, v.id, 'ProcureAI Engine v2.4', useLocalAI);
        }));
        return allResults;
    }
}
export const complianceEngineService = new ComplianceEngineService();
