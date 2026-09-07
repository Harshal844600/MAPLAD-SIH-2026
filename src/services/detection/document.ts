import { AnomalyItem, DocumentRecord, ProjectEntity } from '../../types';

export const detectDocumentAnomalies = (
  project: ProjectEntity,
  documents: DocumentRecord[] = []
): AnomalyItem[] => {
  const anomalies: AnomalyItem[] = [];

  for (const doc of documents) {
    if (!doc.extraction) continue;

    // 1. DOC-MIS-001: Amount Mismatch between OCR invoice and Sanctioned amount
    if (
      doc.extraction.extracted_amount &&
      doc.extraction.extracted_amount > project.sanctioned_amount * 1.15
    ) {
      anomalies.push({
        id: `doc-amt-${doc.id}`,
        project_id: project.id,
        rule_code: 'DOC-MIS-001',
        category: 'DOCUMENT',
        severity: 'HIGH',
        score_impact: 18,
        title: `Invoice OCR Amount Exceeds Sanctioned Limit (${doc.file_name})`,
        description: `Scanned bill records ₹${doc.extraction.extracted_amount.toLocaleString(
          'en-IN'
        )}, which exceeds project ceiling ₹${project.sanctioned_amount.toLocaleString('en-IN')}.`,
        evidence_summary: `OCR confidence: ${Math.round((doc.extraction.confidence || 0.9) * 100)}%. Mismatch flag raised.`,
        confidence_score: doc.extraction.confidence || 0.92,
        detected_at: new Date().toISOString(),
        is_resolved: false,
      });
    }

    // 2. DOC-DATE-002: Invoice date predates sanction order
    if (doc.extraction.extracted_date) {
      const invDate = new Date(doc.extraction.extracted_date);
      const sancDate = new Date(project.sanction_date);
      if (invDate < sancDate) {
        anomalies.push({
          id: `doc-date-${doc.id}`,
          project_id: project.id,
          rule_code: 'DOC-DATE-002',
          category: 'DOCUMENT',
          severity: 'HIGH',
          score_impact: 20,
          title: `Vendor Invoice Date Precedes Official Sanction (${doc.file_name})`,
          description: `Extracted invoice date (${doc.extraction.extracted_date}) is earlier than administrative approval date (${project.sanction_date}).`,
          evidence_summary: 'Chronological conflict between vendor billing date and government sanction file.',
          confidence_score: 0.94,
          detected_at: new Date().toISOString(),
          is_resolved: false,
        });
      }
    }
  }

  return anomalies;
};
