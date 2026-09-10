export const shadows = {
  none: 'none',
  subtle: '0 2px 8px rgba(0, 0, 0, 0.4)',
  cardHover: '0 12px 32px rgba(0, 0, 0, 0.6), 0 0 30px rgba(167, 139, 113, 0.2)',
  button: '0 2px 10px rgba(0, 0, 0, 0.3), 0 0 15px rgba(167, 139, 113, 0.2)',
  goldGlow: '0 0 40px rgba(167, 139, 113, 0.25)',
  ambientGlow: '0 0 100px rgba(167, 139, 113, 0.2)',
  satelliteGlow: '0 0 60px rgba(167, 139, 113, 0.3)',
  crimsonGlow: '0 0 30px rgba(239, 68, 68, 0.35)',
  glassModal: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(167, 139, 113, 0.15)',
} as const;

export type ShadowKey = keyof typeof shadows;
