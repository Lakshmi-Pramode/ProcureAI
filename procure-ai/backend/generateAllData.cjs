// ============================================================
// ProcureAI — Complete Data Generator
// Generates full realistic data for 3 tenders + 5 bidders
// Run: node generateAllData.cjs
// ============================================================
const fs = require('fs');
const path = require('path');

// ─── TENDERS ───────────────────────────────────────────────
const tenders = [
  {
    id: 'tender_001',
    tenderId: 'CPCL/IT/2026/001',
    title: 'Supply, Installation & Commissioning of High-Performance Computing Infrastructure',
    department: 'Information Technology',
    organization: 'Chennai Petroleum Corporation Ltd',
    category: 'IT',
    submissionDeadline: '2026-09-20T17:00:00Z',
    description: 'Procurement of 150 workstations, 12 rack servers, NAS storage (500TB), 10GbE core switching, and 3-year AMC with 4-hour SLA.',
    status: 'under_evaluation',
    vendors: ['vendor_001','vendor_002','vendor_003','vendor_004','vendor_005'],
    createdAt: '2026-08-01T10:00:00Z', updatedAt: '2026-09-05T10:00:00Z',
    createdBy: 'Rajesh Kumar', isAnalyzed: true,
    documents: [], requirements: []
  },
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
    vendors: ['vendor_001','vendor_003','vendor_004'],
    createdAt: '2026-08-10T09:00:00Z', updatedAt: '2026-09-06T09:00:00Z',
    createdBy: 'Priya Sharma (Admin)', isAnalyzed: false,
    documents: [], requirements: []
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
    status: 'completed',
    vendors: ['vendor_002','vendor_003','vendor_005'],
    createdAt: '2026-07-10T14:00:00Z', updatedAt: '2026-08-30T16:00:00Z',
    createdBy: 'Priya Sharma (Admin)', isAnalyzed: true,
    documents: [], requirements: []
  }
];

// ─── REQUIREMENTS ──────────────────────────────────────────
const reqTs = '2026-09-05T03:30:00.000Z';

