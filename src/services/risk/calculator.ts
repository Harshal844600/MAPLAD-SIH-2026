import { AnomalyItem, RiskLevel } from '../../types';

export interface RiskWeights {
  financial: number;
  timeline: number;
  vendor: number;
  geographic: number;
  documents: number;
  duplicate: number;
}

export const DEFAULT_RISK_WEIGHTS: RiskWeights = {
  financial: 0.25,
  timeline: 0.20,
  vendor: 0.20,
  geographic: 0.15,
  documents: 0.15,
  duplicate: 0.05,
};

export interface RiskCalculationOutput {
  overallScore: number;
  riskLevel: RiskLevel;
  subscores: {
    financial: number;
    timeline: number;
    vendor: number;
    geographic: number;
    documents: number;
    duplicate: number;
  };
  calculationId: string;
  modelVersion: string;
  ruleSetVersion: string;
  calculatedAt: string;
}

export function computeRiskScore(
  anomalies: AnomalyItem[],
  weights: RiskWeights = DEFAULT_RISK_WEIGHTS
): RiskCalculationOutput {
  const subscores = {
    financial: 0,
    timeline: 0,
    vendor: 0,
    geographic: 0,
    documents: 0,
    duplicate: 0,
  };

  // Tally impacts by category
  for (const a of anomalies) {
    if (a.is_resolved) continue;
    switch (a.category) {
      case 'FINANCIAL':
        subscores.financial = Math.min(100, subscores.financial + a.score_impact);
        break;
      case 'TIMELINE':
        subscores.timeline = Math.min(100, subscores.timeline + a.score_impact);
        break;
      case 'VENDOR':
        subscores.vendor = Math.min(100, subscores.vendor + a.score_impact);
        break;
      case 'GEOGRAPHIC':
        subscores.geographic = Math.min(100, subscores.geographic + a.score_impact);
        break;
      case 'DOCUMENT':
        subscores.documents = Math.min(100, subscores.documents + a.score_impact);
        break;
      case 'DUPLICATE':
        subscores.duplicate = Math.min(100, subscores.duplicate + a.score_impact);
        break;
    }
  }

  // Weighted sum
  const rawScore =
    subscores.financial * weights.financial +
    subscores.timeline * weights.timeline +
    subscores.vendor * weights.vendor +
    subscores.geographic * weights.geographic +
    subscores.documents * weights.documents +
    subscores.duplicate * weights.duplicate;

  const overallScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  const riskLevel: RiskLevel =
    overallScore >= 80
      ? 'CRITICAL'
      : overallScore >= 60
      ? 'HIGH'
      : overallScore >= 30
      ? 'MEDIUM'
      : 'LOW';

  return {
    overallScore,
    riskLevel,
    subscores,
    calculationId: `calc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    modelVersion: 'v1.4.2-hybrid',
    ruleSetVersion: '2026.01',
    calculatedAt: new Date().toISOString(),
  };
}
