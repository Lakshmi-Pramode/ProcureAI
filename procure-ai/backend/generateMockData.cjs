const fs = require('fs');
const path = require('path');

const ts = (h, m) => {
  const d = new Date('2026-09-05');
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};
const id = (prefix, n) => `${prefix}_${String(n).padStart(3, '0')}`;

const requirements = [
  { id: id('req', 1), tenderId: 'tender_001', requirementId: 'R001', description: 'Valid GST Registration', category: 'Legal', condition: 'Must have active GST registration', mandatory: true, sourcePage: 12, sourceText: 'The bidder must possess a valid GST registration certificate.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 2), tenderId: 'tender_001', requirementId: 'R002', description: 'PAN Card', category: 'Tax', condition: 'Valid PAN required', mandatory: true, sourcePage: 12, sourceText: 'A copy of the PAN card of the bidding entity is mandatory.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 3), tenderId: 'tender_001', requirementId: 'R003', description: 'Minimum Annual Turnover', category: 'Financial', condition: '≥ ₹10 Crore in last 3 financial years', mandatory: true, sourcePage: 18, sourceText: 'The bidder must have an average annual turnover of at least ₹10 Crore.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 4), tenderId: 'tender_001', requirementId: 'R004', description: 'Minimum Experience', category: 'Experience', condition: '≥ 5 years in IT equipment supply', mandatory: true, sourcePage: 21, sourceText: 'Bidder should have at least 5 years of experience in supply of IT equipment.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 5), tenderId: 'tender_001', requirementId: 'R005', description: 'MSME/Udyam Registration', category: 'Eligibility', condition: 'If applicable, valid MSME/Udyam registration', mandatory: false, sourcePage: 24, sourceText: 'MSME registered firms may submit their Udyam Registration certificate.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 6), tenderId: 'tender_001', requirementId: 'R006', description: 'Technical Specification Compliance', category: 'Technical', condition: 'Must meet all technical specifications in Annexure-A', mandatory: true, sourcePage: 28, sourceText: 'The offered equipment must comply with all specifications listed in Annexure-A.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 7), tenderId: 'tender_001', requirementId: 'R007', description: 'Company Registration Certificate', category: 'Legal', condition: 'Must be registered under Companies Act or equivalent', mandatory: true, sourcePage: 13, sourceText: 'Certificate of Incorporation or equivalent registration document is required.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 8), tenderId: 'tender_001', requirementId: 'R008', description: 'Income Tax Returns', category: 'Tax', condition: 'ITR for last 3 financial years', mandatory: true, sourcePage: 19, sourceText: 'Copies of Income Tax Returns for the last three financial years must be submitted.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 9), tenderId: 'tender_001', requirementId: 'R009', description: 'Experience Certificate / Work Orders', category: 'Experience', condition: 'At least 3 similar projects completed', mandatory: true, sourcePage: 22, sourceText: 'Bidder must provide evidence of at least 3 similar completed projects.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 10), tenderId: 'tender_001', requirementId: 'R010', description: 'Declaration of Non-Blacklisting', category: 'Legal', condition: 'Self-declaration on company letterhead', mandatory: true, sourcePage: 30, sourceText: 'The bidder must submit a declaration that they have not been blacklisted by any government agency.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 11), tenderId: 'tender_001', requirementId: 'R011', description: 'Make in India Compliance', category: 'Local Content', condition: 'Minimum 50% local content', mandatory: true, sourcePage: 32, sourceText: 'Equipment must have a minimum of 50% local content as per Make in India policy.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 12), tenderId: 'tender_001', requirementId: 'R012', description: 'ISO Certification', category: 'Certification', condition: 'ISO 9001:2015 or equivalent', mandatory: true, sourcePage: 25, sourceText: 'Bidder must hold a valid ISO 9001:2015 quality management certification.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 13), tenderId: 'tender_001', requirementId: 'R013', description: 'Earnest Money Deposit (EMD)', category: 'Financial', condition: '₹5,00,000 via BG/Online or MSME exemption', mandatory: true, sourcePage: 8, sourceText: 'EMD of ₹5 Lakhs to be submitted. Exemption applies for registered MSMEs.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 14), tenderId: 'tender_001', requirementId: 'R014', description: 'Net Worth Certificate', category: 'Financial', condition: 'Positive net worth certified by CA', mandatory: true, sourcePage: 20, sourceText: 'Net worth certificate from a practicing Chartered Accountant.', createdAt: ts(9, 0), updatedAt: ts(9, 0) },
  { id: id('req', 15), tenderId: 'tender_001', requirementId: 'R015', description: 'EPFO & ESIC Registration', category: 'Social Compliance', condition: 'Active EPFO and ESIC registrations', mandatory: true, sourcePage: 14, sourceText: 'Valid EPFO and ESIC registration certificates are mandatory.', createdAt: ts(9, 0), updatedAt: ts(9, 0) }
];

