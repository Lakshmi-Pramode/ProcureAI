import { memoryStore } from './memoryStore.service.js';
import { geminiService } from './gemini.service.js';
export class RiskEngineService {
    async assessVendorRisk(tenderId, vendorId) {
        const vendor = memoryStore.getVendorById(vendorId);
        if (!vendor)
            throw new Error(`Vendor ${vendorId} not found`);
        const tender = memoryStore.getTenderById(tenderId);
        const docs = memoryStore.getDocuments(vendorId, tenderId);
        const reqs = memoryStore.getRequirements(tenderId);
        const analysis = await geminiService.analyzeRiskAndInconsistencies(vendor, docs, reqs);
        const assessment = {
            id: `risk_${tenderId}_${vendorId}`,
            tenderId,
            vendorId,
            overallScore: analysis.overallScore,
            riskLevel: analysis.riskLevel,
            factors: analysis.factors,
            inconsistencies: analysis.inconsistencies,
            missingDocuments: analysis.missingDocuments,
            calculatedAt: new Date().toISOString()
        };
        memoryStore.saveRiskAssessment(assessment);
        memoryStore.logAudit({
            userId: 'system',
            userName: 'ProcureAI Risk Engine',
            action: 'risk_assessment_completed',
            tenderId,
            tenderTitle: tender?.title,
            vendorId,
            vendorName: vendor.name,
            details: `Calculated overall risk score ${assessment.overallScore}/100 (${assessment.riskLevel} risk) with ${assessment.inconsistencies.length} inconsistency flags.`
        });
        return assessment;
    }
    async assessAllVendorsForTender(tenderId) {
        const vendors = memoryStore.getVendors(tenderId);
        const assessments = [];
        for (const v of vendors) {
            assessments.push(await this.assessVendorRisk(tenderId, v.id));
        }
        return assessments;
    }
}
export const riskEngineService = new RiskEngineService();
