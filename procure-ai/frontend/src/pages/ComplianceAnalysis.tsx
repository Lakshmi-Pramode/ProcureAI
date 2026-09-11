import { useState, useEffect } from 'react';
import {
  CheckCircle2, XCircle, AlertCircle, Download,
  Search, ChevronDown
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import type { Requirement, ComplianceResult, Tender, Vendor } from '../types';
import { demoVendors,  demoComplianceResults } from '../data/demo';
import { api } from '../services/api';

export default function ComplianceAnalysis() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [complianceResults, setComplianceResults] = useState<ComplianceResult[]>([]);
  const [selectedTenderId, setSelectedTenderId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Technical', 'Financial', 'Legal', 'Experience', 'Tax'];

  useEffect(() => {
    api.tenders.getAll().then(res => {
      if (res && res.length > 0) {
        setTenders(res);
        setSelectedTenderId(res[0].id);
      }
    }).catch(() => {});

    api.vendors.getAll().then(res => {
      if (res && res.length > 0) setVendors(res);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedTenderId) {
      api.verification.getResults(selectedTenderId)
        .then(res => {
          if (res && res.length > 0) setComplianceResults(res);
        })
        .catch(() => {});

      api.tenders.getById(selectedTenderId)
        .then(t => {
          if (t && t.requirements && t.requirements.length > 0) {
            setRequirements(t.requirements);
          }
        })
        .catch(() => {});
    }
  }, [selectedTenderId]);

  const filteredRequirements: Requirement[] = requirements.filter((req: Requirement) => {
    const matchCat = selectedCategory === 'all' || req.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        req.requirementId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Calculate compliance per vendor
  const vendorComplianceStats = vendors.map(vendor => {
    const vendorResults = complianceResults.filter((r: ComplianceResult) => r.vendorId === vendor.id);
    const compliantCount = vendorResults.filter((r: ComplianceResult) => r.status === 'compliant').length;
    const totalCount = vendorResults.length || 1;
    const percent = Math.round((compliantCount / totalCount) * 100);
    return {
      vendor,
      compliantCount,
      totalCount,
      percent,
    };
  });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Compliance Analysis & Matrix"
        subtitle="Cross-bidder compliance matrix evaluating all vendor submissions against tender requirements"
        breadcrumbs={[{ label: 'Compliance Analysis' }]}
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="px-4 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-surface-secondary flex items-center gap-2 transition">
              <Download className="w-3.5 h-3.5" /> Export Matrix (CSV)
            </button>
          </div>
        }
      />

      {/* Top Comparative Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vendorComplianceStats.map(stat => (
          <div key={stat.vendor.id} className="bg-surface rounded-xl border border-border p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                  {stat.vendor.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary truncate max-w-[150px]">{stat.vendor.name}</h4>
                  <span className="text-[11px] text-text-tertiary">ID: {stat.vendor.id}</span>
                </div>
              </div>
              <span className={`text-sm font-extrabold px-2.5 py-1 rounded-full ${
                stat.percent >= 80 ? 'bg-compliant-bg text-compliant border border-compliant-border' :
                stat.percent >= 60 ? 'bg-manual-review-bg text-manual-review border border-manual-review-border' :
                'bg-non-compliant-bg text-non-compliant border border-non-compliant-border'
              }`}>
                {stat.percent}%
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-text-tertiary">
                <span>Requirements Met</span>
                <span className="font-semibold text-text-primary">{stat.compliantCount} of {stat.totalCount}</span>
              </div>
              <div className="w-full h-2 bg-surface-tertiary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    stat.percent >= 80 ? 'bg-compliant' :
                    stat.percent >= 60 ? 'bg-manual-review' :
                    'bg-non-compliant'
                  }`}
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select
              value={selectedTenderId}
              onChange={e => setSelectedTenderId(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-semibold rounded-lg border border-border bg-surface text-text-primary focus:ring-2 focus:ring-primary-500/30"
            >
              {tenders.map(t => (
                <option key={t.id} value={t.id}>{t.tenderId} ({t.category})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
          </div>

          <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-lg border border-border">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition capitalize ${
                  selectedCategory === cat
                    ? 'bg-surface text-primary-600 shadow-xs'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search requirement clause..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
      </div>

      {/* Cross-Bidder Comparison Matrix Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-tertiary uppercase w-24">Req ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-tertiary uppercase min-w-[280px]">Requirement Clause</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-tertiary uppercase w-28">Category</th>
                {demoVendors.map(v => (
                  <th key={v.id} className="text-center px-4 py-3 text-xs font-semibold text-text-tertiary uppercase min-w-[150px]">
                    <span className="block text-text-primary font-bold">{v.name}</span>
                    <span className="text-[10px] lowercase text-text-tertiary">{v.id}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRequirements.map(req => (
                <tr key={req.id} className="hover:bg-surface-secondary/40 transition">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                      {req.requirementId}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-semibold text-text-primary">{req.description}</p>
                    {req.mandatory && (
                      <span className="text-[10px] text-non-compliant font-bold uppercase tracking-wider mt-0.5 block">
                        • Mandatory Requirement
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-text-secondary bg-surface-secondary px-2 py-0.5 rounded border border-border">
                      {req.category}
                    </span>
                  </td>

                  {/* Vendor Status Columns */}
                  {demoVendors.map(vendor => {
                    const result = demoComplianceResults.find(
                      (r: ComplianceResult) => r.vendorId === vendor.id && (r.requirement?.requirementId === req.requirementId || r.requirementId === req.id || r.requirementId === req.requirementId)
                    );
                    const status = result?.status || 'compliant';

                    return (
                      <td key={vendor.id} className="px-4 py-3.5 text-center">
                        <div className="inline-flex flex-col items-center">
                          {status === 'compliant' && (
                            <div className="flex items-center gap-1 text-compliant text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Pass</span>
                            </div>
                          )}
                          {status === 'manual_review' && (
                            <div className="flex items-center gap-1 text-manual-review text-xs font-bold">
                              <AlertCircle className="w-4 h-4" />
                              <span>Review</span>
                            </div>
                          )}
                          {status === 'non_compliant' && (
                            <div className="flex items-center gap-1 text-non-compliant text-xs font-bold">
                              <XCircle className="w-4 h-4" />
                              <span>Fail</span>
                            </div>
                          )}
                          {result?.confidence && (
                            <span className="text-[10px] text-text-tertiary mt-0.5">
                              {result.confidence}% conf.
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