const vendors = [
  { id: 'vendor_001', vendorId: 'VND001', name: 'TechServe Solutions Pvt Ltd', contactPerson: 'Suresh Menon', email: 'suresh@techservesolutions.com', phone: '+91 98401 23456', address: '42 Anna Salai, Guindy, Chennai - 600032', registrationNumber: 'U72200TN2018PTC123456', gstNumber: '33AABCT1234F1Z5', panNumber: 'AABCT1234F', tenderIds: ['tender_001', 'tender_002'], documents: [], bidSubmissionDate: '2026-09-02T14:30:00Z', createdAt: ts(8, 0), updatedAt: ts(10, 0) },
  { id: 'vendor_002', vendorId: 'VND002', name: 'Apex Infra & Systems LLP', contactPerson: 'Kavita Reddy', email: 'kavita@apexinfra.in', phone: '+91 98840 67890', address: '15 OMR Road, Thoraipakkam, Chennai - 600097', registrationNumber: 'AAL-4567', gstNumber: '33AABCA5678G1Z2', panNumber: 'AABCA5678G', tenderIds: ['tender_001', 'tender_003'], documents: [], bidSubmissionDate: '2026-09-03T11:15:00Z', createdAt: ts(8, 0), updatedAt: ts(10, 0) },
  { id: 'vendor_003', vendorId: 'VND003', name: 'Global Tech Enterprises', contactPerson: 'Arun Kumar', email: 'arun@globaltechenterprises.com', phone: '+91 97102 34567', address: '88 Mount Road, Teynampet, Chennai - 600018', registrationNumber: 'U72900TN2020PTC234567', gstNumber: '33AABCG9012H1Z8', panNumber: 'AABCG9012H', tenderIds: ['tender_001', 'tender_003'], documents: [], bidSubmissionDate: '2026-09-04T16:45:00Z', createdAt: ts(8, 0), updatedAt: ts(10, 0) },
  { id: 'vendor_004', vendorId: 'VND004', name: 'Bharat Digital Networks', contactPerson: 'Deepa Krishnan', email: 'deepa@bharatdigital.co.in', phone: '+91 94440 12345', address: '23 Nelson Manickam Road, Chennai - 600029', registrationNumber: 'U74999TN2015PTC345678', gstNumber: '33AABCB3456J1Z1', panNumber: 'AABCB3456J', tenderIds: ['tender_001', 'tender_002'], documents: [], bidSubmissionDate: '2026-09-01T10:00:00Z', createdAt: ts(8, 0), updatedAt: ts(10, 0) },
  { id: 'vendor_005', vendorId: 'VND005', name: 'Delta Cybernetics India', contactPerson: 'Vikram Singhania', email: 'vikram@deltacybernetics.in', phone: '+91 98201 87654', address: '56 Ambattur Industrial Estate, Chennai - 600058', registrationNumber: 'U30007TN2012PTC456789', gstNumber: '33AABCD7890K1Z4', panNumber: 'AABCD7890K', tenderIds: ['tender_001', 'tender_003'], documents: [], bidSubmissionDate: '2026-09-04T09:30:00Z', createdAt: ts(8, 0), updatedAt: ts(10, 0) }
];

let docIdCounter = 1;
let crIdCounter = 1;
let raIdCounter = 1;
const docs = [];
const crs = [];
const ras = [];

