// ==============================================================================
// MPLAD SENTINEL — RBAC & DEMO AUTHENTICATION UNIT TESTS
// ==============================================================================

import { describe, it, expect } from 'vitest';
import {
  hasPermission,
  hasRole,
  hasAnyPermission,
  hasAllPermissions,
  ROLE_PERMISSIONS,
  DEMO_USERS,
  ROLE_DEFINITIONS,
} from '../services/store/rbac';
import { appStore } from '../services/store/appStore';

describe('Enterprise RBAC & Permission Architecture', () => {
  describe('1. Super Admin Clearance', () => {
    it('SUPER_ADMIN has universal wildcard clearance (*)', () => {
      expect(hasPermission('SUPER_ADMIN', 'dashboard.view')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'projects.create')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'projects.delete')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'users.manage')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'roles.manage')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'settings.manage')).toBe(true);
      expect(hasPermission('SUPER_ADMIN', 'ai.config')).toBe(true);
    });
  });

  describe('2. Ministry Admin Clearance', () => {
    it('MINISTRY_ADMIN can approve/reject/verify projects and review fraud, but cannot manage users/settings', () => {
      expect(hasPermission('MINISTRY_ADMIN', 'projects.view')).toBe(true);
      expect(hasPermission('MINISTRY_ADMIN', 'projects.approve')).toBe(true);
      expect(hasPermission('MINISTRY_ADMIN', 'projects.reject')).toBe(true);
      expect(hasPermission('MINISTRY_ADMIN', 'fraud.view')).toBe(true);
      expect(hasPermission('MINISTRY_ADMIN', 'reports.export')).toBe(true);

      // Denied actions
      expect(hasPermission('MINISTRY_ADMIN', 'users.manage')).toBe(false);
      expect(hasPermission('MINISTRY_ADMIN', 'roles.manage')).toBe(false);
      expect(hasPermission('MINISTRY_ADMIN', 'settings.manage')).toBe(false);
    });
  });

  describe('3. Auditor Clearance (Read-Only Compliance)', () => {
    it('AUDITOR has read-only access to ledgers, fraud alerts, and audit logs, but cannot edit or approve', () => {
      expect(hasPermission('AUDITOR', 'dashboard.view')).toBe(true);
      expect(hasPermission('AUDITOR', 'projects.view')).toBe(true);
      expect(hasPermission('AUDITOR', 'funds.view')).toBe(true);
      expect(hasPermission('AUDITOR', 'fraud.view')).toBe(true);
      expect(hasPermission('AUDITOR', 'anomaly.view')).toBe(true);
      expect(hasPermission('AUDITOR', 'audit.view')).toBe(true);
      expect(hasPermission('AUDITOR', 'reports.export')).toBe(true);

      // Modification & management permissions strictly denied
      expect(hasPermission('AUDITOR', 'projects.create')).toBe(false);
      expect(hasPermission('AUDITOR', 'projects.edit')).toBe(false);
      expect(hasPermission('AUDITOR', 'projects.delete')).toBe(false);
      expect(hasPermission('AUDITOR', 'projects.approve')).toBe(false);
      expect(hasPermission('AUDITOR', 'projects.reject')).toBe(false);
      expect(hasPermission('AUDITOR', 'users.manage')).toBe(false);
      expect(hasPermission('AUDITOR', 'settings.manage')).toBe(false);
    });
  });

  describe('4. Field Officer Clearance', () => {
    it('FIELD_OFFICER can upload evidence and verify site inspections, but cannot approve or access global settings', () => {
      expect(hasPermission('FIELD_OFFICER', 'evidence.upload')).toBe(true);
      expect(hasPermission('FIELD_OFFICER', 'inspections.manage')).toBe(true);
      expect(hasPermission('FIELD_OFFICER', 'projects.verify')).toBe(true);

      // Denied
      expect(hasPermission('FIELD_OFFICER', 'projects.approve')).toBe(false);
      expect(hasPermission('FIELD_OFFICER', 'users.manage')).toBe(false);
      expect(hasPermission('FIELD_OFFICER', 'settings.manage')).toBe(false);
      expect(hasPermission('FIELD_OFFICER', 'analytics.view')).toBe(false);
    });
  });

  describe('5. Multi-Permission Helpers (hasAnyPermission & hasAllPermissions)', () => {
    it('correctly evaluates hasAnyPermission', () => {
      expect(hasAnyPermission('AUDITOR', ['projects.edit', 'projects.view'])).toBe(true);
      expect(hasAnyPermission('AUDITOR', ['projects.create', 'users.manage'])).toBe(false);
    });

    it('correctly evaluates hasAllPermissions', () => {
      expect(hasAllPermissions('MINISTRY_ADMIN', ['projects.view', 'projects.approve'])).toBe(true);
      expect(hasAllPermissions('AUDITOR', ['projects.view', 'projects.approve'])).toBe(false);
    });
  });

  describe('6. Demo Users Authentication & Credentials Verification', () => {
    it('validates 7 demo accounts with correct passwords', () => {
      expect(DEMO_USERS.SUPER_ADMIN.email).toBe('superadmin@mpladsentinel.gov.in');
      expect(DEMO_USERS.SUPER_ADMIN.password).toBe('SuperAdmin@123');

      expect(DEMO_USERS.MINISTRY_ADMIN.email).toBe('admin@mpladsentinel.gov.in');
      expect(DEMO_USERS.MINISTRY_ADMIN.password).toBe('Admin@123');

      expect(DEMO_USERS.MP_OFFICER.email).toBe('mp.officer@mpladsentinel.gov.in');
      expect(DEMO_USERS.MP_OFFICER.password).toBe('Officer@123');

      expect(DEMO_USERS.DISTRICT_OFFICER.email).toBe('district.officer@mpladsentinel.gov.in');
      expect(DEMO_USERS.DISTRICT_OFFICER.password).toBe('District@123');

      expect(DEMO_USERS.AUDITOR.email).toBe('auditor@mpladsentinel.gov.in');
      expect(DEMO_USERS.AUDITOR.password).toBe('Auditor@123');

      expect(DEMO_USERS.DATA_ANALYST.email).toBe('analyst@mpladsentinel.gov.in');
      expect(DEMO_USERS.DATA_ANALYST.password).toBe('Analyst@123');

      expect(DEMO_USERS.FIELD_OFFICER.email).toBe('field.officer@mpladsentinel.gov.in');
      expect(DEMO_USERS.FIELD_OFFICER.password).toBe('Field@123');
    });

    it('successfully logs in via appStore.loginWithCredentials', () => {
      const loginRes = appStore.loginWithCredentials(
        'auditor@mpladsentinel.gov.in',
        'Auditor@123'
      );
      expect(loginRes.success).toBe(true);
      expect(loginRes.user?.role).toBe('AUDITOR');
      expect(appStore.getCurrentUser().role).toBe('AUDITOR');

      // Invalid login fails gracefully
      const failRes = appStore.loginWithCredentials(
        'auditor@mpladsentinel.gov.in',
        'WrongPassword'
      );
      expect(failRes.success).toBe(false);
      expect(failRes.error).toBeDefined();
    });
  });
});
