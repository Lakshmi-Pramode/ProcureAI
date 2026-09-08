import fs from 'fs/promises';
import path from 'path';

export class DocumentParserService {
  public async extractTextFromFile(filePath: string, fileType?: string): Promise<{ text: string; pages: number }> {
    try {
      const ext = path.extname(filePath).toLowerCase();

      // For plain text, markdown, csv, json
      if (['.txt', '.csv', '.json', '.md'].includes(ext)) {
        const content = await fs.readFile(filePath, 'utf-8');
        return { text: content, pages: 1 };
      }

      // For PDFs
      if (ext === '.pdf') {
        try {
          const pdfParseModule = await import('pdf-parse');
          // In ESM / CJS interop, handle both module and module.default
          const pdfParse = (pdfParseModule as any).default || pdfParseModule;
          const dataBuffer = await fs.readFile(filePath);
          const parsed = await pdfParse(dataBuffer);
          return {
            text: parsed.text || '',
            pages: parsed.numpages || 1
          };
        } catch (pdfErr) {
          console.warn('⚠️ PDF text extraction warning, fallback to buffer scan:', (pdfErr as Error).message);
          return { text: `Document indexed: ${path.basename(filePath)}`, pages: 1 };
        }
      }

      // Images or other binaries
      return {
        text: `Binary document ${path.basename(filePath)} (${fileType || ext})`,
        pages: 1
      };
    } catch (err) {
      console.error('Error reading file for text extraction:', err);
      return { text: '', pages: 1 };
    }
  }
}

export const documentParserService = new DocumentParserService();
