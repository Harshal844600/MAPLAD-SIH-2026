// ==============================================================================
// MPLAD SENTINEL — CENTRAL STATE & HYBRID REPOSITORY SERVICE
// ==============================================================================

import {
  AuditLogRecord,
  DocumentRecord,
  InvestigationCase,
  InvestigationNote,
  ProjectEntity,
  TransactionRecord,
  UserProfile,
  VendorInfo,
} from '../../types';
import {
  CURRENT_DEMO_USER,
  DEMO_DISTRICTS,
  DEMO_STATES,
  DEMO_VENDORS,
  FLAGSHIP_DOCUMENTS_10291,
  FLAGSHIP_INVESTIGATION_10291,
  FLAGSHIP_NOTES_10291,
  FLAGSHIP_PROJECT_10291,
  FLAGSHIP_TRANSACTIONS_10291,
  generateSyntheticProjects,
  INITIAL_AUDIT_LOGS,
} from '../demo/syntheticData';
import { runFullAnomalyDetectionPipeline } from '../detection';
import { computeRiskScore, DEFAULT_RISK_WEIGHTS, RiskWeights } from '../risk';

class AppRepository {
  private projects: ProjectEntity[] = [];
  private vendors: VendorInfo[] = [...DEMO_VENDORS];
  private investigations: InvestigationCase[] = [FLAGSHIP_INVESTIGATION_10291];
  private notes: InvestigationNote[] = [...FLAGSHIP_NOTES_10291];
  private documents: DocumentRecord[] = [...FLAGSHIP_DOCUMENTS_10291];
  private transactions: TransactionRecord[] = [...FLAGSHIP_TRANSACTIONS_10291];
  private auditLogs: AuditLogRecord[] = [...INITIAL_AUDIT_LOGS];
  private currentUser: UserProfile = { ...CURRENT_DEMO_USER };
  private riskWeights: RiskWeights = { ...DEFAULT_RISK_WEIGHTS };
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;
    this.projects = generateSyntheticProjects(1050);
    this.initialized = true;
  }

  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public setCurrentUserRole(role: UserProfile['role']) {
    this.currentUser.role = role;
    this.logAudit('USER_ROLE_SWITCHED', 'USER', this.currentUser.id, { newRole: role });
  }

  public getProjects(params?: {
    search?: string;
    stateId?: string;
    districtId?: string;
    category?: string;
    riskLevel?: string;
    status?: string;
    vendorId?: string;
    page?: number;
    pageSize?: number;
    sortBy?: keyof ProjectEntity;
    sortOrder?: 'asc' | 'desc';
  }) {
    let list = [...this.projects];

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.project_code.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.vendor_name?.toLowerCase().includes(q) ||
          p.district_name.toLowerCase().includes(q) ||
          p.location_name.toLowerCase().includes(q) ||
          p.category_name.toLowerCase().includes(q)
      );
    }

    if (params?.stateId && params.stateId !== 'ALL') {
      list = list.filter((p) => p.state_id === params.stateId);
    }

    if (params?.districtId && params.districtId !== 'ALL') {
      list = list.filter((p) => p.district_id === params.districtId);
    }

    if (params?.category && params.category !== 'ALL') {
      list = list.filter((p) => p.category_name === params.category);
    }

    if (params?.riskLevel && params.riskLevel !== 'ALL') {
      list = list.filter((p) => p.risk_level === params.riskLevel);
    }

    if (params?.status && params.status !== 'ALL') {
      list = list.filter((p) => p.status === params.status);
    }

    if (params?.vendorId && params.vendorId !== 'ALL') {
      list = list.filter((p) => p.vendor_id === params.vendorId);
    }

    // Sorting
    const sortBy = params?.sortBy || 'risk_score';
    const sortOrder = params?.sortOrder || 'desc';

    list.sort((a, b) => {
      const valA = a[sortBy] ?? '';
      const valB = b[sortBy] ?? '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const totalCount = list.length;
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 15;
    const startIndex = (page - 1) * pageSize;
    const paginated = list.slice(startIndex, startIndex + pageSize);

    return {
      items: paginated,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  public getProjectById(idOrCode: string): ProjectEntity | undefined {
    return this.projects.find((p) => p.id === idOrCode || p.project_code === idOrCode);
  }

  public getProjectAnomalies(projectId: string) {
    const project = this.getProjectById(projectId);
    if (!project) return [];

    const txns = this.transactions.filter((t) => t.project_id === project.id);
    const docs = this.documents.filter((d) => d.project_id === project.id);
    const vendor = this.vendors.find((v) => v.id === project.vendor_id);
    const constProjects = this.projects.filter(
      (p) => p.constituency_id === project.constituency_id
    );

    return runFullAnomalyDetectionPipeline({
      project,
      transactions: txns,
      documents: docs,
      vendor,
      constituencyProjects: constProjects,
      allProjects: this.projects,
    });
  }

  public getProjectTransactions(projectId: string): TransactionRecord[] {
    return this.transactions.filter((t) => t.project_id === projectId);
  }

  public getProjectDocuments(projectId: string): DocumentRecord[] {
    return this.documents.filter((d) => d.project_id === projectId);
  }

  public getInvestigations(): InvestigationCase[] {
    return [...this.investigations];
  }

  public getInvestigationById(idOrCase: string): InvestigationCase | undefined {
    return this.investigations.find((i) => i.id === idOrCase || i.case_number === idOrCase);
  }

  public getInvestigationNotes(investigationId: string): InvestigationNote[] {
    return this.notes.filter((n) => n.investigation_id === investigationId);
  }

  public createInvestigation(
    projectId: string,
    title: string,
    priority: ProjectEntity['risk_level'] = 'HIGH'
  ): InvestigationCase {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    const newCase: InvestigationCase = {
      id: `inv-${Date.now()}`,
      case_number: `INV-2026-${project.project_code.replace('MPLAD-', '')}`,
      project_id: project.id,
      project_code: project.project_code,
      project_title: project.title,
      title,
      status: 'NEW',
      priority,
      assigned_officer_id: this.currentUser.id,
      assigned_officer_name: this.currentUser.full_name,
      assigned_at: new Date().toISOString(),
      risk_score: project.risk_score,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      evidence_count: project.anomalies_count || 3,
      notes_count: 0,
    };

    this.investigations.unshift(newCase);
    project.open_investigations_count = (project.open_investigations_count || 0) + 1;

    this.logAudit('INVESTIGATION_OPENED', 'INVESTIGATION', newCase.id, {
      caseNumber: newCase.case_number,
      projectCode: project.project_code,
      priority,
    });

    return newCase;
  }

  public updateInvestigationStatus(
    investigationId: string,
    status: InvestigationCase['status'],
    resolutionSummary?: string
  ) {
    const inv = this.getInvestigationById(investigationId);
    if (inv) {
      const prev = inv.status;
      inv.status = status;
      inv.updated_at = new Date().toISOString();
      if (resolutionSummary) inv.resolution_summary = resolutionSummary;

      this.logAudit('INVESTIGATION_STATUS_CHANGED', 'INVESTIGATION', inv.id, {
        previousStatus: prev,
        newStatus: status,
        resolutionSummary,
      });
    }
  }

  public addInvestigationNote(
    investigationId: string,
    noteText: string,
    isConfidential = false
  ): InvestigationNote {
    const newNote: InvestigationNote = {
      id: `note-${Date.now()}`,
      investigation_id: investigationId,
      author_id: this.currentUser.id,
      author_name: this.currentUser.full_name,
      author_role: this.currentUser.role,
      note_text: noteText,
      is_confidential: isConfidential,
      created_at: new Date().toISOString(),
    };

    this.notes.unshift(newNote);
    const inv = this.getInvestigationById(investigationId);
    if (inv) inv.notes_count = (inv.notes_count || 0) + 1;

    this.logAudit('INVESTIGATION_NOTE_ADDED', 'INVESTIGATION', investigationId, {
      isConfidential,
      noteLength: noteText.length,
    });

    return newNote;
  }

  public recalculateProjectRisk(projectId: string): ProjectEntity | undefined {
    const project = this.getProjectById(projectId);
    if (!project) return undefined;

    const anomalies = this.getProjectAnomalies(projectId);
    const calc = computeRiskScore(anomalies, this.riskWeights);

    const prevScore = project.risk_score;
    project.risk_score = calc.overallScore;
    project.risk_level = calc.riskLevel;
    project.subscores = calc.subscores;
    project.anomalies_count = anomalies.length;
    project.updated_at = new Date().toISOString();

    this.logAudit('RISK_RECALCULATED', 'PROJECT', project.id, {
      previousScore: prevScore,
      newScore: project.risk_score,
      modelVersion: calc.modelVersion,
    });

    return project;
  }

  public getVendors(): VendorInfo[] {
    return [...this.vendors];
  }

  public getAuditLogs(): AuditLogRecord[] {
    return [...this.auditLogs];
  }

  public logAudit(
    action: string,
    entityType: string,
    entityId?: string,
    metadata: Record<string, any> = {}
  ) {
    const last = this.auditLogs[0];
    const seq = (last?.sequence_number || 10480) + 1;

    const record: AuditLogRecord = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sequence_number: seq,
      actor_name: this.currentUser.full_name,
      actor_role: this.currentUser.role,
      action,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      ip_address: '10.24.18.91',
      tamper_hash: `sha256-${Date.now()}-${seq}`,
      created_at: new Date().toISOString(),
    };

    this.auditLogs.unshift(record);
  }

  public getSystemKPIs() {
    const totalProjects = this.projects.length;
    let totalSanctioned = 0;
    let totalReleased = 0;
    let totalUtilized = 0;
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;

    for (const p of this.projects) {
      totalSanctioned += p.sanctioned_amount;
      totalReleased += p.released_amount;
      totalUtilized += p.utilized_amount;
      if (p.risk_level === 'CRITICAL') criticalCount++;
      else if (p.risk_level === 'HIGH') highCount++;
      else if (p.risk_level === 'MEDIUM') mediumCount++;
      else lowCount++;
    }

    return {
      totalProjects,
      totalSanctioned,
      totalReleased,
      totalUtilized,
      unutilizedAmount: totalReleased - totalUtilized,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      openInvestigationsCount: this.investigations.filter((i) => i.status !== 'RESOLVED').length,
    };
  }
}

export const appStore = new AppRepository();
