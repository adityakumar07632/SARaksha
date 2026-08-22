import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  UserCheck,
  ArrowRight,
  Sparkles,
  MapPin,
  Satellite,
  CheckCircle2,
  ShieldAlert,
  Info,
  KeyRound,
} from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || null;
  const targetFrom = from && from !== '/' && from !== '/login' ? from : null;

  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER_ADMIN');
  const [email, setEmail] = useState('admin@saraksha.demo');
  const [password, setPassword] = useState('••••••••••••');
  const [showForgotNotice, setShowForgotNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated and not explicitly redirected from a protected route, navigate to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      if (targetFrom) {
        navigate(targetFrom, { replace: true });
      } else if (role === 'SUPER_ADMIN') {
        navigate('/super-admin', { replace: true });
      } else if (role === 'NORMAL_ADMIN') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/field-officer/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, role, targetFrom, navigate]);

  const handleSelectDemoCredential = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    const cred = DEMO_CREDENTIALS.find((c) => c.role === role);
    if (cred) {
      setEmail(cred.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const success = login(email || selectedRole, password);

    if (success) {
      if (targetFrom) {
        navigate(targetFrom, { replace: true });
        return;
      }

      if (selectedRole === 'SUPER_ADMIN') {
        navigate('/super-admin', { replace: true });
      } else if (selectedRole === 'NORMAL_ADMIN') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/field-officer/dashboard', { replace: true });
      }
    } else {
      setErrorMessage('Invalid credentials. Please select a valid demo role or enter valid credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-3 sm:p-4 relative overflow-hidden font-sans">
      {/* Ambient background gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Prototype / Demo Badge */}
      <div className="mb-4 sm:mb-6 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-mono text-amber-300 backdrop-blur-md shadow-xl text-center max-w-[calc(100vw-24px)]">
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
        <span className="font-bold truncate">DEMO ENVIRONMENT &bull; PRESET ROLES</span>
      </div>

      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Header Branding */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-xl shadow-emerald-950/50 mb-3 border border-emerald-400/30">
            <ShieldCheck className="h-7 w-7 sm:h-9 sm:w-9 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
            SARaksha
          </h1>
          <p className="text-xs font-mono font-bold text-emerald-400 mt-1 uppercase tracking-wider">
            Smart Watershed Monitoring & Evidence System
          </p>
          <p className="text-xs text-slate-400 mt-2 font-sans italic">
            "One connected investigation from map to decision with evidence at every step."
          </p>
        </div>

        {/* Demo Quick-Select Role Credentials */}
        <div className="mb-6 rounded-2xl bg-slate-950/80 p-4 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="uppercase font-bold text-slate-300">Quick-Fill Demo Roles</span>
            <span className="text-emerald-400">SIH Prototype</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
            {DEMO_CREDENTIALS.map((cred) => {
              const isSelected = selectedRole === cred.role;
              return (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => handleSelectDemoCredential(cred.role)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">
                    {cred.role.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-bold text-slate-200 truncate mt-0.5">{cred.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-slate-500 truncate mt-0.5">{cred.email}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1">
              Authorized Government ID / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                placeholder="user@saraksha.demo"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono font-medium text-slate-300">
                Password / Secure Passcode
              </label>
              <button
                type="button"
                onClick={() => setShowForgotNotice(!showForgotNotice)}
                className="text-[11px] font-mono text-emerald-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {showForgotNotice && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0 text-amber-400" />
              <span>
                In prototype mode, credentials are pre-configured. Use any of the 3 quick-fill role presets above.
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Sign In to SARaksha Command Portal</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Footer Security Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500">
            <KeyRound className="h-3.5 w-3.5 text-slate-400" />
            <span>Role-Based Access Control &bull; SHA-256 Audit Trail Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
