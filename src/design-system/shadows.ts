export const shadows = {
  none: 'none',
  subtle: '0 2px 8px rgba(0, 0, 0, 0.3)',
  cardHover: '0 8px 24px rgba(0, 0, 0, 0.45)',
  button: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.3)',
  brassGlow: '0 4px 16px rgba(201, 169, 98, 0.35)',
  crimsonGlow: '0 4px 16px rgba(139, 38, 53, 0.4)',
  waxSeal: 'inset 0 2px 4px rgba(255, 255, 255, 0.25), inset 0 -2px 4px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.5)',
  engravedText: '1px 1px 1px rgba(0,0,0,0.6), -1px -1px 1px rgba(255,255,255,0.08)',
} as const;

export type ShadowKey = keyof typeof shadows;
