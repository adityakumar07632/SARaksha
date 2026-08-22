import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Users,
  Camera,
  AlertTriangle,
  BarChart3,
  FileText,
  LogOut,
  Layers,
  ShieldAlert,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onClose }) => {
  const { role, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nav Items based on Role
  const superAdminNav = [
    { name: 'Overview', to: '/super-admin', icon: LayoutDashboard },
    { name: 'Watersheds', to: '/super-admin/watersheds', icon: Map },
    { name: 'Users', to: '/super-admin/users', icon: Users },
    { name: 'Evidence Hub', to: '/super-admin/evidence', icon: Camera },
    { name: 'Alert Center', to: '/super-admin/alerts', icon: AlertTriangle, badge: '32' },
    { name: 'Analytics', to: '/super-admin/analytics', icon: BarChart3 },
    { name: 'Reports', to: '/super-admin/reports', icon: FileText },
  ];

  const normalAdminNav = [
    { name: 'Watershed Map', to: '/dashboard', icon: Map },
    { name: 'Interventions', to: '/watershed/WS-001', icon: Layers },
    { name: 'Field Evidence', to: '/field-evidence', icon: Camera, badge: '3' },
    { name: 'Active Alerts', to: '/alerts', icon: AlertTriangle, badge: '2' },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },
    { name: 'Reports', to: '/reports', icon: FileText },
  ];

  const fieldOfficerNav = [
    { name: 'Submit Evidence', to: '/field-evidence', icon: Camera },
    { name: 'My Interventions', to: '/watershed/WS-001', icon: Layers },
    { name: 'Inspection Tasks', to: '/alerts', icon: ShieldAlert, badge: '1' },
  ];

  const navItems =
    role === 'SUPER_ADMIN'
      ? superAdminNav
      : role === 'NORMAL_ADMIN'
      ? normalAdminNav
      : fieldOfficerNav;

  const renderNavContent = (isMobile = false) => (
    <>
      <div className="space-y-6">
        {/* Mobile Header with Close Button */}
        {isMobile && (
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs">
                🛡
              </div>
              <span className="font-extrabold text-white font-mono text-sm tracking-tight">
                SARaksha Menu
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close navigation drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Role identifier badge */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Navigation Mode
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs font-bold text-white font-mono">
              {role.replace('_', ' ')}
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1" aria-label="Sidebar Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === '/super-admin' || item.to === '/dashboard'}
                onClick={isMobile ? onClose : undefined}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium font-mono transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-bold text-rose-400 font-mono">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User summary & Log out */}
      <div className="border-t border-slate-800/80 pt-4 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-emerald-400 font-mono shrink-0">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate">
              {currentUser?.name}
            </span>
            <span className="text-[10px] text-slate-400 truncate font-mono">
              {currentUser?.email}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            if (isMobile && onClose) onClose();
            handleLogout();
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-rose-950/30 hover:text-rose-400 transition font-mono cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar (>= 1024px) */}
      <aside className="hidden lg:flex flex-col justify-between w-64 min-h-[calc(100vh-4rem)] border-r border-slate-800 bg-slate-950/95 p-4 backdrop-blur-md shrink-0">
        {renderNavContent(false)}
      </aside>

      {/* Mobile Slide-in Drawer (< 1024px) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex font-sans"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-200"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside className="relative flex flex-col justify-between w-72 max-w-[85vw] h-full border-r border-slate-800 bg-slate-950 p-4 shadow-2xl z-10 overflow-y-auto">
            {renderNavContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
