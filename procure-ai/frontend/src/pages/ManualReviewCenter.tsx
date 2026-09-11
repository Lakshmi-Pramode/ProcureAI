import { useState, useEffect } from 'react';
import { ShieldAlert, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/shared/PageHeader';
import type { ComplianceResult } from '../types';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';

export default function ManualReviewCenter() {
  const { addToast } = useToast();
  const [results, setResults] = useState<ComplianceResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ComplianceResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const manualReviewItems = results.filter(r => r.status === 'manual_review');

  useEffect(() => {
    api.verification.getResults().then(res => {
      if (res && res.length > 0) setResults(res);
    }).catch(() => {});
  }, []);

  const handleAction = async (status: 'compliant' | 'non_compliant') => {
    if (!selectedResult) return;
    setIsSubmitting(true);
    try {
      await api.verification.saveOverride(selectedResult.id, status, `Manually reviewed by officer`);
      setResults(prev => prev.map(r =>
        r.id === selectedResult.id ? { ...r, status } : r
      ));
      addToast('success', 'Manual Review Completed', `Requirement marked as ${status === 'compliant' ? 'Compliant' : 'Non-Compliant'}`);
      setSelectedResult(null);
    } catch {
      // Optimistic update if API fails (offline mode)
      setResults(prev => prev.map(r =>
        r.id === selectedResult.id ? { ...r, status } : r
      ));
      addToast('success', 'Manual Review Completed', `Requirement marked as ${status === 'compliant' ? 'Compliant' : 'Non-Compliant'}`);
      setSelectedResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Manual Review Center"
        subtitle="Uncertain compliance results routed for human-in-the-loop verification"
        breadcrumbs={[{ label: 'Manual Review Center' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-5 bg-surface rounded-xl border border-border overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-border bg-surface-secondary flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Pending Reviews ({manualReviewItems.length})</h3>
          </div>

          <div className="divide-y divide-border overflow-y-auto max-h-[620px]">
            {manualReviewItems.length === 0 ? (
              <div className="p-8 text-center text-text-tertiary text-sm">
                No items pending manual review.
              </div>
            ) : manualReviewItems.map(item => {
              const isSelected = item.id === selectedResult?.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedResult(item)}
                  className={`w-full text-left p-4 transition-all flex flex-col gap-1 ${
                    isSelected ? 'bg-primary-50/60 border-l-4 border-primary-600' : 'hover:bg-surface-secondary/60 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-mono text-xs font-bold text-manual-review bg-manual-review-bg px-2 rounded">
                      {item.requirementId}
                    </span>
                    <span className="text-xs font-semibold text-text-secondary">{item.confidence}% Match</span>
                  </div>
                  <p className="text-sm font-semibold text-text-primary mt-1">{item.vendorId}</p>
                  <p className="text-xs text-text-tertiary line-clamp-1">{item.requirement?.description || 'Requirement Check'}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Details */}
        <div className="lg:col-span-7 space-y-6">
          {selectedResult ? (
            <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <ShieldAlert className="w-6 h-6 text-manual-review" />
                <div>
                  <h3 className="text-base font-bold text-text-primary">Manual Verification Required</h3>
                  <p className="text-xs text-text-secondary">Vendor ID: {selectedResult.vendorId}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-secondary rounded-lg border border-border">
                    <span className="text-xs font-semibold text-text-secondary block mb-1">Requirement</span>
                    <p className="text-sm text-text-primary font-medium">{selectedResult.requirement?.description}</p>
                    <p className="text-xs text-text-tertiary mt-1">Expected: {selectedResult.expectedValue}</p>
                  </div>
                  <div className="p-4 bg-surface-secondary rounded-lg border border-border">
                    <span className="text-xs font-semibold text-text-secondary block mb-1">Reason for Review</span>
                    <p className="text-sm text-text-primary font-medium">{selectedResult.explanation}</p>
                    <p className="text-xs text-text-tertiary mt-1">Confidence: {selectedResult.confidence}%</p>
                  </div>
                </div>

                <div className="p-4 bg-surface rounded-lg border border-border">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-semibold text-text-secondary flex items-center gap-2">
                       <FileText className="w-4 h-4 text-primary-600"/> Evidence Snapshot
                     </span>
                     <span className="text-[10px] bg-surface-secondary px-2 py-0.5 rounded text-text-tertiary">
                       Page {selectedResult.evidencePage || 1}
                     </span>
                   </div>
                   <p className="text-sm text-text-primary italic border-l-2 border-primary-300 pl-3">
                     "{selectedResult.evidenceText || selectedResult.extractedValue}"
                   </p>
                   <p className="text-[10px] text-text-tertiary mt-2">Source Document: {selectedResult.evidenceDocumentName}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <Link
                  to={`/bidders/${selectedResult.vendorId}`}
                  className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-surface-secondary text-text-primary transition mr-auto"
                >
                  View Bidder Profile
                </Link>
                <button
                  onClick={() => handleAction('non_compliant')}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-non-compliant-bg text-non-compliant border border-non-compliant border-opacity-30 rounded-lg text-xs font-semibold hover:bg-red-100 flex items-center gap-2 transition disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" /> Mark Non-Compliant
                </button>
                <button
                  onClick={() => handleAction('compliant')}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-compliant text-white rounded-lg text-xs font-semibold hover:bg-green-600 flex items-center gap-2 transition disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" /> Mark Compliant
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface rounded-xl border border-border p-12 shadow-sm flex flex-col items-center justify-center text-center">
               <ShieldAlert className="w-12 h-12 text-text-tertiary opacity-50 mb-4" />
               <h3 className="text-base font-bold text-text-primary">Select an item to review</h3>
               <p className="text-sm text-text-secondary mt-1 max-w-md">
                 Click on an item from the left panel to inspect the AI's reasoning, view extracted evidence, and make a final manual determination.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
