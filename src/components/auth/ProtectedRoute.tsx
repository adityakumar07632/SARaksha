import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { hasPermission, Permission, canAccessRoute } from '../../services/auth/permissions';
import { AccessDenied } from '../../pages/AccessDenied';

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
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

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
