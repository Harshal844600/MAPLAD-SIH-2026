export const typography = {
  fonts: {
    heading: "'Cormorant Garamond', Georgia, serif",
    body: "'Crimson Pro', Georgia, serif",
    display: "'Cinzel', Trajan, Georgia, serif",
    mono: "'JetBrains Mono', monospace",
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  sizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1.0625rem',  // 17px
    lg: '1.1875rem',   // 19px
    xl: '1.375rem',    // 22px
    '2xl': '1.625rem', // 26px
    '3xl': '2rem',     // 32px
    '4xl': '2.625rem', // 42px
    '5xl': '3.5rem',   // 56px
    '6xl': '4.5rem',   // 72px
  },
  tracking: {
    tighter: '-0.03em',
    tight: '-0.015em',
    normal: '0em',
    wide: '0.1em',
    wider: '0.18em',
    widest: '0.25em',
  },
  lineHeights: {
    tight: '1.15',
    snug: '1.3',
    normal: '1.625',
    relaxed: '1.8',
  },
} as const;
