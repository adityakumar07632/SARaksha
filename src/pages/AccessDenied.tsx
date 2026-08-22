import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const { role, currentUser } = useAuth();

  const handleReturnHome = () => {
    if (role === 'SUPER_ADMIN') {
      navigate('/super-admin');
    } else if (role === 'NORMAL_ADMIN') {
      navigate('/dashboard');
    } else {
      navigate('/field-evidence');
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-full max-w-md p-8 rounded-2xl border border-rose-500/30 bg-slate-900/90 shadow-2xl backdrop-blur-md space-y-5 font-mono">
        <div className="h-16 w-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldAlert className="h-9 w-9" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
            HTTP 403 &bull; Access Denied
          </span>
          <h1 className="text-xl font-black text-white">RESTRICTED GOVERNMENT CLEARANCE</h1>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Your active role (<strong>{role}</strong> &bull; {currentUser?.name}) does not have permission to access this command module or geospatial administrative registry.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <Lock className="h-3.5 w-3.5 text-rose-400" />
            <span>Required Authorization:</span>
          </div>
          <p className="text-[10px] text-slate-500 pl-5">
            Elevated administrative privileges (National Super Admin) required. All access attempts are recorded in the security audit trail.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
          <button
            onClick={handleReturnHome}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
