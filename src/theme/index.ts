import { ColorPalette } from './colors';
import { Typography } from './typography';
import { Spacing } from './spacing';

export type ThemeMode = 'light' | 'dark';

type ThemeColors = {
  light: ColorPalette;
  dark: ColorPalette;
};

export interface Theme extends Record<string, unknown> {
  colors: ThemeColors;
  typography: Typography;
  space: Spacing;
  currentMode: ThemeMode;
  getCurrentColors: () => ColorPalette;
  [key: string]: unknown; // Index signature
}

// Import theme modules
import colors from './colors';
import typography from './typography';
import space from './spacing';

// Base theme configuration
export const theme: Theme = {
  colors: {
    light: {
      ...colors,
      // Light mode color overrides can be added here
    },
    dark: {
      ...colors,
      // Dark mode color overrides can be added here
    },
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
