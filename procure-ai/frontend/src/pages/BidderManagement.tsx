import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, ChevronDown } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import RiskBadge from '../components/shared/RiskBadge';
import { demoVendors, demoVendorScores } from '../data/demo';
import { api } from '../services/api';
import type { Vendor, VendorScore } from '../types';

export default function BidderManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [vendors, setVendors] = useState<Vendor[]>(demoVendors);
  const [scores, setScores] = useState<VendorScore[]>(demoVendorScores);

  useEffect(() => {
    api.vendors.getAll().then(res => {
      if (res && res.length > 0) setVendors(res);
    }).catch(() => {});

    api.vendors.getScores('tender_001').then(res => {
      if (res && res.length > 0) setScores(res);
    }).catch(() => {});
  }, []);

  const bidders = vendors.map(v => {
    const score = scores.find(s => s.vendorId === v.id) || (v as any).score;
    return { ...v, score };
  });

  const filtered = bidders.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRisk = riskFilter === 'all' || b.score?.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Bidders" subtitle="Manage and review all bidder submissions" />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input type="text" placeholder="Search bidders..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition" />
        </div>
        <div className="relative">
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 text-sm rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition cursor-pointer">
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Bidder</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Tender</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Documents</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Compliance</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Risk</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b border-border/50 last:border-0 hover:bg-surface-secondary transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {b.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{b.name}</p>
                        <p className="text-xs text-text-tertiary">{b.vendorId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-text-secondary font-mono text-xs">{b.tenderIds?.[0] || 'N/A'}</td>
                  <td className="px-6 py-3.5 text-text-secondary">
                    <span className="font-semibold">{b.documents.length}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="font-bold" style={{ color: (b.score?.overallScore || 0) >= 80 ? '#059669' : (b.score?.overallScore || 0) >= 50 ? '#d97706' : '#dc2626' }}>
                      {b.score?.overallScore || 0}%
                    </span>
                  </td>
                  <td className="px-6 py-3.5"><RiskBadge level={b.score?.riskLevel || 'low'} /></td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={
                      (b.score?.overallScore || 0) >= 80 ? 'compliant' :
                      (b.score?.overallScore || 0) >= 50 ? 'manual_review' : 'non_compliant'
                    } />
                  </td>
                  <td className="px-6 py-3.5">
                    <Link to={`/bidders/${b.id}`} className="flex items-center gap-1.5 text-primary-500 hover:text-primary-600 font-medium text-xs">
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </Link>
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
