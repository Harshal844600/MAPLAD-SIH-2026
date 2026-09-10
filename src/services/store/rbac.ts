// ==============================================================================
// MPLAD SENTINEL — ENTERPRISE ROLE-BASED ACCESS CONTROL (RBAC) ARCHITECTURE
// ==============================================================================

import { AppPermission, DemoUserAccount, UserProfile, UserRole } from '../../types';

export interface RoleMetadata {
  role: UserRole;
  title: string;
  department: string;
  clearanceLevel: 'TOP_SECRET' | 'CONFIDENTIAL' | 'RESTRICTED' | 'OFFICIAL' | 'PUBLIC';
  description: string;
  badgeVariant: 'gold' | 'crimson' | 'emerald' | 'blue' | 'purple' | 'amber' | 'slate';
  permissions: AppPermission[];
}

/**
 * Centralized Role-Permission mapping configuration.
 * Super Admin uses wildcard '*' for universal clearance.
 */
export const ROLE_PERMISSIONS: Record<UserRole, AppPermission[]> = {
  SUPER_ADMIN: ['*'],

  MINISTRY_ADMIN: [
    'dashboard.view',
    'projects.view',
    'projects.verify',
    'projects.approve',
    'projects.reject',
    'funds.view',
    'funds.monitor',
    'fraud.view',
    'anomaly.view',
    'risk.view',
    'geo.view',
    'district.view',
    'reports.view',
    'reports.export',
    'analytics.view',
    'audit.view',
    'ai.view',
    'documents.ocr',
    'evidence.view',
  ],

  MP_OFFICER: [
    'dashboard.view',
    'constituency.view',
    'projects.view',
    'funds.view',
    'reports.view',
    'reports.export',
    'geo.view',
    'evidence.view',
    'ai.view',
  ],

  DISTRICT_OFFICER: [
    'dashboard.view',
    'district.view',
    'projects.view',
    'projects.verify',
    'funds.view',
    'anomaly.view',
    'fraud.view',
    'reports.view',
    'reports.export',
    'geo.view',
    'inspections.view',
    'evidence.view',
    'evidence.upload',
    'documents.ocr',
  ],

  AUDITOR: [
    'dashboard.view',
    'projects.view',
    'funds.view',
    'anomaly.view',
    'fraud.view',
    'risk.view',
    'reports.view',
    'reports.export',
    'audit.view',
    'documents.ocr',
    'evidence.view',
    'ai.view',
  ],

  DATA_ANALYST: [
    'dashboard.view',
    'analytics.view',
    'anomaly.view',
    'fraud.view',
    'risk.view',
    'geo.view',
    'projects.view',
    'funds.view',
    'reports.view',
    'reports.export',
    'ai.view',
  ],

  FIELD_OFFICER: [
    'dashboard.view',
    'projects.view',
    'projects.verify',
    'inspections.view',
    'inspections.manage',
    'evidence.upload',
    'evidence.view',
    'documents.ocr',
  ],

  // Backward compatibility alias mappings
  STATE_ADMIN: [
    'dashboard.view',
    'projects.view',
    'projects.verify',
    'funds.view',
    'risk.view',
    'geo.view',
    'anomaly.view',
    'reports.view',
    'reports.export',
    'analytics.view',
  ],
  MP_USER: [
    'dashboard.view',
    'constituency.view',
    'projects.view',
    'funds.view',
    'reports.view',
    'geo.view',
  ],
  VIEWER: [
    'dashboard.view',
    'projects.view',
    'geo.view',
    'analytics.view',
  ],
};

/**
 * Detailed Metadata Catalog for all roles.
 */
