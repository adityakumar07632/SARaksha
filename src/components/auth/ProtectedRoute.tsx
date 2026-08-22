import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { hasPermission, Permission, canAccessRoute } from '../../services/auth/permissions';
import { AccessDenied } from '../../pages/AccessDenied';
import { Loader2 } from 'lucide-react';
import { SARakshaLogo } from '../branding/SARakshaLogo';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission,
}) => {
  const { isAuthenticated, isInitializing, role } = useAuth();
  const location = useLocation();

  // 1. Initial auth check in progress - render splash/loading to prevent any dashboard flash
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] w-full gap-4 font-mono p-6 select-none">
        <SARakshaLogo variant="icon" size="lg" priority />
        <div className="text-center space-y-1">
          <span className="text-base font-black text-white font-mono tracking-wider block">
            SARaksha
          </span>
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
            VERIFYING AUTHORIZATION
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          <span className="text-[11px] text-slate-400">Validating session credentials...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated user - immediately redirect to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role authorization checks
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  if (requiredPermission && !hasPermission(role, requiredPermission)) {
    return <AccessDenied />;
  }

  if (!canAccessRoute(role, location.pathname)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};