const complianceLogic = {
  'vendor_001': { profile: 'compliant' },
  'vendor_002': { profile: 'non_compliant_financial', failReqs: ['req_003', 'req_014'] },
  'vendor_003': { profile: 'manual_review', failReqs: [], reviewReqs: ['req_011', 'req_006'] },
  'vendor_004': { profile: 'missing_docs', failReqs: ['req_012', 'req_015'] },
  'vendor_005': { profile: 'mixed', reviewReqs: ['req_009'] }
};

for (const vendor of vendors) {
  // Generate docs
  docs.push({ id: `vdoc_${docIdCounter++}`, vendorId: vendor.id, tenderId: 'tender_001', documentType: 'GST Certificate', fileName: `${vendor.name.split(' ')[0]}_GST.pdf`, fileSize: 1.2 * 1024 * 1024, fileType: 'application/pdf', uploadedAt: vendor.bidSubmissionDate, status: 'ready' });
  docs.push({ id: `vdoc_${docIdCounter++}`, vendorId: vendor.id, tenderId: 'tender_001', documentType: 'PAN Card', fileName: `${vendor.name.split(' ')[0]}_PAN.pdf`, fileSize: 0.8 * 1024 * 1024, fileType: 'application/pdf', uploadedAt: vendor.bidSubmissionDate, status: 'ready' });
  docs.push({ id: `vdoc_${docIdCounter++}`, vendorId: vendor.id, tenderId: 'tender_001', documentType: 'Financial Statement', fileName: `${vendor.name.split(' ')[0]}_Financials.pdf`, fileSize: 4.5 * 1024 * 1024, fileType: 'application/pdf', uploadedAt: vendor.bidSubmissionDate, status: 'ready' });
  docs.push({ id: `vdoc_${docIdCounter++}`, vendorId: vendor.id, tenderId: 'tender_001', documentType: 'Experience Certificate', fileName: `${vendor.name.split(' ')[0]}_Experience.pdf`, fileSize: 2.1 * 1024 * 1024, fileType: 'application/pdf', uploadedAt: vendor.bidSubmissionDate, status: 'ready' });
  
  const logic = complianceLogic[vendor.id];
  let failedCount = 0;
  
  for (const req of requirements) {
    let status = 'compliant';
    let confidence = 0.95 + (Math.random() * 0.04);
    let expectedValue = req.condition;
    let extractedValue = 'Found satisfactory evidence in submitted documents.';
    let explanation = 'Verified successfully by AI Engine.';
    
    if (logic.failReqs && logic.failReqs.includes(req.id)) {
      status = 'non_compliant';
      confidence = 0.90 + (Math.random() * 0.08);
      extractedValue = 'Did not meet requirements or document missing.';
      explanation = 'Automated check failed due to insufficient criteria.';
      failedCount++;
    } else if (logic.reviewReqs && logic.reviewReqs.includes(req.id)) {
      status = 'manual_review';
      confidence = 0.60 + (Math.random() * 0.15);
      extractedValue = 'Ambiguous or borderline value found.';
      explanation = 'AI confidence below threshold. Requires human review.';
    }

    crs.push({
      id: `cr_${crIdCounter++}`,
      tenderId: 'tender_001',
      vendorId: vendor.id,
      requirementId: req.requirementId,
      status: status,
      confidence: parseFloat(confidence.toFixed(2)),
      confidenceLevel: confidence > 0.8 ? 'high' : (confidence > 0.6 ? 'medium' : 'low'),
      extractedValue: extractedValue,
      expectedValue: expectedValue,
      explanation: explanation,
      evidenceDocumentName: `${vendor.name.split(' ')[0]}_Doc.pdf`,
      evidencePage: Math.floor(Math.random() * 10) + 1,
      evidenceText: `Extract showing ${status} result for ${req.category}.`,
      verifiedAt: ts(10, 30 + Math.floor(Math.random()*15)),
      verifiedBy: 'ProcureAI Engine v2.4'
    });
  }

  // Risk Assessment
  let overallScore = 10;
  let riskLevel = 'low';
  if (failedCount > 0) {
    overallScore = 80;
    riskLevel = 'high';
  } else if (logic.reviewReqs && logic.reviewReqs.length > 0) {
    overallScore = 45;
    riskLevel = 'medium';
  }

  ras.push({
    id: `risk_${raIdCounter++}`,
    tenderId: 'tender_001',
    vendorId: vendor.id,
    overallScore,
    riskLevel,
    factors: [
      { id: `rf_${vendor.id}_1`, description: `System generated risk profile based on compliance matrix`, severity: riskLevel, category: 'AI Assessment', impact: 'Impacts final selection' }
    ],
    missingDocuments: logic.profile === 'missing_docs' ? ['ISO Certification'] : [],
    inconsistencies: [],
    calculatedAt: ts(11, 0)
  });
}

