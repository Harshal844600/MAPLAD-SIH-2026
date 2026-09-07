import { colors } from './colors';
import { typography } from './typography';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { motion } from './motion';
import { decorations } from './decorations';

export const academiaTokens = {
  colors,
  typography,
  radius,
  shadows,
  spacing,
  motion,
  decorations,
} as const;

export const tokens = academiaTokens;
export type DesignTokens = typeof academiaTokens;