export const ROLE_DEFINITIONS: Record<UserRole, RoleMetadata> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    title: 'Super Administrator',
    department: 'Ministry of Statistics & Programme Implementation (MoSPI)',
    clearanceLevel: 'TOP_SECRET',
    badgeVariant: 'gold',
    description: 'National supervisory authority with full system control, user & role management, and cryptographic audit log access.',
    permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
  },
  MINISTRY_ADMIN: {
    role: 'MINISTRY_ADMIN',
    title: 'Ministry / Government Admin',
    department: 'MoSPI National Monitoring Directorate',
    clearanceLevel: 'TOP_SECRET',
    badgeVariant: 'crimson',
    description: 'National and state-wide scheme monitoring, project sanction approvals/rejections, fund utilization, and fraud alert reviews.',
    permissions: ROLE_PERMISSIONS.MINISTRY_ADMIN,
  },
  MP_OFFICER: {
    role: 'MP_OFFICER',
    title: 'MP / Constituency Officer',
    department: 'Parliamentary Representative Office',
    clearanceLevel: 'RESTRICTED',
    badgeVariant: 'blue',
    description: 'Constituency operations, local scheme progress tracking, MP recommendation monitoring, and constituency-level reporting.',
    permissions: ROLE_PERMISSIONS.MP_OFFICER,
  },
  DISTRICT_OFFICER: {
    role: 'DISTRICT_OFFICER',
    title: 'District Officer (DM / Collector)',
    department: 'District Collectorate & Planning Cell',
    clearanceLevel: 'CONFIDENTIAL',
    badgeVariant: 'amber',
    description: 'District monitoring, local site verification checkoffs, contractor tracking, delayed projects, and AI risk alerts.',
    permissions: ROLE_PERMISSIONS.DISTRICT_OFFICER,
  },
  AUDITOR: {
    role: 'AUDITOR',
    title: 'CAG Forensic Auditor',
    department: 'Comptroller & Auditor General of India',
    clearanceLevel: 'TOP_SECRET',
    badgeVariant: 'purple',
    description: 'Independent forensic audit, cross-scheme duplication scrutiny, risk analysis, and read-only compliance inspection.',
    permissions: ROLE_PERMISSIONS.AUDITOR,
  },
  DATA_ANALYST: {
    role: 'DATA_ANALYST',
    title: 'Data & Risk Analyst',
    department: 'National Analytics & AI Governance Unit',
    clearanceLevel: 'OFFICIAL',
    badgeVariant: 'emerald',
    description: 'Macro analytics, risk distribution curves, geospatial intelligence, trend modeling, and chart export.',
    permissions: ROLE_PERMISSIONS.DATA_ANALYST,
  },
  FIELD_OFFICER: {
    role: 'FIELD_OFFICER',
    title: 'Field Verification Officer',
    department: 'District Rural Development Agency (DRDA)',
    clearanceLevel: 'OFFICIAL',
    badgeVariant: 'slate',
    description: 'On-site physical inspection, geo-tagged photo and voucher evidence uploads, and preliminary field verification remarks.',
    permissions: ROLE_PERMISSIONS.FIELD_OFFICER,
  },

  // Aliases
  STATE_ADMIN: {
    role: 'STATE_ADMIN',
    title: 'State Nodal Administrator',
    department: 'State Planning & Nodal Department',
    clearanceLevel: 'CONFIDENTIAL',
    badgeVariant: 'amber',
    description: 'State-wide project tracking and high-level expenditure analysis.',
    permissions: ROLE_PERMISSIONS.STATE_ADMIN,
  },
  MP_USER: {
    role: 'MP_USER',
    title: 'Member of Parliament',
    department: 'Parliamentary Constituency Office',
    clearanceLevel: 'RESTRICTED',
    badgeVariant: 'blue',
    description: 'Constituency progress tracking and scheme recommendation view.',
    permissions: ROLE_PERMISSIONS.MP_USER,
  },
  VIEWER: {
    role: 'VIEWER',
    title: 'Public Transparency Viewer',
    department: 'Citizen Oversight Portal',
    clearanceLevel: 'PUBLIC',
    badgeVariant: 'slate',
    description: 'Read-only public transparency portal to inspect sanctioned local development works.',
    permissions: ROLE_PERMISSIONS.VIEWER,
  },
};

/**
 * Predefined Demo Accounts Catalog for Hackathon Demonstration.
 */
