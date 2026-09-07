import { AnomalyItem, DocumentRecord, ProjectEntity, TransactionRecord, VendorInfo } from '../../types';
import { detectFinancialAnomalies } from './financial';
import { detectTimelineAnomalies } from './timeline';
import { detectVendorAnomalies } from './vendor';
import { detectGeographicAnomalies } from './geographic';
import { detectDocumentAnomalies } from './document';
import { detectDuplicateAnomalies } from './duplicate';

export * from './financial';
export * from './timeline';
export * from './vendor';
export * from './geographic';
export * from './document';
export * from './duplicate';

export interface DetectionInputContext {
  project: ProjectEntity;
  transactions?: TransactionRecord[];
  documents?: DocumentRecord[];
  vendor?: VendorInfo;
  constituencyProjects?: ProjectEntity[];
  allProjects?: ProjectEntity[];
  benchmarkCost?: number;
}

export function runFullAnomalyDetectionPipeline(ctx: DetectionInputContext): AnomalyItem[] {
  const financial = detectFinancialAnomalies(ctx.project, ctx.transactions, ctx.benchmarkCost);
  const timeline = detectTimelineAnomalies(ctx.project);
  const vendor = detectVendorAnomalies(ctx.project, ctx.vendor, ctx.constituencyProjects);
  const geo = detectGeographicAnomalies(ctx.project, ctx.allProjects);
  const docs = detectDocumentAnomalies(ctx.project, ctx.documents);
  const duplicate = detectDuplicateAnomalies(ctx.project, ctx.allProjects);

  return [...financial, ...timeline, ...vendor, ...geo, ...docs, ...duplicate];
}
