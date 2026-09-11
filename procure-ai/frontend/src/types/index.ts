// ============================================================
// ProcureAI — Core TypeScript Types
// ============================================================

// --- Auth & Users ---
export type UserRole = 'officer' | 'admin' | 'reviewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isDemo: boolean;
}

// --- Tender ---
export type TenderStatus = 'draft' | 'published' | 'under_evaluation' | 'completed' | 'cancelled';
export type TenderCategory = 'IT' | 'Construction' | 'Healthcare' | 'Defense' | 'Education' | 'Infrastructure' | 'Services' | 'Goods' | 'Other';

export interface Tender {
  id: string;
  tenderId: string;
  title: string;
  department: string;
  organization: string;
  category: TenderCategory;
  submissionDeadline: string;
  description: string;
  status: TenderStatus;
  documents: TenderDocument[];
  requirements: Requirement[];
  vendors: string[]; // vendor IDs
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  analyzedAt?: string;
  isAnalyzed: boolean;
}

// --- Requirement ---
export type RequirementCategory =
  | 'Legal'
  | 'Financial'
  | 'Technical'
  | 'Eligibility'
  | 'Experience'
  | 'Certification'
  | 'Tax'
  | 'Social Compliance'
  | 'Local Content'
  | 'Other';

export interface Requirement {
  id: string;
  tenderId: string;
  requirementId: string; // e.g., R001
  description: string;
  category: RequirementCategory;
  condition: string;
  mandatory: boolean;
  sourcePage: number;
  sourceText?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Vendor ---
export interface Vendor {
  id: string;
  vendorId: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  gstNumber?: string;
  panNumber?: string;
  tenderIds: string[];
  documents: VendorDocument[];
  bidSubmissionDate?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Documents ---
export type DocumentType =
  | 'Technical Bid'
  | 'Financial Bid'
  | 'GST Certificate'
  | 'PAN Card'
  | 'OEM Authorization'
  | 'MSME/Udyam Certificate'
  | 'Income Tax Document'
  | 'Financial Statement'
  | 'Experience Certificate'
  | 'Technical Compliance Sheet'
  | 'Company Registration'
  | 'Startup Certificate'
  | 'NSIC Certificate'
  | 'EPFO/ESIC Document'
  | 'Declaration'
  | 'Tender Document'
  | 'Other';

export type DocumentProcessingStatus = 'uploaded' | 'processing' | 'extracting' | 'verified' | 'ready' | 'failed';

export interface TenderDocument {
  id: string;
  tenderId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  status: DocumentProcessingStatus;
}

export interface VendorDocument {
  id: string;
  vendorId: string;
  tenderId: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  status: DocumentProcessingStatus;
  filePath?: string;
  extractedData?: ExtractedData;
}

export interface ExtractedData {
  fields: Record<string, string | number | boolean>;
  sourcePage: number;
  confidence: number;
  rawText?: string;
}

// --- Compliance ---
export type ComplianceStatus = 'compliant' | 'non_compliant' | 'manual_review';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ComplianceResult {
  id: string;
  tenderId: string;
  vendorId: string;
  requirementId: string;
  requirement: Requirement;
  status: ComplianceStatus;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  extractedValue: string;
  expectedValue: string;
  explanation: string;
  evidenceDocumentId?: string;
  evidenceDocumentName: string;
  evidencePage: number;
  evidenceText: string;
  verifiedAt: string;
  verifiedBy: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

// --- Risk ---
export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskFactor {
  id: string;
  description: string;
  severity: RiskLevel;
  category: string;
  impact: string;
}

export interface RiskAssessment {
  id: string;
  tenderId: string;
  vendorId: string;
  overallScore: number; // 0-100, lower is better
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  missingDocuments: string[];
  inconsistencies: Inconsistency[];
  calculatedAt: string;
}

export interface Inconsistency {
  id: string;
  type: 'name_mismatch' | 'value_conflict' | 'date_discrepancy' | 'status_mismatch';
  severity: RiskLevel;
  description: string;
  document1: string;
  document2: string;
  value1: string;
  value2: string;
  field: string;
}

// --- Vendor Comparison ---
export interface VendorComparisonRow {
  requirement: Requirement;
  results: Record<string, ComplianceResult>; // vendorId -> result
}

export interface VendorScore {
  vendorId: string;
  vendorName: string;
  overallScore: number;
  compliant: number;
  nonCompliant: number;
  manualReview: number;
  total: number;
  riskLevel: RiskLevel;
  riskScore: number;
}

// --- Audit Trail ---
export type AuditAction =
  | 'tender_created'
  | 'tender_updated'
  | 'document_uploaded'
  | 'ai_analysis_started'
  | 'ai_analysis_completed'
  | 'requirement_extracted'
  | 'requirement_edited'
  | 'vendor_added'
  | 'vendor_document_uploaded'
  | 'compliance_check_started'
  | 'compliance_check_completed'
  | 'compliance_result_reviewed'
  | 'compliance_result_approved'
  | 'compliance_result_overridden'
  | 'report_generated'
  | 'risk_assessment_completed'
  | 'user_login'
  | 'user_logout';

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  timestamp: string;
  tenderId?: string;
  tenderTitle?: string;
  vendorId?: string;
  vendorName?: string;
  documentId?: string;
  documentName?: string;
  details: string;
  metadata?: Record<string, unknown>;
}

// --- Chat ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  references?: ChatReference[];
}

export interface ChatReference {
  type: 'requirement' | 'vendor' | 'document' | 'compliance';
  id: string;
  label: string;
}

// --- Dashboard Stats ---
export interface DashboardStats {
  activeTenders: number;
  totalVendors: number;
  totalRequirements: number;
  requirementsVerified: number;
  manualReview: number;
  nonCompliant: number;
  complianceRate: number;
  pendingReviews: number;
}

// --- External Verification ---
export type VerificationStatus = 'connected' | 'demo' | 'pending' | 'unavailable';

export interface ExternalVerification {
  service: string;
  status: VerificationStatus;
  lastChecked?: string;
  result?: string;
}

// --- Report ---
export interface ComplianceReport {
  id: string;
  tenderId: string;
  tenderTitle: string;
  vendorId?: string;
  vendorName?: string;
  generatedAt: string;
  generatedBy: string;
  type: 'single_vendor' | 'comparison' | 'summary';
  sections: ReportSection[];
}

export interface ReportSection {
  title: string;
  content: string;
  data?: Record<string, unknown>;
}

// --- API Response ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// --- Processing Steps ---
export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  detail?: string;
}