export const DEMO_USERS: Record<UserRole, DemoUserAccount> = {
  SUPER_ADMIN: {
    id: 'demo-superadmin-001',
    email: 'superadmin@mpladsentinel.gov.in',
    password: 'SuperAdmin@123',
    role: 'SUPER_ADMIN',
    full_name: 'Dr. Harshavardhan Rao, IAS',
    designation: 'Chief Vigilance & Governance Officer',
    department: 'Ministry of Statistics & Programme Implementation (MoSPI)',
    clearanceLevel: 'TOP_SECRET',
    description: 'Full system administrator with universal clearance and access to all configuration consoles.',
  },
  MINISTRY_ADMIN: {
    id: 'demo-ministry-002',
    email: 'admin@mpladsentinel.gov.in',
    password: 'Admin@123',
    role: 'MINISTRY_ADMIN',
    full_name: 'Smt. Ananya Deshmukh',
    designation: 'Joint Secretary (Scheme Monitoring)',
    department: 'MoSPI National Monitoring Directorate',
    clearanceLevel: 'TOP_SECRET',
    description: 'National government monitor with project approval, sanction, and anomaly review authority.',
  },
  MP_OFFICER: {
    id: 'demo-mp-003',
    email: 'mp.officer@mpladsentinel.gov.in',
    password: 'Officer@123',
    role: 'MP_OFFICER',
    full_name: 'Shri Vikramaditya Joshi',
    designation: 'Nodal Officer to Member of Parliament',
    department: 'Pune Parliamentary Constituency Cell',
    clearanceLevel: 'RESTRICTED',
    description: 'Constituency operations officer focused on MP recommendation tracking and local fund utilization.',
    state_name: 'Maharashtra',
    district_name: 'Pune',
    constituency_name: 'Pune Parliamentary Constituency',
  },
  DISTRICT_OFFICER: {
    id: 'demo-district-004',
    email: 'district.officer@mpladsentinel.gov.in',
    password: 'District@123',
    role: 'DISTRICT_OFFICER',
    full_name: 'Dr. Rajesh Sharma, IAS',
    designation: 'District Magistrate & Collector',
    department: 'District Collectorate & Planning Cell, Pune',
    clearanceLevel: 'CONFIDENTIAL',
    description: 'District authority verifying site reports, contractor concentrations, and local milestone clearances.',
    state_name: 'Maharashtra',
    district_name: 'Pune District',
  },
  AUDITOR: {
    id: 'demo-auditor-005',
    email: 'auditor@mpladsentinel.gov.in',
    password: 'Auditor@123',
    role: 'AUDITOR',
    full_name: 'Shri K. S. Ramanujan',
    designation: 'Senior Forensic Auditor (CAG)',
    department: 'Comptroller & Auditor General of India',
    clearanceLevel: 'TOP_SECRET',
    description: 'Independent forensic audit specialist with read-only compliance access across financial ledgers and logs.',
  },
  DATA_ANALYST: {
    id: 'demo-analyst-006',
    email: 'analyst@mpladsentinel.gov.in',
    password: 'Analyst@123',
    role: 'DATA_ANALYST',
    full_name: 'Ms. Tanvi Singhal',
    designation: 'Lead Intelligence & Risk Modeler',
    department: 'National Analytics & AI Governance Unit',
    clearanceLevel: 'OFFICIAL',
    description: 'Data scientist modeling risk trends, HHI vendor concentration, and spatial anomaly clusters.',
  },
  FIELD_OFFICER: {
    id: 'demo-field-007',
    email: 'field.officer@mpladsentinel.gov.in',
    password: 'Field@123',
    role: 'FIELD_OFFICER',
    full_name: 'Shri Rameshwar Patil',
    designation: 'Assistant Engineer & Site Inspector',
    department: 'District Rural Development Agency (DRDA)',
    clearanceLevel: 'OFFICIAL',
    description: 'Field officer performing physical on-site inspections, geotagged evidence capture, and status updates.',
    state_name: 'Maharashtra',
    district_name: 'Pune District',
  },

  // Aliases for compatibility
  STATE_ADMIN: {
    id: 'demo-state-008',
    email: 'state.admin@mpladsentinel.gov.in',
    password: 'State@123',
    role: 'STATE_ADMIN',
    full_name: 'Shri Manoj Patil',
    designation: 'State Planning Director',
    department: 'State Planning & Nodal Department',
    clearanceLevel: 'CONFIDENTIAL',
    description: 'State nodal administrator.',
  },
  MP_USER: {
    id: 'demo-mpuser-009',
    email: 'mp.user@mpladsentinel.gov.in',
    password: 'MpUser@123',
    role: 'MP_USER',
    full_name: 'Hon. Member of Parliament',
    designation: 'Member of Parliament (Lok Sabha)',
    department: 'Parliament of India',
    clearanceLevel: 'RESTRICTED',
    description: 'Constituency representative.',
  },
  VIEWER: {
    id: 'demo-viewer-010',
    email: 'viewer@mpladsentinel.gov.in',
    password: 'Viewer@123',
    role: 'VIEWER',
    full_name: 'Public Citizen / Auditor',
    designation: 'Public Transparency Visitor',
    department: 'Citizen Portal',
    clearanceLevel: 'PUBLIC',
    description: 'Citizen transparency viewer.',
  },
};

