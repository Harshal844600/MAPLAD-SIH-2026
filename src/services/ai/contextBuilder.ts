import { AnomalyItem, DocumentRecord, ProjectEntity, TransactionRecord, VendorInfo } from '../../types';
import { sanitizeUntrustedText } from './safety';

export interface GroundingContext {
  project: {
    code: string;
    title: string;
    category: string;
    sanctionedAmount: number;
    releasedAmount: number;
    utilizedAmount: number;
    status: string;
    location: string;
    coordinates: { lat: number; lon: number };
    sanctionDate: string;
    expectedCompletionDate?: string;
    actualCompletionDate?: string;
  };
  vendor?: {
    name: string;
    gstin?: string;
    blacklisted: boolean;
    totalProjectsCount: number;
  };
  anomalies: Array<{
    ruleCode: string;
    category: string;
    severity: string;
    title: string;
    description: string;
    evidenceSummary: string;
  }>;
  transactions: Array<{
    ref: string;
    amount: number;
    invoiceNo?: string;
    paymentDate: string;
  }>;
  documentFindings: Array<{
    fileName: string;
    type: string;
    extractedVendor?: string;
    extractedAmount?: number;
    extractedDate?: string;
    mismatchFlags?: string[];
  }>;
}

export function buildGroundingContext(
  project: ProjectEntity,
  anomalies: AnomalyItem[],
  transactions: TransactionRecord[] = [],
  documents: DocumentRecord[] = [],
  vendor?: VendorInfo
): GroundingContext {
  return {
    project: {
      code: project.project_code,
      title: sanitizeUntrustedText(project.title),
      category: project.category_name,
      sanctionedAmount: project.sanctioned_amount,
      releasedAmount: project.released_amount,
      utilizedAmount: project.utilized_amount,
      status: project.status,
      location: `${project.location_name}, ${project.district_name}, ${project.state_name}`,
      coordinates: { lat: project.latitude, lon: project.longitude },
      sanctionDate: project.sanction_date,
      expectedCompletionDate: project.expected_completion_date,
      actualCompletionDate: project.actual_completion_date,
    },
    vendor: vendor
      ? {
          name: sanitizeUntrustedText(vendor.name),
          gstin: vendor.gstin,
          blacklisted: vendor.blacklisted,
          totalProjectsCount: vendor.total_projects_count,
        }
      : undefined,
    anomalies: anomalies.map((a) => ({
      ruleCode: a.rule_code,
      category: a.category,
      severity: a.severity,
      title: a.title,
      description: a.description,
      evidenceSummary: a.evidence_summary,
    })),
    transactions: transactions.map((t) => ({
      ref: t.transaction_reference,
      amount: t.amount,
      invoiceNo: t.invoice_number,
      paymentDate: t.payment_date,
    })),
    documentFindings: documents.map((d) => ({
      fileName: d.file_name,
      type: d.document_type,
      extractedVendor: d.extraction?.extracted_vendor_name,
      extractedAmount: d.extraction?.extracted_amount,
      extractedDate: d.extraction?.extracted_date,
      mismatchFlags: d.extraction?.mismatch_flags,
    })),
  };
}
