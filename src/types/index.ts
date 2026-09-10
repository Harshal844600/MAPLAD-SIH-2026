// ==============================================================================
// MPLAD SENTINEL — CORE DOMAIN DATA CONTRACTS & TYPES
// ==============================================================================

export type UserRole =
  | 'SUPER_ADMIN'
  | 'MINISTRY_ADMIN'
  | 'MP_OFFICER'
  | 'DISTRICT_OFFICER'
  | 'AUDITOR'
  | 'DATA_ANALYST'
  | 'FIELD_OFFICER'
  // Backward compatibility aliases
  | 'STATE_ADMIN'
  | 'MP_USER'
  | 'VIEWER';

export type ProjectStatus =
  | 'SANCTIONED'
  | 'TENDERED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'STALLED'
  | 'CANCELLED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AnomalyCategory =
  | 'FINANCIAL'
  | 'TIMELINE'
  | 'VENDOR'
  | 'GEOGRAPHIC'
  | 'DOCUMENT'
  | 'DUPLICATE';

export type InvestigationStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'DISMISSED';


export type AppPermission =
  // Monitoring
  | 'dashboard.view'
  | 'projects.view'
  | 'projects.create'
  | 'projects.edit'
  | 'projects.delete'
  | 'projects.verify'
  | 'projects.approve'
  | 'projects.reject'
  | 'funds.view'
  | 'funds.monitor'
  | 'constituency.view'
  | 'district.view'
  // Intelligence
  | 'anomaly.view'
  | 'fraud.view'
  | 'risk.view'
  | 'geo.view'
  | 'ai.view'
  | 'ai.config'
  // Operations
  | 'inspections.view'
  | 'inspections.manage'
  | 'evidence.upload'
  | 'evidence.view'
  | 'documents.ocr'
  // Reporting
  | 'reports.view'
  | 'reports.export'
  | 'analytics.view'
  // Administration
  | 'users.manage'
  | 'roles.manage'
  | 'audit.view'
  | 'settings.manage'
  | '*';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  state_id?: string;
  state_name?: string;
  district_id?: string;
  district_name?: string;
  constituency_id?: string;
  constituency_name?: string;
  designation?: string;
  department?: string;
  avatar_url?: string;
  auth_provider?: 'google' | 'demo' | 'email';
  permissions?: AppPermission[];
}

export interface DemoUserAccount {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  full_name: string;
  designation: string;
  department: string;
  clearanceLevel: 'TOP_SECRET' | 'CONFIDENTIAL' | 'RESTRICTED' | 'OFFICIAL' | 'PUBLIC';
  description: string;
  state_name?: string;
  district_name?: string;
  constituency_name?: string;
}


export interface StateInfo {
  id: string;
  code: string;
  name: string;
}

export interface DistrictInfo {
  id: string;
  state_id: string;
  code: string;
  name: string;
  nodal_officer_name?: string;
}

export interface ConstituencyInfo {
  id: string;
  state_id: string;
  district_id?: string;
  name: string;
  type: 'LOK_SABHA' | 'RAJYA_SABHA';
  mp_name: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  description?: string;
  standard_benchmark_cost_per_unit: number;
  standard_duration_days: number;
}

export interface VendorInfo {
  id: string;
  vendor_code: string;
  name: string;
  pan_number?: string;
  gstin?: string;
  registered_address?: string;
  state_name?: string;
  district_name?: string;
  blacklisted: boolean;
  blacklisted_reason?: string;
  total_projects_count: number;
  total_contract_value: number;
  risk_index?: number;
}

export interface ProjectEntity {
  id: string;
  project_code: string; // e.g., MPLAD-10291
  title: string;
  description: string;
  category_id: string;
  category_name: string;
  
  mp_id?: string;
  mp_name: string;
  constituency_id: string;
  constituency_name: string;
  district_id: string;
  district_name: string;
  state_id: string;
  state_name: string;
  
  implementing_agency: string;
  vendor_id?: string;
  vendor_name?: string;
  status: ProjectStatus;
  
  // Exact financial figures
  sanctioned_amount: number;
  released_amount: number;
  utilized_amount: number;
  
  // Timeline
  sanction_date: string;
  start_date?: string;
  expected_completion_date?: string;
  actual_completion_date?: string;
  
  // PostGIS Coordinates
  latitude: number;
  longitude: number;
  location_name: string;
  
  // Composite Risk Metrics
  risk_score: number;
  risk_level: RiskLevel;
  anomalies_count: number;
  open_investigations_count: number;
  
  // Sub-scores
  subscores: {
    financial: number;
    timeline: number;
    vendor: number;
    geographic: number;
    documents: number;
    duplicate: number;
  };
  
  is_demo?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnomalyItem {
  id: string;
  project_id: string;
  rule_code: string;
  category: AnomalyCategory;
  severity: RiskLevel;
  score_impact: number;
  title: string;
  description: string;
  evidence_summary: string;
  evidence_payload?: Record<string, any>;
  confidence_score: number; // 0.0 - 1.0
  detected_at: string;
  is_resolved: boolean;
}

export interface TransactionRecord {
  id: string;
  project_id: string;
  vendor_id: string;
  vendor_name: string;
  transaction_reference: string;
  amount: number;
  invoice_number?: string;
  invoice_date?: string;
  payment_date: string;
  payment_mode: string;
  purpose?: string;
}

export interface DocumentRecord {
  id: string;
  project_id: string;
  document_type: 'SANCTION_ORDER' | 'INVOICE' | 'COMPLETION_CERTIFICATE' | 'UTILIZATION_CERTIFICATE' | 'INSPECTION_REPORT' | 'SITE_PHOTO';
  file_name: string;
  file_size_bytes: number;
  mime_type: string;
  uploaded_at: string;
  uploaded_by_name: string;
  is_verified: boolean;
  extraction?: {
    extracted_vendor_name?: string;
    extracted_amount?: number;
    extracted_date?: string;
    extracted_location?: string;
    confidence: number;
    mismatch_flags?: string[];
  };
}

export interface InvestigationCase {
  id: string;
  case_number: string; // INV-2026-10291
  project_id: string;
  project_code: string;
  project_title: string;
  title: string;
  status: InvestigationStatus;
  priority: RiskLevel;
  assigned_officer_id?: string;
  assigned_officer_name?: string;
  assigned_at?: string;
  resolution_summary?: string;
  risk_score: number;
  created_at: string;
  updated_at: string;
  evidence_count: number;
  notes_count: number;
}

export interface InvestigationNote {
  id: string;
  investigation_id: string;
  author_id: string;
  author_name: string;
  author_role: UserRole;
  note_text: string;
  is_confidential: boolean;
  created_at: string;
  edited_at?: string;
}

export interface AuditLogRecord {
  id: string;
  sequence_number: number;
  actor_name: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  entity_label?: string;
  metadata: Record<string, any>;
  ip_address?: string;
  tamper_hash?: string;
  created_at: string;
}

export interface SentinelAIAnalysisResult {
  summary: string;
  riskLevel: RiskLevel;
  confidence: number;
  keyFindings: Array<{
    title: string;
    fact: string;
    inference: string;
    severity: RiskLevel;
    evidenceId?: string;
  }>;
  evidenceLinks: Array<{
    id: string;
    type: string;
    description: string;
  }>;
  whyItMatters: string;
  recommendedNextSteps: string[];
  generatedAt: string;
  modelVersion: string;
}
