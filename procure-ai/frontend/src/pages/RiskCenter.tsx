import { useState, useEffect } from 'react';
import {
  AlertTriangle, ShieldAlert, AlertCircle,
  Network, ShieldCheck, Search
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import RiskBadge from '../components/shared/RiskBadge';
import type { RiskAssessment, RiskFactor, Inconsistency, Vendor } from '../types';
import { demoRiskAssessments } from '../data/demo';
import { api } from '../services/api';

export default function RiskCenter() {
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [riskAssessmentList, setRiskAssessmentList] = useState<RiskAssessment[]>(Object.values(demoRiskAssessments));

  useEffect(() => {
    api.vendors.getAll().then(res => {
      if (res && res.length > 0) setVendors(res);
    }).catch(() => {});

    api.risk.getAll().then(res => {
      if (res && res.length > 0) setRiskAssessmentList(res);
    }).catch(() => {});
  }, []);

  const allRiskFactors = riskAssessmentList.flatMap((ra: RiskAssessment) => {
    const vendor = vendors.find(v => v.id === ra.vendorId);
    return (ra.factors || []).map((f: RiskFactor) => ({ ...f, vendor, vendorId: ra.vendorId }));
  });

  const allInconsistencies = riskAssessmentList.flatMap((ra: RiskAssessment) => {
    const vendor = vendors.find(v => v.id === ra.vendorId);
    return (ra.inconsistencies || []).map((inc: Inconsistency) => ({ ...inc, vendor, vendorId: ra.vendorId }));
  });

  const filteredFactors = allRiskFactors.filter(f => {
    const matchFilter = selectedRiskFilter === 'all' || f.severity === selectedRiskFilter;
    const matchSearch = f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (f.vendor?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Risk & Fraud Intelligence Center"
        subtitle="AI-driven cartel detection, shell company identification, and cross-document integrity checks"
        breadcrumbs={[{ label: 'Risk Center' }]}
      />

      {/* High-Level Risk Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-tertiary">Critical Risk Bids</span>
            <span className="p-2 rounded-lg bg-red-50 text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </span>
          </div>
          <p className="text-2xl font-bold text-text-primary mt-2">1</p>
          <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> High priority review required
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-tertiary">Cartel & Collusion Flags</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Network className="w-5 h-5" />
            </span>
          </div>
          <p className="text-2xl font-bold text-text-primary mt-2">2</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">Common directors / IP traces</p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-tertiary">Data Inconsistencies</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <p className="text-2xl font-bold text-text-primary mt-2">{allInconsistencies.length}</p>
          <p className="text-xs text-text-tertiary mt-1">Cross-document mismatches</p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-tertiary">Clean Bidders</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
          </div>
          <p className="text-2xl font-bold text-text-primary mt-2">
            {riskAssessmentList.filter(ra => ra.riskLevel === 'low').length}
          </p>
          <p className="text-xs text-compliant mt-1 font-medium">Verified without critical flags</p>
        </div>
      </div>

      {/* Cartel Detection & Collusion Alert Banner */}
      <div className="p-5 rounded-xl border border-amber-300 bg-amber-50/70 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Potential Collusive Bidding Pattern Detected (GeM Rule 149 Audit)
              </h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                BidGuard graph neural network identified an overlap between <strong>Bharat Digital Systems</strong> and <strong>Nova Infotech</strong>:
                Both submissions were made from identical subnet IP range within 14 minutes, and share a common DIN director in MCA21 registry records.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold rounded bg-amber-200 text-amber-900 shrink-0">
            HIGH SEVERITY
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-tertiary mr-2">Severity:</span>
          {['all', 'high', 'medium', 'low'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedRiskFilter(lvl)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition ${
                selectedRiskFilter === lvl
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-surface-secondary text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search risk or bidder..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
      </div>

      {/* Risk Factors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFactors.map(factor => (
          <div key={factor.id} className="bg-surface rounded-xl border border-border p-5 shadow-sm space-y-3 hover:border-primary-300 transition">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                  {factor.vendor?.name}
                </span>
                <h4 className="text-sm font-bold text-text-primary mt-1.5">{factor.category} Flag</h4>
              </div>
              <RiskBadge level={factor.severity} />
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              {factor.description}
            </p>

            <div className="p-3 rounded-lg bg-surface-secondary text-xs text-text-secondary border border-border/80">
              <span className="font-semibold text-text-primary block mb-0.5">Impact:</span>
              {factor.impact || 'Request formal clarification and attested statutory certificates.'}
            </div>
          </div>
        ))}
      </div>

      {/* Cross-Document Inconsistencies Section */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-non-compliant" />
          Cross-Document Inconsistency Register
        </h3>
        <p className="text-xs text-text-tertiary">
          Automated cross-check comparing values across GST, PAN, financial statements, and technical bid affidavits
        </p>

        <div className="divide-y divide-border">
          {allInconsistencies.map(inc => (
            <div key={inc.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary">{inc.field} Discrepancy</span>
                  <span className="text-xs text-text-tertiary">• {inc.vendor?.name}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-non-compliant-bg text-non-compliant border border-non-compliant-border">
                  {inc.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-text-secondary">{inc.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-surface-secondary border border-border">
                  <span className="text-[11px] text-text-tertiary block">File: {inc.document1}</span>
                  <span className="font-mono font-bold text-text-primary">{inc.value1}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-secondary border border-border">
                  <span className="text-[11px] text-text-tertiary block">File: {inc.document2}</span>
                  <span className="font-mono font-bold text-text-primary">{inc.value2}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
