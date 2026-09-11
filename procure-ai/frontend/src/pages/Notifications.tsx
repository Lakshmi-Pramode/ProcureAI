import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, AlertCircle, AlertTriangle, Info, CheckCircle2,
  Trash2
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  read: boolean;
  link?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'High-Risk Collusive Bid Pattern Flagged',
    description: 'Bidders XYZ Industrial and Beta Corp share identical IP subnets on Tender CPCL/IT/2026/001.',
    time: '10 minutes ago',
    type: 'urgent',
    read: false,
    link: '/risk-center',
  },
  {
    id: 'n2',
    title: 'OEM Authorization Document Missing',
    description: 'ABC Technologies has not uploaded the required OEM Manufacturer Authorization Form for Item 4.',
    time: '25 minutes ago',
    type: 'warning',
    read: false,
    link: '/tenders/tender_001',
  },
  {
    id: 'n3',
    title: 'AI Verification Completed for 3 Bidders',
    description: 'BidGuard NLP engine has finished clause extraction and compliance matching for Tender CPCL/MECH/2026/003.',
    time: '1 hour ago',
    type: 'success',
    read: false,
    link: '/compliance',
  },
  {
    id: 'n4',
    title: 'GSTIN Invalidation Alert',
    description: 'External MCA21 API reported inactive status on registration for vendor MegaInfra Ltd.',
    time: '2 hours ago',
    type: 'urgent',
    read: true,
    link: '/bidders/v2',
  },
  {
    id: 'n5',
    title: 'Submission Window Closing Soon',
    description: 'Tender CPCL/SAFETY/2026/002 closes for bidder proposals in 48 hours.',
    time: '5 hours ago',
    type: 'info',
    read: true,
    link: '/tenders',
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'urgent') return n.type === 'urgent';
    return true;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Alerts & Notifications"
        subtitle="Real-time compliance alerts, deadline countdowns, and system risk warnings"
        breadcrumbs={[{ label: 'Notifications' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold hover:bg-surface-secondary flex items-center gap-1.5 transition"
            >
              <Check className="w-3.5 h-3.5" /> Mark All as Read
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-border">
        {(['all', 'unread', 'urgent'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
              filter === f
                ? 'bg-primary-600 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {f} {f === 'unread' && `(${notifications.filter(n => !n.read).length})`}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="bg-surface rounded-xl border border-border divide-y divide-border overflow-hidden shadow-sm">
        {filtered.length > 0 ? (
          filtered.map(item => (
            <div
              key={item.id}
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                !item.read ? 'bg-primary-50/20' : 'hover:bg-surface-secondary/40'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0">
                  {item.type === 'urgent' && <AlertCircle className="w-5 h-5 text-non-compliant" />}
                  {item.type === 'warning' && <AlertTriangle className="w-5 h-5 text-manual-review" />}
                  {item.type === 'info' && <Info className="w-5 h-5 text-primary-500" />}
                  {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-compliant" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-text-primary">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-primary-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
                  <p className="text-[11px] text-text-tertiary pt-0.5">{item.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.link && (
                  <Link
                    to={item.link}
                    className="px-2.5 py-1 rounded bg-surface-secondary hover:bg-surface-tertiary text-xs font-semibold text-primary-600 transition"
                  >
                    Investigate
                  </Link>
                )}
                <button
                  onClick={() => clearNotification(item.id)}
                  className="p-1.5 text-text-tertiary hover:text-non-compliant transition rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-text-tertiary">
            No notifications in this view.
          </div>
        )}
      </div>
    </div>
  );
}