/**
 * Core Permission Check Utility
 */
export function hasPermission(
  roleOrUser: UserRole | UserProfile | null | undefined,
  permission: AppPermission
): boolean {
  if (!roleOrUser) return false;

  const role: UserRole = typeof roleOrUser === 'string' ? roleOrUser : roleOrUser.role;
  const permissions = ROLE_PERMISSIONS[role] || [];

  // Super Admin universal wildcard clearance
  if (permissions.includes('*')) return true;

  // Exact permission match
  if (permissions.includes(permission)) return true;

  // Domain-level wildcard match (e.g., 'projects.*' matches 'projects.view')
  const [domain] = permission.split('.');
  if (permissions.includes(`${domain}.*` as AppPermission)) return true;

  return false;
}

/**
 * Role Check Utility
 */
export function hasRole(
  currentRole: UserRole | undefined,
  targetRole: UserRole | UserRole[]
): boolean {
  if (!currentRole) return false;
  if (Array.isArray(targetRole)) {
    return targetRole.includes(currentRole);
  }
  return currentRole === targetRole;
}

/**
 * Check if user possesses ANY of the specified permissions.
 */
export function hasAnyPermission(
  roleOrUser: UserRole | UserProfile | null | undefined,
  permissions: AppPermission[]
): boolean {
  if (!roleOrUser || !permissions.length) return false;
  return permissions.some((perm) => hasPermission(roleOrUser, perm));
}

/**
 * Check if user possesses ALL of the specified permissions.
 */
export function hasAllPermissions(
  roleOrUser: UserRole | UserProfile | null | undefined,
  permissions: AppPermission[]
): boolean {
  if (!roleOrUser || !permissions.length) return false;
  return permissions.every((perm) => hasPermission(roleOrUser, perm));
}

/**
 * Structured taxonomy grouping for the Permissions Matrix visualization.
 */
export interface PermissionCategoryGroup {
  id: string;
  name: string;
  description: string;
  permissions: {
    code: AppPermission;
    label: string;
    description: string;
  }[];
}

