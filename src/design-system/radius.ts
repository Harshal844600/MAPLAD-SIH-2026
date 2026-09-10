export const radius = {
  none: '0px',
  sm: '4px',
  default: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '48px',
  arch: '24px 24px 0 0',
  full: '9999px',
} as const;

export type RadiusKey = keyof typeof radius;