const requirements = [
  // Tender 001 - IT Hardware (15 requirements)
  { id: 'req_001', tenderId: 'tender_001', requirementId: 'R001', description: 'Valid GST Registration', category: 'Legal', condition: 'Must have active GSTIN registration', mandatory: true, sourcePage: 12, sourceText: 'The bidder must possess a valid GST registration certificate from the relevant tax authorities.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_002', tenderId: 'tender_001', requirementId: 'R002', description: 'PAN Card', category: 'Tax', condition: 'Valid PAN card in entity name', mandatory: true, sourcePage: 12, sourceText: 'A copy of the PAN card of the bidding entity is mandatory.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_003', tenderId: 'tender_001', requirementId: 'R003', description: 'Minimum Annual Turnover', category: 'Financial', condition: '≥ ₹10 Crore average in last 3 financial years', mandatory: true, sourcePage: 18, sourceText: 'The bidder must have an average annual turnover of at least ₹10 Crore.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_004', tenderId: 'tender_001', requirementId: 'R004', description: 'Minimum Experience', category: 'Experience', condition: '≥ 5 years in IT equipment supply to government/PSU', mandatory: true, sourcePage: 21, sourceText: 'Bidder should have at least 5 years of experience in IT equipment supply.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_005', tenderId: 'tender_001', requirementId: 'R005', description: 'MSME/Udyam Registration', category: 'Eligibility', condition: 'If applicable, valid MSME/Udyam registration', mandatory: false, sourcePage: 24, sourceText: 'MSME registered firms may submit their Udyam Registration certificate.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_006', tenderId: 'tender_001', requirementId: 'R006', description: 'Technical Specification Compliance', category: 'Technical', condition: 'Must meet all specs in Annexure-A including BIS certification', mandatory: true, sourcePage: 28, sourceText: 'The offered equipment must comply with all specifications listed in Annexure-A.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_007', tenderId: 'tender_001', requirementId: 'R007', description: 'Certificate of Incorporation', category: 'Legal', condition: 'Must be registered under Companies Act 2013 or LLP Act', mandatory: true, sourcePage: 13, sourceText: 'Certificate of Incorporation or equivalent registration document is required.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_008', tenderId: 'tender_001', requirementId: 'R008', description: 'Income Tax Returns', category: 'Tax', condition: 'ITR filed for last 3 financial years (FY23, FY24, FY25)', mandatory: true, sourcePage: 19, sourceText: 'Copies of Income Tax Returns for the last three financial years must be submitted.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_009', tenderId: 'tender_001', requirementId: 'R009', description: 'Similar Project Experience', category: 'Experience', condition: 'At least 3 similar IT infrastructure projects completed for PSU/Govt.', mandatory: true, sourcePage: 22, sourceText: 'Bidder must provide evidence of at least 3 similar completed projects.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_010', tenderId: 'tender_001', requirementId: 'R010', description: 'Non-Blacklisting Declaration', category: 'Legal', condition: 'Self-declaration on company letterhead that entity is not blacklisted', mandatory: true, sourcePage: 30, sourceText: 'The bidder must submit a declaration that they have not been blacklisted by any government agency.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_011', tenderId: 'tender_001', requirementId: 'R011', description: 'Make in India Compliance', category: 'Local Content', condition: 'Minimum 50% local content as per DPIIT Order 2017', mandatory: true, sourcePage: 32, sourceText: 'Equipment must have a minimum of 50% local content as per Make in India policy.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_012', tenderId: 'tender_001', requirementId: 'R012', description: 'ISO 9001:2015 Certification', category: 'Certification', condition: 'ISO 9001:2015 or equivalent quality management certification', mandatory: true, sourcePage: 25, sourceText: 'Bidder must hold a valid ISO 9001:2015 quality management certification.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_013', tenderId: 'tender_001', requirementId: 'R013', description: 'Earnest Money Deposit (EMD)', category: 'Financial', condition: '₹5,00,000 via BG/Online or MSME exemption letter', mandatory: true, sourcePage: 8, sourceText: 'EMD of ₹5 Lakhs to be submitted. Exemption applies for registered MSMEs.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_014', tenderId: 'tender_001', requirementId: 'R014', description: 'Net Worth Certificate', category: 'Financial', condition: 'Positive net worth certified by practicing CA', mandatory: true, sourcePage: 20, sourceText: 'Net worth certificate from a practicing Chartered Accountant.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_015', tenderId: 'tender_001', requirementId: 'R015', description: 'EPFO & ESIC Registration', category: 'Social Compliance', condition: 'Active EPFO and ESIC registrations with at least 10 employees', mandatory: true, sourcePage: 14, sourceText: 'Valid EPFO and ESIC registration certificates are mandatory.', createdAt: reqTs, updatedAt: reqTs },

  // Tender 002 - Safety Systems (10 requirements)
  { id: 'req_101', tenderId: 'tender_002', requirementId: 'S001', description: 'GST Registration', category: 'Legal', condition: 'Must have active GSTIN registration', mandatory: true, sourcePage: 5, sourceText: 'Bidder must hold a valid GST certificate from GSTN portal.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_102', tenderId: 'tender_002', requirementId: 'S002', description: 'PAN Card', category: 'Tax', condition: 'Valid PAN card in entity name', mandatory: true, sourcePage: 5, sourceText: 'Self-attested PAN copy is mandatory for income tax verification.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_103', tenderId: 'tender_002', requirementId: 'S003', description: 'Minimum Turnover', category: 'Financial', condition: '≥ ₹8 Crore in last 2 financial years', mandatory: true, sourcePage: 9, sourceText: 'Annual turnover of at least ₹8 Crore for each of the last 2 years.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_104', tenderId: 'tender_002', requirementId: 'S004', description: 'Safety Equipment Experience', category: 'Experience', condition: '≥ 3 years in industrial safety/fire detection systems', mandatory: true, sourcePage: 11, sourceText: 'Bidder must have 3+ years experience in industrial safety equipment supply.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_105', tenderId: 'tender_002', requirementId: 'S005', description: 'BIS / UL Certification for Equipment', category: 'Certification', condition: 'BIS certification (IS 2189) or UL listed for all detectors', mandatory: true, sourcePage: 15, sourceText: 'All smoke and heat detectors must carry BIS (IS 2189) or UL listing mark.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_106', tenderId: 'tender_002', requirementId: 'S006', description: 'Factory / Authorized Dealer Certificate', category: 'Eligibility', condition: 'Must be OEM or authorized dealer with valid MAF', mandatory: true, sourcePage: 16, sourceText: 'Original Equipment Manufacturer or authorized dealer with Manufacturer Authorization Form.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_107', tenderId: 'tender_002', requirementId: 'S007', description: 'Certificate of Incorporation', category: 'Legal', condition: 'Registered under Companies Act 2013 or equivalent', mandatory: true, sourcePage: 6, sourceText: 'Certificate of Incorporation from RoC/equivalent authority.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_108', tenderId: 'tender_002', requirementId: 'S008', description: 'Net Worth Positive', category: 'Financial', condition: 'Positive net worth as of last audited balance sheet', mandatory: true, sourcePage: 10, sourceText: 'The bidder must have a positive net worth as evidenced by audited accounts.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_109', tenderId: 'tender_002', requirementId: 'S009', description: 'Non-Blacklisting Declaration', category: 'Legal', condition: 'Declaration that firm is not blacklisted by any government body', mandatory: true, sourcePage: 18, sourceText: 'Self-declaration of not being blacklisted by any government/regulatory body.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_110', tenderId: 'tender_002', requirementId: 'S010', description: 'EPFO & ESIC Compliance', category: 'Social Compliance', condition: 'Active EPFO/ESIC registration', mandatory: true, sourcePage: 7, sourceText: 'Proof of EPFO and ESIC registration must be submitted.', createdAt: reqTs, updatedAt: reqTs },

  // Tender 003 - ERP AMC (10 requirements)
  { id: 'req_201', tenderId: 'tender_003', requirementId: 'E001', description: 'GST Registration', category: 'Legal', condition: 'Must have active GSTIN registration', mandatory: true, sourcePage: 4, sourceText: 'Valid GST registration certificate from the relevant tax authority.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_202', tenderId: 'tender_003', requirementId: 'E002', description: 'PAN Card', category: 'Tax', condition: 'Valid PAN card in entity name', mandatory: true, sourcePage: 4, sourceText: 'PAN of the bidding firm must be submitted.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_203', tenderId: 'tender_003', requirementId: 'E003', description: 'Annual Turnover', category: 'Financial', condition: '≥ ₹15 Crore in last 3 years (IT/ITES services)', mandatory: true, sourcePage: 7, sourceText: 'For ERP AMC services, bidder turnover in IT/ITES must exceed ₹15 Crore annually.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_204', tenderId: 'tender_003', requirementId: 'E004', description: 'SAP Certified Partner', category: 'Certification', condition: 'Must be SAP Certified Partner or hold SAP BASIS/ABAP certifications', mandatory: true, sourcePage: 10, sourceText: 'Bidder must be a certified SAP Partner or demonstrate certified SAP resources.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_205', tenderId: 'tender_003', requirementId: 'E005', description: 'Cybersecurity Experience', category: 'Experience', condition: '≥ 3 years providing SIEM/SOC services to PSU or BFSI', mandatory: true, sourcePage: 12, sourceText: 'Demonstrated experience in SIEM monitoring and SOC operations for large enterprises.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_206', tenderId: 'tender_003', requirementId: 'E006', description: 'ISO 27001 Certification', category: 'Certification', condition: 'Valid ISO 27001:2022 information security certification', mandatory: true, sourcePage: 11, sourceText: 'Bidder must hold valid ISO 27001 certification for information security management.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_207', tenderId: 'tender_003', requirementId: 'E007', description: 'Certified Security Professionals', category: 'Technical', condition: 'At least 2 CISSP or CEH certified engineers on payroll', mandatory: true, sourcePage: 14, sourceText: 'Must have minimum 2 certified information security professionals (CISSP/CEH).', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_208', tenderId: 'tender_003', requirementId: 'E008', description: 'Net Worth Certificate', category: 'Financial', condition: 'Positive net worth certified by CA', mandatory: true, sourcePage: 8, sourceText: 'Net worth certificate from a Chartered Accountant must be submitted.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_209', tenderId: 'tender_003', requirementId: 'E009', description: 'Non-Blacklisting Declaration', category: 'Legal', condition: 'Self-declaration of non-blacklisting on company letterhead', mandatory: true, sourcePage: 16, sourceText: 'Signed declaration that firm is not debarred by any government body.', createdAt: reqTs, updatedAt: reqTs },
  { id: 'req_210', tenderId: 'tender_003', requirementId: 'E010', description: 'Data Residency Compliance', category: 'Social Compliance', condition: 'All customer data must be stored in India (MeitY guidelines)', mandatory: true, sourcePage: 17, sourceText: 'Bidder must ensure all data is stored in India as per MeitY data localization guidelines.', createdAt: reqTs, updatedAt: reqTs },
];

// ─── VENDORS ───────────────────────────────────────────────
const vendors = [
  {
    id: 'vendor_001', vendorId: 'VND001',
    name: 'TechServe Solutions India Pvt Ltd',
    contactPerson: 'Suresh Menon',
    email: 'suresh@techservesolutions.com',
    phone: '+91 98401 23456',
    address: '42 Anna Salai, Guindy, Chennai - 600032',
    registrationNumber: 'U72200TN2018PTC123456',
    gstNumber: '29AACTS1234F1Z5',
    panNumber: 'AACTS1234F',
    tenderIds: ['tender_001', 'tender_002'],
    documents: [],
    bidSubmissionDate: '2026-09-02T14:30:00Z',
    createdAt: '2026-09-01T10:00:00Z', updatedAt: '2026-09-05T10:00:00Z'
  },
  {
    id: 'vendor_002', vendorId: 'VND002',
    name: 'Bharat Digital Systems Ltd',
    contactPerson: 'Kavita Reddy',
    email: 'kavita@bharatdigital.in',
    phone: '+91 98840 67890',
    address: '15 OMR Road, Thoraipakkam, Chennai - 600097',
    registrationNumber: 'U72900TN2015PTC234567',
    gstNumber: '27AABBD5678G1Z3',
    panNumber: 'AABBD5678G',
    tenderIds: ['tender_001', 'tender_003'],
    documents: [],
    bidSubmissionDate: '2026-09-03T11:15:00Z',
    createdAt: '2026-09-01T10:00:00Z', updatedAt: '2026-09-05T10:00:00Z'
  },
  {
    id: 'vendor_003', vendorId: 'VND003',
    name: 'CloudMatrix Technologies Pvt Ltd',
    contactPerson: 'Arun Kumar',
    email: 'arun@cloudmatrix.tech',
    phone: '+91 97102 34567',
    address: '88 Mount Road, Teynampet, Chennai - 600018',
    registrationNumber: 'U72900TN2020PTC345678',
    gstNumber: '33AAACM9012H1Z1',
    panNumber: 'AAACM9012H',
    tenderIds: ['tender_001', 'tender_002', 'tender_003'],
    documents: [],
    bidSubmissionDate: '2026-09-04T16:45:00Z',
    createdAt: '2026-09-01T10:00:00Z', updatedAt: '2026-09-05T10:00:00Z'
  },
  {
    id: 'vendor_004', vendorId: 'VND004',
    name: 'Nova Infotech Pvt Ltd',
    contactPerson: 'Deepa Krishnan',
    email: 'deepa@novainfotech.co.in',
    phone: '+91 94440 12345',
    address: '23 Nelson Manickam Road, Chennai - 600029',
    registrationNumber: 'U74999TN2020PTC456789',
    gstNumber: '09AAANI3456J1Z8',
    panNumber: 'AAANI3456J',
    tenderIds: ['tender_001', 'tender_002'],
    documents: [],
    bidSubmissionDate: '2026-09-01T10:00:00Z',
    createdAt: '2026-09-01T10:00:00Z', updatedAt: '2026-09-05T10:00:00Z'
  },
  {
    id: 'vendor_005', vendorId: 'VND005',
    name: 'InfraGlobe Engineering Solutions',
    contactPerson: 'Vikram Singhania',
    email: 'vikram@infraglobe.in',
    phone: '+91 98201 87654',
    address: '56 Ambattur Industrial Estate, Chennai - 600058',
    registrationNumber: 'U30007TN2012PTC567890',
    gstNumber: '08AAAII7890K1Z6',
    panNumber: 'AAAII7890K',
    tenderIds: ['tender_001', 'tender_003'],
    documents: [],
    bidSubmissionDate: '2026-09-04T09:30:00Z',
    createdAt: '2026-09-01T10:00:00Z', updatedAt: '2026-09-05T10:00:00Z'
  }
];

// ─── DOCUMENT FIELD DATA ────────────────────────────────────
// Each vendor has different compliance profiles:
// vendor_001: Strong (all compliant, 18.5 Cr turnover)
// vendor_002: Medium risk (7.2 Cr < 10 Cr for tender_001, but 22 Cr for tender_003)
// vendor_003: Best (22.1 Cr, ISO 27001, SAP certified)
// vendor_004: High risk (4.1 Cr, low turnover fails most tenders)
// vendor_005: Strong (31.4 Cr, infrastructure specialist)

const vendorDocFields = {
  vendor_001: {
    gst: { gstin: '29AACTS1234F1Z5', legalName: 'TechServe Solutions India Pvt Ltd', status: 'Active', registrationDate: '2018-04-01', returnFiled: 'GSTR-3B filed up to Aug 2026' },
    pan: { pan: 'AACTS1234F', name: 'TechServe Solutions India Pvt Ltd', status: 'Active', category: 'Company' },
    fin: { averageTurnover: '18.5', netWorth: '9.2', caName: 'R.K. Sharma & Co, Chennai', status: 'Audited', itrFiled: 'FY23, FY24, FY25', emdSubmitted: 'BG No. 2024/ICICI/8821' },
    exp: { clientName: 'BHEL Ltd, Tiruchirappalli', projectValue: '12.5', completionDate: '2024-03-31', yearsExp: '8', projectCount: '6', isoNo: 'ISO9001-TN-2023-001' },
  },
  vendor_002: {
    gst: { gstin: '27AABBD5678G1Z3', legalName: 'Bharat Digital Systems Ltd', status: 'Active', registrationDate: '2015-07-15', returnFiled: 'GSTR-3B filed up to Jul 2026' },
    pan: { pan: 'AABBD5678G', name: 'Bharat Digital Systems Ltd', status: 'Active', category: 'Company' },
    fin: { averageTurnover: '7.2', netWorth: '3.1', caName: 'P.L. Gupta & Associates, Mumbai', status: 'Audited', itrFiled: 'FY23, FY24, FY25', emdSubmitted: 'DD/Pay Order' },
    exp: { clientName: 'ONGC Mumbai', projectValue: '5.8', completionDate: '2024-01-15', yearsExp: '4', projectCount: '3', isoNo: '' },
  },
  vendor_003: {
    gst: { gstin: '33AAACM9012H1Z1', legalName: 'CloudMatrix Technologies Pvt Ltd', status: 'Active', registrationDate: '2020-01-10', returnFiled: 'GSTR-3B filed up to Aug 2026' },
    pan: { pan: 'AAACM9012H', name: 'CloudMatrix Technologies Pvt Ltd', status: 'Active', category: 'Company' },
    fin: { averageTurnover: '22.1', netWorth: '14.7', caName: 'Mehta & Partners CA, Chennai', status: 'Audited', itrFiled: 'FY23, FY24, FY25', emdSubmitted: 'BG No. 2025/HDFC/3311' },
    exp: { clientName: 'ISRO Satellite Centre, Bengaluru', projectValue: '19.3', completionDate: '2025-02-28', yearsExp: '6', projectCount: '5', isoNo: 'ISO27001-KA-2024-009', sapCertified: 'SAP Gold Partner ID: IN-SAP-2024-CM03', cissp: '2 CISSP certified engineers on payroll' },
  },
  vendor_004: {
    gst: { gstin: '09AAANI3456J1Z8', legalName: 'Nova Infotech Pvt Ltd', status: 'Active', registrationDate: '2020-03-22', returnFiled: 'GSTR-3B filed up to Jun 2026 (gap noted)' },
    pan: { pan: 'AAANI3456J', name: 'Nova Infotech Pvt Ltd', status: 'Active', category: 'Company' },
    fin: { averageTurnover: '4.1', netWorth: '1.8', caName: 'S.V. Iyer & Co, Chennai', status: 'Audited', itrFiled: 'FY24, FY25 only (FY23 missing)', emdSubmitted: 'MSME Exemption (claimed, certificate pending verification)' },
    exp: { clientName: 'State Bank of India, LHO Chennai', projectValue: '3.2', completionDate: '2023-11-30', yearsExp: '2', projectCount: '2', isoNo: '' },
  },
  vendor_005: {
    gst: { gstin: '08AAAII7890K1Z6', legalName: 'InfraGlobe Engineering Solutions', status: 'Active', registrationDate: '2012-09-01', returnFiled: 'GSTR-3B filed up to Aug 2026' },
    pan: { pan: 'AAAII7890K', name: 'InfraGlobe Engineering Solutions', status: 'Active', category: 'LLP' },
    fin: { averageTurnover: '31.4', netWorth: '19.5', caName: 'Kapoor & Associates, Delhi', status: 'Audited', itrFiled: 'FY23, FY24, FY25', emdSubmitted: 'BG No. 2025/SBI/7741' },
    exp: { clientName: 'NTPC Limited, Korba', projectValue: '28.7', completionDate: '2025-04-15', yearsExp: '12', projectCount: '9', isoNo: 'ISO9001-DL-2025-007', sapCertified: 'SAP Silver Partner ID: IN-SAP-2023-IG05' },
  },
};

// ─── BUILD VENDOR DOCUMENTS ────────────────────────────────
let docIdCounter = 1;
const allDocs = [];

// For each vendor, generate documents for each tender they applied to
for (const vendor of vendors) {
  for (const tenderId of vendor.tenderIds) {
    const fields = vendorDocFields[vendor.id];
    const uploadDate = vendor.bidSubmissionDate;

    const docDefs = [
      {
        documentType: 'GST Certificate',
        fileName: `${vendor.id}_${tenderId}_GST.pdf`,
        extractedFields: fields.gst,
      },
      {
        documentType: 'PAN Card',
        fileName: `${vendor.id}_${tenderId}_PAN.pdf`,
        extractedFields: fields.pan,
      },
      {
        documentType: 'Financial Statement',
        fileName: `${vendor.id}_${tenderId}_FinancialStatement.pdf`,
        extractedFields: fields.fin,
      },
      {
        documentType: 'Experience Certificate',
        fileName: `${vendor.id}_${tenderId}_ExperienceCert.pdf`,
        extractedFields: fields.exp,
      },
    ];

    for (const def of docDefs) {
      allDocs.push({
        id: `vdoc_${docIdCounter++}`,
        vendorId: vendor.id,
        tenderId,
        documentType: def.documentType,
        fileName: def.fileName,
        fileSize: Math.floor(Math.random() * 1500000) + 500000,
        fileType: 'application/pdf',
        uploadedAt: uploadDate,
        status: 'ready',
        extractedData: {
          fields: def.extractedFields,
          rawText: '',
          sourcePage: 1,
          confidence: 0.95
        }
      });
    }
  }
}

// ─── BUILD COMPLIANCE RESULTS ───────────────────────────────
// Generate deterministic compliance results based on vendor data
const allComplianceResults = [];
let crCounter = 1;

// Compliance logic per vendor for tender_001 (15 reqs, min 10Cr turnover)
const t1Results = {
  vendor_001: { pass: ['req_001','req_002','req_003','req_004','req_006','req_007','req_008','req_009','req_010','req_011','req_012','req_013','req_014','req_015'], review: ['req_005'], fail: [] },
  vendor_002: { pass: ['req_001','req_002','req_007','req_008','req_010'], review: ['req_004','req_005','req_006'], fail: ['req_003','req_009','req_011','req_012','req_013','req_014','req_015'] },
  vendor_003: { pass: ['req_001','req_002','req_003','req_004','req_006','req_007','req_008','req_009','req_010','req_011','req_012','req_013','req_014','req_015'], review: ['req_005'], fail: [] },
  vendor_004: { pass: ['req_001','req_002','req_007'], review: ['req_005','req_006'], fail: ['req_003','req_004','req_008','req_009','req_010','req_011','req_012','req_013','req_014','req_015'] },
  vendor_005: { pass: ['req_001','req_002','req_003','req_004','req_006','req_007','req_008','req_009','req_010','req_011','req_012','req_013','req_014','req_015'], review: ['req_005'], fail: [] },
};

// Compliance logic for tender_002 (10 reqs, min 8Cr turnover)
const t2Results = {
  vendor_001: { pass: ['req_101','req_102','req_103','req_104','req_105','req_106','req_107','req_108','req_109','req_110'], review: [], fail: [] },
  vendor_003: { pass: ['req_101','req_102','req_103','req_107','req_108','req_109','req_110'], review: ['req_105','req_106'], fail: ['req_104'] },
  vendor_004: { pass: ['req_101','req_102','req_107'], review: ['req_105','req_106'], fail: ['req_103','req_104','req_108','req_109','req_110'] },
};

// Compliance logic for tender_003 (10 reqs, min 15Cr IT services)
const t3Results = {
  vendor_002: { pass: ['req_201','req_202','req_208','req_209'], review: ['req_204','req_205','req_207'], fail: ['req_203','req_206','req_210'] },
  vendor_003: { pass: ['req_201','req_202','req_203','req_204','req_205','req_206','req_207','req_208','req_209','req_210'], review: [], fail: [] },
  vendor_005: { pass: ['req_201','req_202','req_203','req_208','req_209','req_210'], review: ['req_204','req_207'], fail: ['req_205','req_206'] },
};

const makeResult = (tenderId, vendorId, reqId, status) => {
  const verdicts = {
    compliant: { confidence: Math.floor(Math.random() * 10) + 88, confidenceLevel: 'high', extractedValue: 'Document verified and meets requirement', explanation: 'AI semantic matching confirmed this clause is fully satisfied by the submitted documents.', evidenceDocumentName: `${vendorId}_${tenderId}_GST.pdf` },
    manual_review: { confidence: Math.floor(Math.random() * 20) + 60, confidenceLevel: 'medium', extractedValue: 'Partial evidence found — officer review needed', explanation: 'Document partially matches requirement. Specific values could not be confirmed with high confidence. Manual review recommended.', evidenceDocumentName: `${vendorId}_${tenderId}_ExperienceCert.pdf` },
    non_compliant: { confidence: Math.floor(Math.random() * 10) + 85, confidenceLevel: 'high', extractedValue: 'Does not meet required threshold', explanation: 'AI analysis found that the submitted documentation does not meet this mandatory requirement. Bidder is ineligible on this criterion.', evidenceDocumentName: `${vendorId}_${tenderId}_FinancialStatement.pdf` },
  };
  const v = verdicts[status];
  return {
    id: `cr_${crCounter++}`,
    tenderId, vendorId,
    requirementId: reqId,
    status,
    confidence: v.confidence,
    confidenceLevel: v.confidenceLevel,
    extractedValue: v.extractedValue,
    expectedValue: 'See tender clause',
    explanation: v.explanation,
    evidenceDocumentName: v.evidenceDocumentName,
    evidencePage: Math.floor(Math.random() * 5) + 1,
    evidenceText: v.extractedValue,
    verifiedAt: '2026-09-05T10:00:00Z',
    verifiedBy: 'ProcureAI Engine v2.4'
  };
};

for (const [vid, data] of Object.entries(t1Results)) {
  for (const rid of data.pass) allComplianceResults.push(makeResult('tender_001', vid, rid, 'compliant'));
  for (const rid of data.review) allComplianceResults.push(makeResult('tender_001', vid, rid, 'manual_review'));
  for (const rid of data.fail) allComplianceResults.push(makeResult('tender_001', vid, rid, 'non_compliant'));
}
for (const [vid, data] of Object.entries(t2Results)) {
  for (const rid of data.pass) allComplianceResults.push(makeResult('tender_002', vid, rid, 'compliant'));
  for (const rid of data.review) allComplianceResults.push(makeResult('tender_002', vid, rid, 'manual_review'));
  for (const rid of data.fail) allComplianceResults.push(makeResult('tender_002', vid, rid, 'non_compliant'));
}
for (const [vid, data] of Object.entries(t3Results)) {
  for (const rid of data.pass) allComplianceResults.push(makeResult('tender_003', vid, rid, 'compliant'));
  for (const rid of data.review) allComplianceResults.push(makeResult('tender_003', vid, rid, 'manual_review'));
  for (const rid of data.fail) allComplianceResults.push(makeResult('tender_003', vid, rid, 'non_compliant'));
}

// ─── RISK ASSESSMENTS ─────────────────────────────────────
const riskProfiles = [
  { id: 'ra_001', tenderId: 'tender_001', vendorId: 'vendor_001', overallScore: 12, riskLevel: 'low', factors: [{ id: 'rf1', description: 'All statutory registrations active and verified.', severity: 'low', category: 'Compliance', impact: 'Minimal risk — compliant vendor.' }], inconsistencies: [], missingDocuments: [], calculatedAt: '2026-09-05T10:00:00Z' },
  { id: 'ra_002', tenderId: 'tender_001', vendorId: 'vendor_002', overallScore: 72, riskLevel: 'high', factors: [
    { id: 'rf2', description: 'Annual turnover (₹7.2 Cr) well below the ₹10 Cr mandatory threshold.', severity: 'high', category: 'Financial', impact: 'Vendor may be ineligible for contract award.' },
    { id: 'rf3', description: 'Shared subnet IP detected with vendor_004 during bid upload (GeM audit flag).', severity: 'high', category: 'Integrity', impact: 'Potential collusion risk — requires officer verification.' },
  ], inconsistencies: [{ id: 'inc_1', type: 'value_conflict', severity: 'high', description: 'Turnover in financial statement (₹7.2 Cr) conflicts with the ₹10 Cr threshold required.', document1: 'FinancialStatement.pdf', document2: 'Tender Clause R003', value1: '₹7.2 Crore', value2: '≥ ₹10 Crore', field: 'Annual Turnover' }], missingDocuments: ['ISO Certificate', 'ITR FY23'], calculatedAt: '2026-09-05T10:00:00Z' },
  { id: 'ra_003', tenderId: 'tender_001', vendorId: 'vendor_003', overallScore: 8, riskLevel: 'low', factors: [{ id: 'rf4', description: 'Strong financial position (₹22.1 Cr turnover, ₹14.7 Cr net worth).', severity: 'low', category: 'Financial', impact: 'No financial risk identified.' }], inconsistencies: [], missingDocuments: [], calculatedAt: '2026-09-05T10:00:00Z' },
  { id: 'ra_004', tenderId: 'tender_001', vendorId: 'vendor_004', overallScore: 88, riskLevel: 'high', factors: [
    { id: 'rf5', description: 'Turnover (₹4.1 Cr) is 59% below the mandatory ₹10 Cr threshold.', severity: 'high', category: 'Financial', impact: 'Vendor is financially ineligible.' },
    { id: 'rf6', description: 'FY23 ITR not submitted. Only 2 years of financial records provided.', severity: 'high', category: 'Documentation', impact: 'Non-compliance with ITR submission requirement.' },
    { id: 'rf7', description: 'MSME exemption claimed but Udyam certificate not verified or uploaded.', severity: 'medium', category: 'Eligibility', impact: 'Exemption may be invalidated if certificate is not authentic.' },
  ], inconsistencies: [{ id: 'inc_2', type: 'name_mismatch', severity: 'medium', description: 'Company name in PAN (Nova Infotech Pvt Ltd) differs slightly from GST certificate (Nova Infotech).', document1: 'PAN Card', document2: 'GST Certificate', value1: 'Nova Infotech Pvt Ltd', value2: 'Nova Infotech', field: 'Legal Entity Name' }], missingDocuments: ['ITR FY23', 'ISO Certificate', 'Udyam Registration Certificate'], calculatedAt: '2026-09-05T10:00:00Z' },
  { id: 'ra_005', tenderId: 'tender_001', vendorId: 'vendor_005', overallScore: 10, riskLevel: 'low', factors: [{ id: 'rf8', description: 'Highest turnover (₹31.4 Cr) and net worth (₹19.5 Cr) among all bidders.', severity: 'low', category: 'Financial', impact: 'Strong financial profile.' }], inconsistencies: [], missingDocuments: [], calculatedAt: '2026-09-05T10:00:00Z' },
  { id: 'ra_006', tenderId: 'tender_002', vendorId: 'vendor_001', overallScore: 14, riskLevel: 'low', factors: [{ id: 'rf9', description: 'Vendor holds all required certifications and licenses for safety systems.', severity: 'low', category: 'Compliance', impact: 'No risk identified.' }], inconsistencies: [], missingDocuments: [], calculatedAt: '2026-09-06T10:00:00Z' },
  { id: 'ra_007', tenderId: 'tender_002', vendorId: 'vendor_003', overallScore: 35, riskLevel: 'medium', factors: [{ id: 'rf10', description: 'CloudMatrix is primarily an IT company — limited verifiable experience in industrial safety equipment supply.', severity: 'medium', category: 'Experience', impact: 'May not meet safety domain experience requirement.' }], inconsistencies: [], missingDocuments: ['BIS Certification for Detectors', 'OEM Authorization Form'], calculatedAt: '2026-09-06T10:00:00Z' },
  { id: 'ra_008', tenderId: 'tender_002', vendorId: 'vendor_004', overallScore: 81, riskLevel: 'high', factors: [{ id: 'rf11', description: 'Turnover (₹4.1 Cr) below ₹8 Cr minimum for tender_002.', severity: 'high', category: 'Financial', impact: 'Financially ineligible for this tender.' }], inconsistencies: [], missingDocuments: ['BIS Certificate', 'OEM MAF', 'ITR FY23'], calculatedAt: '2026-09-06T10:00:00Z' },
  { id: 'ra_009', tenderId: 'tender_003', vendorId: 'vendor_002', overallScore: 65, riskLevel: 'high', factors: [{ id: 'rf12', description: 'No SAP partner certification or ISO 27001 found in submitted documents.', severity: 'high', category: 'Certification', impact: 'Does not meet mandatory certification requirements for ERP AMC.' }], inconsistencies: [], missingDocuments: ['SAP Partner Certificate', 'ISO 27001 Certificate', 'CISSP/CEH Proof'], calculatedAt: '2026-08-30T10:00:00Z' },
  { id: 'ra_010', tenderId: 'tender_003', vendorId: 'vendor_003', overallScore: 6, riskLevel: 'low', factors: [{ id: 'rf13', description: 'SAP Gold Partner, ISO 27001 certified, 2 CISSP engineers. Best qualified for ERP AMC.', severity: 'low', category: 'Compliance', impact: 'No risk. Recommended bidder.' }], inconsistencies: [], missingDocuments: [], calculatedAt: '2026-08-30T10:00:00Z' },
  { id: 'ra_011', tenderId: 'tender_003', vendorId: 'vendor_005', overallScore: 42, riskLevel: 'medium', factors: [{ id: 'rf14', description: 'InfraGlobe is infrastructure-focused; limited SAP/SIEM-specific experience evidence found.', severity: 'medium', category: 'Experience', impact: 'Cybersecurity experience unverified. Manual review required.' }], inconsistencies: [], missingDocuments: ['ISO 27001 Certificate', 'CISSP/CEH Proof'], calculatedAt: '2026-08-30T10:00:00Z' },
];

// ─── AUDIT ENTRIES ─────────────────────────────────────────
const auditEntries = [
  { id: 'audit_001', userId: 'user_001', userName: 'Rajesh Kumar', action: 'tender_created', timestamp: '2026-08-01T10:00:00Z', tenderId: 'tender_001', tenderTitle: 'Supply, Installation & Commissioning of HPC Infrastructure', details: 'Tender CPCL/IT/2026/001 created and published on GeM portal.' },
  { id: 'audit_002', userId: 'user_001', userName: 'Rajesh Kumar', action: 'vendor_added', timestamp: '2026-09-02T14:30:00Z', tenderId: 'tender_001', vendorId: 'vendor_001', vendorName: 'TechServe Solutions India Pvt Ltd', details: 'Bid submitted by TechServe Solutions. 4 documents uploaded.' },
  { id: 'audit_003', userId: 'user_001', userName: 'Rajesh Kumar', action: 'vendor_added', timestamp: '2026-09-03T11:15:00Z', tenderId: 'tender_001', vendorId: 'vendor_002', vendorName: 'Bharat Digital Systems Ltd', details: 'Bid submitted by Bharat Digital Systems. 4 documents uploaded.' },
  { id: 'audit_004', userId: 'user_001', userName: 'Rajesh Kumar', action: 'vendor_added', timestamp: '2026-09-04T16:45:00Z', tenderId: 'tender_001', vendorId: 'vendor_003', vendorName: 'CloudMatrix Technologies Pvt Ltd', details: 'Bid submitted by CloudMatrix Technologies. 4 documents uploaded.' },
  { id: 'audit_005', userId: 'user_001', userName: 'Rajesh Kumar', action: 'vendor_added', timestamp: '2026-09-01T10:00:00Z', tenderId: 'tender_001', vendorId: 'vendor_004', vendorName: 'Nova Infotech Pvt Ltd', details: 'Bid submitted by Nova Infotech. 4 documents uploaded. MSME exemption claimed.' },
  { id: 'audit_006', userId: 'user_001', userName: 'Rajesh Kumar', action: 'vendor_added', timestamp: '2026-09-04T09:30:00Z', tenderId: 'tender_001', vendorId: 'vendor_005', vendorName: 'InfraGlobe Engineering Solutions', details: 'Bid submitted by InfraGlobe Engineering. 4 documents uploaded.' },
  { id: 'audit_007', userId: 'system', userName: 'ProcureAI Engine v2.4', action: 'ai_analysis_completed', timestamp: '2026-09-05T10:00:00Z', tenderId: 'tender_001', details: 'AI semantic clause evaluation completed for all 5 bidders. 75 compliance records generated. 2 high-risk bidders flagged.' },
  { id: 'audit_008', userId: 'user_002', userName: 'Priya Sharma (Admin)', action: 'compliance_result_reviewed', timestamp: '2026-09-05T14:30:00Z', tenderId: 'tender_001', vendorId: 'vendor_002', vendorName: 'Bharat Digital Systems Ltd', details: 'Manual review initiated for Bharat Digital: collusion pattern flagged with Nova Infotech (shared IP subnet).' },
  { id: 'audit_009', userId: 'user_002', userName: 'Priya Sharma (Admin)', action: 'tender_created', timestamp: '2026-08-10T09:00:00Z', tenderId: 'tender_002', tenderTitle: 'Procurement of Industrial Safety & Fire Detection Systems', details: 'Tender CPCL/SAFETY/2026/002 created and published.' },
  { id: 'audit_010', userId: 'system', userName: 'ProcureAI Engine v2.4', action: 'risk_assessment_completed', timestamp: '2026-09-06T10:00:00Z', tenderId: 'tender_002', details: 'Risk assessment completed for 3 bidders on tender_002. 1 high-risk flag raised.' },
  { id: 'audit_011', userId: 'user_002', userName: 'Priya Sharma (Admin)', action: 'tender_created', timestamp: '2026-07-10T14:00:00Z', tenderId: 'tender_003', tenderTitle: 'Annual Maintenance Contract for Enterprise ERP & Cyber Defense', details: 'Tender TND-2026-0775 created. Evaluation completed on 2026-08-30.' },
  { id: 'audit_012', userId: 'system', userName: 'ProcureAI Engine v2.4', action: 'ai_analysis_completed', timestamp: '2026-08-30T16:00:00Z', tenderId: 'tender_003', details: 'AI compliance and risk analysis completed for 3 bidders. CloudMatrix Technologies recommended as L1.' },
  { id: 'audit_013', userId: 'user_001', userName: 'Rajesh Kumar', action: 'compliance_result_overridden', timestamp: '2026-09-05T15:00:00Z', tenderId: 'tender_001', vendorId: 'vendor_004', vendorName: 'Nova Infotech Pvt Ltd', details: 'MSME exemption for Nova Infotech marked manual_review pending physical certificate verification.' },
];

// ─── WRITE OUTPUT ──────────────────────────────────────────
const users = [
  { id: 'user_001', name: 'Rajesh Kumar', email: 'rajesh.kumar@procurement.gov.in', role: 'officer', organization: 'Chennai Petroleum Corporation Ltd', password: 'password123' },
  { id: 'user_002', name: 'Priya Sharma', email: 'priya.sharma@procurement.gov.in', role: 'admin', organization: 'Chennai Petroleum Corporation Ltd', password: 'password123' }
];

const output = `
import type {
  Tender, Requirement, Vendor, VendorDocument, ComplianceResult,
  RiskAssessment, AuditEntry, User
} from '../types/index.js';

export const initialUsers: User[] = ${JSON.stringify(users, null, 2)};

export const initialRequirements: Requirement[] = ${JSON.stringify(requirements, null, 2)};

export const initialVendors: Vendor[] = ${JSON.stringify(vendors, null, 2)};

export const initialVendorDocuments: VendorDocument[] = ${JSON.stringify(allDocs, null, 2)};

export const initialTenders: Tender[] = ${JSON.stringify(tenders, null, 2)};

export const initialComplianceResults: ComplianceResult[] = ${JSON.stringify(allComplianceResults, null, 2)};

export const initialRiskAssessments: RiskAssessment[] = ${JSON.stringify(riskProfiles, null, 2)};

export const initialAuditEntries: AuditEntry[] = ${JSON.stringify(auditEntries, null, 2)};
`;

const outFile = path.join(__dirname, 'src', 'data', 'initialData.ts');
fs.writeFileSync(outFile, output, 'utf8');

const stats = {
  users: users.length,
  tenders: tenders.length,
  requirements: requirements.length,
  vendors: vendors.length,
  documents: allDocs.length,
  complianceResults: allComplianceResults.length,
  riskAssessments: riskProfiles.length,
  auditEntries: auditEntries.length,
};
console.log('✅ Complete data generated successfully!');
console.log(JSON.stringify(stats, null, 2));
