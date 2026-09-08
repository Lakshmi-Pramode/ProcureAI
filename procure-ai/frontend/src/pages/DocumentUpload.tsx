import { useState } from 'react';
import {
  Upload, FileText, CheckCircle2,
  Trash2, Eye, ShieldCheck, RefreshCw, FileUp
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import type { VendorDocument } from '../types';
import { demoTenders, demoVendors, demoVendorDocuments } from '../data/demo';

interface UploadItem {
  id: string;
  name: string;
  size: string;
  tenderId: string;
  vendorId: string;
  category: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
}

export default function DocumentUpload() {
  const [selectedTender, setSelectedTender] = useState(demoTenders[0].id);
  const [selectedVendor, setSelectedVendor] = useState(demoVendors[0].id);
  const [selectedCategory, setSelectedCategory] = useState('technical_bid');
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [recentDocs, setRecentDocs] = useState<VendorDocument[]>(demoVendorDocuments);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: UploadItem[] = Array.from(files).map((file, idx) => ({
      id: `up_${Date.now()}_${idx}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      tenderId: selectedTender,
      vendorId: selectedVendor,
      category: selectedCategory,
      status: 'processing',
      progress: 65,
    }));

    setUploadQueue(prev => [...newItems, ...prev]);

    // Simulate completing processing after 2 seconds
    setTimeout(() => {
      setUploadQueue(prev =>
        prev.map(item =>
          newItems.some(ni => ni.id === item.id)
            ? { ...item, status: 'completed', progress: 100 }
            : item
        )
      );

      // Add to recent docs
      const newDocs: VendorDocument[] = newItems.map(item => ({
        id: item.id,
        vendorId: item.vendorId,
        tenderId: item.tenderId,
        fileName: item.name,
        documentType: 'Technical Compliance Sheet',
        fileSize: 1024 * 1024,
        fileType: 'application/pdf',
        uploadedAt: new Date().toISOString(),
        status: 'verified',
      }));
      setRecentDocs((prev: VendorDocument[]) => [...newDocs, ...prev]);
    }, 2000);
  };

  const removeUpload = (id: string) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Document Ingestion & AI OCR"
        subtitle="Upload tender notices and bidder submissions for automated OCR extraction and clause parsing"
        breadcrumbs={[{ label: 'Documents' }]}
      />

      {/* Upload Controls & Dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Metadata selection */}
        <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-base font-semibold text-text-primary">Submission Context</h3>
          <p className="text-xs text-text-tertiary">Select the associated tender and vendor before uploading files</p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Target Tender</label>
              <select
                value={selectedTender}
                onChange={e => setSelectedTender(e.target.value)}
                className="w-full text-sm rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              >
                {demoTenders.map(t => (
                  <option key={t.id} value={t.id}>{t.tenderId} — {t.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Bidder / Vendor</label>
              <select
                value={selectedVendor}
                onChange={e => setSelectedVendor(e.target.value)}
                className="w-full text-sm rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              >
                {demoVendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Document Category</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full text-sm rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              >
                <option value="technical_bid">Technical Bid / Proposal</option>
                <option value="financial_bid">Financial Bid / BOQ</option>
                <option value="gst_certificate">GST Registration Certificate</option>
                <option value="pan_card">PAN Card Document</option>
                <option value="oem_authorization">OEM Authorization (MAF)</option>
                <option value="turnover_certificate">Audited Balance Sheet & CA Certificate</option>
                <option value="past_experience">Past Work Order & Completion Certificate</option>
                <option value="msme_certificate">MSME / Udyam Registration</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-primary-50 border border-primary-100 text-xs text-primary-700 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Files are encrypted with SHA-256 integrity hashing and parsed through BidGuard's multi-lingual OCR pipeline.</span>
          </div>
        </div>

        {/* Right: Dropzone */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6 flex flex-col justify-center">
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
              dragOver
                ? 'border-primary-500 bg-primary-50/50 scale-[0.99]'
                : 'border-border hover:border-primary-400 hover:bg-surface-secondary/40'
            }`}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.docx,.xlsx,.jpg,.png"
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
            <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
              <Upload className="w-7 h-7" />
            </div>
            <h4 className="text-base font-semibold text-text-primary">Drag and drop tender or bidder files here</h4>
            <p className="text-xs text-text-secondary mt-1">Supports PDF, DOCX, XLSX, Scanned Images (up to 50MB each)</p>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 transition"
            >
              Browse Files
            </button>
          </div>

          {/* Active Processing Queue */}
          {uploadQueue.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Processing Queue ({uploadQueue.length})</h4>
              <div className="space-y-2">
                {uploadQueue.map(item => (
                  <div key={item.id} className="p-3 rounded-lg border border-border bg-surface-secondary flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileUp className="w-4 h-4 text-primary-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate">{item.name}</p>
                        <p className="text-[10px] text-text-tertiary">{item.size} • {item.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {item.status === 'processing' && (
                        <div className="flex items-center gap-2 text-xs text-primary-600">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Extracting OCR...</span>
                        </div>
                      )}
                      {item.status === 'completed' && (
                        <div className="flex items-center gap-1.5 text-xs text-compliant font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Parsed</span>
                        </div>
                      )}
                      <button onClick={() => removeUpload(item.id)} className="text-text-tertiary hover:text-non-compliant transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Documents Repository */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-text-primary">Processed Document Repository</h3>
            <p className="text-xs text-text-tertiary">All documents extracted with OCR text layers and metadata</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-surface-secondary border border-border text-text-secondary">
            {recentDocs.length} Total Files
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-tertiary uppercase">File Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-tertiary uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-tertiary uppercase">Vendor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-tertiary uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-tertiary uppercase">Uploaded</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-tertiary uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentDocs.map((doc: VendorDocument) => (
                <tr key={doc.id} className="hover:bg-surface-secondary/60 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-primary-500 shrink-0" />
                      <span className="font-medium text-text-primary">{doc.fileName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary capitalize">{doc.documentType}</td>
                  <td className="px-4 py-3 text-xs font-medium text-text-primary">
                    {demoVendors.find(v => v.id === doc.vendorId)?.name || doc.vendorId}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-text-tertiary">
                    {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Just now'}
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded hover:bg-surface-tertiary text-text-tertiary hover:text-primary-600 transition" title="Preview Document">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
