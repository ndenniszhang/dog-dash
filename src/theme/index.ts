import { Typography } from './typography';
import { Spacing } from './spacing';
import colorTokens from './colors';

export type ThemeMode = 'light' | 'dark';

// Define color structure types
type TextColors = {
  primary: string;
  secondary: string;
  disabled: string;
  inverse: string;
};

type SurfaceColors = {
  background: string;
  paper: string;
  border: string;
  divider: string;
};

// Define a more flexible color palette type that allows string values
export interface ThemeColorPalette {
  primary: Record<string, string>;
  semantic: Record<string, Record<string, string>>;
  neutral: Record<string, string>;
  text: TextColors;
  surface: SurfaceColors;
  [key: string]: unknown;
}

type ThemeColors = {
  light: ThemeColorPalette;
  dark: ThemeColorPalette;
};

export interface Theme extends Record<string, unknown> {
  colors: ThemeColors;
  typography: Typography;
  space: Spacing;
  currentMode: ThemeMode;
  getCurrentColors: () => ThemeColorPalette;
  [key: string]: unknown; // Index signature
}

// Import theme modules
import typography from './typography';
import space from './spacing';

// Create light and dark color palettes
const lightColors: ThemeColorPalette = {
  ...colorTokens,
  text: {
    primary: colorTokens.neutral[900],
    secondary: colorTokens.neutral[600],
    disabled: colorTokens.neutral[400],
    inverse: '#FFFFFF',
  },
  surface: {
    background: '#FFFFFF',
    paper: colorTokens.neutral[50],
    border: colorTokens.neutral[200],
    divider: colorTokens.neutral[100],
  },
};

const darkColors: ThemeColorPalette = {
  ...colorTokens,
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
};

// Base theme configuration
export const theme: Theme = {
  colors: {
    light: lightColors,
    dark: darkColors,
  },
  typography,
  space,
  currentMode: 'light',
  getCurrentColors() {
    return this.colors[this.currentMode];
  },
};

// Helper function to get theme value
export const themeGet = (path: string) => {
  return (props: { theme: Theme }) => {
    const parts = path.split('.');
    let value: Record<string, unknown> = props.theme;

    // If the path starts with 'colors', use the current mode's colors
    if (parts[0] === 'colors') {
      value = props.theme.getCurrentColors() as Record<string, unknown>;
      parts.shift(); // Remove 'colors' from parts
    }

    for (const part of parts) {
      if (value === undefined || value === null) break;
      value = value[part] as Record<string, unknown>;
    }

    return value;
  };
};

// Export theme provider
export { ThemeProvider } from './ThemeProvider';

export default theme;
