// Primary colors
export const primary = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6', // Base primary
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
} as const;

// Semantic colors
export const semantic = {
  success: {
    50: '#ECFDF5',
    500: '#10B981', // Base success
    900: '#064E3B',
  },
  error: {
    50: '#FEF2F2',
    500: '#EF4444', // Base error
    900: '#7F1D1D',
  },
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B', // Base warning
    900: '#78350F',
  },
  info: {
    50: '#EFF6FF',
    500: '#3B82F6', // Base info
    900: '#1E3A8A',
  },
} as const;

// Neutral colors
export const neutral = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
} as const;

// Text colors
export const text = {
  primary: neutral[900],
  secondary: neutral[600],
  disabled: neutral[400],
  inverse: '#FFFFFF',
} as const;

// Surface colors
export const surface = {
  background: '#FFFFFF',
  paper: neutral[50],
  border: neutral[200],
  divider: neutral[100],
} as const;

// Dark mode overrides
export const dark = {
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    disabled: '#475569',
    inverse: '#0F172A',
  },
  surface: {
    background: '#0F172A',
    paper: '#1E293B',
    border: '#334155',
    divider: '#1E293B',
  },
} as const;

// Export all color tokens as a single object
const colorTokens = {
  primary,
  semantic,
  neutral,
  text,
  surface,
  dark,
};

export default colorTokens;
