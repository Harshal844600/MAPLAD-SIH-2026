import { querySentinelGroqAI } from './groq';
import { buildGroundingContext } from './contextBuilder';
import { AnomalyItem, DocumentRecord, ProjectEntity, SentinelAIAnalysisResult, TransactionRecord, VendorInfo } from '../../types';

export async function explainWhyProjectFlagged(
  project: ProjectEntity,
  anomalies: AnomalyItem[],
  transactions: TransactionRecord[] = [],
  documents: DocumentRecord[] = [],
  vendor?: VendorInfo
): Promise<SentinelAIAnalysisResult> {
  const context = buildGroundingContext(project, anomalies, transactions, documents, vendor);
  return querySentinelGroqAI(
    'Synthesize a forensic breakdown explaining WHY this MPLAD project was flagged. List primary facts, inferences, and high-priority evidence citations.',
    context
  );
}

export async function generateInvestigationDossierSummary(
  project: ProjectEntity,
  anomalies: AnomalyItem[],
  transactions: TransactionRecord[] = [],
  documents: DocumentRecord[] = []
): Promise<string> {
  const result = await explainWhyProjectFlagged(project, anomalies, transactions, documents);
  return result.summary;
}
