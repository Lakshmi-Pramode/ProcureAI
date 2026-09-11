import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, ShieldCheck, BarChart3,
  AlertTriangle, ScrollText, Settings, HelpCircle,
  LogOut, ChevronLeft, ChevronRight, UserCog, Upload, Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const mainNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tenders', icon: FileText, label: 'Tenders' },
  { to: '/bidders', icon: Users, label: 'Bidders' },
  { to: '/documents', icon: Upload, label: 'Document Ingestion' },
  { to: '/verification', icon: ShieldCheck, label: 'AI Verification' },
  { to: '/compliance', icon: BarChart3, label: 'Compliance Matrix' },
  { to: '/manual-review', icon: AlertTriangle, label: 'Manual Review' },
  { to: '/risk-center', icon: AlertTriangle, label: 'Risk Intelligence' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/audit-trail', icon: ScrollText, label: 'Audit Trail' },
  { to: '/ai-assistant', icon: HelpCircle, label: 'AI Assistant' },
];

const adminNav = [
  { to: '/admin/users', icon: UserCog, label: 'Official Users' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group ${
      isActive
        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
        : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
    }`;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-slate-900 flex flex-col z-50 transition-all duration-300 border-r border-slate-800 ${
        collapsed ? 'w-[72px]' : 'w-[250px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <h1 className="text-white font-extrabold text-sm leading-tight tracking-tight">BidGuard AI</h1>
            <p className="text-blue-400 text-[10px] font-bold tracking-wider uppercase">GeM Platform</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 ${collapsed ? 'text-center' : 'px-3'}`}>
          {collapsed ? '—' : 'Platform'}
        </p>
        {mainNav.map(item => (
          <NavLink key={item.to} to={item.to} className={linkClass} title={collapsed ? item.label : undefined}>
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}

        <div className="pt-3 mt-3 border-t border-slate-800">
          <p className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 ${collapsed ? 'text-center' : 'px-3'}`}>
            {collapsed ? '—' : 'Governance'}
          </p>
          {adminNav.map(item => (
            <NavLink key={item.to} to={item.to} className={linkClass} title={collapsed ? item.label : undefined}>
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-slate-800 p-3 space-y-1">
        <button
          onClick={() => navigate('/notifications')}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors w-full cursor-pointer"
          title={collapsed ? 'Notifications' : undefined}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Help & Guidelines</span>}
        </button>

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-800/80 transition-colors w-full cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'RK'}
            </div>
            {!collapsed && (
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Rajesh Kumar'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.role === 'admin' ? 'Administrator' : 'Procurement Officer'}</p>
              </div>
            )}
          </button>
          {showProfile && !collapsed && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden animate-scale-in p-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-slate-700/80 rounded-lg w-full transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10 cursor-pointer shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
