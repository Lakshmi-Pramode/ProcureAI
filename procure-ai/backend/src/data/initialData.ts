import type {
  Tender, Requirement, Vendor, VendorDocument, ComplianceResult,
  RiskAssessment, AuditEntry, User
} from '../types/index.js';

const id = (prefix: string, n: number) => `${prefix}_${String(n).padStart(3, '0')}`;
const ts = (h: number, m: number) => {
  const d = new Date('2026-09-05');
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const initialUsers: User[] = [
  {
    id: 'user_001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@procurement.gov.in',
    role: 'officer',
    organization: 'Chennai Petroleum Corporation Ltd',
    password: 'password123'
  },
  {
    id: 'user_002',
    name: 'Priya Sharma',
    email: 'priya.sharma@procurement.gov.in',
    role: 'admin',
    organization: 'Chennai Petroleum Corporation Ltd',
    password: 'password123'
  },
  {
    id: 'user_003',
    name: 'Amit Patel',
    email: 'amit.patel@procurement.gov.in',
    role: 'reviewer',
    organization: 'Chennai Petroleum Corporation Ltd',
    password: 'password123'
  }
];

export const initialRequirements: Requirement[] = [
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
    description: 'Earnest Money Deposit (EMD)', category: 'Financial',
    condition: '₹5,00,000 via BG/Online or MSME exemption', mandatory: true,
    sourcePage: 8, sourceText: 'EMD of ₹5 Lakhs to be submitted. Exemption applies for registered MSMEs.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 14), tenderId: 'tender_001', requirementId: 'R014',
    description: 'Net Worth Certificate', category: 'Financial',
    condition: 'Positive net worth certified by CA', mandatory: true,
    sourcePage: 20, sourceText: 'Net worth certificate from a practicing Chartered Accountant.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
  {
    id: id('req', 15), tenderId: 'tender_001', requirementId: 'R015',
    description: 'EPFO & ESIC Registration', category: 'Social Compliance',
    condition: 'Active EPFO and ESIC registrations', mandatory: true,
    sourcePage: 14, sourceText: 'Valid EPFO and ESIC registration certificates are mandatory.',
    createdAt: ts(9, 0), updatedAt: ts(9, 0),
  },
];

export const initialVendors: Vendor[] = [
  {
    id: 'vendor_001', vendorId: 'VND001', name: 'TechServe Solutions Pvt Ltd',
    contactPerson: 'Suresh Menon', email: 'suresh@techservesolutions.com', phone: '+91 98401 23456',
    address: '42 Anna Salai, Guindy, Chennai - 600032', registrationNumber: 'U72200TN2018PTC123456',
    gstNumber: '33AABCT1234F1Z5', panNumber: 'AABCT1234F',
    tenderIds: ['tender_001'],
    documents: [],
    bidSubmissionDate: '2026-09-02T14:30:00Z',
    createdAt: ts(8, 0), updatedAt: ts(10, 0),
  },
  {
    id: 'vendor_002', vendorId: 'VND002', name: 'Apex Infra & Systems LLP',
    contactPerson: 'Kavita Reddy', email: 'kavita@apexinfra.in', phone: '+91 98840 67890',
    address: '15 OMR Road, Thoraipakkam, Chennai - 600097', registrationNumber: 'AAL-4567',
    gstNumber: '33AABCA5678G1Z2', panNumber: 'AABCA5678G',
    tenderIds: ['tender_001'],
    documents: [],
    bidSubmissionDate: '2026-09-03T11:15:00Z',
    createdAt: ts(8, 0), updatedAt: ts(10, 0),
  },
  {
    id: 'vendor_003', vendorId: 'VND003', name: 'Global Tech Enterprises',
    contactPerson: 'Arun Kumar', email: 'arun@globaltechenterprises.com', phone: '+91 97102 34567',
    address: '88 Mount Road, Teynampet, Chennai - 600018', registrationNumber: 'U72900TN2020PTC234567',
    gstNumber: '33AABCG9012H1Z8', panNumber: 'AABCG9012H',
    tenderIds: ['tender_001'],
    documents: [],
    bidSubmissionDate: '2026-09-04T16:45:00Z',
    createdAt: ts(8, 0), updatedAt: ts(10, 0),
  },
  {
    id: 'vendor_004', vendorId: 'VND004', name: 'Bharat Digital Networks',
    contactPerson: 'Deepa Krishnan', email: 'deepa@bharatdigital.co.in', phone: '+91 94440 12345',
    address: '23 Nelson Manickam Road, Chennai - 600029', registrationNumber: 'U74999TN2015PTC345678',
    gstNumber: '33AABCB3456J1Z1', panNumber: 'AABCB3456J',
    tenderIds: ['tender_001'],
    documents: [],
    bidSubmissionDate: '2026-09-01T10:00:00Z',
    createdAt: ts(8, 0), updatedAt: ts(10, 0),
  },
  {
    id: 'vendor_005', vendorId: 'VND005', name: 'Delta Cybernetics India',
    contactPerson: 'Vikram Singhania', email: 'vikram@deltacybernetics.in', phone: '+91 98201 87654',
    address: '56 Ambattur Industrial Estate, Chennai - 600058', registrationNumber: 'U30007TN2012PTC456789',
    gstNumber: '33AABCD7890K1Z4', panNumber: 'AABCD7890K',
    tenderIds: ['tender_001'],
    documents: [],
    bidSubmissionDate: '2026-09-04T09:30:00Z',
    createdAt: ts(8, 0), updatedAt: ts(10, 0),
  },
];

export const initialVendorDocuments: VendorDocument[] = [
  {
    id: 'vdoc_001', vendorId: 'vendor_001', tenderId: 'tender_001',
    documentType: 'GST Certificate', fileName: 'TechServe_GST_Certificate.pdf',
    fileSize: 1.2 * 1024 * 1024, fileType: 'application/pdf', uploadedAt: '2026-09-02T14:30:00Z',
    status: 'ready',
    extractedData: {
      fields: {
        gstin: '33AABCT1234F1Z5', legalName: 'TechServe Solutions Private Limited',
        tradeName: 'TechServe Solutions', dateOfRegistration: '2018-04-15',
        status: 'Active', constitutionOfBusiness: 'Private Limited Company'
      },
      sourcePage: 1, confidence: 0.98, rawText: 'GSTIN: 33AABCT1234F1Z5, Legal Name: TechServe Solutions Private Limited, Status: Active'
    }
  },
  {
    id: 'vdoc_002', vendorId: 'vendor_001', tenderId: 'tender_001',
    documentType: 'PAN Card', fileName: 'TechServe_PAN_Card.pdf',
    fileSize: 0.8 * 1024 * 1024, fileType: 'application/pdf', uploadedAt: '2026-09-02T14:31:00Z',
    status: 'ready',
    extractedData: {
      fields: {
        pan: 'AABCT1234F', name: 'TechServe Solutions Private Limited',
        incorporationDate: '2018-03-20', status: 'Valid'
      },
      sourcePage: 1, confidence: 0.99, rawText: 'Permanent Account Number: AABCT1234F, Name: TechServe Solutions Private Limited'
    }
  },
  {
    id: 'vdoc_003', vendorId: 'vendor_001', tenderId: 'tender_001',
    documentType: 'Financial Statement', fileName: 'TechServe_Audited_Financials_FY23-25.pdf',
    fileSize: 4.5 * 1024 * 1024, fileType: 'application/pdf', uploadedAt: '2026-09-02T14:33:00Z',
    status: 'ready',
    extractedData: {
      fields: {
        turnover_FY23: '14.2 Cr', turnover_FY24: '16.8 Cr', turnover_FY25: '18.5 Cr',
        averageTurnover: '16.5 Cr', netWorth: '8.2 Cr', caName: 'R. Srinivasan & Co', caMemNo: '045678'
      },
      sourcePage: 3, confidence: 0.95, rawText: 'Average annual turnover for past 3 years is Rs 16.50 Crores with positive net worth of Rs 8.2 Crores.'
    }
  }
];

export const initialTenders: Tender[] = [
  {
    id: 'tender_001',
    tenderId: 'TND-2026-0891',
    title: 'Supply and Installation of Enterprise Server Infrastructure and Cloud Storage',
    department: 'Information Technology Division',
    organization: 'Chennai Petroleum Corporation Ltd',
    category: 'IT',
    submissionDeadline: '2026-09-15T17:00:00Z',
    description: 'Procurement of high-performance server clusters, SAN storage arrays, and network edge equipment for modernizing CPCL datacenter operations.',
    status: 'under_evaluation',
    documents: [
      {
        id: 'tdoc_001',
        tenderId: 'tender_001',
        fileName: 'CPCL_IT_Server_Tender_Notice_2026.pdf',
        fileSize: 8.4 * 1024 * 1024,
        fileType: 'application/pdf',
        uploadedAt: '2026-08-15T10:00:00Z',
        status: 'ready'
      },
      {
        id: 'tdoc_002',
        tenderId: 'tender_001',
        fileName: 'Annexure_A_Technical_Specifications.pdf',
        fileSize: 3.1 * 1024 * 1024,
        fileType: 'application/pdf',
        uploadedAt: '2026-08-15T10:05:00Z',
        status: 'ready'
      }
    ],
    requirements: initialRequirements,
    vendors: ['vendor_001', 'vendor_002', 'vendor_003', 'vendor_004', 'vendor_005'],
    createdAt: '2026-08-15T09:30:00Z',
    updatedAt: '2026-09-05T12:00:00Z',
    createdBy: 'Rajesh Kumar (Officer)',
    analyzedAt: '2026-09-05T11:45:00Z',
    isAnalyzed: true
  },
  {
    id: 'tender_002',
    tenderId: 'TND-2026-0842',
    title: 'Modernization of Refinery Control System Hardware & Industrial IoT Sensors',
    department: 'Instrumentation & Process Control',
    organization: 'Chennai Petroleum Corporation Ltd',
    category: 'Infrastructure',
    submissionDeadline: '2026-09-28T18:00:00Z',
    description: 'Upgradation of DCS supervisory controllers, safety instrumented nodes, and smart field transmitter telemetry.',
    status: 'published',
    documents: [],
    requirements: [],
    vendors: ['vendor_001', 'vendor_004'],
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-08-20T11:00:00Z',
    createdBy: 'Rajesh Kumar (Officer)',
    isAnalyzed: false
  },
  {
    id: 'tender_003',
    tenderId: 'TND-2026-0775',
    title: 'Annual Maintenance Contract for Enterprise ERP & Cyber Defense Suites',
    department: 'Digital Systems',
    organization: 'Chennai Petroleum Corporation Ltd',
    category: 'Services',
    submissionDeadline: '2026-08-25T17:00:00Z',
    description: 'L3 support, routine patch validation, automated log SIEM monitoring, and failover disaster drills.',
    status: 'completed',
    documents: [],
    requirements: [],
    vendors: ['vendor_002', 'vendor_003', 'vendor_005'],
    createdAt: '2026-07-10T14:00:00Z',
    updatedAt: '2026-08-30T16:00:00Z',
    createdBy: 'Priya Sharma (Admin)',
    isAnalyzed: true
  }
];

export const initialComplianceResults: ComplianceResult[] = [
  {
    id: 'cr_001', tenderId: 'tender_001', vendorId: 'vendor_001', requirementId: 'R001',
    requirement: initialRequirements[0], status: 'compliant', confidence: 0.98, confidenceLevel: 'high',
    extractedValue: 'GSTIN: 33AABCT1234F1Z5, Active, Reg Date: 15/04/2018',
    expectedValue: 'Active GST registration certificate required',
    explanation: 'GST registration certificate verified with GSTIN 33AABCT1234F1Z5 matching bidder name. Status confirmed active.',
    evidenceDocumentId: 'vdoc_001', evidenceDocumentName: 'TechServe_GST_Certificate.pdf',
    evidencePage: 1, evidenceText: 'Government of India Form GST REG-06: Registration Certificate for 33AABCT1234F1Z5',
    verifiedAt: ts(10, 30), verifiedBy: 'ProcureAI Engine v2.4',
  },
  {
    id: 'cr_002', tenderId: 'tender_001', vendorId: 'vendor_001', requirementId: 'R002',
    requirement: initialRequirements[1], status: 'compliant', confidence: 0.99, confidenceLevel: 'high',
    extractedValue: 'PAN: AABCT1234F, Name: TechServe Solutions Pvt Ltd',
    expectedValue: 'Valid PAN card in the name of the bidding entity',
    explanation: 'PAN AABCT1234F verified successfully. 4th character "C" designates Company status matching incorporation documents.',
    evidenceDocumentId: 'vdoc_002', evidenceDocumentName: 'TechServe_PAN_Card.pdf',
    evidencePage: 1, evidenceText: 'INCOME TAX DEPARTMENT: Permanent Account Number Card AABCT1234F',
    verifiedAt: ts(10, 30), verifiedBy: 'ProcureAI Engine v2.4',
  },
  {
    id: 'cr_003', tenderId: 'tender_001', vendorId: 'vendor_001', requirementId: 'R003',
    requirement: initialRequirements[2], status: 'compliant', confidence: 0.95, confidenceLevel: 'high',
    extractedValue: '₹16.50 Crore average (FY23: ₹14.2Cr, FY24: ₹16.8Cr, FY25: ₹18.5Cr)',
    expectedValue: 'Minimum average annual turnover ≥ ₹10 Crore in last 3 financial years',
    explanation: 'Audited balance sheets show 3-year average turnover of ₹16.50 Cr exceeding the ₹10 Cr requirement by 65%.',
    evidenceDocumentId: 'vdoc_003', evidenceDocumentName: 'TechServe_Audited_Financials_FY23-25.pdf',
    evidencePage: 3, evidenceText: 'Statutory Auditor Certificate: Turnover for FY22-23: 14.20 Cr, FY23-24: 16.80 Cr, FY24-25: 18.50 Cr',
    verifiedAt: ts(10, 30), verifiedBy: 'ProcureAI Engine v2.4',
  },
  {
    id: 'cr_004', tenderId: 'tender_001', vendorId: 'vendor_001', requirementId: 'R004',
    requirement: initialRequirements[3], status: 'compliant', confidence: 0.92, confidenceLevel: 'high',
    extractedValue: '8 years experience (Incorporated 2018)',
    expectedValue: 'Minimum 5 years experience in IT equipment supply',
    explanation: 'Certificate of Incorporation dated 20/03/2018 confirms 8+ years of commercial operations in IT infrastructure.',
    evidenceDocumentName: 'TechServe_Company_Registration.pdf', evidencePage: 1,
    evidenceText: 'Date of Incorporation: Twentieth day of March Two Thousand Eighteen',
    verifiedAt: ts(10, 30), verifiedBy: 'ProcureAI Engine v2.4',
  },
  {
    id: 'cr_005', tenderId: 'tender_001', vendorId: 'vendor_001', requirementId: 'R005',
    requirement: initialRequirements[4], status: 'compliant', confidence: 0.94, confidenceLevel: 'high',
    extractedValue: 'Udyam Reg: UDYAM-TN-02-0045892 (Medium Enterprise)',
    expectedValue: 'Valid MSME/Udyam Registration Certificate (Optional for exemption)',
    explanation: 'Valid Udyam Certificate provided. Eligible for EMD and tender fee exemptions as per MSME procurement policy.',
    evidenceDocumentName: 'TechServe_Udyam_Certificate.pdf', evidencePage: 1,
    evidenceText: 'Ministry of MSME: UDYAM-TN-02-0045892, Enterprise Type: Medium',
    verifiedAt: ts(10, 30), verifiedBy: 'ProcureAI Engine v2.4',
  },
  {
    id: 'cr_006', tenderId: 'tender_001', vendorId: 'vendor_002', requirementId: 'R003',
    requirement: initialRequirements[2], status: 'non_compliant', confidence: 0.96, confidenceLevel: 'high',
    extractedValue: '₹7.80 Crore average (FY23: ₹6.2Cr, FY24: ₹8.1Cr, FY25: ₹9.1Cr)',
    expectedValue: 'Minimum average annual turnover ≥ ₹10 Crore in last 3 financial years',
    explanation: 'Turnover falls short of ₹10 Cr minimum threshold by ₹2.20 Cr (22% deficit). Does not meet mandatory financial criterion.',
    evidenceDocumentName: 'Apex_CA_Turnover_Certificate.pdf', evidencePage: 1,
    evidenceText: 'Average annual turnover is Rs 7.80 Crores for the three preceding financial years.',
    verifiedAt: ts(10, 35), verifiedBy: 'ProcureAI Engine v2.4',
  },
  {
    id: 'cr_007', tenderId: 'tender_001', vendorId: 'vendor_003', requirementId: 'R011',
    requirement: initialRequirements[10], status: 'manual_review', confidence: 0.68, confidenceLevel: 'medium',
    extractedValue: 'Local content self-declared at 48.5% (borderline)',
    expectedValue: 'Minimum 50% local content under Make in India policy',
    explanation: 'Declared local content is 48.5%, slightly below 50% threshold. Requires review of OEM tiered bill of materials.',
    evidenceDocumentName: 'GlobalTech_LocalContent_Declaration.pdf', evidencePage: 2,
    evidenceText: 'Local content calculated at 48.5% based on domestic manufacturing components.',
    verifiedAt: ts(10, 40), verifiedBy: 'ProcureAI Engine v2.4',
  }
];

export const initialRiskAssessments: RiskAssessment[] = [
  {
    id: 'risk_001', tenderId: 'tender_001', vendorId: 'vendor_001',
    overallScore: 12, riskLevel: 'low',
    factors: [
      { id: 'rf_001', description: 'Strong financial health with 16.5Cr avg turnover', severity: 'low', category: 'Financial', impact: 'Positive solvency' },
      { id: 'rf_002', description: 'All statutory certificates verified with clean GST filings', severity: 'low', category: 'Compliance', impact: 'Low regulatory risk' },
    ],
    missingDocuments: [],
    inconsistencies: [],
    calculatedAt: ts(11, 0),
  },
  {
    id: 'risk_002', tenderId: 'tender_001', vendorId: 'vendor_002',
    overallScore: 68, riskLevel: 'high',
    factors: [
      { id: 'rf_003', description: 'Turnover deficit below mandatory tender threshold', severity: 'high', category: 'Financial', impact: 'Financial default risk' },
      { id: 'rf_004', description: 'Name variation between PAN Card and LLP Agreement', severity: 'medium', category: 'Legal', impact: 'Entity ambiguity' },
    ],
    missingDocuments: ['ISO 9001:2015 Certificate'],
    inconsistencies: [
      {
        id: 'inc_001', type: 'name_mismatch', severity: 'medium',
        description: 'Trade name in GST does not match exact LLP Agreement',
        document1: 'GST Certificate (Apex Infra Systems)', document2: 'LLP Agreement (Apex Infra & Systems LLP)',
        value1: 'Apex Infra Systems', value2: 'Apex Infra & Systems LLP', field: 'Entity Name'
      }
    ],
    calculatedAt: ts(11, 5),
  },
  {
    id: 'risk_003', tenderId: 'tender_001', vendorId: 'vendor_003',
    overallScore: 42, riskLevel: 'medium',
    factors: [
      { id: 'rf_005', description: 'Make in India declaration falls below mandatory 50%', severity: 'medium', category: 'Policy', impact: 'Regulatory non-compliance' },
    ],
    missingDocuments: ['EPFO Registration Certificate'],
    inconsistencies: [],
    calculatedAt: ts(11, 10),
  }
];

export const initialAuditEntries: AuditEntry[] = [
  {
    id: 'audit_001', userId: 'user_001', userName: 'Rajesh Kumar',
    action: 'tender_created', timestamp: '2026-08-15T09:30:00Z',
    tenderId: 'tender_001', tenderTitle: 'Supply and Installation of Enterprise Server Infrastructure',
    details: 'Created new tender with 15 mandatory compliance clauses and attached 2 tender specifications.',
  },
  {
    id: 'audit_002', userId: 'user_001', userName: 'Rajesh Kumar',
    action: 'document_uploaded', timestamp: '2026-08-15T10:00:00Z',
    tenderId: 'tender_001', documentName: 'CPCL_IT_Server_Tender_Notice_2026.pdf',
    details: 'Uploaded RFP Document (8.4 MB) - Processed 42 pages for automatic clause extraction.',
  },
  {
    id: 'audit_003', userId: 'user_001', userName: 'Rajesh Kumar',
    action: 'ai_analysis_completed', timestamp: '2026-09-05T11:45:00Z',
    tenderId: 'tender_001',
    details: 'AI Semantic Clause Verification Engine analyzed 5 bidders across 15 tender clauses with 96.4% confidence.',
  },
  {
    id: 'audit_004', userId: 'user_002', userName: 'Priya Sharma',
    action: 'compliance_result_reviewed', timestamp: '2026-09-05T12:15:00Z',
    tenderId: 'tender_001', vendorId: 'vendor_001',
    details: 'Reviewed and confirmed TechServe Solutions Pvt Ltd technical compliance scoring.',
  }
];
