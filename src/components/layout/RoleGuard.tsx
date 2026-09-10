// ==============================================================================
// MPLAD SENTINEL — PROTECTED ROUTE & ROLE GUARD
// ==============================================================================

import React from 'react';
import { useCurrentUser } from '../../services/store/useCurrentUser';
import { AppPermission } from '../../types';
import { UserRole } from '../../types';
import { AccessDeniedDossier } from '../ui/AccessDeniedDossier';
interface RoleGuardProps {
  permission?: AppPermission;
  permissions?: AppPermission[];
  match?: 'any' | 'all';
  allowedRoles?: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  permission,
  permissions,
  match = 'all',
  allowedRoles,
  children,
  fallback,
}) => {
  const { role, can, canAny, canAll, hasRole } = useCurrentUser();

  let isAuthorized = true;

  // 1. Check single permission
  if (permission && !can(permission)) {
    isAuthorized = false;
  }

  // 2. Check multiple permissions array
  if (permissions && permissions.length > 0) {
    const passed = match === 'any' ? canAny(permissions) : canAll(permissions);
    if (!passed) {
      isAuthorized = false;
    }
  }

  // 3. Check role whitelist
  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    isAuthorized = false;
  }

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <AccessDeniedDossier
        requiredPermission={permission || permissions}
        allowedRoles={allowedRoles}
      />
    );
  }

  return <>{children}</>;
};