// Write the template output
const output = `
import type {
  Tender, Requirement, Vendor, VendorDocument, ComplianceResult,
  RiskAssessment, AuditEntry, User
} from '../types/index.js';

const ts = (h: number, m: number) => {
  const d = new Date('2026-09-05');
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const initialUsers: User[] = [
  { id: 'user_001', name: 'Rajesh Kumar', email: 'rajesh.kumar@procurement.gov.in', role: 'officer', organization: 'Chennai Petroleum Corporation Ltd', password: 'password123' },
  { id: 'user_002', name: 'Priya Sharma', email: 'priya.sharma@procurement.gov.in', role: 'admin', organization: 'Chennai Petroleum Corporation Ltd', password: 'password123' }
];

export const initialRequirements: Requirement[] = ${JSON.stringify(requirements, null, 2)};
export const initialVendors: Vendor[] = ${JSON.stringify(vendors, null, 2)};
export const initialVendorDocuments: VendorDocument[] = ${JSON.stringify(docs, null, 2)};

export const initialTenders: Tender[] = [
  {
    id: 'tender_001',
    tenderId: 'TND-2026-0891',
    title: 'Supply and Installation of Enterprise Server Infrastructure',
    department: 'Information Technology Division',
    organization: 'Chennai Petroleum Corporation Ltd',
    category: 'IT',
    submissionDeadline: '2026-09-15T17:00:00Z',
    description: 'Procurement of high-performance server clusters.',
    status: 'under_evaluation',
    documents: [],
    requirements: initialRequirements,
    vendors: ['vendor_001', 'vendor_002', 'vendor_003', 'vendor_004', 'vendor_005'],
    createdAt: '2026-08-15T09:30:00Z',
    updatedAt: '2026-09-05T12:00:00Z',
    createdBy: 'Rajesh Kumar',
    analyzedAt: '2026-09-05T11:45:00Z',
    isAnalyzed: true
  },
  {
    id: 'tender_002',
    tenderId: 'TND-2026-0842',
    title: 'Modernization of Refinery Control System Hardware',
    department: 'Instrumentation',
    organization: 'Chennai Petroleum Corporation Ltd',
    category: 'Infrastructure',
    submissionDeadline: '2026-09-28T18:00:00Z',
    description: 'Upgradation of DCS supervisory controllers.',
    status: 'published',
    documents: [],
    requirements: [],
    vendors: ['vendor_001', 'vendor_004'],
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-08-20T11:00:00Z',
    createdBy: 'Rajesh Kumar',
    isAnalyzed: false
  }
];

export const initialComplianceResults: ComplianceResult[] = ${JSON.stringify(crs, null, 2)};
export const initialRiskAssessments: RiskAssessment[] = ${JSON.stringify(ras, null, 2)};

export const initialAuditEntries: AuditEntry[] = [
  {
    id: 'audit_001', userId: 'user_001', userName: 'Rajesh Kumar',
    action: 'ai_analysis_completed', timestamp: '2026-09-05T11:45:00Z',
    tenderId: 'tender_001',
    details: 'AI Semantic Clause Verification Engine analyzed 5 bidders across 15 tender clauses with high confidence.'
  }
];
`;

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'initialData.ts'), output);
console.log('Successfully generated complete mock data!');
