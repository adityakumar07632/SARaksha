/**
 * SARaksha Centralized Role-Based Access Control (RBAC) & Permissions Model
 */

import { UserRole } from '../../types';

export type Permission =
  | 'VIEW_DASHBOARD'
  | 'VIEW_WATERSHEDS'
  | 'VIEW_INTERVENTIONS'
  | 'VIEW_SATELLITE_DATA'
  | 'VIEW_ALERTS'
  | 'UPLOAD_EVIDENCE'
  | 'VERIFY_EVIDENCE'
  | 'MANAGE_USERS'
  | 'GENERATE_REPORTS'
  | 'VIEW_ANALYTICS';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_WATERSHEDS',
    'VIEW_INTERVENTIONS',
    'VIEW_SATELLITE_DATA',
    'VIEW_ALERTS',
    'UPLOAD_EVIDENCE',
    'VERIFY_EVIDENCE',
    'MANAGE_USERS',
    'GENERATE_REPORTS',
    'VIEW_ANALYTICS',
  ],
  NORMAL_ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_WATERSHEDS',
    'VIEW_INTERVENTIONS',
    'VIEW_SATELLITE_DATA',
    'VIEW_ALERTS',
    'UPLOAD_EVIDENCE',
    'VERIFY_EVIDENCE',
    'GENERATE_REPORTS',
    'VIEW_ANALYTICS',
  ],
  FIELD_OFFICER: [
    'VIEW_DASHBOARD',
    'VIEW_INTERVENTIONS',
    'VIEW_SATELLITE_DATA',
    'VIEW_ALERTS',
    'UPLOAD_EVIDENCE',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessRoute(role: UserRole, path: string): boolean {
  if (path.startsWith('/super-admin/users')) {
    return hasPermission(role, 'MANAGE_USERS');
  }
  if (path.startsWith('/super-admin')) {
    return role === 'SUPER_ADMIN';
  }
  if (path.startsWith('/field-evidence') || path.startsWith('/field-officer')) {
    return hasPermission(role, 'UPLOAD_EVIDENCE');
  }
  return true;
}
