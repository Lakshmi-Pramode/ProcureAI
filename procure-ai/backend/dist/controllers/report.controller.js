import { memoryStore } from '../services/memoryStore.service.js';
export const getReportSummary = (req, res) => {
    try {
        const { tenderId } = req.params;
        const tender = memoryStore.getTenderById(tenderId);
        if (!tender)
            return res.status(404).json({ success: false, error: 'Tender not found' });
        const requirements = memoryStore.getRequirements(tenderId);
        const vendors = memoryStore.getVendors(tenderId);
        const scores = memoryStore.getVendorScores(tenderId);
        const risks = memoryStore.getRiskAssessments(tenderId);
        const report = {
            id: `rep_${Date.now()}`,
            tenderId: tender.id,
            tenderTitle: tender.title,
            generatedAt: new Date().toISOString(),
            generatedBy: req.user?.name || 'Procurement Officer',
            stats: {
                totalClauses: requirements.length,
                totalBidders: vendors.length,
                qualifiedBidders: scores.filter(s => s.nonCompliant === 0).length,
                disqualifiedBidders: scores.filter(s => s.nonCompliant > 0).length
            },
            biddersSummary: scores.map(s => {
                const r = risks.find(risk => risk.vendorId === s.vendorId);
                return {
                    ...s,
                    riskAssessment: r
                };
            })
        };
        memoryStore.logAudit({
            userId: req.user?.id || 'officer',
            userName: req.user?.name || 'Procurement Officer',
            action: 'report_generated',
            tenderId: tender.id,
            tenderTitle: tender.title,
            details: `Generated formal Tender Compliance & Evaluation Report for "${tender.title}"`
        });
        res.json({ success: true, data: report });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
