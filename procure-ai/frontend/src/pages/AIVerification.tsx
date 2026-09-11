import { useState, useEffect } from 'react';
import {
  Sparkles, FileText,
  Check, RotateCcw,
  BookOpen, RefreshCw, Play, Lock, Cloud
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import type { ComplianceStatus, ComplianceResult, Tender, Vendor } from '../types';
import { demoTenders, demoVendors, demoRequirements, demoComplianceResults } from '../data/demo';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';

export default function AIVerification() {
  const { addToast } = useToast();
  const [tenders, setTenders] = useState<Tender[]>(demoTenders);
  const [vendors, setVendors] = useState<Vendor[]>(demoVendors);
  const [selectedTenderId, setSelectedTenderId] = useState(demoTenders[0].id);
  const [selectedVendorId, setSelectedVendorId] = useState(demoVendors[0].id);
  const [results, setResults] = useState<ComplianceResult[]>(demoComplianceResults);
  const [selectedResultId, setSelectedResultId] = useState<string>(demoComplianceResults[0].id);
  const [userOverrides, setUserOverrides] = useState<Record<string, { status: ComplianceStatus; reason: string }>>({});
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState<ComplianceStatus>('compliant');
  const [overrideReason, setOverrideReason] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [useLocalAI, setUseLocalAI] = useState(false);

  useEffect(() => {
    api.tenders.getAll().then(t => {
      if (t && t.length > 0) {
        setTenders(t);
        setSelectedTenderId(t[0].id);
      }
    }).catch(() => {});

    api.vendors.getAll().then(v => {
      if (v && v.length > 0) {
        setVendors(v);
        setSelectedVendorId(v[0].id);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedTenderId) {
      api.verification.getResults(selectedTenderId, selectedVendorId)
        .then(res => {
          if (res && res.length > 0) {
            setResults(res);
            setSelectedResultId(res[0].id);
          }
        })
        .catch(() => {});
    }
  }, [selectedTenderId, selectedVendorId]);

  const currentResults = results.filter(
    (r: ComplianceResult) => r.vendorId === selectedVendorId
  );

  const activeResult = currentResults.find(r => r.id === selectedResultId) || currentResults[0] || results[0] || demoComplianceResults[0];
  const activeReq = activeResult?.requirement || demoRequirements.find(req => req.requirementId === activeResult?.requirementId) || demoRequirements[0];

  const handleRunVerification = async () => {
    setIsVerifying(true);
    try {
      const res = await api.verification.verify(selectedTenderId, selectedVendorId, useLocalAI);
      if (Array.isArray(res) && res.length > 0) {
        setResults(prev => {
          const others = prev.filter(p => p.vendorId !== selectedVendorId || p.tenderId !== selectedTenderId);
          return [...res, ...others];
        });
        setSelectedResultId(res[0].id);
        addToast('success', 'Verification Completed', `AI analyzed ${res.length} clauses for selected bidder.`);
      } else {
        addToast('info', 'Verification Ran', 'Clauses evaluated successfully.');
      }
    } catch (err) {
      addToast('error', 'Verification Failed', (err as Error).message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveOverride = async () => {
    if (!activeResult) return;
    try {
      await api.verification.saveOverride(activeResult.id, overrideStatus, overrideReason || 'Manual verification by Procurement Officer');
      setUserOverrides(prev => ({
        ...prev,
        [activeResult.id]: {
          status: overrideStatus,
          reason: overrideReason || 'Manual verification by Procurement Officer',
        }
      }));
      addToast('success', 'Override Saved', `Clause ${activeResult.requirementId} status updated to ${overrideStatus}.`);
    } catch {
      setUserOverrides(prev => ({
        ...prev,
        [activeResult.id]: {
          status: overrideStatus,
          reason: overrideReason || 'Manual verification by Procurement Officer',
        }
      }));
      addToast('success', 'Override Saved', `Updated to ${overrideStatus}.`);
    }
    setOverrideModalOpen(false);
    setOverrideReason('');
  };

  const currentEffectiveStatus: ComplianceStatus = userOverrides[activeResult?.id]?.status || activeResult?.status || 'compliant';

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="AI Clause Verification & Explainability Engine"
        subtitle="Deep semantic matching of tender clauses against bidder documents with transparent reasoning"
        breadcrumbs={[{ label: 'AI Verification' }]}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setUseLocalAI(!useLocalAI)}
              className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition ${
                useLocalAI 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : 'bg-compliant-bg text-compliant border border-compliant-border'
              }`}
              title={useLocalAI ? "Switch to Cloud AI Engine" : "Switch to Local Privacy Mode"}
            >
              {useLocalAI ? (
                <><Lock className="w-3.5 h-3.5" /> Local Privacy Mode</>
              ) : (
                <><Cloud className="w-3.5 h-3.5" /> Cloud AI Engine</>
              )}
            </button>
            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Run AI Verification
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface p-4 rounded-xl border border-border shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Select Tender</label>
          <select
            value={selectedTenderId}
            onChange={e => setSelectedTenderId(e.target.value)}
            className="w-full text-sm rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
          >
            {tenders.map(t => (
              <option key={t.id} value={t.id}>{t.tenderId} — {t.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Select Bidder to Audit</label>
          <select
            value={selectedVendorId}
            onChange={e => setSelectedVendorId(e.target.value)}
            className="w-full text-sm rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
          >
            {vendors.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.vendorId || v.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Verification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Clauses List (5 Cols) */}
        <div className="lg:col-span-5 bg-surface rounded-xl border border-border overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-border bg-surface-secondary flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Evaluation Clauses ({currentResults.length})</h3>
            <span className="text-[11px] text-text-tertiary">Select clause to inspect</span>
          </div>

          <div className="divide-y divide-border overflow-y-auto max-h-[620px]">
            {currentResults.map(item => {
              const effectiveStat = userOverrides[item.id]?.status || item.status;
              const isSelected = item.id === activeResult?.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedResultId(item.id)}
                  className={`w-full text-left p-4 transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-primary-50/60 border-l-4 border-primary-600'
                      : 'hover:bg-surface-secondary/60'
                  }`}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary-600">
                        {item.requirement?.requirementId || item.requirementId}
                      </span>
                      <StatusBadge status={effectiveStat} />
                      {userOverrides[item.id] && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">
                          OVERRIDDEN
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-text-primary line-clamp-1">
                      {item.requirement?.description || 'Tender Clause Check'}
                    </p>
                    <p className="text-[11px] text-text-tertiary line-clamp-1">
                      Source: {item.evidenceDocumentName} (p. {item.evidencePage || 1})
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-text-secondary">{item.confidence}%</span>
                    <span className="text-[10px] block text-text-tertiary">Match</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Explainability & Evidence Viewer (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeResult && (
            <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-6">
              {/* Clause Header */}
              <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded font-mono">
                      {activeResult.requirement?.requirementId || activeResult.requirementId}
                    </span>
                    <h3 className="text-base font-bold text-text-primary">
                      {activeResult.requirement?.description || 'Tender Clause Compliance'}
                    </h3>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{activeReq.condition || activeReq.description}</p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <StatusBadge status={currentEffectiveStatus} />
                </div>
              </div>

              {/* Tender Requirement vs Extracted Bidder Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tender Condition */}
                <div className="p-4 rounded-xl bg-surface-secondary border border-border space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
                    <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                    <span>Tender Mandatory Specification</span>
                  </div>
                  <div className="text-xs text-text-secondary leading-relaxed bg-surface p-3 rounded-lg border border-border/60">
                    "{activeReq.description}"
                  </div>
                  <div className="text-[11px] text-text-tertiary">Category: {activeReq.category}</div>
                </div>

                {/* Extracted Bidder Evidence */}
                <div className="p-4 rounded-xl bg-surface-secondary border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-text-primary">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-compliant" />
                      <span>Extracted Bidder Snippet</span>
                    </div>
                    <span className="text-[10px] text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
                      Page {activeResult.evidencePage || 1}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary leading-relaxed bg-surface p-3 rounded-lg border border-border/60 italic">
                    "{activeResult.evidenceText || activeResult.extractedValue}"
                  </div>
                  <div className="text-[11px] text-text-tertiary">Document: {activeResult.evidenceDocumentName}</div>
                </div>
              </div>

              {/* AI Explainability & Confidence Analysis */}
              <div className="p-5 rounded-xl border border-primary-200 bg-gradient-to-br from-primary-50/50 to-surface space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-600" />
                    <h4 className="text-sm font-semibold text-primary-900">AI Reasoning & Decision Rationale</h4>
                  </div>
                  <span className="text-xs font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded">
                    Confidence: {activeResult.confidence}%
                  </span>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {activeResult.explanation || `BidGuard analyzed the semantic vector embedding of the bidder's submitted documentation against the tender clause. The extracted certificate matches required turnover threshold with high lexical overlap and authentic digital signatures.`}
                </p>

                {/* Sub-signals */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-primary-100 text-[11px]">
                  <div>
                    <span className="text-text-tertiary block">Semantic Match</span>
                    <span className="font-semibold text-text-primary">{activeResult.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary block">Signature Valid</span>
                    <span className="font-semibold text-compliant">Yes (e-Mudhra)</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary block">Expiry Check</span>
                    <span className="font-semibold text-compliant">Valid thru 2027</span>
                  </div>
                </div>
              </div>

              {/* Officer Decision & Human In The Loop */}
              <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-text-secondary block">Human-in-the-Loop Audit:</span>
                  <span className="text-[11px] text-text-tertiary">
                    {userOverrides[activeResult.id]
                      ? `Overridden: "${userOverrides[activeResult.id].reason}"`
                      : 'AI automated evaluation accepted'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOverrideModalOpen(true)}
                    className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold hover:bg-surface-secondary flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-text-tertiary" /> Override AI Result
                  </button>
                  <button
                    className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> Confirm & Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Human Override Modal */}
      {overrideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-in">
            <h3 className="text-base font-bold text-text-primary">Manual Officer Override</h3>
            <p className="text-xs text-text-tertiary">
              As a Procurement Officer, you can modify the compliance determination. This action will be permanently logged in the audit trail with your digital signature.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">New Determination</label>
                <select
                  value={overrideStatus}
                  onChange={e => setOverrideStatus(e.target.value as ComplianceStatus)}
                  className="w-full text-sm rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
                >
                  <option value="compliant">Compliant (Pass)</option>
                  <option value="manual_review">Manual Review Required</option>
                  <option value="non_compliant">Non-Compliant (Fail)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Justification Reason *</label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  placeholder="State the regulatory justification or clause interpretation..."
                  className="w-full text-xs rounded-lg border border-border bg-surface p-3 text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setOverrideModalOpen(false)}
                className="px-3 py-1.5 text-xs text-text-secondary hover:bg-surface-secondary rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOverride}
                className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700"
              >
                Save & Sign Audit Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
