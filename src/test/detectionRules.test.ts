import { describe, it, expect } from 'vitest';
import { detectFinancialAnomalies } from '../services/detection/financial';
import { detectTimelineAnomalies } from '../services/detection/timeline';
import { detectGeographicAnomalies } from '../services/detection/geographic';
import { FLAGSHIP_PROJECT_10291, FLAGSHIP_TRANSACTIONS_10291 } from '../services/demo/syntheticData';

describe('Multi-Layer Anomaly Detection Engines', () => {
  it('should detect duplicate payment invoices under FIN-DUP-002', () => {
    const anomalies = detectFinancialAnomalies(
      FLAGSHIP_PROJECT_10291,
      FLAGSHIP_TRANSACTIONS_10291
    );

    const dupAnomaly = anomalies.find((a) => a.rule_code === 'FIN-DUP-002');
    expect(dupAnomaly).toBeDefined();
    expect(dupAnomaly?.severity).toBe('CRITICAL');
  });

  it('should detect inverted completion certificate chronology under TIME-SEQ-001', () => {
    const anomalies = detectTimelineAnomalies(FLAGSHIP_PROJECT_10291);
    const seqAnomaly = anomalies.find((a) => a.rule_code === 'TIME-SEQ-001');
    expect(seqAnomaly).toBeDefined();
    expect(seqAnomaly?.severity).toBe('CRITICAL');
  });

  it('should detect GPS coordinate overlap under GEO-DUP-001 when overlapping within 25m', () => {
    const mockNearby = [
      {
        ...FLAGSHIP_PROJECT_10291,
        id: 'proj-other-2023',
        project_code: 'MPLAD-2023-99',
        title: 'Old Community Hall 2023',
        latitude: 25.548201, // ~1 meter away
        longitude: 81.983401,
      },
    ];

    const anomalies = detectGeographicAnomalies(FLAGSHIP_PROJECT_10291, mockNearby);
    const geoAnomaly = anomalies.find((a) => a.rule_code === 'GEO-DUP-001');
    expect(geoAnomaly).toBeDefined();
    expect(geoAnomaly?.severity).toBe('CRITICAL');
  });

  it('should compute variable, category-tailored standard reference rates for FIN-COST-001', () => {
    // 1. Flagship case: Community Center sanctioned for 48.5 Lakhs vs 22 Lakhs benchmark
    const flagshipAnomalies = detectFinancialAnomalies(
      FLAGSHIP_PROJECT_10291,
      FLAGSHIP_TRANSACTIONS_10291
    );
    const flagshipCostAnomaly = flagshipAnomalies.find((a) => a.rule_code === 'FIN-COST-001');
    expect(flagshipCostAnomaly).toBeDefined();
    expect(flagshipCostAnomaly?.description).toContain('22,00,000');
    expect(flagshipCostAnomaly?.severity).toBe('CRITICAL');

    // 2. High-outlay Roads & Bridges project
    const roadProject = {
      ...FLAGSHIP_PROJECT_10291,
      id: 'proj-road-991',
      project_code: 'MPLAD-ROAD-991',
      category_name: 'Roads & Bridges',
      sanctioned_amount: 8500000,
      risk_score: 88,
      risk_level: 'CRITICAL' as const,
      subscores: { ...FLAGSHIP_PROJECT_10291.subscores, financial: 90 },
    };
    const roadAnomalies = detectFinancialAnomalies(roadProject);
    const roadCostAnomaly = roadAnomalies.find((a) => a.rule_code === 'FIN-COST-001');
    expect(roadCostAnomaly).toBeDefined();
    // Benchmark is variable and dynamically calculated (not static 25,00,000)
    expect(roadCostAnomaly?.description).not.toContain('₹25,00,000');
    expect(roadCostAnomaly?.description).toContain('Roads & Bridges');
  });
});
