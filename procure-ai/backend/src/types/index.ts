// Backend types for ProcureAI
export type UserRole = 'officer' | 'admin' | 'reviewer';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  organization: string;
  avatar?: string;
}

export type TenderStatus = 'draft' | 'published' | 'under_evaluation' | 'completed' | 'cancelled';
export type TenderCategory = 'IT' | 'Construction' | 'Healthcare' | 'Defense' | 'Education' | 'Infrastructure' | 'Services' | 'Goods' | 'Other';

export interface TenderDocument {
  id: string;
  tenderId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath?: string;
  uploadedAt: string;
  status: DocumentProcessingStatus;
}

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
  requirementId: string;
  description: string;
  category: RequirementCategory;
  condition: string;
  mandatory: boolean;
  sourcePage: number;
  sourceText?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType =
  | 'GST Certificate'
  | 'PAN Card'
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

export interface ExtractedData {
  fields: Record<string, string | number | boolean>;
  sourcePage: number;
  confidence: number;
  rawText?: string;
}

export interface VendorDocument {
  id: string;
  vendorId: string;
  tenderId: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath?: string;
  uploadedAt: string;
  status: DocumentProcessingStatus;
  extractedData?: ExtractedData;
}

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
  vendors: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  analyzedAt?: string;
  isAnalyzed: boolean;
}

export type ComplianceStatus = 'compliant' | 'non_compliant' | 'manual_review';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ComplianceResult {
  id: string;
  tenderId: string;
  vendorId: string;
  requirementId: string;
  requirement?: Requirement;
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

export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskFactor {
  id: string;
  description: string;
  severity: RiskLevel;
  category: string;
  impact: string;
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

export interface RiskAssessment {
  id: string;
  tenderId: string;
  vendorId: string;
  overallScore: number;
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  missingDocuments: string[];
  inconsistencies: Inconsistency[];
  calculatedAt: string;
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
  | 'user_logout'
  | 'config_updated';

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
