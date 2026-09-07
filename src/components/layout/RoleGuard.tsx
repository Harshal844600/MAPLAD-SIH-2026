import React from 'react';
import { useCurrentUser } from '../../services/store/useCurrentUser';
import { AppPermission } from '../../services/store/rbac';
import { UserRole } from '../../types';
import { AccessDeniedDossier } from '../ui/AccessDeniedDossier';

interface RoleGuardProps {
  permission?: AppPermission;
  allowedRoles?: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  permission,
  allowedRoles,
  children,
  fallback,
}) => {
  const { role, can } = useCurrentUser();

  let hasAccess = true;

  if (permission && !can(permission)) {
    hasAccess = false;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    hasAccess = false;
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <AccessDeniedDossier
        requiredPermission={permission}
        allowedRoles={allowedRoles}
      />
    );
  }

  return <>{children}</>;
};
