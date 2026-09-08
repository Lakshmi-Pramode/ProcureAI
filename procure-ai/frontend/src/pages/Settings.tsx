import { useState } from 'react';
import {
  Database,
  Cpu, Save, CheckCircle2, Lock
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';

export default function Settings() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [riskSensitivity, setRiskSensitivity] = useState('medium');
  const [autoFlagCollusion, setAutoFlagCollusion] = useState(true);
  const [dualSignoff, setDualSignoff] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Platform & Compliance Settings"
        subtitle="Configure BidGuard AI model thresholds, GeM integration parameters, and compliance rules"
        breadcrumbs={[{ label: 'Settings' }]}
        actions={
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 flex items-center gap-2 transition shadow-sm"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved Successfully' : 'Save Configuration'}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Engine Parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Thresholds */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary-600" />
              AI Inference & Matching Thresholds
            </h3>
            <p className="text-xs text-text-tertiary">
              Adjust the algorithmic tolerance for automated semantic matching and OCR confidence
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-semibold text-text-secondary">Minimum NLP Confidence for Auto-Pass</span>
                  <span className="font-mono font-bold text-primary-600">{confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={confidenceThreshold}
                  onChange={e => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <p className="text-[11px] text-text-tertiary mt-1">
                  Matches below {confidenceThreshold}% are automatically routed to Procurement Officer for manual review.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Cartel & Collusion Sensitivity
                </label>
                <select
                  value={riskSensitivity}
                  onChange={e => setRiskSensitivity(e.target.value)}
                  className="w-full text-xs rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
                >
                  <option value="high">High — Strict IP subnet, bank branch & DIN matching</option>
                  <option value="medium">Medium — Balanced standard GeM audit scrutiny</option>
                  <option value="low">Low — Flag only deterministic exact-match anomalies</option>
                </select>
              </div>

              <div className="pt-2 border-t border-border space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoFlagCollusion}
                    onChange={e => setAutoFlagCollusion(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded border-border focus:ring-primary-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-text-primary block">Automated Collusion Flagging</span>
                    <span className="text-[11px] text-text-tertiary">Instantly generate warning banner when bidders share directors or IP subnets</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dualSignoff}
                    onChange={e => setDualSignoff(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded border-border focus:ring-primary-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-text-primary block">Mandatory Dual-Officer Signoff</span>
                    <span className="text-[11px] text-text-tertiary">Requires secondary approving officer signoff before disqualifying a bid</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Connected External Registries */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Database className="w-5 h-5 text-primary-600" />
              Connected Government Registries & APIs
            </h3>
            <p className="text-xs text-text-tertiary">Real-time connectors verifying bidder credentials</p>

            <div className="divide-y divide-border">
              {[
                { name: 'GeM Procurement Core API', desc: 'Syncs tenders, bids, and vendor catalogs', status: 'Operational', latency: '42ms' },
                { name: 'MCA21 Company Master Data', desc: 'Validates CIN, incorporation date, and active DIN directors', status: 'Operational', latency: '118ms' },
                { name: 'GSTN Tax Verification Gateway', desc: 'Validates 15-digit GSTIN, return filing status & GSTR-3B', status: 'Operational', latency: '95ms' },
                { name: 'CVC / GeM Debarment Register', desc: 'Real-time blacklist screening against banned supplier list', status: 'Operational', latency: '35ms' },
              ].map(api => (
                <div key={api.name} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">{api.name}</span>
                      <span className="text-[10px] text-compliant bg-compliant-bg px-1.5 py-0.5 rounded font-bold">
                        {api.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-tertiary mt-0.5">{api.desc}</p>
                  </div>
                  <span className="text-[11px] font-mono text-text-tertiary">{api.latency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security & Compliance Seal */}
        <div className="space-y-6">
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">Compliance Architecture</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              BidGuard AI operates in compliance with <strong>GFR 2017 Rule 149</strong> and <strong>MeitY Guidelines for Responsible AI in Governance</strong>.
            </p>

            <div className="space-y-2 text-xs text-text-secondary border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Cryptographic Integrity:</span>
                <span className="font-semibold text-text-primary">SHA-256</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Data Center Hosting:</span>
                <span className="font-semibold text-text-primary">NIC Cloud (MeitY)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Audit Trail Retention:</span>
                <span className="font-semibold text-text-primary">7 Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Engine Version:</span>
                <span className="font-semibold text-text-primary">v2.4.0-sih</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