export const PERMISSION_TAXONOMY: PermissionCategoryGroup[] = [
  {
    id: 'monitoring',
    name: 'Monitoring & Ledger Operations',
    description: 'View, track, create, and verify government development schemes and project ledgers.',
    permissions: [
      { code: 'dashboard.view', label: 'Dashboard Access', description: 'Access institutional command console and KPI metrics.' },
      { code: 'projects.view', label: 'View Project Ledgers', description: 'Inspect sanctioned development works and milestone telemetry.' },
      { code: 'projects.create', label: 'Create New Project', description: 'Register new sanction orders and initial outlays.' },
      { code: 'projects.edit', label: 'Edit Project Details', description: 'Modify project scope, contractor assignment, and timelines.' },
      { code: 'projects.delete', label: 'Delete / Cancel Project', description: 'Revoke and delete invalid scheme entries.' },
      { code: 'projects.verify', label: 'Verify Site Status', description: 'Perform technical verification and update clearance checklist.' },
      { code: 'projects.approve', label: 'Approve Sanctions', description: 'Grant executive approval for fund disbursement.' },
      { code: 'projects.reject', label: 'Reject / Flag Sanction', description: 'Issue formal rejection notices with evidence remarks.' },
      { code: 'funds.view', label: 'Fund Outlay Tracking', description: 'View financial allocations, installments, and ledger balance.' },
      { code: 'funds.monitor', label: 'Fund Disbursement Control', description: 'Authorize milestone-linked payment releases.' },
      { code: 'constituency.view', label: 'Constituency Filter', description: 'Access parliamentary constituency specific telemetry.' },
      { code: 'district.view', label: 'District Administration', description: 'Access district-level oversight and collectorate controls.' },
    ],
  },
  {
    id: 'intelligence',
    name: 'Forensic Intelligence & AI',
    description: 'Multi-layer anomaly detection, fraud identification, geospatial analysis, and LLM copilots.',
    permissions: [
      { code: 'anomaly.view', label: 'AI Anomaly Detection', description: 'Inspect 6-layer deterministic anomaly rule violations.' },
      { code: 'fraud.view', label: 'Fraud Alerts & Cartels', description: 'Review HHI cartel indices and duplicate invoice flags.' },
      { code: 'risk.view', label: 'Composite Risk Analytics', description: 'View multi-variate weighted risk scores (0–100).' },
      { code: 'geo.view', label: 'Geographic Intelligence', description: 'View PostGIS spatial proximity and 25m duplicate overlaps.' },
      { code: 'ai.view', label: 'Sentinel AI Copilot', description: 'Execute forensic inquiries using grounded Llama-3.3 70B.' },
      { code: 'ai.config', label: 'AI & Algorithm Calibration', description: 'Adjust multi-layer risk weights and prompt guardrails.' },
    ],
  },
  {
    id: 'operations',
    name: 'Field Operations & Evidence',
    description: 'On-site inspections, photo evidence capture, and OCR document processing.',
    permissions: [
      { code: 'inspections.view', label: 'View Site Inspections', description: 'Inspect field verification logs and site visit records.' },
      { code: 'inspections.manage', label: 'Conduct Inspections', description: 'Record inspection remarks and verification timestamps.' },
      { code: 'evidence.upload', label: 'Upload Geotagged Evidence', description: 'Attach physical vouchers, inspection photos, and GPS proof.' },
      { code: 'evidence.view', label: 'Inspect Evidence Dossier', description: 'Examine cryptographic evidence attachments.' },
      { code: 'documents.ocr', label: 'OCR Document Archive', description: 'Access structured OCR invoice extracts and mismatch scans.' },
    ],
  },
  {
    id: 'reporting',
    name: 'Reporting & Analytics',
    description: 'Macro analytics, statistical trends, and official signed dossier exports.',
    permissions: [
      { code: 'reports.view', label: 'View Formal Reports', description: 'Access compiled parliamentary and district dossier books.' },
      { code: 'reports.export', label: 'Export Audit Dossiers', description: 'Download cryptographically signed PDF/CSV audit packs.' },
      { code: 'analytics.view', label: 'Macro Visual Analytics', description: 'Examine high-level financial and risk distribution charts.' },
    ],
  },
  {
    id: 'administration',
    name: 'System Governance & Security',
    description: 'User access control, role assignment, system settings, and immutable audit logs.',
    permissions: [
      { code: 'users.manage', label: 'User Account Management', description: 'Provision, activate, and deactivate officer profiles.' },
      { code: 'roles.manage', label: 'Role & Clearance Control', description: 'Configure permission matrices and clearance levels.' },
      { code: 'audit.view', label: 'Immutable Audit Trail', description: 'Inspect SHA-256 chained tamper-evident system logs.' },
      { code: 'settings.manage', label: 'System Configuration', description: 'Configure database endpoints and system parameters.' },
    ],
  },
];
