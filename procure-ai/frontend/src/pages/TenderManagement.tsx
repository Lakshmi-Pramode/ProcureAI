import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Upload, Search, Eye, Calendar, ChevronDown } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import { demoTenders } from '../data/demo';

const allTenders = [
  ...demoTenders,
  { id: 't4', tenderId: 'CPCL/MECH/2026/003', title: 'Supply of Industrial Valves and Fittings', department: 'Mechanical', category: 'Goods', status: 'published' as const, vendors: ['v1','v2','v3','v4'], submissionDeadline: '2026-10-20T17:00:00.000Z', createdAt: '2026-08-15T06:00:00.000Z' },
  { id: 't5', tenderId: 'CPCL/HR/2026/005', title: 'Manpower Outsourcing Services', department: 'Human Resources', category: 'Services', status: 'completed' as const, vendors: ['v1','v2'], submissionDeadline: '2026-08-01T17:00:00.000Z', createdAt: '2026-07-01T06:00:00.000Z' },
  { id: 't6', tenderId: 'CPCL/SAFETY/2026/002', title: 'Fire Safety Equipment Procurement', department: 'Safety', category: 'Goods', status: 'under_evaluation' as const, vendors: ['v1','v2','v3','v4','v5'], submissionDeadline: '2026-09-25T17:00:00.000Z', createdAt: '2026-08-10T06:00:00.000Z' },
];

export default function TenderManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = allTenders.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tenderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Tenders"
        subtitle="Manage and monitor all procurement tenders"
        actions={
          <>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-tertiary transition-colors">
              <Upload className="w-4 h-4" /> Import Tender
            </button>
            <Link to="/tenders/create"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Create Tender
            </Link>
          </>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text" placeholder="Search tenders..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition"
          />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 text-sm rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition cursor-pointer">
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Active</option>
            <option value="under_evaluation">Evaluation</option>
            <option value="completed">Completed</option>
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Tender ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Tender Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Department</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Bids</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Deadline</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Created</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-b border-border/50 last:border-0 hover:bg-surface-secondary transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs text-primary-600">{t.tenderId}</td>
                  <td className="px-6 py-3.5 font-medium text-text-primary max-w-[220px] truncate">{t.title}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{t.department}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{t.category}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{t.vendors.length}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={t.status} /></td>
                  <td className="px-6 py-3.5 text-text-secondary text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(t.submissionDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-text-tertiary text-xs">
                    {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-6 py-3.5">
                    <Link to={`/tenders/${t.id}`} className="flex items-center gap-1.5 text-primary-500 hover:text-primary-600 font-medium text-xs">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-border flex items-center justify-between text-xs text-text-tertiary">
          <span>Showing {filtered.length} of {allTenders.length} tenders</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border border-border hover:bg-surface-tertiary transition-colors">Previous</button>
            <button className="px-3 py-1 rounded bg-primary-600 text-white">1</button>
            <button className="px-3 py-1 rounded border border-border hover:bg-surface-tertiary transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
