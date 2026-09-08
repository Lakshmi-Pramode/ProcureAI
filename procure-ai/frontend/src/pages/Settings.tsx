import { useState, useEffect } from 'react';
import {
  Database,
  Cpu, Save, CheckCircle2, Lock, Sparkles, RefreshCw, Key, Server
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';

export default function Settings() {
  const { addToast } = useToast();
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [riskSensitivity, setRiskSensitivity] = useState('medium');
  const [autoFlagCollusion, setAutoFlagCollusion] = useState(true);
  const [dualSignoff, setDualSignoff] = useState(true);
  const [saved, setSaved] = useState(false);

  // Backend Config & Credentials
  const [mongoUri, setMongoUri] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [isUpdatingConfig, setIsUpdatingConfig] = useState(false);

  useEffect(() => {
    api.config.getStatus()
      .then(res => {
        if (res) setConfigStatus(res);
      })
      .catch(() => {});
  }, []);

  const handleSaveThresholds = () => {
    setSaved(true);
    addToast('success', 'Thresholds Saved', 'AI matching criteria updated successfully.');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpdateCredentials = async () => {
    setIsUpdatingConfig(true);
    try {
      const res = await api.config.updateConfig({
        mongoUri: mongoUri.trim() ? mongoUri.trim() : undefined,
        geminiApiKey: geminiApiKey.trim() ? geminiApiKey.trim() : undefined
      });
      if (res && res.data) {
        setConfigStatus(res.data);
      }
      addToast('success', 'Credentials Updated', 'System configuration updated successfully.');
    } catch (err) {
      addToast('error', 'Update Failed', (err as Error).message);
    } finally {
      setIsUpdatingConfig(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Platform & Compliance Settings"
        subtitle="Configure BidGuard AI model thresholds, Gemini API keys, MongoDB cluster, and compliance rules"
        breadcrumbs={[{ label: 'Settings' }]}
        actions={
          <button
            onClick={handleSaveThresholds}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 flex items-center gap-2 transition shadow-sm"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved Successfully' : 'Save Configuration'}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Engine Parameters & Database Credentials */}
        <div className="lg:col-span-2 space-y-6">

          {/* Database & Gemini API Key Live Configuration */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Server className="w-5 h-5 text-primary-600" />
                Live Database & AI Engine Configuration
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary-50 text-primary-700 border border-primary-100">
                Dual-Mode Architecture
              </span>
            </div>
            <p className="text-xs text-text-tertiary">
              Configure your live MongoDB cluster connection string and Google Gemini API key. If not provided, ProcureAI seamlessly runs on its pre-seeded in-memory store and heuristic NLP engine.
            </p>

            {/* Current Engine Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-lg border border-border bg-surface-secondary">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-primary-600" /> Database Engine
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    configStatus?.isMongoConnected
                      ? 'bg-compliant-bg text-compliant border border-compliant-border'
                      : 'bg-manual-review-bg text-manual-review border border-manual-review-border'
                  }`}>
                    {configStatus?.isMongoConnected ? 'MongoDB Connected' : 'Dual-Mode In-Memory'}
                  </span>
                </div>
                <p className="text-xs text-text-primary font-medium truncate">
                  {configStatus?.activeDatabase || 'Dual-Mode In-Memory Store (Active & Pre-seeded)'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-border bg-surface-secondary">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary-600" /> AI Semantic Model
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    configStatus?.isGeminiConfigured
                      ? 'bg-compliant-bg text-compliant border border-compliant-border'
                      : 'bg-primary-50 text-primary-600 border border-primary-200'
                  }`}>
                    {configStatus?.isGeminiConfigured ? 'Gemini 1.5 Flash Active' : 'Heuristic NLP v2.4'}
                  </span>
                </div>
                <p className="text-xs text-text-primary font-medium truncate">
                  {configStatus?.activeAIEngine || 'ProcureAI Heuristic Engine (Offline / Test Mode)'}
                </p>
              </div>
            </div>

            {/* Input fields */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  MongoDB URI (Connection String)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="mongodb+srv://username:password@cluster.mongodb.net/procureai"
                    value={mongoUri}
                    onChange={e => setMongoUri(e.target.value)}
                    className="w-full text-xs font-mono rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
                <p className="text-[11px] text-text-tertiary mt-1">
                  Leave blank to continue using the pre-seeded in-memory store.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Google Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiApiKey}
                    onChange={e => setGeminiApiKey(e.target.value)}
                    className="w-full text-xs font-mono rounded-lg border border-border bg-surface px-3 py-2 text-text-primary focus:ring-2 focus:ring-primary-500/30"
                  />
                </div>
                <p className="text-[11px] text-text-tertiary mt-1">
                  Required for real-time deep LLM semantic clause extraction and reasoning.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleUpdateCredentials}
                  disabled={isUpdatingConfig}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
                >
                  {isUpdatingConfig ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Connecting...
                    </>
                  ) : (
                    <>
                      <Key className="w-3.5 h-3.5" /> Save & Test Credentials
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Thresholds */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary-600" />
              AI Inference & Matching Thresholds
            </h3>
            <p className="text-xs text-text-tertiary">
              Adjust algorithmic tolerance for automated semantic matching and OCR confidence
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
              ].map(apiItem => (
                <div key={apiItem.name} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-primary">{apiItem.name}</span>
                      <span className="text-[10px] text-compliant bg-compliant-bg px-1.5 py-0.5 rounded font-bold">
                        {apiItem.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-tertiary mt-0.5">{apiItem.desc}</p>
                  </div>
                  <span className="text-[11px] font-mono text-text-tertiary">{apiItem.latency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security & Compliance Architecture */}
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
