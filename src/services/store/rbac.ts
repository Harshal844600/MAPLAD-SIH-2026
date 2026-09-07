import { UserRole } from '../../types';

export type AppPermission =
  | 'VIEW_DASHBOARD'
  | 'VIEW_PROJECTS'
  | 'VIEW_RISK_INTELLIGENCE'
  | 'VIEW_MAP'
  | 'VIEW_INVESTIGATIONS'
  | 'EDIT_INVESTIGATIONS'
  | 'VIEW_AI_COPILOT'
  | 'VIEW_DOCUMENTS_OCR'
  | 'UPLOAD_DOCUMENTS'
  | 'VIEW_ANALYTICS'
  | 'EXPORT_REPORTS'
  | 'MANAGE_ADMIN_SETTINGS'
  | 'IMPORT_BATCH_DATA';

export interface RoleMetadata {
  role: UserRole;
  title: string;
  department: string;
  clearanceLevel: 'TOP_SECRET' | 'CONFIDENTIAL' | 'RESTRICTED' | 'PUBLIC';
  description: string;
  permissions: AppPermission[];
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleMetadata> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    title: 'Super Administrator',
    department: 'Ministry of Statistics & Programme Implementation (MoSPI)',
    clearanceLevel: 'TOP_SECRET',
    description: 'National supervisory oversight, risk algorithm calibration, and global audit log verification.',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_PROJECTS',
      'VIEW_RISK_INTELLIGENCE',
      'VIEW_MAP',
      'VIEW_INVESTIGATIONS',
      'EDIT_INVESTIGATIONS',
      'VIEW_AI_COPILOT',
      'VIEW_DOCUMENTS_OCR',
      'UPLOAD_DOCUMENTS',
      'VIEW_ANALYTICS',
      'EXPORT_REPORTS',
      'MANAGE_ADMIN_SETTINGS',
      'IMPORT_BATCH_DATA',
    ],
  },
  STATE_ADMIN: {
    role: 'STATE_ADMIN',
    title: 'State Nodal Administrator',
    department: 'State Planning & Nodal Department',
    clearanceLevel: 'CONFIDENTIAL',
    description: 'State-wide project tracking, multi-district cross-validation, and high-level expenditure analysis.',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_PROJECTS',
      'VIEW_RISK_INTELLIGENCE',
      'VIEW_MAP',
      'VIEW_INVESTIGATIONS',
      'VIEW_DOCUMENTS_OCR',
      'VIEW_ANALYTICS',
      'EXPORT_REPORTS',
    ],
  },
  DISTRICT_OFFICER: {
    role: 'DISTRICT_OFFICER',
    title: 'District Magistrate / Planning Officer',
    department: 'District Collectorate & Nodal Authority',
    clearanceLevel: 'CONFIDENTIAL',
    description: 'Local project execution, physical site verification notes, invoice voucher approvals, and field audits.',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_PROJECTS',
      'VIEW_MAP',
      'VIEW_INVESTIGATIONS',
      'EDIT_INVESTIGATIONS',
      'VIEW_DOCUMENTS_OCR',
      'UPLOAD_DOCUMENTS',
      'EXPORT_REPORTS',
      'IMPORT_BATCH_DATA',
    ],
  },
  MP_USER: {
    role: 'MP_USER',
    title: 'Member of Parliament (Lok / Rajya Sabha)',
    department: 'Parliamentary Representative Office',
    clearanceLevel: 'RESTRICTED',
    description: 'Constituency recommendation ledger review, community project progress tracking, and AI synthesis inquiries.',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_PROJECTS',
      'VIEW_MAP',
      'VIEW_AI_COPILOT',
      'EXPORT_REPORTS',
    ],
  },
  AUDITOR: {
    role: 'AUDITOR',
    title: 'CAG Forensic Auditor',
    department: 'Comptroller & Auditor General of India',
    clearanceLevel: 'TOP_SECRET',
    description: 'Independent forensic audit, cross-scheme duplication checks, anomaly resolution sign-off, and formal case dossiers.',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_PROJECTS',
      'VIEW_RISK_INTELLIGENCE',
      'VIEW_MAP',
      'VIEW_INVESTIGATIONS',
      'EDIT_INVESTIGATIONS',
      'VIEW_AI_COPILOT',
      'VIEW_DOCUMENTS_OCR',
      'VIEW_ANALYTICS',
      'EXPORT_REPORTS',
    ],
  },
  VIEWER: {
    role: 'VIEWER',
    title: 'Public Transparency Viewer',
    department: 'Citizen Oversight & Public Domain',
    clearanceLevel: 'PUBLIC',
    description: 'Read-only public transparency portal to inspect sanctioned local development works and asset locations.',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_PROJECTS',
      'VIEW_MAP',
      'VIEW_ANALYTICS',
    ],
  },
};

export const hasRolePermission = (role: UserRole, permission: AppPermission): boolean => {
  const meta = ROLE_DEFINITIONS[role];
  if (!meta) return false;
  return meta.permissions.includes(permission);
};
