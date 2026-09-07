// ==============================================================================
// ACADEMIA / CLASSICAL — CENTRAL COLOR TOKENS
// ==============================================================================

export const colors = {
  // Primary Palette
  background: '#1C1714',       // Deep Mahogany
  backgroundAlt: '#251E19',    // Aged Oak (Surfaces, Cards, Elevated)
  foreground: '#E8DFD4',       // Antique Parchment (Primary Text)
  muted: '#3D332B',            // Worn Leather (Secondary Surfaces)
  mutedForeground: '#9C8B7A',  // Faded Ink (Secondary Text, Metadata)
  border: '#4A3F35',           // Wood Grain (Dividers, Borders)
  
  // Metallic & Accent Palette
  accent: '#C9A962',           // Polished Brass (Primary Interactive, Focus, Highlights)
  accentHover: '#D4B872',      // Bright Brass
  accentDark: '#B8953F',       // Antique Brass
  accentSecondary: '#8B2635',  // Library Crimson (Critical Severity, Wax Seals, Warnings)
  accentSecondaryHover: '#A32D3F',
  accentForeground: '#1C1714',

  // Semantic Risk Palette (Classical Institutional Tone)
  risk: {
    low: {
      bg: 'rgba(22, 101, 52, 0.15)',
      border: '#2e7d32',
      text: '#a5d6a7',
      label: 'LOW RISK',
      scoreRange: '0–29',
    },
    medium: {
      bg: 'rgba(202, 138, 4, 0.15)',
      border: '#C9A962',
      text: '#C9A962',
      label: 'MODERATE RISK',
      scoreRange: '30–59',
    },
    high: {
      bg: 'rgba(234, 88, 12, 0.15)',
      border: '#d97706',
      text: '#fbbf24',
      label: 'ELEVATED RISK',
      scoreRange: '60–79',
    },
    critical: {
      bg: 'rgba(139, 38, 53, 0.25)',
      border: '#8B2635',
      text: '#fca5a5',
      label: 'CRITICAL RISK',
      scoreRange: '80–100',
    },
  },
} as const;

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export function getRiskColor(score: number): {
  level: RiskLevel;
  config: typeof colors.risk[keyof typeof colors.risk];
} {
  if (score >= 80) return { level: 'CRITICAL', config: colors.risk.critical };
  if (score >= 60) return { level: 'HIGH', config: colors.risk.high };
  if (score >= 30) return { level: 'MEDIUM', config: colors.risk.medium };
  return { level: 'LOW', config: colors.risk.low };
}
