export const radius = {
  none: '0px',
  sm: '2px',
  default: '4px',
  md: '4px',
  lg: '6px',
  arch: '40% 40% 0 0 / 20% 20% 0 0',
  full: '9999px',
} as const;

export type RadiusKey = keyof typeof radius;
