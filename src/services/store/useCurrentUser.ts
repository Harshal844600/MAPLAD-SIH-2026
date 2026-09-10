// ==============================================================================
// MPLAD SENTINEL — CURRENT USER & PERMISSIONS REACT HOOK
// ==============================================================================

import { useEffect, useState } from 'react';
import { appStore } from './appStore';
import { AppPermission, UserProfile, UserRole } from '../../types';
import {
  hasPermission,
  hasRole as checkHasRole,
  hasAnyPermission,
  hasAllPermissions,
  ROLE_DEFINITIONS,
  RoleMetadata,
} from './rbac';
import { signInWithGoogle } from '../supabase/authService';

export interface UseCurrentUserReturn {
  user: UserProfile;
  role: UserRole;
  roleMetadata: RoleMetadata;
  isOAuth: boolean;
  isAuthenticated: boolean;
  can: (permission: AppPermission) => boolean;
  canAny: (permissions: AppPermission[]) => boolean;
  canAll: (permissions: AppPermission[]) => boolean;
  hasRole: (targetRole: UserRole | UserRole[]) => boolean;
  loginWithCredentials: (
    email: string,
    password: string
  ) => { success: boolean; error?: string; user?: UserProfile };
  loginAsDemoRole: (role: UserRole) => UserProfile;
  setRole: (role: UserRole) => void;
  loginWithGoogle: (redirectTo?: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

export function useCurrentUser(): UseCurrentUserReturn {
  const [user, setUser] = useState<UserProfile>(appStore.getCurrentUser());
  const [isOAuth, setIsOAuth] = useState<boolean>(appStore.isOAuthUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(appStore.isUserAuthenticated());

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setUser(appStore.getCurrentUser());
      setIsOAuth(appStore.isOAuthUser());
      setIsAuthenticated(appStore.isUserAuthenticated());
    });
    return unsubscribe;
  }, []);

  const role = user.role;
  const roleMetadata = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.SUPER_ADMIN;

  const can = (permission: AppPermission): boolean => {
    return hasPermission(role, permission);
  };

  const canAny = (permissions: AppPermission[]): boolean => {
    return hasAnyPermission(role, permissions);
  };

  const canAll = (permissions: AppPermission[]): boolean => {
    return hasAllPermissions(role, permissions);
  };

  const hasRoleCheck = (targetRole: UserRole | UserRole[]): boolean => {
    return checkHasRole(role, targetRole);
  };

  const loginWithCredentials = (email: string, password: string) => {
    return appStore.loginWithCredentials(email, password);
  };

  const loginAsDemoRole = (targetRole: UserRole) => {
    return appStore.loginAsDemoRole(targetRole);
  };

  const setRole = (newRole: UserRole) => {
    appStore.loginAsDemoRole(newRole);
  };

  const loginWithGoogle = async (redirectTo?: string) => {
    return await signInWithGoogle(redirectTo);
  };

  const logout = async () => {
    await appStore.logoutUser();
  };

  return {
    user,
    role,
    roleMetadata,
    isOAuth,
    isAuthenticated,
    can,
    canAny,
    canAll,
    hasRole: hasRoleCheck,
    loginWithCredentials,
    loginAsDemoRole,
    setRole,
    loginWithGoogle,
    logout,
  };
}
