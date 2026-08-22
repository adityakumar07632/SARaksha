import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  UserCheck,
  Globe,
  Bell,
  Search,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { currentUser, role, switchDemoRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    switchDemoRole(newRole);
    setRoleDropdownOpen(false);
    if (newRole === 'SUPER_ADMIN') {
      navigate('/super-admin');
    } else if (newRole === 'NORMAL_ADMIN') {
      navigate('/dashboard');
    } else {
      navigate('/field-officer/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Generate breadcrumb items from current path
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path.startsWith('/super-admin')) {
      return [
        { label: 'India (National)', path: '/super-admin' },
        { label: 'Command Center', path: '/super-admin' }
      ];
    }
    if (path.startsWith('/watershed/')) {
      return [
        { label: 'India', path: '/super-admin' },
        { label: 'Rajasthan', path: '/dashboard' },
        { label: 'Alwar North (WS-001)', path: path }
      ];
    }
    if (path.startsWith('/intervention/')) {
      return [
        { label: 'Rajasthan', path: '/dashboard' },
        { label: 'WS-001 (Alwar)', path: '/watershed/WS-001' },
        { label: 'Check Dam #12 (CD-012)', path: path }
      ];
    }
    if (path === '/field-evidence') {
      return [
        { label: 'Field Operations', path: '/field-evidence' },
        { label: 'Evidence Collection', path: '/field-evidence' }
      ];
    }
    return [
      { label: 'India', path: '/super-admin' },
      { label: 'Rajasthan Division', path: '/dashboard' }
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Brand & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Link to={role === 'SUPER_ADMIN' ? '/super-admin' : '/dashboard'} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 shadow-md group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white font-mono">SARaksha</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PROTOTYPE
              </span>
            </div>
            <span className="text-[10px] text-slate-400 -mt-0.5 hidden sm:inline">
              Smart Watershed Monitoring System
            </span>
          </div>
        </Link>

        {/* Drill-down Breadcrumb trail */}
        <div className="hidden lg:flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 ml-4">
          <Globe className="h-3.5 w-3.5 text-emerald-400" />
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-600" />}
              <Link
                to={crumb.path}
                className={`hover:text-emerald-400 transition-colors ${
                  idx === breadcrumbs.length - 1 ? 'text-slate-200 font-semibold' : ''
                }`}
              >
                {crumb.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right Controls: Role Switcher, Alerts, Theme, User */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill (Clearly labeled for Prototype Demo) */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-slate-900 px-3 py-1.5 text-xs font-mono font-semibold text-amber-300 hover:border-amber-400 transition"
          >
            <UserCheck className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline text-slate-400">DEMO ROLE:</span>
            <span className="text-emerald-400 font-bold">{role.replace('_', ' ')}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-amber-500/40 bg-slate-900 p-2.5 shadow-2xl backdrop-blur-md text-xs font-mono z-50">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-amber-400 border-b border-slate-800 pb-1 mb-1">
                SWITCH DEMO ROLE (PROTOTYPE)
              </div>
              <button
                onClick={() => handleRoleChange('SUPER_ADMIN')}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-slate-800 cursor-pointer ${
                  role === 'SUPER_ADMIN' ? 'bg-emerald-500/15 text-emerald-400 font-bold' : 'text-slate-300'
                }`}
              >
                <span>Super Admin</span>
                <span className="text-[10px] text-slate-500">National Command</span>
              </button>
              <button
                onClick={() => handleRoleChange('NORMAL_ADMIN')}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-slate-800 cursor-pointer ${
                  role === 'NORMAL_ADMIN' ? 'bg-emerald-500/15 text-emerald-400 font-bold' : 'text-slate-300'
                }`}
              >
                <span>Normal Admin</span>
                <span className="text-[10px] text-slate-500">Watershed Nodal</span>
              </button>
              <button
                onClick={() => handleRoleChange('FIELD_OFFICER')}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between hover:bg-slate-800 cursor-pointer ${
                  role === 'FIELD_OFFICER' ? 'bg-emerald-500/15 text-emerald-400 font-bold' : 'text-slate-300'
                }`}
              >
                <span>Field Officer</span>
                <span className="text-[10px] text-slate-500">Ground Evidence</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-400" />}
        </button>

        {/* User profile & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-white leading-tight">
              {currentUser?.name || 'Authorized Official'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {currentUser?.region || 'National Division'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-700/50 transition"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
