import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText, ShieldCheck, AlertTriangle, Clock, CheckCircle2,
  XCircle, AlertCircle, Download, ExternalLink,
  Building2, Mail, Phone, MapPin, Award
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import RiskBadge from '../components/shared/RiskBadge';
import Tabs from '../components/shared/Tabs';
import ComplianceScore from '../components/shared/ComplianceScore';
import DocumentCard from '../components/shared/DocumentCard';
import type { ComplianceResult, VendorDocument, RiskFactor, Inconsistency, AuditEntry, Vendor } from '../types';
import { demoVendors, demoComplianceResults,
  demoRiskAssessments, demoVendorScores, demoExternalVerifications,
  demoAuditLog } from '../data/demo';
import { api } from '../services/api';

export default function BidderDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('compliance');
  const [vendor, setVendor] = useState<Vendor>(demoVendors.find(v => v.id === id) || demoVendors[0]);
  const [compliance, setCompliance] = useState<ComplianceResult[]>(demoComplianceResults.filter(c => c.vendorId === (id || demoVendors[0].id)));
  const [risk, setRisk] = useState<any>(demoRiskAssessments[id || demoVendors[0].id]);
  const [documents, setDocuments] = useState<VendorDocument[]>(demoVendors[0].documents || []);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = async () => {
    if (!id || !vendor.tenderIds || vendor.tenderIds.length === 0) return;
    setIsEvaluating(true);
    try {
      await api.verification.verify(vendor.tenderIds[0], id);
      // Fetch updated data after evaluation
      const res = await api.vendors.getById(id);
      if (res) {
        setVendor(res);
        if (res.documents) setDocuments(res.documents);
        if (res.complianceResults && res.complianceResults.length > 0) setCompliance(res.complianceResults);
        if (res.riskAssessment) setRisk(res.riskAssessment);
      }
    } catch (err) {
      console.error(err);
      alert('Evaluation failed or AI Service not reachable.');
    } finally {
      setIsEvaluating(false);
    }
  };

  useEffect(() => {
    if (id) {
      api.vendors.getById(id)
        .then(res => {
          if (res) {
            setVendor(res);
            if (res.documents) setDocuments(res.documents);
            if (res.complianceResults && res.complianceResults.length > 0) setCompliance(res.complianceResults);
            if (res.riskAssessment) setRisk(res.riskAssessment);
          }
        })
        .catch(() => {});
    }
  }, [id]);

  const score = demoVendorScores.find(s => s.vendorId === vendor.id);
  const auditEntries: AuditEntry[] = demoAuditLog.filter(a => a.details.includes(vendor.name) || a.vendorId === vendor.id);

  if (!vendor) return <div className="p-8 text-center text-text-secondary">Loading...</div>;

  const tabs = [
    { id: 'compliance', label: 'Compliance Criteria', icon: <ShieldCheck className="w-4 h-4" />, count: compliance.length },
    { id: 'documents', label: 'Submitted Documents', icon: <FileText className="w-4 h-4" />, count: documents.length },
    { id: 'risks', label: 'Risk & Anomalies', icon: <AlertTriangle className="w-4 h-4" />, count: (risk?.factors?.length || 0) + (risk?.inconsistencies?.length || 0) },
    { id: 'verifications', label: 'External Verifications', icon: <CheckCircle2 className="w-4 h-4" />, count: demoExternalVerifications.length },
    { id: 'audit', label: 'Audit Trail', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title={vendor.name}
        subtitle={`Bidder Profile & Verification Analysis — ${vendor.id}`}
        breadcrumbs={[
          { label: 'Bidders', to: '/bidders' },
          { label: vendor.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface-secondary flex items-center gap-2 transition">
              <Download className="w-4 h-4" /> Export Report
            </button>
            <button 
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm transition disabled:opacity-50">
              {isEvaluating ? 'Evaluating...' : 'Evaluate Bid'}
            </button>
          </div>
        }
      />

      {/* Overview Top Card */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          {/* Vendor Details */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-600 flex items-center justify-center font-bold text-lg">
                {vendor.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-text-primary">{vendor.name}</h2>
                  <StatusBadge status="active" />
                </div>
                <p className="text-xs text-text-tertiary">Registered on GeM • ID: {vendor.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary pt-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                <span className="truncate">GSTIN: {vendor.gstNumber || '29AABCP1234F1Z5'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                <span className="truncate">PAN: {vendor.panNumber || 'AABCP1234F'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                <span className="truncate">{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                <span className="truncate">{vendor.phone}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                <span className="truncate">{vendor.address}</span>
              </div>
            </div>
          </div>

          {/* Compliance & Risk Cards */}
          <div className="flex items-center justify-around p-4 rounded-xl bg-surface-secondary border border-border/80">
            <ComplianceScore score={score?.overallScore || 85} size="lg" />
          </div>

          <div className="flex flex-col justify-center space-y-3 p-4 rounded-xl bg-surface-secondary border border-border/80">
            <div>
              <span className="text-xs text-text-tertiary uppercase font-semibold">Risk Rating</span>
              <div className="mt-1 flex items-center gap-2">
                <RiskBadge level={score?.riskLevel || 'low'} />
              </div>
            </div>
            <div>
              <span className="text-xs text-text-tertiary uppercase font-semibold">Tender Submitted</span>
              <p className="text-sm font-semibold text-text-primary mt-0.5">CPCL/IT/2026/001</p>
              <Link to="/tenders/tender_001" className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1 mt-0.5">
                View Tender <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="p-6">
          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-text-primary">Compliance Verification Results</h3>
                  <p className="text-xs text-text-tertiary">Verified against tender clauses by BidGuard AI extraction engine</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-compliant-bg text-compliant border border-compliant-border">
                    {compliance.filter((c: ComplianceResult) => c.status === 'compliant').length} Compliant
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-manual-review-bg text-manual-review border border-manual-review-border">
                    {compliance.filter((c: ComplianceResult) => c.status === 'manual_review').length} Review Needed
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-non-compliant-bg text-non-compliant border border-non-compliant-border">
                    {compliance.filter((c: ComplianceResult) => c.status === 'non_compliant').length} Non-Compliant
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {compliance.map((item: ComplianceResult) => (
                  <div key={item.id} className="p-4 rounded-xl border border-border bg-surface hover:border-primary-200 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                            {item.requirement?.requirementId || item.requirementId}
                          </span>
                          <StatusBadge status={item.status} />
                          <span className="text-xs text-text-tertiary">Confidence: {item.confidence}%</span>
                        </div>
                        <p className="text-sm font-semibold text-text-primary mt-1">{item.requirement?.description || 'Requirement Specification'}</p>
                        <p className="text-xs text-text-secondary">{item.explanation}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-xs text-text-tertiary">Source: {item.evidenceDocumentName}</span>
                        <div className="text-[11px] text-text-tertiary mt-1">Page {item.evidencePage || 1}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc: VendorDocument) => (
                <DocumentCard
                  key={doc.id}
                  name={doc.fileName}
                  type={doc.documentType}
                  status={doc.status}
                  uploadDate={doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : undefined}
                  size={doc.fileSize ? `${(doc.fileSize / 1024).toFixed(0)} KB` : '1.2 MB'}
                  onView={() => doc.filePath ? window.open(doc.filePath, '_blank') : alert('No file available for preview in demo mode.')}
                />
              ))}
            </div>
          )}

          {/* Risks & Inconsistencies Tab */}
          {activeTab === 'risks' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-manual-review" /> Identified Risk Factors
                </h3>
                {risk && risk.factors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {risk.factors.map((f: RiskFactor) => (
                      <div key={f.id} className="p-4 rounded-xl border border-border bg-surface-secondary space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-text-primary">{f.category} Risk</span>
                          <RiskBadge level={f.severity} />
                        </div>
                        <p className="text-xs text-text-secondary">{f.description}</p>
                        <div className="text-[11px] text-text-tertiary">Impact: {f.impact}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-text-tertiary p-4 rounded-lg bg-surface-secondary">No major risk factors flagged.</div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-non-compliant" /> Cross-Document Inconsistencies
                </h3>
                {risk && risk.inconsistencies.length > 0 ? (
                  <div className="space-y-3">
                    {risk.inconsistencies.map((inc: Inconsistency) => (
                      <div key={inc.id} className="p-4 rounded-xl border border-non-compliant/20 bg-non-compliant-bg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-non-compliant">{inc.field} Discrepancy</span>
                          <span className="text-xs font-semibold text-non-compliant px-2 py-0.5 rounded bg-non-compliant/10 uppercase">
                            {inc.severity} Severity
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">{inc.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div className="p-2 rounded bg-surface border border-border">
                            <span className="text-text-tertiary block text-[11px]">Doc A: {inc.document1}</span>
                            <span className="font-semibold text-text-primary">{inc.value1}</span>
                          </div>
                          <div className="p-2 rounded bg-surface border border-border">
                            <span className="text-text-tertiary block text-[11px]">Doc B: {inc.document2}</span>
                            <span className="font-semibold text-text-primary">{inc.value2}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-text-tertiary p-4 rounded-lg bg-surface-secondary">No cross-document inconsistencies detected.</div>
                )}
              </div>
            </div>
          )}

          {/* External Verifications Tab */}
          {activeTab === 'verifications' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demoExternalVerifications.map((v, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-surface hover:border-primary-300 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-text-primary">{v.service}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            v.status === 'connected' || v.status === 'demo' ? 'bg-compliant-bg text-compliant' :
                            v.status === 'pending' ? 'bg-manual-review-bg text-manual-review' :
                            'bg-non-compliant-bg text-non-compliant'
                          }`}>
                            {v.status}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">{v.result || 'Connected to live endpoint'}</p>
                      </div>
                      {v.status === 'connected' || v.status === 'demo' ? (
                        <CheckCircle2 className="w-5 h-5 text-compliant shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-manual-review shrink-0" />
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-tertiary">
                      <span>Source: Ministry / Agency API</span>
                      <span>Verified: {v.lastChecked ? new Date(v.lastChecked).toLocaleDateString() : 'Active'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              {auditEntries.length > 0 ? (
                auditEntries.map((entry: AuditEntry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-surface-secondary transition">
                    <Clock className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-text-primary">{entry.action}</p>
                        <span className="text-[11px] text-text-tertiary">{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">{entry.details}</p>
                      <p className="text-[10px] text-text-tertiary mt-1">By: {entry.userName}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-text-tertiary p-4 rounded-lg bg-surface-secondary">No specific audit entries recorded for this bidder.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
