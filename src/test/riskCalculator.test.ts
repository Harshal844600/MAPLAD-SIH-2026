import { describe, it, expect } from 'vitest';
import { computeRiskScore, DEFAULT_RISK_WEIGHTS } from '../services/risk';
import { AnomalyItem } from '../types';

describe('Risk Score Calculator Engine', () => {
  it('should compute 0 score and LOW risk when no anomalies exist', () => {
    const result = computeRiskScore([]);
    expect(result.overallScore).toBe(0);
    expect(result.riskLevel).toBe('LOW');
  });

  it('should correctly classify CRITICAL risk for severe multi-layer anomalies', () => {
    const mockAnomalies: AnomalyItem[] = [
      {
        id: '1',
        project_id: 'p1',
        rule_code: 'FIN-DUP-002',
        category: 'FINANCIAL',
        severity: 'CRITICAL',
        score_impact: 30,
        title: 'Duplicate Invoice',
        description: 'Disbursed twice',
        evidence_summary: 'Dual payment',
        confidence_score: 0.99,
        detected_at: new Date().toISOString(),
        is_resolved: false,
      },
      {
        id: '2',
        project_id: 'p1',
        rule_code: 'GEO-DUP-001',
        category: 'GEOGRAPHIC',
        severity: 'CRITICAL',
        score_impact: 30,
        title: 'GPS Overlap',
        description: 'Asset overlap',
        evidence_summary: '8m distance',
        confidence_score: 0.98,
        detected_at: new Date().toISOString(),
        is_resolved: false,
      },
      {
        id: '3',
        project_id: 'p1',
        rule_code: 'TIME-SEQ-001',
        category: 'TIMELINE',
        severity: 'CRITICAL',
        score_impact: 28,
        title: 'Completion Before Sanction',
        description: 'Sequence inverted',
        evidence_summary: 'Chronology conflict',
        confidence_score: 0.95,
        detected_at: new Date().toISOString(),
        is_resolved: false,
      },
      {
        id: '4',
        project_id: 'p1',
        rule_code: 'VEN-CONC-001',
        category: 'VENDOR',
        severity: 'HIGH',
        score_impact: 24,
        title: 'Vendor Concentration',
        description: 'High HHI',
        evidence_summary: '75% share',
        confidence_score: 0.92,
        detected_at: new Date().toISOString(),
        is_resolved: false,
      },
    ];

    const result = computeRiskScore(mockAnomalies);
    expect(result.overallScore).toBeGreaterThanOrEqual(15);
    expect(result.calculationId).toBeDefined();
    expect(result.modelVersion).toContain('v1.4.2');
  });

  it('should ignore resolved anomalies during score calculation', () => {
    const mockAnomalies: AnomalyItem[] = [
      {
        id: '1',
        project_id: 'p1',
        rule_code: 'FIN-COST-001',
        category: 'FINANCIAL',
        severity: 'HIGH',
        score_impact: 25,
        title: 'Cost Deviation',
        description: 'High unit rate',
        evidence_summary: 'Rate delta',
        confidence_score: 0.9,
        detected_at: new Date().toISOString(),
        is_resolved: true, // RESOLVED
      },
    ];

    const result = computeRiskScore(mockAnomalies);
    expect(result.overallScore).toBe(0);
    expect(result.riskLevel).toBe('LOW');
  });
});
