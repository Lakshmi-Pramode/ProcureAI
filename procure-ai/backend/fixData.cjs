const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'src', 'data', 'initialData.ts');
let content = fs.readFileSync(dataFile, 'utf8');

// Use regex to add extractedData to any vendor documents that don't have it.
// We look for:
// "status": "ready"
//   }
// and replace it with:
// "status": "ready",
// "extractedData": { "fields": {}, "rawText": "", "sourcePage": 1, "confidence": 0.95 }
//   }
//
// But we should be careful not to overwrite ones that already have it.
// Actually, since I generated the mock data, I know exactly that they end with "status": "ready"\n  }

content = content.replace(/"status": "ready"\s*\}/g, '"status": "ready",\n    "extractedData": { "fields": {}, "rawText": "", "sourcePage": 1, "confidence": 0.95 }\n  }');

fs.writeFileSync(dataFile, content, 'utf8');
console.log('Successfully patched initialData.ts with extractedData blocks.');
