import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FileText, Users, ShieldCheck, Clock,
  CheckCircle, Eye
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import RiskBadge from '../components/shared/RiskBadge';
import Tabs from '../components/shared/Tabs';
import ComplianceScore from '../components/shared/ComplianceScore';
import { demoTender, demoTenders, demoRequirements, demoVendors, demoVendorScores } from '../data/demo';

const tabs = [
  { id: 'overview', label: 'Overview', icon: <FileText className="w-4 h-4" /> },
  { id: 'requirements', label: 'Requirements', icon: <ShieldCheck className="w-4 h-4" />, count: 15 },
  { id: 'bidders', label: 'Bidders', icon: <Users className="w-4 h-4" />, count: 3 },
  { id: 'compliance', label: 'Compliance', icon: <CheckCircle className="w-4 h-4" /> },
  { id: 'audit', label: 'Audit', icon: <Clock className="w-4 h-4" /> },
];

export default function TenderDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const tender = id === 'tender_001' ? demoTender : demoTenders.find(t => t.id === id) || demoTender;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={tender.title}
        subtitle={`${tender.tenderId} · ${tender.department}`}
        breadcrumbs={[
          { label: 'Tenders', to: '/tenders' },
          { label: tender.tenderId },
        ]}
        actions={
          <StatusBadge status={tender.status} size="md" />
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-text-tertiary font-medium uppercase">Total Bids</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{tender.vendors.length}</p>
        </div>
        <div className="bg-compliant-bg rounded-xl border border-compliant-border p-4">
          <p className="text-xs text-compliant font-medium uppercase">Verified</p>
          <p className="text-2xl font-bold text-compliant mt-1">1</p>
        </div>
        <div className="bg-manual-review-bg rounded-xl border border-manual-review-border p-4">
          <p className="text-xs text-manual-review font-medium uppercase">Pending Review</p>
          <p className="text-2xl font-bold text-manual-review mt-1">1</p>
        </div>
        <div className="bg-non-compliant-bg rounded-xl border border-non-compliant-border p-4">
          <p className="text-xs text-non-compliant font-medium uppercase">High Risk</p>
          <p className="text-2xl font-bold text-non-compliant mt-1">1</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Tender Information</h3>
                  <dl className="space-y-3">
                    {[
                      ['Tender ID', tender.tenderId],
                      ['Department', tender.department],
                      ['Organization', tender.organization],
                      ['Category', tender.category],
                      ['Status', tender.status.replace('_', ' ')],
                      ['Submission Deadline', new Date(tender.submissionDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-start gap-2">
                        <dt className="text-xs text-text-tertiary w-36 shrink-0 pt-0.5">{label}</dt>
                        <dd className="text-sm text-text-primary font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Description</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{tender.description}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-3">
              {demoRequirements.map((req) => (
                <div key={req.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-surface-secondary transition-colors">
                  <span className="text-xs font-bold text-primary-500 bg-primary-50 px-2 py-1 rounded-md shrink-0">{req.requirementId}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text-primary">{req.description}</p>
                      {req.mandatory ? (
                        <span className="text-[10px] font-bold text-non-compliant bg-non-compliant-bg px-1.5 py-0.5 rounded">MANDATORY</span>
                      ) : (
                        <span className="text-[10px] font-bold text-text-tertiary bg-surface-tertiary px-1.5 py-0.5 rounded">OPTIONAL</span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{req.condition}</p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-text-tertiary">
                      <span>Category: {req.category}</span>
                      <span>Page: {req.sourcePage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'bidders' && (
            <div className="space-y-4">
              {demoVendors.map(vendor => {
                const score = demoVendorScores.find(s => s.vendorId === vendor.id);
                return (
                  <div key={vendor.id} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:shadow-md hover:border-border-strong transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {vendor.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary">{vendor.name}</p>
                      <p className="text-xs text-text-tertiary">{vendor.vendorId} · {vendor.documents.length} documents</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold" style={{ color: (score?.overallScore || 0) >= 80 ? '#059669' : (score?.overallScore || 0) >= 50 ? '#d97706' : '#dc2626' }}>
                        {score?.overallScore || 0}%
                      </p>
                      <p className="text-[10px] text-text-tertiary">Score</p>
                    </div>
                    <RiskBadge level={score?.riskLevel || 'low'} />
                    <Link to={`/bidders/${vendor.id}`} className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 font-medium">
                      <Eye className="w-4 h-4" /> Details
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="text-center py-8">
              <div className="flex justify-center gap-8 flex-wrap">
                {demoVendorScores.map(vs => (
                  <div key={vs.vendorId} className="text-center">
                    <ComplianceScore score={vs.overallScore} size="sm" />
                    <p className="text-sm font-medium text-text-primary mt-3">{vs.vendorName}</p>
                    <p className="text-xs text-text-tertiary">{vs.compliant}/{vs.total} compliant</p>
                    <Link to={`/bidders/${vs.vendorId}`} className="text-xs text-primary-500 hover:text-primary-600 mt-2 inline-block font-medium">
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              {[
                { time: '08:00 AM', user: 'Rajesh Kumar', action: 'Tender created', status: 'completed' },
                { time: '08:30 AM', user: 'Rajesh Kumar', action: 'Tender document uploaded', status: 'completed' },
                { time: '09:00 AM', user: 'AI Engine', action: 'Document analysis started', status: 'completed' },
                { time: '09:05 AM', user: 'AI Engine', action: '15 requirements extracted', status: 'completed' },
                { time: '09:30 AM', user: 'Rajesh Kumar', action: 'Vendor ABC Technologies added', status: 'completed' },
                { time: '10:00 AM', user: 'Rajesh Kumar', action: '12 documents uploaded for ABC Technologies', status: 'completed' },
                { time: '11:30 AM', user: 'AI Engine', action: 'Compliance analysis completed', status: 'completed' },
              ].map((entry, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-secondary transition-colors">
                  <span className="text-xs font-mono text-text-tertiary w-20 shrink-0 pt-0.5">{entry.time}</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-text-primary">{entry.user}</span>
                    <span className="text-sm text-text-secondary"> — {entry.action}</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-compliant shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
