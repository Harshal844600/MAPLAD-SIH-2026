import { useEffect, useState } from 'react';
import { appStore } from './appStore';
import { UserProfile, UserRole } from '../../types';
import { AppPermission, hasRolePermission, ROLE_DEFINITIONS, RoleMetadata } from './rbac';

export interface UseCurrentUserReturn {
  user: UserProfile;
  role: UserRole;
  roleMetadata: RoleMetadata;
  can: (permission: AppPermission) => boolean;
  setRole: (role: UserRole) => void;
}

export function useCurrentUser(): UseCurrentUserReturn {
  const [user, setUser] = useState<UserProfile>(appStore.getCurrentUser());

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setUser(appStore.getCurrentUser());
    });
    return unsubscribe;
  }, []);

  const role = user.role;
  const roleMetadata = ROLE_DEFINITIONS[role];

  const can = (permission: AppPermission): boolean => {
    return hasRolePermission(role, permission);
  };

  const setRole = (newRole: UserRole) => {
    appStore.setCurrentUserRole(newRole);
  };

  return {
    user,
    role,
    roleMetadata,
    can,
    setRole,
  };
}
