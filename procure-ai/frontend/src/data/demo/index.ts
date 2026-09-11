// ============================================================
// ProcureAI — Comprehensive Demo Data
// ============================================================
import type {
  Tender, Requirement, Vendor, VendorDocument, ComplianceResult,
  RiskAssessment, AuditEntry, DashboardStats,
  VendorScore, ExternalVerification, User, ExtractedData,
  ComplianceStatus, ConfidenceLevel
} from '../../types';

// ─── Helper ──────────────────────────────────────────────────
const id = (prefix: string, n: number) => `${prefix}_${String(n).padStart(3, '0')}`;
const ts = (h: number, m: number) => {
  const d = new Date('2026-09-05');
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

// ─── Demo User ───────────────────────────────────────────────
export const demoUser: User = {
  id: 'user_001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@procurement.gov.in',
  role: 'officer',
  organization: 'Chennai Petroleum Corporation Ltd',
  avatar: undefined,
};

export const demoAdmin: User = {
  id: 'user_002',
  name: 'Priya Sharma',
  email: 'priya.sharma@procurement.gov.in',
  role: 'admin',
  organization: 'Chennai Petroleum Corporation Ltd',
};

// ─── Demo Requirements (15) ─────────────────────────────────
export const demoRequirements: Requirement[] = [
  {
    id: id('req', 1), tenderId: 'tender_001', requirementId: 'R001',
    description: 'Valid GST Registration', category: 'Legal',
    condition: 'Must have active GST registration', mandatory: true,
    sourcePage: 12, sourceText: 'The bidder must possess a valid GST registration certificate.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 2), tenderId: 'tender_001', requirementId: 'R002',
    description: 'PAN Card', category: 'Tax',
    condition: 'Valid PAN required', mandatory: true,
    sourcePage: 12, sourceText: 'A copy of the PAN card of the bidding entity is mandatory.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 3), tenderId: 'tender_001', requirementId: 'R003',
    description: 'Minimum Annual Turnover', category: 'Financial',
    condition: '≥ ₹10 Crore in last 3 financial years', mandatory: true,
    sourcePage: 18, sourceText: 'The bidder must have an average annual turnover of at least ₹10 Crore.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 4), tenderId: 'tender_001', requirementId: 'R004',
    description: 'Minimum Experience', category: 'Experience',
    condition: '≥ 5 years in IT equipment supply', mandatory: true,
    sourcePage: 21, sourceText: 'Bidder should have at least 5 years of experience in supply of IT equipment.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 5), tenderId: 'tender_001', requirementId: 'R005',
    description: 'MSME/Udyam Registration', category: 'Eligibility',
    condition: 'If applicable, valid MSME/Udyam registration', mandatory: false,
    sourcePage: 24, sourceText: 'MSME registered firms may submit their Udyam Registration certificate.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 6), tenderId: 'tender_001', requirementId: 'R006',
    description: 'Technical Specification Compliance', category: 'Technical',
    condition: 'Must meet all technical specifications in Annexure-A', mandatory: true,
    sourcePage: 28, sourceText: 'The offered equipment must comply with all specifications listed in Annexure-A.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 7), tenderId: 'tender_001', requirementId: 'R007',
    description: 'Company Registration Certificate', category: 'Legal',
    condition: 'Must be registered under Companies Act or equivalent', mandatory: true,
    sourcePage: 13, sourceText: 'Certificate of Incorporation or equivalent registration document is required.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 8), tenderId: 'tender_001', requirementId: 'R008',
    description: 'Income Tax Returns', category: 'Tax',
    condition: 'ITR for last 3 financial years', mandatory: true,
    sourcePage: 19, sourceText: 'Copies of Income Tax Returns for the last three financial years must be submitted.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 9), tenderId: 'tender_001', requirementId: 'R009',
    description: 'Experience Certificate / Work Orders', category: 'Experience',
    condition: 'At least 3 similar projects completed', mandatory: true,
    sourcePage: 22, sourceText: 'Bidder must provide evidence of at least 3 similar completed projects.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 10), tenderId: 'tender_001', requirementId: 'R010',
    description: 'Declaration of Non-Blacklisting', category: 'Legal',
    condition: 'Self-declaration on company letterhead', mandatory: true,
    sourcePage: 30, sourceText: 'The bidder must submit a declaration that they have not been blacklisted by any government agency.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 11), tenderId: 'tender_001', requirementId: 'R011',
    description: 'Make in India Compliance', category: 'Local Content',
    condition: 'Minimum 50% local content', mandatory: true,
    sourcePage: 32, sourceText: 'Equipment must have a minimum of 50% local content as per Make in India policy.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 12), tenderId: 'tender_001', requirementId: 'R012',
    description: 'ISO Certification', category: 'Certification',
    condition: 'ISO 9001:2015 or equivalent', mandatory: true,
    sourcePage: 25, sourceText: 'Bidder must hold a valid ISO 9001:2015 quality management certification.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 13), tenderId: 'tender_001', requirementId: 'R013',
    description: 'EPFO Registration', category: 'Social Compliance',
    condition: 'Valid EPFO registration', mandatory: false,
    sourcePage: 26, sourceText: 'EPFO registration certificate of the bidding entity may be submitted.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 14), tenderId: 'tender_001', requirementId: 'R014',
    description: 'EMD / Bid Security', category: 'Financial',
    condition: '₹5 Lakh EMD via bank guarantee or DD', mandatory: true,
    sourcePage: 8, sourceText: 'EMD of ₹5,00,000 must be submitted as a bank guarantee or demand draft.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 15), tenderId: 'tender_001', requirementId: 'R015',
    description: 'Startup India / NSIC Certificate', category: 'Eligibility',
    condition: 'If applicable, for EMD exemption', mandatory: false,
    sourcePage: 9, sourceText: 'Startups registered under Startup India or NSIC may claim EMD exemption.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
];

// ─── Demo Tender ─────────────────────────────────────────────
export const demoTender: Tender = {
  id: 'tender_001',
  tenderId: 'CPCL/IT/2026/001',
  title: 'Supply, Installation & Commissioning of High-Performance Computing Infrastructure',
  department: 'Information Technology',
  organization: 'Chennai Petroleum Corporation Ltd',
  category: 'IT',
  submissionDeadline: '2026-09-20T17:00:00Z',
  description: 'Procurement of 150 workstations, 12 rack servers, NAS storage (500TB), 10GbE core switching, and 3-year AMC with 4-hour SLA.',
  status: 'under_evaluation',
  documents: [
    {
      id: 'tdoc_001',
      tenderId: 'tender_001',
      fileName: 'CPCL_IT_2026_001_Tender_Document.pdf',
      fileSize: 2458624,
      fileType: 'application/pdf',
      uploadedAt: ts(8, 30),
      status: 'ready',
    },
  ],
  requirements: demoRequirements,
  vendors: ['vendor_001', 'vendor_002', 'vendor_003'],
  createdAt: ts(8, 0),
  updatedAt: ts(9, 0),
  createdBy: 'user_001',
  analyzedAt: ts(9, 5),
  isAnalyzed: true,
};

export const demoTenders: Tender[] = [
  demoTender,
  {
    id: 'tender_002',
    tenderId: 'CPCL/SAFETY/2026/002',
    title: 'Procurement of Industrial Safety, Fire Detection & Gas Suppression Systems',
    department: 'Health, Safety & Environment',
    organization: 'Chennai Petroleum Corporation Ltd',
    category: 'Infrastructure',
    submissionDeadline: '2026-09-25T17:00:00Z',
    description: 'Turnkey supply and installation of 240 smoke/heat detectors, 18 halon-free suppression panels, SCBA sets, firefighting PPE, and 5-year AMC.',
    status: 'published',
    documents: [],
    requirements: [],
    vendors: [],
    createdAt: '2026-09-01T06:00:00.000Z',
    updatedAt: '2026-09-01T06:00:00.000Z',
    createdBy: 'user_001',
    isAnalyzed: false,
  },
  {
    id: 'tender_003',
    tenderId: 'TND-2026-0775',
    title: 'Annual Maintenance Contract for Enterprise ERP & Cyber Defense Suites',
    department: 'Digital Systems',
    organization: 'Chennai Petroleum Corporation Ltd',
    category: 'Services',
    submissionDeadline: '2026-08-25T17:00:00Z',
    description: 'L3 support, quarterly patch validation, automated SIEM log monitoring, vulnerability assessments, and 99.9% SLA for 12 modules of SAP S/4HANA.',
    status: 'draft',
    documents: [],
    requirements: [],
    vendors: [],
    createdAt: '2026-08-20T06:00:00.000Z',
    updatedAt: '2026-08-20T06:00:00.000Z',
    createdBy: 'user_001',
    isAnalyzed: false,
  },
];

// ─── Helper: make extracted data ─────────────────────────────
function makeExtracted(fields: Record<string, string | number | boolean>, page: number, confidence: number): ExtractedData {
  return { fields, sourcePage: page, confidence };
}

// ─── Demo Vendor Documents ───────────────────────────────────
const vendorADocs: VendorDocument[] = [
  { id: 'vdoc_a1', vendorId: 'vendor_001', tenderId: 'tender_001', documentType: 'GST Certificate', fileName: 'ABC_GST_Certificate.pdf', fileSize: 524288, fileType: 'application/pdf', uploadedAt: ts(10, 0), status: 'ready', extractedData: makeExtracted({ gst_number: '29AACTS1234F1Z5', legal_name: 'TechServe Solutions India Pvt Ltd', status: 'Active', registration_date: '2018-04-15' }, 1, 98) },
  { id: 'vdoc_a2', vendorId: 'vendor_001', tenderId: 'tender_001', documentType: 'PAN Card', fileName: 'ABC_PAN.pdf', fileSize: 204800, fileType: 'application/pdf', uploadedAt: ts(10, 1), status: 'ready', extractedData: makeExtracted({ pan_number: 'AACTS1234F', name: 'TechServe Solutions India Pvt Ltd', type: 'Company' }, 1, 99) },
  { id: 'vdoc_a3', vendorId: 'vendor_001', tenderId: 'tender_001', documentType: 'Financial Statement', fileName: 'ABC_Financial_Statement_2025.pdf', fileSize: 1048576, fileType: 'application/pdf', uploadedAt: ts(10, 2), status: 'ready', extractedData: makeExtracted({ annual_turnover: '₹12.5 Crore', turnover_numeric: 12.5, financial_year: '2025-26', net_profit: '₹1.8 Crore' }, 18, 96) },
  { id: 'vdoc_a4', vendorId: 'vendor_001', tenderId: 'tender_001', documentType: 'Experience Certificate', fileName: 'ABC_Experience_Certificates.pdf', fileSize: 819200, fileType: 'application/pdf', uploadedAt: ts(10, 3), status: 'ready', extractedData: makeExtracted({ experience_years: 8, projects_completed: 12, similar_projects: 5, largest_project_value: '₹4.2 Crore' }, 3, 94) },
  { id: 'vdoc_a5', vendorId: 'vendor_001', tenderId: 'tender_001', documentType: 'MSME/Udyam Certificate', fileName: 'ABC_Udyam_Registration.pdf', fileSize: 307200, fileType: 'application/pdf', uploadedAt: ts(10, 4), status: 'ready', extractedData: makeExtracted({ udyam_number: 'UDYAM-TN-01-0012345', enterprise_name: 'TechServe Solutions India Pvt Ltd', category: 'Medium', date_of_registration: '2020-07-01' }, 1, 97) },
  { id: 'vdoc_a6', vendorId: 'vendor_001', tenderId: 'tender_001', documentType: 'Company Registration', fileName: 'ABC_Certificate_of_Incorporation.pdf', fileSize: 409600, fileType: 'application/pdf', uploadedAt: ts(10, 5), status: 'ready', extractedData: makeExtracted({ cin: 'U72200TN2018PTC123456', company_name: 'TechServe Solutions India Pvt Ltd', date_of_incorporation: '2016-06-15', type: 'Private Limited' }, 1, 99) },
  { id: 'vdoc_a7', vendorId: 'vendor_001', tenderId: 'tender_001', documentType: 'Income Tax Document', fileName: 'ABC_ITR_2023_2024_2025.pdf', fileSize: 1536000, fileType: 'application/pdf', uploadedAt: ts(10, 6), status: 'ready', extractedData: makeExtracted({ itr_years: '2023-24, 2024-25, 2025-26', total_income_2025: '₹2.1 Crore', tax_paid_2025: '₹54.6 Lakh' }, 2, 95) },
  { id: 'vdoc_a8', vendorId: 'vendor_001', tenderId: 'tender_001', documentType: 'Technical Compliance Sheet', fileName: 'ABC_Technical_Compliance.pdf', fileSize: 716800, fileType: 'application/pdf', uploadedAt: ts(10, 7), status: 'ready', extractedData: makeExtracted({ specs_met: 18, specs_total: 18, compliance_percentage: 100, local_content_percentage: 62 }, 1, 93) },
  { id: 'vdoc_a9', vendorId: 'vendor_001', tenderId: 'tender_001', documentType: 'Declaration', fileName: 'ABC_Non_Blacklisting_Declaration.pdf', fileSize: 204800, fileType: 'application/pdf', uploadedAt: ts(10, 8), status: 'ready', extractedData: makeExtracted({ declaration_type: 'Non-Blacklisting', signed: true, date: '2026-09-01', signatory: 'Managing Director' }, 1, 97) },
  { id: 'vdoc_a10', vendorId: 'vendor_001', tenderId: 'tender_001', documentType: 'Other', fileName: 'ABC_ISO_9001_Certificate.pdf', fileSize: 512000, fileType: 'application/pdf', uploadedAt: ts(10, 9), status: 'ready', extractedData: makeExtracted({ certification: 'ISO 9001:2015', valid_until: '2028-03-31', certifying_body: 'Bureau Veritas', status: 'Valid' }, 1, 98) },
  { id: 'vdoc_a11', vendorId: 'vendor_001', tenderId: 'tender_001', documentType: 'EPFO/ESIC Document', fileName: 'ABC_EPFO_Registration.pdf', fileSize: 307200, fileType: 'application/pdf', uploadedAt: ts(10, 10), status: 'ready', extractedData: makeExtracted({ epfo_number: 'TNMAS0012345000', establishment_name: 'TechServe Solutions India Pvt Ltd', status: 'Active' }, 1, 96) },
  { id: 'vdoc_a12', vendorId: 'vendor_001', tenderId: 'tender_001', documentType: 'Other', fileName: 'ABC_EMD_Bank_Guarantee.pdf', fileSize: 409600, fileType: 'application/pdf', uploadedAt: ts(10, 11), status: 'ready', extractedData: makeExtracted({ type: 'Bank Guarantee', amount: '₹5,00,000', bank: 'State Bank of India', valid_until: '2027-03-31' }, 1, 99) },
];

const vendorBDocs: VendorDocument[] = [
  { id: 'vdoc_b1', vendorId: 'vendor_002', tenderId: 'tender_001', documentType: 'GST Certificate', fileName: 'Bharat_GST_Certificate.pdf', fileSize: 512000, fileType: 'application/pdf', uploadedAt: ts(10, 30), status: 'ready', extractedData: makeExtracted({ gst_number: '27AABBD5678G1Z3', legal_name: 'Bharat Digital Systems Ltd Ltd', status: 'Active', registration_date: '2019-08-20' }, 1, 97) },
  { id: 'vdoc_b2', vendorId: 'vendor_002', tenderId: 'tender_001', documentType: 'PAN Card', fileName: 'Bharat_PAN.pdf', fileSize: 204800, fileType: 'application/pdf', uploadedAt: ts(10, 31), status: 'ready', extractedData: makeExtracted({ pan_number: 'AABBD5678G', name: 'Bharat Digital Systems Ltd Ltd', type: 'LLP' }, 1, 98) },
  { id: 'vdoc_b3', vendorId: 'vendor_002', tenderId: 'tender_001', documentType: 'Financial Statement', fileName: 'Bharat_Financial_Statement_2025.pdf', fileSize: 1024000, fileType: 'application/pdf', uploadedAt: ts(10, 32), status: 'ready', extractedData: makeExtracted({ annual_turnover: '₹7.8 Crore', turnover_numeric: 7.8, financial_year: '2025-26', net_profit: '₹0.9 Crore' }, 15, 95) },
  { id: 'vdoc_b4', vendorId: 'vendor_002', tenderId: 'tender_001', documentType: 'Experience Certificate', fileName: 'Bharat_Experience.pdf', fileSize: 614400, fileType: 'application/pdf', uploadedAt: ts(10, 33), status: 'ready', extractedData: makeExtracted({ experience_years: 4, projects_completed: 6, similar_projects: 2, largest_project_value: '₹1.5 Crore' }, 5, 82) },
  { id: 'vdoc_b5', vendorId: 'vendor_002', tenderId: 'tender_001', documentType: 'Company Registration', fileName: 'Bharat_LLP_Registration.pdf', fileSize: 409600, fileType: 'application/pdf', uploadedAt: ts(10, 34), status: 'ready', extractedData: makeExtracted({ llpin: 'U72900TN2015PTC234567', company_name: 'Bharat Digital Systems Ltd Ltd', date_of_incorporation: '2020-03-12', type: 'LLP' }, 1, 98) },
  { id: 'vdoc_b6', vendorId: 'vendor_002', tenderId: 'tender_001', documentType: 'Income Tax Document', fileName: 'Bharat_ITR_2024_2025.pdf', fileSize: 1024000, fileType: 'application/pdf', uploadedAt: ts(10, 35), status: 'ready', extractedData: makeExtracted({ itr_years: '2024-25, 2025-26', total_income_2025: '₹1.1 Crore', tax_paid_2025: '₹28.6 Lakh', note: 'Only 2 years provided' }, 2, 90) },
  { id: 'vdoc_b7', vendorId: 'vendor_002', tenderId: 'tender_001', documentType: 'Technical Compliance Sheet', fileName: 'Bharat_Technical_Response.pdf', fileSize: 819200, fileType: 'application/pdf', uploadedAt: ts(10, 36), status: 'ready', extractedData: makeExtracted({ specs_met: 14, specs_total: 18, compliance_percentage: 77.8, local_content_percentage: 38 }, 1, 85) },
  { id: 'vdoc_b8', vendorId: 'vendor_002', tenderId: 'tender_001', documentType: 'Declaration', fileName: 'Bharat_Declaration.pdf', fileSize: 204800, fileType: 'application/pdf', uploadedAt: ts(10, 37), status: 'ready', extractedData: makeExtracted({ declaration_type: 'Non-Blacklisting', signed: true, date: '2026-09-02', signatory: 'Designated Partner' }, 1, 96) },
];

const vendorCDocs: VendorDocument[] = [
  { id: 'vdoc_c1', vendorId: 'vendor_003', tenderId: 'tender_001', documentType: 'GST Certificate', fileName: 'Nova_GST_Certificate.pdf', fileSize: 524288, fileType: 'application/pdf', uploadedAt: ts(11, 0), status: 'ready', extractedData: makeExtracted({ gst_number: '33AAACM9012H1Z1', legal_name: 'CloudMatrix Technologies Pvt Ltd', status: 'Active', registration_date: '2017-11-01' }, 1, 97) },
  { id: 'vdoc_c2', vendorId: 'vendor_003', tenderId: 'tender_001', documentType: 'PAN Card', fileName: 'Nova_PAN_Card.pdf', fileSize: 102400, fileType: 'application/pdf', uploadedAt: ts(11, 1), status: 'ready', extractedData: makeExtracted({ pan_number: 'AAACM9012H', name: 'CloudMatrix Technologies Pvt Ltd', type: 'Company' }, 1, 88) },
  { id: 'vdoc_c3', vendorId: 'vendor_003', tenderId: 'tender_001', documentType: 'Financial Statement', fileName: 'Nova_Financial_Statement_2025.pdf', fileSize: 1228800, fileType: 'application/pdf', uploadedAt: ts(11, 2), status: 'ready', extractedData: makeExtracted({ annual_turnover: '₹15.2 Crore', turnover_numeric: 15.2, financial_year: '2025-26', net_profit: '₹2.3 Crore' }, 20, 96) },
  { id: 'vdoc_c4', vendorId: 'vendor_003', tenderId: 'tender_001', documentType: 'Experience Certificate', fileName: 'Nova_Experience_Certificates.pdf', fileSize: 921600, fileType: 'application/pdf', uploadedAt: ts(11, 3), status: 'ready', extractedData: makeExtracted({ experience_years: 9, projects_completed: 22, similar_projects: 8, largest_project_value: '₹8.5 Crore' }, 4, 95) },
  { id: 'vdoc_c5', vendorId: 'vendor_003', tenderId: 'tender_001', documentType: 'Company Registration', fileName: 'Nova_Certificate_of_Incorporation.pdf', fileSize: 409600, fileType: 'application/pdf', uploadedAt: ts(11, 4), status: 'ready', extractedData: makeExtracted({ cin: 'U72900TN2020PTC345678', company_name: 'CloudMatrix Technologies Pvt Ltd', date_of_incorporation: '2015-03-20', type: 'Private Limited' }, 1, 99) },
  { id: 'vdoc_c6', vendorId: 'vendor_003', tenderId: 'tender_001', documentType: 'Income Tax Document', fileName: 'Nova_ITR_2023_2024_2025.pdf', fileSize: 1536000, fileType: 'application/pdf', uploadedAt: ts(11, 5), status: 'ready', extractedData: makeExtracted({ itr_years: '2023-24, 2024-25, 2025-26', total_income_2025: '₹2.8 Crore', tax_paid_2025: '₹72.8 Lakh' }, 2, 96) },
  { id: 'vdoc_c7', vendorId: 'vendor_003', tenderId: 'tender_001', documentType: 'Technical Compliance Sheet', fileName: 'Nova_Technical_Compliance.pdf', fileSize: 716800, fileType: 'application/pdf', uploadedAt: ts(11, 6), status: 'ready', extractedData: makeExtracted({ specs_met: 17, specs_total: 18, compliance_percentage: 94.4, local_content_percentage: 55 }, 1, 91) },
  { id: 'vdoc_c8', vendorId: 'vendor_003', tenderId: 'tender_001', documentType: 'MSME/Udyam Certificate', fileName: 'Nova_Udyam_Certificate.pdf', fileSize: 307200, fileType: 'application/pdf', uploadedAt: ts(11, 7), status: 'ready', extractedData: makeExtracted({ udyam_number: 'UDYAM-DL-07-0098765', enterprise_name: 'CloudMatrix Technologies Pvt Ltd', category: 'Small', date_of_registration: '2021-02-15' }, 1, 89) },
  { id: 'vdoc_c9', vendorId: 'vendor_003', tenderId: 'tender_001', documentType: 'Other', fileName: 'Nova_ISO_9001_Certificate.pdf', fileSize: 512000, fileType: 'application/pdf', uploadedAt: ts(11, 8), status: 'ready', extractedData: makeExtracted({ certification: 'ISO 9001:2015', valid_until: '2025-12-31', certifying_body: 'TÜV SÜD', status: 'Expired' }, 1, 97) },
  { id: 'vdoc_c10', vendorId: 'vendor_003', tenderId: 'tender_001', documentType: 'Startup Certificate', fileName: 'Nova_Startup_India_Certificate.pdf', fileSize: 409600, fileType: 'application/pdf', uploadedAt: ts(11, 9), status: 'ready', extractedData: makeExtracted({ certificate_number: 'DIPP12345', company_name: 'CloudMatrix Technologies Pvt Ltd', recognition_date: '2019-06-15', valid_until: '2029-06-15' }, 1, 96) },
];

// ─── Demo Vendors ────────────────────────────────────────────
export const demoVendors: Vendor[] = [
  {
    id: 'vendor_001',
    vendorId: 'VND001',
    name: 'TechServe Solutions India Pvt Ltd',
    contactPerson: 'Suresh Menon',
    email: 'suresh@techservesolutions.com',
    phone: '+91 98401 23456',
    address: '42 Anna Salai, Guindy, Chennai - 600032',
    registrationNumber: 'U72200TN2018PTC123456',
    gstNumber: '29AACTS1234F1Z5',
    panNumber: 'AACTS1234F',
    tenderIds: ['tender_001'],
    documents: vendorADocs,
    bidSubmissionDate: '2026-09-05T12:00:00.000Z',
    createdAt: ts(9, 30),
    updatedAt: ts(10, 15),
  },
  {
    id: 'vendor_002',
    vendorId: 'VND002',
    name: 'Bharat Digital Systems Ltd',
    contactPerson: 'Kavita Reddy',
    email: 'kavita@bharatdigital.in',
    phone: '+91 98840 67890',
    address: '15 OMR Road, Thoraipakkam, Chennai - 600097',
    registrationNumber: 'U72900TN2015PTC234567',
    gstNumber: '27AABBD5678G1Z3',
    panNumber: 'AABBD5678G',
    tenderIds: ['tender_001'],
    documents: vendorBDocs,
    bidSubmissionDate: '2026-09-05T14:00:00.000Z',
    createdAt: ts(9, 45),
    updatedAt: ts(10, 40),
  },
  {
    id: 'vendor_003',
    vendorId: 'VND003',
    name: 'CloudMatrix Technologies Pvt Ltd',
    contactPerson: 'Arun Kumar',
    email: 'arun@cloudmatrix.tech',
    phone: '+91 97102 34567',
    address: '88 Mount Road, Teynampet, Chennai - 600018',
    registrationNumber: 'U72900TN2020PTC345678',
    gstNumber: '33AAACM9012H1Z1',
    panNumber: 'AAACM9012H',
    tenderIds: ['tender_001'],
    documents: vendorCDocs,
    bidSubmissionDate: '2026-09-05T16:00:00.000Z',
    createdAt: ts(10, 0),
    updatedAt: ts(11, 15),
  },
];

// ─── Demo Compliance Results ─────────────────────────────────
function cr(
  n: number, vendorId: string, reqId: string,
  status: ComplianceStatus, confidence: number,
  extracted: string, expected: string,
  explanation: string, docName: string, page: number, evidenceText: string
): ComplianceResult {
  const lvl: ConfidenceLevel = confidence >= 90 ? 'high' : confidence >= 70 ? 'medium' : 'low';
  return {
    id: `cr_${vendorId.split('_')[1]}_${n}`,
    tenderId: 'tender_001',
    vendorId,
    requirementId: reqId,
    requirement: demoRequirements.find(r => r.id === reqId)!,
    status,
    confidence,
    confidenceLevel: lvl,
    extractedValue: extracted,
    expectedValue: expected,
    explanation,
    evidenceDocumentName: docName,
    evidencePage: page,
    evidenceText,
    verifiedAt: ts(11, 30),
    verifiedBy: 'AI Engine v1.0',
  };
}

export const demoComplianceVendorA: ComplianceResult[] = [
  cr(1, 'vendor_001', 'req_001', 'compliant', 98, 'GST: 29AACTS1234F1Z5 — Active', 'Must have active GST registration', 'GST registration 29AACTS1234F1Z5 is active and valid. The legal name matches the bidder entity.', 'ABC_GST_Certificate.pdf', 1, 'GSTIN: 29AACTS1234F1Z5\nLegal Name: TechServe Solutions India Pvt Ltd\nStatus: Active'),
  cr(2, 'vendor_001', 'req_002', 'compliant', 99, 'PAN: AACTS1234F', 'Valid PAN required', 'PAN card AACTS1234F is valid. The name on the PAN matches the bidding entity name.', 'ABC_PAN.pdf', 1, 'Permanent Account Number: AACTS1234F\nName: TechServe Solutions India Pvt Ltd'),
  cr(3, 'vendor_001', 'req_003', 'compliant', 96, '₹12.5 Crore', '≥ ₹10 Crore', 'The tender requires a minimum annual turnover of ₹10 Crore. The submitted financial statement for FY 2025-26 reports an annual turnover of ₹12.5 Crore, which exceeds the required minimum by ₹2.5 Crore.', 'ABC_Financial_Statement_2025.pdf', 18, 'Annual Turnover (FY 2025-26): ₹12,50,00,000\nNet Profit: ₹1,80,00,000'),
  cr(4, 'vendor_001', 'req_004', 'compliant', 94, '8 years', '≥ 5 years', 'The bidder has 8 years of experience in IT equipment supply with 12 completed projects, of which 5 are similar in nature. This exceeds the required 5 years.', 'ABC_Experience_Certificates.pdf', 3, 'Total Experience: 8 years\nProjects Completed: 12\nSimilar Projects: 5'),
  cr(5, 'vendor_001', 'req_005', 'compliant', 97, 'UDYAM-TN-01-0012345 — Medium Enterprise', 'If applicable, valid MSME/Udyam registration', 'Valid Udyam registration certificate found. The enterprise is classified as Medium under MSME.', 'ABC_Udyam_Registration.pdf', 1, 'Udyam Registration Number: UDYAM-TN-01-0012345\nCategory: Medium Enterprise'),
  cr(6, 'vendor_001', 'req_006', 'compliant', 93, '18/18 specifications met (100%)', 'Must meet all technical specifications in Annexure-A', 'The technical compliance sheet confirms that all 18 specifications listed in Annexure-A are met. Full compliance achieved.', 'ABC_Technical_Compliance.pdf', 1, 'Specifications Met: 18 out of 18\nCompliance: 100%'),
  cr(7, 'vendor_001', 'req_007', 'compliant', 99, 'CIN: U72200TN2018PTC123456', 'Must be registered under Companies Act or equivalent', 'Certificate of Incorporation found. Company registered under Companies Act 2013 as a Private Limited company.', 'ABC_Certificate_of_Incorporation.pdf', 1, 'CIN: U72200TN2018PTC123456\nDate of Incorporation: 15-06-2016'),
  cr(8, 'vendor_001', 'req_008', 'compliant', 95, 'ITR filed for 2023-24, 2024-25, 2025-26', 'ITR for last 3 financial years', 'Income Tax Returns for all three required financial years have been submitted and verified.', 'ABC_ITR_2023_2024_2025.pdf', 2, 'ITR Filed: 2023-24, 2024-25, 2025-26\nTotal Income (2025-26): ₹2,10,00,000'),
  cr(9, 'vendor_001', 'req_009', 'compliant', 94, '5 similar projects completed', 'At least 3 similar projects completed', 'The bidder has completed 5 similar projects out of 12 total, exceeding the minimum requirement of 3 similar projects.', 'ABC_Experience_Certificates.pdf', 5, 'Similar Projects: 5\nTotal Projects: 12\nLargest Value: ₹4.2 Crore'),
  cr(10, 'vendor_001', 'req_010', 'compliant', 97, 'Declaration signed by Managing Director', 'Self-declaration on company letterhead', 'Non-blacklisting declaration is signed by the Managing Director on company letterhead and dated 01-Sep-2026.', 'ABC_Non_Blacklisting_Declaration.pdf', 1, 'Declaration Type: Non-Blacklisting\nSignatory: Managing Director\nDate: 01-09-2026'),
  cr(11, 'vendor_001', 'req_011', 'compliant', 91, '62% local content', 'Minimum 50% local content', 'The technical compliance sheet reports 62% local content, which exceeds the required minimum of 50% under Make in India policy.', 'ABC_Technical_Compliance.pdf', 3, 'Local Content Percentage: 62%\nMinimum Required: 50%'),
  cr(12, 'vendor_001', 'req_012', 'compliant', 98, 'ISO 9001:2015 — Valid until 31-Mar-2028', 'ISO 9001:2015 or equivalent', 'Valid ISO 9001:2015 certification from Bureau Veritas. Certificate is valid until 31-Mar-2028.', 'ABC_ISO_9001_Certificate.pdf', 1, 'Certification: ISO 9001:2015\nCertifying Body: Bureau Veritas\nValid Until: 31-03-2028'),
  cr(13, 'vendor_001', 'req_013', 'compliant', 96, 'EPFO: TNMAS0012345000 — Active', 'Valid EPFO registration', 'EPFO registration is active and valid for the establishment.', 'ABC_EPFO_Registration.pdf', 1, 'EPFO Number: TNMAS0012345000\nStatus: Active'),
  cr(14, 'vendor_001', 'req_014', 'compliant', 99, 'Bank Guarantee of ₹5,00,000 from SBI', '₹5 Lakh EMD via bank guarantee or DD', 'EMD of ₹5,00,000 submitted as a Bank Guarantee from State Bank of India, valid until 31-Mar-2027.', 'ABC_EMD_Bank_Guarantee.pdf', 1, 'Type: Bank Guarantee\nAmount: ₹5,00,000\nBank: State Bank of India'),
  cr(15, 'vendor_001', 'req_015', 'compliant', 92, 'Not applicable — EMD submitted', 'If applicable, for EMD exemption', 'Vendor has submitted EMD directly via bank guarantee. Startup/NSIC certificate not required for exemption.', 'ABC_EMD_Bank_Guarantee.pdf', 1, 'EMD submitted. Exemption not claimed.'),
];

export const demoComplianceVendorB: ComplianceResult[] = [
  cr(1, 'vendor_002', 'req_001', 'compliant', 97, 'GST: 27AABBD5678G1Z3 — Active', 'Must have active GST registration', 'GST registration is active and valid.', 'Bharat_GST_Certificate.pdf', 1, 'GSTIN: 27AABBD5678G1Z3\nStatus: Active'),
  cr(2, 'vendor_002', 'req_002', 'compliant', 98, 'PAN: AABBD5678G', 'Valid PAN required', 'PAN card is valid and matches the bidding entity.', 'Bharat_PAN.pdf', 1, 'PAN: AABBD5678G\nName: Bharat Digital Systems Ltd Ltd'),
  cr(3, 'vendor_002', 'req_003', 'non_compliant', 95, '₹7.8 Crore', '≥ ₹10 Crore', 'The tender requires a minimum annual turnover of ₹10 Crore. The submitted financial statement for FY 2025-26 reports an annual turnover of ₹7.8 Crore, which is ₹2.2 Crore below the required minimum. The requirement is NOT satisfied.', 'Bharat_Financial_Statement_2025.pdf', 15, 'Annual Turnover (FY 2025-26): ₹7,80,00,000\nNet Profit: ₹90,00,000'),
  cr(4, 'vendor_002', 'req_004', 'non_compliant', 88, '4 years', '≥ 5 years', 'The bidder reports 4 years of experience, which is below the required minimum of 5 years. Only 2 similar projects were found, which is also below the required 3.', 'Bharat_Experience.pdf', 5, 'Total Experience: 4 years\nSimilar Projects: 2'),
  cr(5, 'vendor_002', 'req_005', 'non_compliant', 92, 'No MSME/Udyam certificate submitted', 'If applicable, valid MSME/Udyam registration', 'No MSME or Udyam registration certificate was found in the submitted documents. However, this requirement is optional.', '', 0, 'Document not submitted'),
  cr(6, 'vendor_002', 'req_006', 'manual_review', 85, '14/18 specifications met (77.8%)', 'Must meet all technical specifications in Annexure-A', 'The technical response indicates 14 out of 18 specifications are met. 4 specifications are not addressed clearly. Manual review is recommended to verify partial compliance claims.', 'Bharat_Technical_Response.pdf', 1, 'Specifications Met: 14 out of 18\nCompliance: 77.8%'),
  cr(7, 'vendor_002', 'req_007', 'compliant', 98, 'LLP Registration: U72900TN2015PTC234567', 'Must be registered under Companies Act or equivalent', 'LLP registration document found. Bharat Digital Systems Ltd Ltd is a registered Limited Liability Partnership.', 'Bharat_LLP_Registration.pdf', 1, 'LLPIN: U72900TN2015PTC234567\nDate: 12-03-2020'),
  cr(8, 'vendor_002', 'req_008', 'non_compliant', 90, 'ITR for 2 years only (2024-25, 2025-26)', 'ITR for last 3 financial years', 'Only 2 years of ITR were submitted instead of the required 3 years. ITR for 2023-24 is missing.', 'Bharat_ITR_2024_2025.pdf', 2, 'ITR Filed: 2024-25, 2025-26\nMissing: 2023-24'),
  cr(9, 'vendor_002', 'req_009', 'non_compliant', 82, '2 similar projects (below minimum of 3)', 'At least 3 similar projects completed', 'Only 2 similar projects found against the required minimum of 3. Total project count is 6 across all categories.', 'Bharat_Experience.pdf', 7, 'Similar Projects: 2\nTotal Projects: 6'),
  cr(10, 'vendor_002', 'req_010', 'compliant', 96, 'Declaration signed by Designated Partner', 'Self-declaration on company letterhead', 'Non-blacklisting declaration submitted and signed on official letterhead.', 'Bharat_Declaration.pdf', 1, 'Declaration: Non-Blacklisting\nSigned: Yes'),
  cr(11, 'vendor_002', 'req_011', 'non_compliant', 87, '38% local content', 'Minimum 50% local content', 'The technical response indicates only 38% local content, which is 12 percentage points below the required 50% minimum under Make in India policy.', 'Bharat_Technical_Response.pdf', 4, 'Local Content: 38%\nRequired: 50%'),
  cr(12, 'vendor_002', 'req_012', 'manual_review', 65, 'No ISO certificate found in submissions', 'ISO 9001:2015 or equivalent', 'No ISO 9001:2015 certificate was found in the submitted documents. However, the technical response mentions ISO certification. Manual verification is recommended.', 'Bharat_Technical_Response.pdf', 2, 'Reference to ISO certification found in text but no certificate document submitted'),
  cr(13, 'vendor_002', 'req_013', 'manual_review', 60, 'No EPFO document submitted', 'Valid EPFO registration', 'No EPFO registration document found. This is a non-mandatory requirement but recommended for verification.', '', 0, 'Document not submitted'),
  cr(14, 'vendor_002', 'req_014', 'manual_review', 70, 'EMD document not clearly identified', '₹5 Lakh EMD via bank guarantee or DD', 'No clear EMD document (bank guarantee or demand draft) was identified in the submitted documents. Manual verification of payment records is recommended.', '', 0, 'No EMD document found'),
  cr(15, 'vendor_002', 'req_015', 'non_compliant', 85, 'No Startup/NSIC certificate', 'If applicable, for EMD exemption', 'No Startup India or NSIC certificate was submitted. Since EMD status is also unclear, this is marked as non-compliant.', '', 0, 'No exemption certificate found'),
];

export const demoComplianceVendorC: ComplianceResult[] = [
  cr(1, 'vendor_003', 'req_001', 'compliant', 97, 'GST: 33AAACM9012H1Z1 — Active', 'Must have active GST registration', 'GST registration is active and valid.', 'Nova_GST_Certificate.pdf', 1, 'GSTIN: 33AAACM9012H1Z1\nStatus: Active'),
  cr(2, 'vendor_003', 'req_002', 'manual_review', 72, 'PAN: AAACM9012H — Name variation detected', 'Valid PAN required', 'PAN card found but the name on PAN reads "CloudMatrix Technologies Pvt Ltd" while other documents show "CloudMatrix Technologies Pvt Ltd". Minor name variation detected — manual verification recommended.', 'Nova_PAN_Card.pdf', 1, 'PAN: AAACM9012H\nName: CloudMatrix Technologies Pvt Ltd'),
  cr(3, 'vendor_003', 'req_003', 'compliant', 96, '₹15.2 Crore', '≥ ₹10 Crore', 'Annual turnover of ₹15.2 Crore exceeds the required minimum of ₹10 Crore by ₹5.2 Crore.', 'Nova_Financial_Statement_2025.pdf', 20, 'Annual Turnover (FY 2025-26): ₹15,20,00,000'),
  cr(4, 'vendor_003', 'req_004', 'compliant', 95, '9 years', '≥ 5 years', 'The bidder has 9 years of experience with 8 similar projects, well exceeding the 5-year minimum requirement.', 'Nova_Experience_Certificates.pdf', 4, 'Experience: 9 years\nSimilar Projects: 8'),
  cr(5, 'vendor_003', 'req_005', 'manual_review', 74, 'UDYAM-DL-07-0098765 — Name variation', 'If applicable, valid MSME/Udyam registration', 'Udyam certificate found but the name reads "CloudMatrix Technologies Pvt Ltd" which has minor differences from the company registration name. Manual verification recommended.', 'Nova_Udyam_Certificate.pdf', 1, 'Udyam Number: UDYAM-DL-07-0098765\nName: CloudMatrix Technologies Pvt Ltd'),
  cr(6, 'vendor_003', 'req_006', 'compliant', 91, '17/18 specifications met (94.4%)', 'Must meet all technical specifications in Annexure-A', 'Technical compliance sheet shows 17 out of 18 specifications met. One specification (redundant power supply) is listed as "alternative solution proposed". High compliance rate.', 'Nova_Technical_Compliance.pdf', 1, 'Specifications Met: 17/18\nCompliance: 94.4%'),
  cr(7, 'vendor_003', 'req_007', 'compliant', 99, 'CIN: U72900TN2020PTC345678', 'Must be registered under Companies Act or equivalent', 'Certificate of Incorporation verified. Registered under Companies Act 2013.', 'Nova_Certificate_of_Incorporation.pdf', 1, 'CIN: U72900TN2020PTC345678'),
  cr(8, 'vendor_003', 'req_008', 'compliant', 96, 'ITR filed for 2023-24, 2024-25, 2025-26', 'ITR for last 3 financial years', 'All three years of ITR have been submitted as required.', 'Nova_ITR_2023_2024_2025.pdf', 2, 'ITR Filed: 2023-24, 2024-25, 2025-26'),
  cr(9, 'vendor_003', 'req_009', 'compliant', 95, '8 similar projects completed', 'At least 3 similar projects completed', 'The bidder has completed 8 similar projects, well exceeding the minimum requirement of 3.', 'Nova_Experience_Certificates.pdf', 6, 'Similar Projects: 8 of 22 total'),
  cr(10, 'vendor_003', 'req_010', 'non_compliant', 88, 'No declaration document found', 'Self-declaration on company letterhead', 'No non-blacklisting declaration was found in the submitted documents. This is a mandatory requirement.', '', 0, 'Document not submitted'),
  cr(11, 'vendor_003', 'req_011', 'compliant', 89, '55% local content', 'Minimum 50% local content', 'Local content of 55% meets the minimum 50% requirement under Make in India policy, though the margin is relatively small.', 'Nova_Technical_Compliance.pdf', 3, 'Local Content: 55%'),
  cr(12, 'vendor_003', 'req_012', 'non_compliant', 97, 'ISO 9001:2015 — Expired 31-Dec-2025', 'ISO 9001:2015 or equivalent', 'ISO 9001:2015 certificate from TÜV SÜD was found but it expired on 31-Dec-2025. The certificate is no longer valid as of the tender submission date.', 'Nova_ISO_9001_Certificate.pdf', 1, 'Certification: ISO 9001:2015\nValid Until: 31-12-2025\nStatus: EXPIRED'),
  cr(13, 'vendor_003', 'req_013', 'manual_review', 55, 'No EPFO document submitted', 'Valid EPFO registration', 'No EPFO registration document was found. This is a non-mandatory requirement.', '', 0, 'Document not submitted'),
  cr(14, 'vendor_003', 'req_014', 'manual_review', 68, 'Startup India certificate submitted for EMD exemption', '₹5 Lakh EMD via bank guarantee or DD', 'Vendor has submitted a Startup India certificate claiming EMD exemption. The Startup India certificate appears valid but exemption eligibility needs manual verification against current DPIIT guidelines.', 'Nova_Startup_India_Certificate.pdf', 1, 'Startup Certificate: DIPP12345\nEMD Exemption Claimed'),
  cr(15, 'vendor_003', 'req_015', 'compliant', 96, 'Startup India Certificate: DIPP12345', 'If applicable, for EMD exemption', 'Valid Startup India certificate found. Recognition date: 15-Jun-2019, valid until 15-Jun-2029.', 'Nova_Startup_India_Certificate.pdf', 1, 'Certificate: DIPP12345\nValid Until: 15-06-2029'),
];

export const allComplianceResults: Record<string, ComplianceResult[]> = {
  vendor_001: demoComplianceVendorA,
  vendor_002: demoComplianceVendorB,
  vendor_003: demoComplianceVendorC,
};

// ─── Risk Assessments ────────────────────────────────────────
export const demoRiskAssessments: Record<string, RiskAssessment> = {
  vendor_001: {
    id: 'risk_001', tenderId: 'tender_001', vendorId: 'vendor_001',
    overallScore: 8, riskLevel: 'low',
    factors: [
      { id: 'rf_a1', description: 'All mandatory requirements are satisfied', severity: 'low', category: 'Compliance', impact: 'Positive — full compliance' },
    ],
    missingDocuments: [],
    inconsistencies: [],
    calculatedAt: ts(12, 0),
  },
  vendor_002: {
    id: 'risk_002', tenderId: 'tender_001', vendorId: 'vendor_002',
    overallScore: 72, riskLevel: 'high',
    factors: [
      { id: 'rf_b1', description: 'Annual turnover below minimum requirement', severity: 'high', category: 'Financial', impact: 'Mandatory financial requirement not met' },
      { id: 'rf_b2', description: 'Insufficient experience (4 years vs 5 required)', severity: 'high', category: 'Experience', impact: 'Mandatory experience requirement not met' },
      { id: 'rf_b3', description: 'Local content below 50% threshold', severity: 'high', category: 'Local Content', impact: 'Make in India compliance failure' },
      { id: 'rf_b4', description: 'Missing ITR for one financial year', severity: 'medium', category: 'Tax', impact: 'Incomplete tax documentation' },
      { id: 'rf_b5', description: 'Technical specifications partially met (77.8%)', severity: 'medium', category: 'Technical', impact: 'Partial technical compliance needs review' },
      { id: 'rf_b6', description: 'EMD document not clearly identified', severity: 'medium', category: 'Financial', impact: 'Bid security status unclear' },
    ],
    missingDocuments: ['MSME/Udyam Certificate', 'ISO 9001 Certificate', 'EPFO/ESIC Document', 'EMD Bank Guarantee/DD'],
    inconsistencies: [
      { id: 'inc_b1', type: 'name_mismatch', severity: 'low', description: 'Entity type mismatch between documents', document1: 'GST Certificate', document2: 'PAN Card', value1: 'Bharat Digital Systems Ltd Ltd', value2: 'Bharat Digital Systems Ltd Ltd', field: 'Entity Name' },
    ],
    calculatedAt: ts(12, 0),
  },
  vendor_003: {
    id: 'risk_003', tenderId: 'tender_001', vendorId: 'vendor_003',
    overallScore: 38, riskLevel: 'medium',
    factors: [
      { id: 'rf_c1', description: 'ISO 9001:2015 certificate has expired', severity: 'high', category: 'Certification', impact: 'Quality management certification invalid' },
      { id: 'rf_c2', description: 'Non-blacklisting declaration missing', severity: 'high', category: 'Legal', impact: 'Mandatory declaration not submitted' },
      { id: 'rf_c3', description: 'Name variation across documents', severity: 'medium', category: 'Consistency', impact: 'Potential entity identification issues' },
      { id: 'rf_c4', description: 'EMD exemption claim needs verification', severity: 'medium', category: 'Financial', impact: 'Startup exemption eligibility unclear' },
    ],
    missingDocuments: ['Declaration of Non-Blacklisting', 'EPFO/ESIC Document'],
    inconsistencies: [
      { id: 'inc_c1', type: 'name_mismatch', severity: 'medium', description: 'Company name variation between PAN and Company Registration', document1: 'Nova_PAN_Card.pdf', document2: 'Nova_Certificate_of_Incorporation.pdf', value1: 'CloudMatrix Technologies Pvt Ltd', value2: 'CloudMatrix Technologies Pvt Ltd', field: 'Company Name' },
      { id: 'inc_c2', type: 'name_mismatch', severity: 'medium', description: 'Company name variation between Udyam and Company Registration', document1: 'Nova_Udyam_Certificate.pdf', document2: 'Nova_Certificate_of_Incorporation.pdf', value1: 'CloudMatrix Technologies Pvt Ltd', value2: 'CloudMatrix Technologies Pvt Ltd', field: 'Company Name' },
    ],
    calculatedAt: ts(12, 0),
  },
};

// ─── Vendor Scores ───────────────────────────────────────────
export const demoVendorScores: VendorScore[] = [
  {
    vendorId: 'vendor_001', vendorName: 'TechServe Solutions India Pvt Ltd',
    overallScore: 97, compliant: 15, nonCompliant: 0, manualReview: 0, total: 15,
    riskLevel: 'low', riskScore: 8,
  },
  {
    vendorId: 'vendor_002', vendorName: 'Bharat Digital Systems Ltd',
    overallScore: 40, compliant: 4, nonCompliant: 7, manualReview: 4, total: 15,
    riskLevel: 'high', riskScore: 72,
  },
  {
    vendorId: 'vendor_003', vendorName: 'CloudMatrix Technologies Pvt Ltd',
    overallScore: 73, compliant: 8, nonCompliant: 2, manualReview: 5, total: 15,
    riskLevel: 'medium', riskScore: 38,
  },
];

// ─── Dashboard Stats ─────────────────────────────────────────
export const demoDashboardStats: DashboardStats = {
  activeTenders: 3,
  totalVendors: 3,
  totalRequirements: 15,
  requirementsVerified: 15,
  manualReview: 9,
  nonCompliant: 9,
  complianceRate: 60,
  pendingReviews: 9,
};

// ─── Audit Trail ─────────────────────────────────────────────
export const demoAuditTrail: AuditEntry[] = [
  { id: 'aud_01', userId: 'user_001', userName: 'Rajesh Kumar', action: 'tender_created', timestamp: ts(8, 0), tenderId: 'tender_001', tenderTitle: 'Supply, Installation & Commissioning of High-Performance Computing Infrastructure', details: 'Created tender CPCL/IT/2026/001' },
  { id: 'aud_02', userId: 'user_001', userName: 'Rajesh Kumar', action: 'document_uploaded', timestamp: ts(8, 30), tenderId: 'tender_001', tenderTitle: 'Supply, Installation & Commissioning of High-Performance Computing Infrastructure', documentName: 'CPCL_IT_2026_001_Tender_Document.pdf', details: 'Uploaded tender document (2.4 MB)' },
  { id: 'aud_03', userId: 'user_001', userName: 'Rajesh Kumar', action: 'ai_analysis_started', timestamp: ts(9, 0), tenderId: 'tender_001', tenderTitle: 'Supply, Installation & Commissioning of High-Performance Computing Infrastructure', details: 'Started AI analysis of tender document' },
  { id: 'aud_04', userId: 'system', userName: 'AI Engine', action: 'ai_analysis_completed', timestamp: ts(9, 5), tenderId: 'tender_001', tenderTitle: 'Supply, Installation & Commissioning of High-Performance Computing Infrastructure', details: 'AI analysis completed — 15 requirements extracted' },
  { id: 'aud_05', userId: 'user_001', userName: 'Rajesh Kumar', action: 'requirement_edited', timestamp: ts(9, 10), tenderId: 'tender_001', tenderTitle: 'Supply, Installation & Commissioning of High-Performance Computing Infrastructure', details: 'Modified requirement R003: Updated condition to "≥ ₹10 Crore in last 3 financial years"' },
  { id: 'aud_06', userId: 'user_001', userName: 'Rajesh Kumar', action: 'vendor_added', timestamp: ts(9, 30), tenderId: 'tender_001', vendorId: 'vendor_001', vendorName: 'TechServe Solutions India Pvt Ltd', details: 'Added vendor TechServe Solutions India Pvt Ltd (VND001)' },
  { id: 'aud_07', userId: 'user_001', userName: 'Rajesh Kumar', action: 'vendor_added', timestamp: ts(9, 45), tenderId: 'tender_001', vendorId: 'vendor_002', vendorName: 'Bharat Digital Systems Ltd', details: 'Added vendor Bharat Digital Systems Ltd (VND002)' },
  { id: 'aud_08', userId: 'user_001', userName: 'Rajesh Kumar', action: 'vendor_added', timestamp: ts(10, 0), tenderId: 'tender_001', vendorId: 'vendor_003', vendorName: 'CloudMatrix Technologies Pvt Ltd', details: 'Added vendor CloudMatrix Technologies Pvt Ltd (VND003)' },
  { id: 'aud_09', userId: 'user_001', userName: 'Rajesh Kumar', action: 'vendor_document_uploaded', timestamp: ts(10, 0), vendorId: 'vendor_001', vendorName: 'TechServe Solutions India Pvt Ltd', details: 'Uploaded 12 documents for TechServe Solutions India Pvt Ltd' },
  { id: 'aud_10', userId: 'user_001', userName: 'Rajesh Kumar', action: 'vendor_document_uploaded', timestamp: ts(10, 30), vendorId: 'vendor_002', vendorName: 'Bharat Digital Systems Ltd', details: 'Uploaded 8 documents for Bharat Digital Systems Ltd' },
  { id: 'aud_11', userId: 'user_001', userName: 'Rajesh Kumar', action: 'vendor_document_uploaded', timestamp: ts(11, 0), vendorId: 'vendor_003', vendorName: 'CloudMatrix Technologies Pvt Ltd', details: 'Uploaded 10 documents for CloudMatrix Technologies Pvt Ltd' },
  { id: 'aud_12', userId: 'user_001', userName: 'Rajesh Kumar', action: 'compliance_check_started', timestamp: ts(11, 15), tenderId: 'tender_001', details: 'Started compliance verification for all 3 vendors' },
  { id: 'aud_13', userId: 'system', userName: 'AI Engine', action: 'compliance_check_completed', timestamp: ts(11, 30), tenderId: 'tender_001', vendorId: 'vendor_001', vendorName: 'TechServe Solutions India Pvt Ltd', details: 'Compliance check completed — 15/15 compliant (97% score)' },
  { id: 'aud_14', userId: 'system', userName: 'AI Engine', action: 'compliance_check_completed', timestamp: ts(11, 32), tenderId: 'tender_001', vendorId: 'vendor_002', vendorName: 'Bharat Digital Systems Ltd', details: 'Compliance check completed — 4/15 compliant, 7 non-compliant, 4 manual review (40% score)' },
  { id: 'aud_15', userId: 'system', userName: 'AI Engine', action: 'compliance_check_completed', timestamp: ts(11, 34), tenderId: 'tender_001', vendorId: 'vendor_003', vendorName: 'CloudMatrix Technologies Pvt Ltd', details: 'Compliance check completed — 8/15 compliant, 2 non-compliant, 5 manual review (73% score)' },
  { id: 'aud_16', userId: 'system', userName: 'AI Engine', action: 'risk_assessment_completed', timestamp: ts(12, 0), tenderId: 'tender_001', details: 'Risk assessment completed for all vendors: ABC Tech (Low: 8), Bharat Digital (High: 72), Nova Infotech (Medium: 38)' },
  { id: 'aud_17', userId: 'user_001', userName: 'Rajesh Kumar', action: 'compliance_result_reviewed', timestamp: ts(12, 15), tenderId: 'tender_001', vendorId: 'vendor_001', vendorName: 'TechServe Solutions India Pvt Ltd', details: 'Reviewed all compliance results for ABC Technologies — approved' },
  { id: 'aud_18', userId: 'user_001', userName: 'Rajesh Kumar', action: 'report_generated', timestamp: ts(12, 30), tenderId: 'tender_001', details: 'Generated compliance comparison report for tender CPCL/IT/2026/001' },
];

// ─── External Verification ───────────────────────────────────
export const demoExternalVerifications: ExternalVerification[] = [
  { service: 'GST Verification (GSTN)', status: 'demo', lastChecked: ts(11, 30), result: 'Demo Mode — Simulated verification' },
  { service: 'PAN Verification (NSDL)', status: 'demo', lastChecked: ts(11, 30), result: 'Demo Mode — Simulated verification' },
  { service: 'Udyam Registration (MSME)', status: 'unavailable', result: 'External verification required' },
  { service: 'MCA Company Search', status: 'demo', lastChecked: ts(11, 30), result: 'Demo Mode — Simulated verification' },
  { service: 'EPFO Verification', status: 'unavailable', result: 'External verification required' },
  { service: 'Income Tax (e-Filing)', status: 'unavailable', result: 'External verification required' },
];

export const demoComplianceResults: ComplianceResult[] = [
  ...demoComplianceVendorA,
  ...demoComplianceVendorB,
  ...demoComplianceVendorC,
];

export const demoVendorDocuments: VendorDocument[] = demoVendors.flatMap(v => v.documents);

export const demoAuditLog: AuditEntry[] = demoAuditTrail;

