import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as tenderController from '../controllers/tender.controller.js';
import * as vendorController from '../controllers/vendor.controller.js';
import * as documentController from '../controllers/document.controller.js';
import * as verificationController from '../controllers/verification.controller.js';
import * as riskController from '../controllers/risk.controller.js';
import * as reportController from '../controllers/report.controller.js';
import * as auditController from '../controllers/audit.controller.js';
import * as dashboardController from '../controllers/dashboard.controller.js';
import * as configController from '../controllers/config.controller.js';
import * as aiController from '../controllers/ai.controller.js';
import { upload } from '../middlewares/upload.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// --- Health ---
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ProcureAI API Engine', timestamp: new Date().toISOString() });
});

// --- Auth ---
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.get('/auth/me', authenticate, authController.getCurrentUser);

// --- Dashboard ---
router.get('/dashboard/stats', dashboardController.getStats);

// --- Tenders ---
router.get('/tenders', tenderController.getTenders);
router.get('/tenders/:id', tenderController.getTenderById);
router.post('/tenders', authenticate, tenderController.createTender);
router.put('/tenders/:id', authenticate, tenderController.updateTender);
router.delete('/tenders/:id', authenticate, tenderController.deleteTender);
router.post('/tenders/:id/extract-requirements', authenticate, tenderController.extractRequirements);

// --- Vendors ---
router.get('/vendors', vendorController.getVendors);
router.get('/vendors/:id', vendorController.getVendorById);
router.post('/vendors', authenticate, vendorController.createVendor);
router.put('/vendors/:id', authenticate, vendorController.updateVendor);
router.get('/vendors/scores/:tenderId', vendorController.getVendorScores);

// --- Documents ---
router.post('/documents/upload', authenticate, upload.single('file'), documentController.uploadDocument);
router.get('/documents', documentController.getDocuments);
router.get('/documents/:id', documentController.getDocumentById);

// --- AI Verification ---
router.post('/verification/verify', authenticate, verificationController.runVerification);
router.get('/verification/results', verificationController.getResults);
router.put('/verification/override/:id', authenticate, verificationController.saveOverride);
router.get('/verification/matrix/:tenderId', verificationController.getMatrix);

// --- Risk Center ---
router.get('/risk/assessments', riskController.getRiskAssessments);
router.get('/risk/vendor/:vendorId', riskController.getVendorRisk);
router.post('/risk/recalculate', authenticate, riskController.recalculateRisk);

// --- Reports ---
router.get('/reports/:tenderId/summary', reportController.getReportSummary);

// --- Audit Trail ---
router.get('/audit', auditController.getAuditTrail);
router.post('/audit', authenticate, auditController.logEntry);

// --- Config & Credentials ---
router.get('/config/status', configController.getStatus);
router.post('/config/update', authenticate, configController.updateConfig);

// --- AI Procurement Copilot ---
router.post('/ai/chat', authenticate, aiController.chat);

export default router;
