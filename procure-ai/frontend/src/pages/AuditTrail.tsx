import { useState, useEffect } from 'react';
import {
  Search, ShieldCheck, Download,
  Clock, Laptop
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import type { AuditEntry } from '../types';
import { demoAuditLog } from '../data/demo';
import { api } from '../services/api';

export default function AuditTrail() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [logs, setLogs] = useState<AuditEntry[]>(demoAuditLog);

  useEffect(() => {
    api.audit.getAll().then(res => {
      if (res && res.length > 0) setLogs(res);
    }).catch(() => {});
  }, []);

  const filteredLogs: AuditEntry[] = logs.filter((entry: AuditEntry) => {
    const matchSearch = entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        entry.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAction = selectedAction === 'all' || entry.action.toLowerCase().includes(selectedAction.toLowerCase());
    return matchSearch && matchAction;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Immutable Audit Trail & Integrity Log"
        subtitle="Cryptographically verified chronology of every evaluation, officer override, and document ingestion event"
        breadcrumbs={[{ label: 'Audit Trail' }]}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-compliant bg-compliant-bg border border-compliant-border px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Chain of Custody Verified
            </span>
            <button onClick={() => window.print()} className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold hover:bg-surface-secondary flex items-center gap-1.5 transition">
              <Download className="w-3.5 h-3.5" /> Export Log
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-text-tertiary mr-2">Filter Event:</span>
          {['all', 'Verification', 'Override', 'Upload', 'Status'].map(act => (
            <button
              key={act}
              onClick={() => setSelectedAction(act.toLowerCase())}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition ${
                selectedAction === act.toLowerCase()
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-surface-secondary text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {act}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search action, officer, or IP..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left px-5 py-3 font-semibold text-text-tertiary uppercase w-44">Timestamp</th>
                <th className="text-left px-5 py-3 font-semibold text-text-tertiary uppercase w-48">Actor & Identity</th>
                <th className="text-left px-5 py-3 font-semibold text-text-tertiary uppercase w-48">Action</th>
                <th className="text-left px-5 py-3 font-semibold text-text-tertiary uppercase">Details & Context</th>
                <th className="text-right px-5 py-3 font-semibold text-text-tertiary uppercase w-32">Block Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans">
              {filteredLogs.map((log: AuditEntry) => (
                <tr key={log.id} className="hover:bg-surface-secondary/50 transition">
                  <td className="px-5 py-3.5 text-text-secondary whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[10px]">
                        {log.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{log.userName}</p>
                        <p className="text-[10px] text-text-tertiary flex items-center gap-1">
                          <Laptop className="w-2.5 h-2.5" /> {log.userId || 'officer_01'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${
                      log.action.includes('Approved') || log.action.includes('Pass')
                        ? 'bg-compliant-bg text-compliant border border-compliant-border'
                        : log.action.includes('Flagged') || log.action.includes('Override')
                        ? 'bg-manual-review-bg text-manual-review border border-manual-review-border'
                        : 'bg-primary-50 text-primary-700 border border-primary-200'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-text-secondary leading-relaxed">
                    {log.details}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-[10px] text-text-tertiary">
                    <span title="SHA-256 Hash" className="hover:text-primary-600 cursor-pointer">
                      #{log.id.slice(0, 8)}
                    </span>
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
