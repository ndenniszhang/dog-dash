// Design tokens mirroring apps/web/src/theme — kept in sync with the design system spec.
// These are static values; dark mode is handled at the app level via CSS vars (web)
// or ThemeProvider (native).

export const colors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  semantic: {
    success: { 50: '#ECFDF5', 500: '#10B981', 900: '#064E3B' },
    error:   { 50: '#FEF2F2', 500: '#EF4444', 900: '#7F1D1D' },
    warning: { 50: '#FFFBEB', 500: '#F59E0B', 900: '#78350F' },
    info:    { 50: '#EFF6FF', 500: '#3B82F6', 900: '#1E3A8A' },
  },
  neutral: {
    50:  '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  text: {
    primary:   '#0F172A',
    secondary: '#475569',
    disabled:  '#94A3B8',
    inverse:   '#FFFFFF',
  },
  surface: {
    background: '#FFFFFF',
    paper:      '#F8FAFC',
    border:     '#E2E8F0',
    divider:    '#F1F5F9',
  },
} as const;

export const space = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;

export const radii = {
  sm:   2,
  md:   6,
  lg:   8,
  xl:   12,
  full: 9999,
} as const;

export const fontSizes = {
  display: 48,
  h1:      36,
  h2:      30,
  h3:      24,
  h4:      20,
  body1:   16,
  body2:   14,
  caption: 12,
  small:   10,
} as const;

export const fontWeights = {
  regular:  '400',
  medium:   '500',
  semiBold: '600',
  bold:     '700',
} as const;
