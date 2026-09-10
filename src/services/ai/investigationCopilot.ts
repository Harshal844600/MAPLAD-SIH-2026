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
    `Synthesize an executive forensic breakdown explaining why Project #${project.project_code} ("${project.title}") in ${project.district_name}, ${project.state_name} was rated with a risk score of ${project.risk_score}/100. Categorize primary documented facts, inferences, and statutory action steps.`,
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
