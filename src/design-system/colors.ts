// ==============================================================================
// OBSIDIAN & GOLD — CENTRAL COLOR TOKENS
// ==============================================================================

export const colors = {
  // Primary Palette
  background: '#0a0a0a',       // Monochromatic Obsidian Dark
  backgroundAlt: '#121212',    // Deep Charcoal (Surfaces, Cards, Elevated)
  backgroundSubtle: '#181818', // Surface Subtle
  foreground: '#F3F4F6',       // High-Contrast Platinum/White (Primary Text)
  muted: '#222222',            // Muted Surfaces
  mutedForeground: '#9CA3AF',  // Cool Gray (Secondary Text, Metadata)
  border: 'rgba(255, 255, 255, 0.1)', // Glass Border
  
  // Luxury Gold Accents
  goldBase: '#a78b71',         // Primary Gold Accent
  goldLight: '#c9b8a0',        // Secondary Gold Highlight
  goldHover: '#e8d5b7',        // Bright Gold Hover
  accent: '#a78b71',           // Primary Interactive Accent
  accentHover: '#e8d5b7',
  accentDark: '#8c735d',
  accentSecondary: '#EF4444',  // Crimson Red for High Risk/Alerts
  accentSecondaryHover: '#DC2626',
  accentForeground: '#0a0a0a',

  // Semantic Risk Palette (emerald / amber / crimson)
  risk: {
    low: {
      bg: 'rgba(16, 185, 129, 0.15)',
      border: '#10B981',
      text: '#34D399',
      label: 'LOW RISK',
      scoreRange: '0–29',
    },
    medium: {
      bg: 'rgba(245, 158, 11, 0.15)',
      border: '#F59E0B',
      text: '#FBBF24',
      label: 'MODERATE RISK',
      scoreRange: '30–59',
    },
    high: {
      bg: 'rgba(249, 115, 22, 0.15)',
      border: '#F97316',
      text: '#FB923C',
      label: 'ELEVATED RISK',
      scoreRange: '60–79',
    },
    critical: {
      bg: 'rgba(239, 68, 68, 0.2)',
      border: '#EF4444',
      text: '#F87171',
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
