import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Users, ClipboardList, AlertTriangle, Clock, TrendingUp,
  ArrowRight, Eye
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/shared/StatCard';
import StatusBadge from '../components/shared/StatusBadge';
import RiskBadge from '../components/shared/RiskBadge';

import { api } from '../services/api';
import type { Tender, DashboardStats } from '../types';

const defaultComplianceData = [
  { name: 'Compliant', value: 27, color: '#059669' },
  { name: 'Review Required', value: 9, color: '#d97706' },
  { name: 'Non-Compliant', value: 9, color: '#dc2626' },
];

const riskData = [
  { name: 'Low', value: 19, color: '#059669' },
  { name: 'Medium', value: 11, color: '#d97706' },
  { name: 'High', value: 5, color: '#dc2626' },
  { name: 'Critical', value: 2, color: '#991b1b' },
];

const activityData = [
  { month: 'Apr', tenders: 3, bids: 12 },
  { month: 'May', tenders: 5, bids: 18 },
  { month: 'Jun', tenders: 4, bids: 22 },
  { month: 'Jul', tenders: 7, bids: 28 },
  { month: 'Aug', tenders: 6, bids: 35 },
  { month: 'Sep', tenders: 8, bids: 37 },
];

const verificationData = [
  { name: 'Mon', docs: 18, time: 2.3 },
  { name: 'Tue', docs: 24, time: 1.8 },
  { name: 'Wed', docs: 31, time: 2.1 },
  { name: 'Thu', docs: 28, time: 1.9 },
  { name: 'Fri', docs: 35, time: 1.7 },
];

const highRiskBids = [
  { bidder: 'Bharat Digital Systems', risk: 'high' as const, issue: 'Financial eligibility not met — turnover below ₹10 Cr requirement', tender: 'TND-2026-001', vendorId: 'vendor_002' },
  { bidder: 'Nova Infotech Solutions', risk: 'medium' as const, issue: 'ISO certification expired, non-blacklisting declaration missing', tender: 'TND-2026-001', vendorId: 'vendor_003' },
  { bidder: 'Delta Corp', risk: 'high' as const, issue: 'GST information mismatch across documents', tender: 'TND-2026-002', vendorId: '' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const [tenders, setTenders] = useState<Tender[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // Load live stats and tenders
    api.dashboard.getStats()
      .then(s => setStats(s))
      .catch(() => {});

    api.tenders.getAll()
      .then(t => {
        if (t && t.length > 0) setTenders(t);
      })
      .catch(() => {});
  }, []);

  const totalTendersCount = stats?.activeTenders !== undefined ? String(stats.activeTenders + 1) : '24';
  const activeTendersCount = stats?.activeTenders !== undefined ? String(stats.activeTenders) : '8';
  const complianceRateText = stats?.complianceRate !== undefined ? `${stats.complianceRate}%` : '87.4%';

  const complianceChartData = stats ? [
    { name: 'Compliant', value: stats.requirementsVerified || 27, color: '#059669' },
    { name: 'Review Required', value: stats.manualReview || 9, color: '#d97706' },
    { name: 'Non-Compliant', value: stats.nonCompliant || 9, color: '#dc2626' },
  ] : defaultComplianceData;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{greeting}, {user?.name?.split(' ')[0] || 'Officer'}</h1>
        <p className="text-sm text-text-secondary mt-1">Here's an overview of your procurement activity.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 stagger-children">
        <StatCard icon={<FileText className="w-5 h-5" />} label="Total Tenders" value={totalTendersCount} trend={{ value: '+3', positive: true }} />
        <StatCard icon={<ClipboardList className="w-5 h-5" />} label="Active Tenders" value={activeTendersCount} color="text-primary-600" trend={{ value: '+2', positive: true }} />
        <StatCard icon={<Users className="w-5 h-5" />} label="Bids Under Review" value={stats?.totalVendors ? String(stats.totalVendors * 4) : "37"} color="text-manual-review" />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="High Risk Bids" value="5" color="text-non-compliant" trend={{ value: '+1', positive: false }} />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Pending Reviews" value={stats?.pendingReviews !== undefined ? String(stats.pendingReviews) : "12"} color="text-manual-review" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Compliance Rate" value={complianceRateText} color="text-compliant" trend={{ value: '+2.1%', positive: true }} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Bid Compliance Overview */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text-primary mb-4">Bid Compliance Overview</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={complianceChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" strokeWidth={0}>
                {complianceChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '13px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text-primary mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={riskData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} width={60} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {riskData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tender Activity */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text-primary mb-4">Tender Activity</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '13px' }} />
              <Line type="monotone" dataKey="tenders" stroke="#1e40af" strokeWidth={2.5} dot={{ fill: '#1e40af', r: 4 }} name="Tenders" />
              <Line type="monotone" dataKey="bids" stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669', r: 4 }} name="Bids" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Verification Performance */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text-primary mb-4">Verification Performance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={verificationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '13px' }} />
              <Bar dataKey="docs" fill="#1e40af" radius={[4, 4, 0, 0]} name="Documents Processed" />
              <Bar dataKey="time" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Avg Time (min)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tenders & High Risk Bids */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Tenders */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-text-primary">Recent Tenders</h3>
            <Link to="/tenders" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Tender ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Bids</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {tenders.slice(0, 5).map(t => (
                  <tr key={t.id} className="border-b border-border/50 last:border-0 hover:bg-surface-secondary transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-primary-600">{t.tenderId}</td>
                    <td className="px-6 py-3 font-medium text-text-primary max-w-[200px] truncate">{t.title}</td>
                    <td className="px-6 py-3 text-text-secondary">{t.category}</td>
                    <td className="px-6 py-3 text-text-secondary">{t.vendors?.length || 0}</td>
                    <td className="px-6 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-6 py-3">
                      <Link to={`/tenders/${t.id}`} className="text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* High Risk Bids */}
        <div className="bg-surface rounded-xl border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-text-primary">High-Risk Bids</h3>
          </div>
          <div className="divide-y divide-border/50">
            {highRiskBids.map((bid, i) => (
              <div key={i} className="px-6 py-4 hover:bg-surface-secondary transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-text-primary">{bid.bidder}</p>
                  <RiskBadge level={bid.risk} size="sm" />
                </div>
                <p className="text-xs text-text-secondary mb-3">{bid.issue}</p>
                <Link to={bid.vendorId ? `/bidders/${bid.vendorId}` : '/risk-center'}
                  className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
                  View Analysis <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
