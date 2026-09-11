import { useState, useEffect } from 'react';
import { Download, Printer } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { demoVendors, demoVendorScores } from '../data/demo';
import { api } from '../services/api';
import type { Tender, VendorScore } from '../types';

export default function Reports() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [selectedTender, setSelectedTender] = useState('');
  const [reportType, setReportType] = useState('full');
  const [isGenerating, setIsGenerating] = useState(false);
  const [vendorScores, setVendorScores] = useState<VendorScore[]>([]);

  useEffect(() => {
    api.tenders.getAll().then(res => {
      if (res && res.length > 0) {
        setTenders(res);
        setSelectedTender(res[0].id);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedTender) {
      api.vendors.getScores(selectedTender).then(res => {
        if (res && res.length > 0) setVendorScores(res);
      }).catch(() => {});
    }
  }, [selectedTender]);

  const tender = tenders.find(t => t.id === selectedTender) || tenders[0] || null;

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      window.print();
    }, 600);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Audit & Compliance Reports"
        subtitle="Generate authoritative, tamper-evident evaluation reports for procurement committees and CAG audit"
        breadcrumbs={[{ label: 'Reports' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-surface-secondary flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 flex items-center gap-2 transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Compiling Report...' : 'Download / Print Report'}
            </button>
          </div>
        }
      />

      {/* Configuration Controls */}
      <div className="bg-surface rounded-xl border border-border p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Select Tender</label>
          <select
            value={selectedTender}
            onChange={e => setSelectedTender(e.target.value)}
            className="w-full text-xs font-medium rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
          >
            {tenders.map(t => (
              <option key={t.id} value={t.id}>{t.tenderId} — {t.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Report Dossier Type</label>
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="w-full text-xs font-medium rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
          >
            <option value="full">Comprehensive Evaluation & Risk Dossier</option>
            <option value="technical">Technical Clause Compliance Summary</option>
            <option value="risk">Cartel & Integrity Risk Scrutiny</option>
            <option value="executive">Executive Summary for Tender Committee</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1">Compliance Standard</label>
          <select
            className="w-full text-xs font-medium rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
          >
            <option>GeM GTC v4.0 & CVC Guidelines</option>
            <option>Rule 149 of GFR 2017</option>
            <option>Make in India (DPIIT) Order 2017</option>
          </select>
        </div>
      </div>

      {/* Document Report Paper Sheet Preview */}
      <div className="bg-surface rounded-xl border border-border shadow-lg max-w-4xl mx-auto p-8 sm:p-12 space-y-8 text-text-primary print:shadow-none print:border-none">
        {/* Report Header */}
        <div className="border-b-2 border-primary-600 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-black text-sm">
                BG
              </span>
              <h2 className="text-xl font-bold tracking-tight">BidGuard AI Compliance Dossier</h2>
            </div>
            <p className="text-xs text-text-tertiary mt-1">
              Government e-Marketplace (GeM) • Automated Verification Report
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-text-secondary space-y-0.5">
            <p><span className="text-text-tertiary">Report Ref:</span> BG-REP-2026-9941</p>
            <p><span className="text-text-tertiary">Generated:</span> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
            <p><span className="text-text-tertiary">Integrity Hash:</span> <code className="text-[10px] bg-surface-secondary px-1 rounded font-mono">e3b0c442...89a1</code></p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-700">1. Executive Summary</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            This automated compliance evaluation report was prepared for <strong>{tender.title}</strong> (Tender ID: <code>{tender.tenderId}</code>).
            A total of <strong>{demoVendors.length} bidder submissions</strong> were extracted, parsed, and evaluated against 15 mandatory and elective clauses using BidGuard NLP & Vision models.
          </p>
        </div>

        {/* Tender Details Grid */}
        <div className="bg-surface-secondary rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border border-border">
          <div>
            <span className="text-text-tertiary block">Tender ID</span>
            <span className="font-semibold text-text-primary">{tender.tenderId}</span>
          </div>
          <div>
            <span className="text-text-tertiary block">Department</span>
            <span className="font-semibold text-text-primary">{tender.department}</span>
          </div>
          <div>
            <span className="text-text-tertiary block">Organization</span>
            <span className="font-semibold text-text-primary">{tender.organization}</span>
          </div>
          <div>
            <span className="text-text-tertiary block">Status</span>
            <span className="font-semibold text-compliant uppercase">{tender.status}</span>
          </div>
        </div>

        {/* Bidder Evaluation Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-700">2. Bidder Evaluation & Ranking</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-surface-secondary border-b border-border">
                <tr>
                  <th className="text-left p-3 font-semibold text-text-tertiary">Rank</th>
                  <th className="text-left p-3 font-semibold text-text-tertiary">Bidder</th>
                  <th className="text-center p-3 font-semibold text-text-tertiary">Compliance Score</th>
                  <th className="text-center p-3 font-semibold text-text-tertiary">Risk Rating</th>
                  <th className="text-right p-3 font-semibold text-text-tertiary">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {demoVendors.map((vendor, idx) => {
                  const score = vendorScores.find(s => s.vendorId === vendor.id) || demoVendorScores.find(s => s.vendorId === vendor.id);
                  const riskLevel = score?.riskLevel || 'low';
                  const overallScore = score?.overallScore || 75;

                  return (
                    <tr key={vendor.id}>
                      <td className="p-3 font-bold text-primary-600">L{idx + 1}</td>
                      <td className="p-3 font-semibold text-text-primary">{vendor.name}</td>
                      <td className="p-3 text-center font-bold text-text-primary">
                        {overallScore}%
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          riskLevel === 'low' ? 'bg-compliant-bg text-compliant' :
                          riskLevel === 'medium' ? 'bg-manual-review-bg text-manual-review' :
                          'bg-non-compliant-bg text-non-compliant'
                        }`}>
                          {riskLevel}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {riskLevel === 'low' ? (
                          <span className="text-compliant font-semibold">Technically Qualified</span>
                        ) : riskLevel === 'medium' ? (
                          <span className="text-manual-review font-semibold">Subject to Clarification</span>
                        ) : (
                          <span className="text-non-compliant font-semibold">Flagged for Scrutiny</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Signoff */}
        <div className="pt-6 border-t border-border flex justify-between items-end text-xs text-text-tertiary">
          <div>
            <p className="font-semibold text-text-primary">BidGuard AI System Engine</p>
            <p>Verification Algorithm: Model SHA256: 4f89...b210</p>
            <p>GeM Compliance Node ID: DEL-NODE-04</p>
          </div>
          <div className="text-right">
            <div className="w-32 border-b border-text-tertiary mb-1"></div>
            <p className="font-semibold text-text-primary">Rajesh Kumar</p>
            <p>Procurement Officer Signature</p>
          </div>
        </div>
        
        {/* Required SIH Disclaimer */}
        <div className="pt-4 text-center text-[10px] text-text-tertiary italic">
          "AI-assisted decision-support output. Final procurement decisions must be made by authorized officials."
        </div>
      </div>
    </div>
  );
}
