// Font families
export const fontFamilies = {
  sans: {
    regular: 'Geist',
    medium: 'Geist-Medium',
    semiBold: 'Geist-SemiBold',
    bold: 'Geist-Bold',
  },
  mono: {
    regular: 'GeistMono',
    medium: 'GeistMono-Medium',
    semiBold: 'GeistMono-SemiBold',
    bold: 'GeistMono-Bold',
  },
} as const;

// Font sizes (in pixels)
export const fontSizes = {
  display: 48,  // 3rem
  h1: 36,      // 2.25rem
  h2: 30,      // 1.875rem
  h3: 24,      // 1.5rem
  h4: 20,      // 1.25rem
  body1: 16,   // 1rem
  body2: 14,   // 0.875rem
  caption: 12,  // 0.75rem
  small: 10,   // 0.625rem
} as const;

// Line heights
export const lineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// Font weights
export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Text styles
export const textStyles = {
  display: {
    fontSize: fontSizes.display,
    lineHeight: 1.2,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tighter,
  },
  h1: {
    fontSize: fontSizes.h1,
    lineHeight: 1.2,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSizes.h2,
    lineHeight: 1.25,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontSize: fontSizes.h3,
    lineHeight: 1.3,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontSize: fontSizes.h4,
    lineHeight: 1.35,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacing.normal,
  },
  body1: {
    fontSize: fontSizes.body1,
    lineHeight: lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
  },
  body2: {
    fontSize: fontSizes.body2,
    lineHeight: lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.normal,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
  small: {
    fontSize: fontSizes.small,
    lineHeight: lineHeights.normal,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.normal,
  },
} as const;

export type Typography = {
  fontFamilies: typeof fontFamilies;
  fontSizes: typeof fontSizes;
  lineHeights: typeof lineHeights;
  fontWeights: typeof fontWeights;
  letterSpacing: typeof letterSpacing;
  textStyles: typeof textStyles;
};

export const typography: Typography = {
  fontFamilies,
  fontSizes,
  lineHeights,
  fontWeights,
  letterSpacing,
  textStyles,
};

export default typography;
