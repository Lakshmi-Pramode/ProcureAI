import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('officer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) navigate('/dashboard');
        else setError('Invalid credentials');
      } else {
        const success = await register({ name, email, password, role });
        if (success) navigate('/dashboard');
        else setError('Failed to create account');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2.5 text-white group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight block leading-tight">BidGuard AI</span>
            <span className="text-[10px] text-blue-300 font-medium block">GeM Procurement Intelligence</span>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs font-semibold text-blue-200 hover:text-white px-3 py-1.5 rounded-lg border border-blue-400/20 hover:border-blue-400/40 bg-white/5 transition flex items-center gap-1.5"
        >
          Explore Platform <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold tracking-wide uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Government e-Marketplace
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isLogin ? 'Official Sign In' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-500">
              {isLogin 
                ? 'Access the AI-Powered Bid Compliance & Risk Verification Suite'
                : 'Register for secure access to the procurement platform'
              }
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600 flex items-center gap-2 animate-scale-in">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5">
                Official Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rajesh.kumar@procurement.gov.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="role" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition"
                >
                  <option value="officer">Procurement Officer</option>
                  <option value="admin">Administrator</option>
                  <option value="reviewer">Reviewer</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30"
                  />
                  <span className="text-slate-600 font-medium">Keep signed in</span>
                </label>
                <span className="text-blue-600 hover:underline cursor-pointer font-semibold">
                  Forgot access?
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.99] cursor-pointer mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 font-semibold text-slate-400 tracking-wider text-[10px]">
                OR
              </span>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs font-bold text-slate-600 hover:text-blue-600 transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              {isLogin ? (
                <>
                  <UserPlus className="w-3.5 h-3.5" /> Don't have an account? Sign up
                </>
              ) : (
                'Already have an account? Sign in'
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-blue-300/80 mt-4">
          Protected by SHA-256 integrity tokens • Compliance with GFR 2017 Rule 149
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-blue-300/60 z-10">
        © 2026 BidGuard AI • GeM Procurement Compliance & Risk Intelligence Platform
      </div>
    </div>
  );
}
