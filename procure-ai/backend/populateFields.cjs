// Script to populate extractedData fields in initialData.ts with realistic vendor-specific values
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src', 'data', 'initialData.ts');
let content = fs.readFileSync(dataFile, 'utf8');

// Each vendor's documents are listed in order: GST Certificate, PAN Card, Financial Statement, Experience Certificate
// We will build a map from document lines to replacement values per vendor

const vendorFields = {
  vendor_001: { // TechServe Solutions India Pvt Ltd - strong vendor
    gst: { gstin: '29AACTS1234F1Z5', legalName: 'TechServe Solutions India Pvt Ltd', status: 'Active' },
    pan: { pan: 'AACTS1234F', name: 'TechServe Solutions India Pvt Ltd', status: 'Active' },
    fin: { averageTurnover: '18.5', netWorth: '9.2', caName: 'R.K. Sharma & Co', status: 'Audited' },
    exp: { clientName: 'BHEL Ltd', projectValue: '12.5', completionDate: '2024-03-31' },
  },
  vendor_002: { // Bharat Digital Systems - medium risk
    gst: { gstin: '27AABBD5678G1Z3', legalName: 'Bharat Digital Systems Ltd', status: 'Active' },
    pan: { pan: 'AABBD5678G', name: 'Bharat Digital Systems Ltd', status: 'Active' },
    fin: { averageTurnover: '7.2', netWorth: '3.1', caName: 'P.L. Gupta & Associates', status: 'Audited' },
    exp: { clientName: 'ONGC', projectValue: '5.8', completionDate: '2024-01-15' },
  },
  vendor_003: { // CloudMatrix Technologies - clean, compliant
    gst: { gstin: '33AAACM9012H1Z1', legalName: 'CloudMatrix Technologies Pvt Ltd', status: 'Active' },
    pan: { pan: 'AAACM9012H', name: 'CloudMatrix Technologies Pvt Ltd', status: 'Active' },
    fin: { averageTurnover: '22.1', netWorth: '14.7', caName: 'Mehta & Partners CA', status: 'Audited' },
    exp: { clientName: 'ISRO Satellite Centre', projectValue: '19.3', completionDate: '2025-02-28' },
  },
  vendor_004: { // Nova Infotech - high risk (low turnover)
    gst: { gstin: '09AAANI3456J1Z8', legalName: 'Nova Infotech Pvt Ltd', status: 'Active' },
    pan: { pan: 'AAANI3456J', name: 'Nova Infotech Pvt Ltd', status: 'Active' },
    fin: { averageTurnover: '4.1', netWorth: '1.8', caName: 'S.V. Iyer & Co', status: 'Audited' },
    exp: { clientName: 'State Bank of India', projectValue: '3.2', completionDate: '2023-11-30' },
  },
  vendor_005: { // InfraGlobe Engineering - strong vendor
    gst: { gstin: '08AAAII7890K1Z6', legalName: 'InfraGlobe Engineering Solutions', status: 'Active' },
    pan: { pan: 'AAAII7890K', name: 'InfraGlobe Engineering Solutions', status: 'Active' },
    fin: { averageTurnover: '31.4', netWorth: '19.5', caName: 'Kapoor & Associates', status: 'Audited' },
    exp: { clientName: 'NTPC Limited', projectValue: '28.7', completionDate: '2025-04-15' },
  },
};

// Process each vendor's documents
for (const [vendorId, fields] of Object.entries(vendorFields)) {
  // GST Certificate pattern
  content = content.replace(
    new RegExp(
      `("vendorId": "${vendorId}"[^}]*?"documentType": "GST Certificate"[^}]*?"extractedData": \\{ "fields": \\{\\},)`
    ),
    `"vendorId": "${vendorId}","tenderId":"tender_001","documentType":"GST Certificate","fileName":"${vendorId}_GST.pdf","fileSize":1258291,"fileType":"application/pdf","uploadedAt":"2026-09-02T14:30:00Z","status":"ready","extractedData":{"fields":${JSON.stringify(fields.gst)},`
  );
}

// Use a simpler replacement approach - replace by document type within each vendor block
// Split and reconstruct the file content intelligently

// Better approach: use regex to find each vendor's document blocks and update them
for (const [vendorId, fields] of Object.entries(vendorFields)) {
  const docTypes = [
    { key: 'GST Certificate', replacement: JSON.stringify(fields.gst) },
    { key: 'PAN Card', replacement: JSON.stringify(fields.pan) },
    { key: 'Financial Statement', replacement: JSON.stringify(fields.fin) },
    { key: 'Experience Certificate', replacement: JSON.stringify(fields.exp) },
  ];

  for (const { key, replacement } of docTypes) {
    // Find the specific pattern for this vendor's document type
    const searchRegex = new RegExp(
      `("vendorId": "${vendorId}"[^{]*?"documentType": "${key}"[^{]*?"extractedData": \\{ "fields": )\\{\\}`,
      'g'
    );
    content = content.replace(searchRegex, `$1${replacement}`);
  }
}

fs.writeFileSync(dataFile, content, 'utf8');
console.log('Successfully populated extractedData fields for all 5 vendors and 4 document types each!');
