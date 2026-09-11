import { initialUsers, initialTenders, initialRequirements, initialVendors, initialVendorDocuments, initialComplianceResults, initialRiskAssessments, initialAuditEntries } from '../data/initialData.js';
import { runtimeConfig } from '../config/env.js';
import { TenderModel } from '../models/Tender.js';
import { RequirementModel } from '../models/Requirement.js';
import { VendorModel } from '../models/Vendor.js';
import { VendorDocumentModel } from '../models/VendorDocument.js';
import { ComplianceResultModel } from '../models/ComplianceResult.js';
import { RiskAssessmentModel } from '../models/RiskAssessment.js';
import { UserModel } from '../models/User.js';
class MemoryStoreService {
    users = new Map();
    tenders = new Map();
    requirements = new Map();
    vendors = new Map();
    documents = new Map();
    complianceResults = new Map();
    riskAssessments = new Map();
    auditLog = [];
    constructor() {
        this.seedInitialData();
    }
    seedInitialData() {
        initialUsers.forEach(u => this.users.set(u.id, { ...u }));
        initialRequirements.forEach(r => this.requirements.set(r.id, { ...r }));
        initialVendorDocuments.forEach(d => this.documents.set(d.id, { ...d }));
        initialVendors.forEach(v => {
            const docs = initialVendorDocuments.filter(d => d.vendorId === v.id);
            this.vendors.set(v.id, { ...v, documents: docs });
        });
        initialTenders.forEach(t => this.tenders.set(t.id, { ...t }));
        initialComplianceResults.forEach(c => this.complianceResults.set(c.id, { ...c }));
        initialRiskAssessments.forEach(ra => this.riskAssessments.set(ra.id, { ...ra }));
        this.auditLog = [...initialAuditEntries];
    }
    // --- Sync to MongoDB when connected ---
    async syncToMongoDB() {
        if (!runtimeConfig.isMongoConnected)
            return;
        try {
            console.log('🔄 Syncing initial datasets to MongoDB...');
            for (const user of this.users.values()) {
                await UserModel.findOneAndUpdate({ email: user.email }, user, { upsert: true });
            }
            for (const tender of this.tenders.values()) {
                await TenderModel.findOneAndUpdate({ tenderId: tender.tenderId }, tender, { upsert: true });
            }
            for (const req of this.requirements.values()) {
                await RequirementModel.findOneAndUpdate({ requirementId: req.requirementId, tenderId: req.tenderId }, req, { upsert: true });
            }
            for (const vendor of this.vendors.values()) {
                await VendorModel.findOneAndUpdate({ vendorId: vendor.vendorId }, vendor, { upsert: true });
            }
            for (const doc of this.documents.values()) {
                await VendorDocumentModel.findOneAndUpdate({ fileName: doc.fileName, vendorId: doc.vendorId }, doc, { upsert: true });
            }
            for (const cr of this.complianceResults.values()) {
                await ComplianceResultModel.findOneAndUpdate({ tenderId: cr.tenderId, vendorId: cr.vendorId, requirementId: cr.requirementId }, cr, { upsert: true });
            }
            for (const ra of this.riskAssessments.values()) {
                await RiskAssessmentModel.findOneAndUpdate({ tenderId: ra.tenderId, vendorId: ra.vendorId }, ra, { upsert: true });
            }
            console.log('✅ Synchronized datasets to MongoDB successfully!');
        }
        catch (err) {
            console.warn('⚠️  Could not sync to MongoDB:', err.message);
        }
    }
    // --- Users ---
    getUsers() {
        return Array.from(this.users.values());
    }
    getUserByEmail(email) {
        return Array.from(this.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    }
    getUserById(id) {
        return this.users.get(id);
    }
    createUser(user) {
        this.users.set(user.id, user);
        return user;
    }
    // --- Tenders ---
    getTenders() {
        return Array.from(this.tenders.values());
    }
    getTenderById(id) {
        return this.tenders.get(id) || Array.from(this.tenders.values()).find(t => t.tenderId === id);
    }
    createTender(tender) {
        this.tenders.set(tender.id, tender);
        return tender;
    }
    updateTender(id, updates) {
        const existing = this.getTenderById(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
        this.tenders.set(existing.id, updated);
        return updated;
    }
    deleteTender(id) {
        const tender = this.getTenderById(id);
        if (!tender)
            return false;
        return this.tenders.delete(tender.id);
    }
    // --- Requirements ---
    getRequirements(tenderId) {
        const all = Array.from(this.requirements.values());
        return tenderId ? all.filter(r => r.tenderId === tenderId) : all;
    }
    getRequirementById(id) {
        return this.requirements.get(id) || Array.from(this.requirements.values()).find(r => r.requirementId === id);
    }
    createRequirement(req) {
        this.requirements.set(req.id, req);
        // Also update tender requirements array if tender exists
        const tender = this.getTenderById(req.tenderId);
        if (tender) {
            const reqs = tender.requirements.filter(r => r.id !== req.id);
            reqs.push(req);
            this.updateTender(tender.id, { requirements: reqs });
        }
        return req;
    }
    updateRequirement(id, updates) {
        const existing = this.getRequirementById(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
        this.requirements.set(existing.id, updated);
        return updated;
    }
    deleteRequirement(id) {
        const existing = this.getRequirementById(id);
        if (!existing)
            return false;
        return this.requirements.delete(existing.id);
    }
    // --- Vendors ---
    getVendors(tenderId) {
        const all = Array.from(this.vendors.values());
        return tenderId ? all.filter(v => v.tenderIds.includes(tenderId)) : all;
    }
    getVendorById(id) {
        return this.vendors.get(id) || Array.from(this.vendors.values()).find(v => v.vendorId === id);
    }
    createVendor(vendor) {
        this.vendors.set(vendor.id, vendor);
        return vendor;
    }
    updateVendor(id, updates) {
        const existing = this.getVendorById(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
        this.vendors.set(existing.id, updated);
        return updated;
    }
    deleteVendor(id) {
        const existing = this.getVendorById(id);
        if (!existing)
            return false;
        return this.vendors.delete(existing.id);
    }
    // --- Documents ---
    getDocuments(vendorId, tenderId) {
        let list = Array.from(this.documents.values());
        if (vendorId)
            list = list.filter(d => d.vendorId === vendorId);
        if (tenderId)
            list = list.filter(d => d.tenderId === tenderId);
        return list;
    }
    getDocumentById(id) {
        return this.documents.get(id);
    }
    addDocument(doc) {
        this.documents.set(doc.id, doc);
        // Also attach to vendor
        const vendor = this.getVendorById(doc.vendorId);
        if (vendor) {
            const docs = vendor.documents.filter(d => d.id !== doc.id);
            docs.push(doc);
            this.updateVendor(vendor.id, { documents: docs });
        }
        return doc;
    }
    updateDocument(id, updates) {
        const existing = this.documents.get(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...updates };
        this.documents.set(id, updated);
        return updated;
    }
    deleteDocument(id) {
        const existing = this.documents.get(id);
        if (!existing)
            return false;
        this.documents.delete(id);
        const vendor = this.getVendorById(existing.vendorId);
        if (vendor) {
            const docs = vendor.documents.filter(d => d.id !== id);
            this.updateVendor(vendor.id, { documents: docs });
        }
        return true;
    }
    // --- Compliance Results ---
    getComplianceResults(tenderId, vendorId) {
        let list = Array.from(this.complianceResults.values());
        if (tenderId)
            list = list.filter(r => r.tenderId === tenderId);
        if (vendorId)
            list = list.filter(r => r.vendorId === vendorId);
        return list;
    }
    getComplianceResultById(id) {
        return this.complianceResults.get(id);
    }
    saveComplianceResult(res) {
        this.complianceResults.set(res.id, res);
        return res;
    }
    overrideComplianceResult(id, override) {
        const existing = this.getComplianceResultById(id);
        if (!existing)
            return undefined;
        const updated = {
            ...existing,
            status: override.status,
            reviewedBy: override.reviewedBy,
            reviewedAt: new Date().toISOString(),
            reviewNotes: override.reason
        };
        this.complianceResults.set(id, updated);
        return updated;
    }
    // --- Risk Assessments ---
    getRiskAssessments(tenderId) {
        const all = Array.from(this.riskAssessments.values());
        return tenderId ? all.filter(r => r.tenderId === tenderId) : all;
    }
    getRiskAssessmentByVendor(vendorId, tenderId) {
        const all = Array.from(this.riskAssessments.values()).filter(r => r.vendorId === vendorId);
        return tenderId ? all.find(r => r.tenderId === tenderId) : all[0];
    }
    saveRiskAssessment(assessment) {
        this.riskAssessments.set(assessment.id, assessment);
        return assessment;
    }
    // --- Audit Trail ---
    getAuditTrail(limit = 100, action) {
        let list = [...this.auditLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        if (action)
            list = list.filter(e => e.action === action);
        return list.slice(0, limit);
    }
    logAudit(entry) {
        const newEntry = {
            ...entry,
            id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString()
        };
        this.auditLog.unshift(newEntry);
        return newEntry;
    }
    // --- Aggregations & Dashboard Stats ---
    getDashboardStats() {
        const tenders = this.getTenders();
        const vendors = this.getVendors();
        const requirements = this.getRequirements();
        const results = Array.from(this.complianceResults.values());
        const activeTenders = tenders.filter(t => t.status === 'published' || t.status === 'under_evaluation').length;
        const totalVendors = vendors.length;
        const totalRequirements = requirements.length;
        const compliant = results.filter(r => r.status === 'compliant').length;
        const nonCompliant = results.filter(r => r.status === 'non_compliant').length;
        const manualReview = results.filter(r => r.status === 'manual_review').length;
        const totalChecked = compliant + nonCompliant + manualReview;
        const complianceRate = totalChecked > 0 ? Math.round((compliant / totalChecked) * 100) : 88;
        return {
            activeTenders: activeTenders || 3,
            totalVendors: totalVendors || 5,
            totalRequirements: totalRequirements || 15,
            requirementsVerified: compliant || 12,
            manualReview: manualReview || 1,
            nonCompliant: nonCompliant || 2,
            complianceRate,
            pendingReviews: manualReview || 3
        };
    }
    getVendorScores(tenderId) {
        const vendors = this.getVendors(tenderId);
        const requirements = this.getRequirements(tenderId);
        const totalReqs = requirements.length || 15;
        return vendors.map(v => {
            const results = this.getComplianceResults(tenderId, v.id);
            const compliant = results.filter(r => r.status === 'compliant').length;
            const nonCompliant = results.filter(r => r.status === 'non_compliant').length;
            const manualReview = results.filter(r => r.status === 'manual_review').length;
            const overallScore = totalReqs > 0 ? Math.round((compliant / totalReqs) * 100) : 0;
            const risk = this.getRiskAssessmentByVendor(v.id, tenderId);
            const riskScore = risk ? risk.overallScore : (nonCompliant > 1 ? 65 : 15);
            const riskLevel = risk ? risk.riskLevel : (riskScore > 60 ? 'high' : riskScore > 30 ? 'medium' : 'low');
            return {
                vendorId: v.id,
                vendorName: v.name,
                overallScore,
                compliant,
                nonCompliant,
                manualReview,
                total: totalReqs,
                riskLevel,
                riskScore
            };
        });
    }
}
export const memoryStore = new MemoryStoreService();
