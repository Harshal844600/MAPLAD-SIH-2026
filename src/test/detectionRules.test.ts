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
});
