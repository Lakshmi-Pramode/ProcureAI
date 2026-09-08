import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const mockNotifications = [
  { id: '1', title: 'High-risk bid detected', desc: 'XYZ Industries flagged for GST mismatch', time: '5m ago', type: 'error' as const },
  { id: '2', title: 'OEM authorization missing', desc: 'ABC Technologies — TND-2026-001', time: '12m ago', type: 'warning' as const },
  { id: '3', title: 'Tender closing soon', desc: 'TND-2026-001 closes in 3 days', time: '1h ago', type: 'info' as const },
  { id: '4', title: 'Compliance analysis completed', desc: 'All 3 vendors evaluated', time: '2h ago', type: 'success' as const },
];

const notifDots = {
  error: 'bg-non-compliant',
  warning: 'bg-manual-review',
  info: 'bg-primary-500',
  success: 'bg-compliant',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search tenders, bidders, documents..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-tertiary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative p-2 rounded-lg hover:bg-surface-tertiary transition-colors"
          >
            <Bell className="w-5 h-5 text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-non-compliant rounded-full" />
          </button>
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface rounded-xl border border-border shadow-xl animate-scale-in overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <Link to="/notifications" className="text-xs text-primary-500 hover:text-primary-600 font-medium" onClick={() => setShowNotif(false)}>View All</Link>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map(n => (
                  <div key={n.id} className="px-4 py-3 hover:bg-surface-secondary transition-colors border-b border-border/50 last:border-0">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notifDots[n.type]}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">{n.title}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{n.desc}</p>
                        <p className="text-[11px] text-text-tertiary mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border mx-1" />

        {/* User */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-lg hover:bg-surface-tertiary transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-text-primary">{user?.name}</p>
              <p className="text-[11px] text-text-tertiary">Procurement Officer</p>
            </div>
            <ChevronDown className="w-4 h-4 text-text-tertiary" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-xl border border-border shadow-xl animate-scale-in overflow-hidden">
              <Link to="/settings" onClick={() => setShowProfile(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-surface-secondary transition-colors">
                <UserIcon className="w-4 h-4" /> Profile
              </Link>
              <Link to="/settings" onClick={() => setShowProfile(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:bg-surface-secondary transition-colors border-t border-border/50">
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <button onClick={() => { logout(); navigate('/'); }}
                className="flex items-center gap-3 px-4 py-3 text-sm text-non-compliant hover:bg-non-compliant-bg transition-colors border-t border-border/50 w-full">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
