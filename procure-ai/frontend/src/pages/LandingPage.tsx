import { Link } from 'react-router-dom';
import {
  Shield, ArrowRight, Upload, Search, FileCheck, BarChart3,
  Brain, AlertTriangle, ScrollText, Lock,
  ChevronRight, Zap, Eye, ShieldCheck
} from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI Document Extraction', desc: 'Automatically extract and parse information from bidder documents using advanced OCR and NLP.' },
  { icon: FileCheck, title: 'Automated Compliance Verification', desc: 'Verify bidder documents against tender requirements with AI-powered analysis.' },
  { icon: Search, title: 'Cross-Document Consistency', desc: 'Detect inconsistencies across multiple documents from the same bidder.' },
  { icon: AlertTriangle, title: 'Risk Detection', desc: 'Identify potential risks including expired certificates, data mismatches, and missing documents.' },
  { icon: Eye, title: 'Explainable AI Recommendations', desc: 'Every recommendation comes with clear evidence and reasoning — no black box.' },
  { icon: BarChart3, title: 'Compliance Scoring', desc: 'Quantified compliance scores with detailed breakdowns by category.' },
  { icon: ScrollText, title: 'Audit Trail', desc: 'Complete audit trail of every action for transparency and accountability.' },
  { icon: Zap, title: 'Procurement Analytics', desc: 'Real-time dashboards with actionable insights on procurement activity.' },
];

const steps = [
  { num: '01', label: 'Upload', desc: 'Upload tender and bidder documents', icon: Upload },
  { num: '02', label: 'Extract', desc: 'AI extracts key information via OCR', icon: Brain },
  { num: '03', label: 'Verify', desc: 'Documents verified against requirements', icon: FileCheck },
  { num: '04', label: 'Analyze', desc: 'Cross-document consistency checks', icon: Search },
  { num: '05', label: 'Score', desc: 'Compliance score generated', icon: BarChart3 },
  { num: '06', label: 'Recommend', desc: 'AI recommendation with evidence', icon: ShieldCheck },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-text-primary">BidGuard AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors">Sign In</Link>
            <Link to="/login" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white" />
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-600 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" /> AI-Powered Procurement Compliance & Risk Intelligence
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-text-primary leading-tight tracking-tight">
              Smarter Procurement.{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                Verified Compliance.
              </span>
            </h1>
            <p className="text-xl text-text-secondary mt-6 leading-relaxed max-w-2xl mx-auto">
              BidGuard AI transforms complex bidder documents into explainable compliance, risk and decision intelligence — powering smarter procurement for GeM.
            </p>
            <div className="flex items-center justify-center gap-4 mt-10">
              <Link to="/login"
                className="px-6 py-3 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 flex items-center gap-2">
                Explore Demo <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works"
                className="px-6 py-3 bg-white text-text-primary text-sm font-semibold rounded-xl border border-border hover:border-border-strong hover:shadow-md transition-all flex items-center gap-2">
                How It Works <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Hero Visual — Dashboard Preview */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-border shadow-2xl shadow-primary-900/5 p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-compliant-bg rounded-xl p-4 border border-compliant-border">
                  <p className="text-2xl font-bold text-compliant">87.4%</p>
                  <p className="text-xs font-medium text-compliant mt-1">Compliance Score</p>
                </div>
                <div className="bg-manual-review-bg rounded-xl p-4 border border-manual-review-border">
                  <p className="text-2xl font-bold text-manual-review">Medium</p>
                  <p className="text-xs font-medium text-manual-review mt-1">Risk Level</p>
                </div>
                <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
                  <p className="text-2xl font-bold text-primary-600">142</p>
                  <p className="text-xs font-medium text-primary-600 mt-1">Docs Verified</p>
                </div>
                <div className="bg-surface-tertiary rounded-xl p-4 border border-border">
                  <p className="text-2xl font-bold text-text-primary">Proceed</p>
                  <p className="text-xs font-medium text-text-secondary mt-1">AI Recommendation</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {['GST Certificate — Verified ✓', 'PAN Card — Verified ✓', 'OEM Auth — Missing ✕'].map((doc, i) => (
                  <div key={i} className={`text-xs font-medium px-3 py-2 rounded-lg border ${
                    i < 2 ? 'bg-compliant-bg border-compliant-border text-compliant' : 'bg-non-compliant-bg border-non-compliant-border text-non-compliant'
                  }`}>
                    {doc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 bg-surface-secondary">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary">The Problem</h2>
          <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto leading-relaxed">
            Procurement officers spend countless hours manually reviewing bidder documents — checking GST certificates, PAN cards, financial statements, and dozens of eligibility requirements. This manual process is slow, error-prone, and lacks consistency across evaluations. Critical issues like expired certificates, document inconsistencies, and non-compliant bids can easily be missed.
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary">The Solution</h2>
          <p className="text-lg text-text-secondary mt-4 max-w-3xl mx-auto leading-relaxed">
            BidGuard AI automates the entire document analysis and compliance verification workflow. Using OCR, NLP, and intelligent matching algorithms, it extracts information from bidder documents, verifies them against tender requirements, checks cross-document consistency, detects risks, and generates explainable AI recommendations — all in minutes instead of hours.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-surface-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="bg-white rounded-xl border border-border p-5 text-center hover:shadow-lg hover:border-primary-200 transition-all duration-300 h-full">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-3">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wider">{step.num}</p>
                  <p className="text-sm font-bold text-text-primary mt-1">{step.label}</p>
                  <p className="text-xs text-text-secondary mt-1.5">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-4 h-4 text-primary-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-4">Key Features</h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">Everything you need for intelligent procurement compliance verification.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center mb-4 group-hover:bg-primary-100 group-hover:scale-110 transition-all">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-6 bg-primary-800">
        <div className="max-w-5xl mx-auto text-center">
          <Lock className="w-12 h-12 text-primary-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Enterprise-Grade Security & Trust</h2>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto mb-8">
            Built for government procurement with audit trails, role-based access, and complete transparency in every AI decision.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: ScrollText, label: 'Complete Audit Trail' },
              { icon: ShieldCheck, label: 'Explainable AI Decisions' },
              { icon: Lock, label: 'Role-Based Access Control' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-primary-700/40 border border-primary-600/30">
                <item.icon className="w-6 h-6 text-primary-300" />
                <p className="text-sm font-medium text-white">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Ready to Transform Procurement?</h2>
          <p className="text-lg text-text-secondary mb-8">Start evaluating bids with AI-powered compliance verification.</p>
          <Link to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 hover:shadow-xl text-lg">
            Start Evaluating Bids <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 bg-surface-secondary">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-500" />
            <span className="font-bold text-text-primary">BidGuard AI</span>
          </div>
          <p className="text-xs text-text-tertiary">AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement</p>
        </div>
      </footer>
    </div>
  );
}
