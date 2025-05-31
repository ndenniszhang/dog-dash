/**
 * Theme utility functions for accessing design tokens
 */
import { Theme } from './index';

/**
 * Get a value from the theme using a path string
 * @param path The dot-notation path to the theme value
 * @param fallback Optional fallback value
 */
export const getThemeValue = <T = unknown>(path: string, fallback?: T) => {
  return (props: { theme: Theme }): T | undefined => {
    const value = path.split('.').reduce<Record<string, unknown> | undefined>((obj, key) => {
      if (!obj || typeof obj !== 'object') return undefined;
      return obj[key] as Record<string, unknown> | undefined;
    }, props.theme as Record<string, unknown>);
    
    return (value === undefined ? fallback : value) as T;
  };
};

/**
 * Get a color from the theme
 * @param colorPath The dot-notation path to the color (e.g., 'primary.500')
 * @param fallback Optional fallback color
 */
export const getColor = (colorPath: string, fallback?: string) => {
  return getThemeValue(`colors.${colorPath}`, fallback);
};

/**
 * Get a spacing value from the theme
 * @param key The spacing key (e.g., '4' for 16px)
 */
export const getSpacing = (key: string | number) => {
  return getThemeValue(`space.${key}`);
};

/**
 * Get a typography style from the theme
 * @param variant The typography variant (e.g., 'h1', 'body1')
 */
export const getTypography = (variant: string) => {
  return getThemeValue(`typography.textStyles.${variant}`);
};

/**
 * Get a font family from the theme
 * @param family The font family ('sans' or 'mono')
 * @param weight The font weight ('regular', 'medium', 'semiBold', 'bold')
 */
export const getFontFamily = (family: 'sans' | 'mono', weight: 'regular' | 'medium' | 'semiBold' | 'bold') => {
  return getThemeValue(`typography.fontFamilies.${family}.${weight}`);
};

/**
 * Get a font size from the theme
 * @param size The font size key (e.g., 'body1', 'h1')
 */
export const getFontSize = (size: string) => {
  return getThemeValue(`typography.fontSizes.${size}`);
};

/**
 * Get a border radius value from the theme
 * @param size The border radius size ('sm', 'md', 'lg', 'xl', '2xl', 'full')
 */
export const getRadius = (size: string) => {
  return getThemeValue(`space.radii.${size}`);
};

/**
 * Get a shadow value from the theme
 * @param size The shadow size ('sm', 'md', 'lg', 'xl', '2xl')
 */
export const getShadow = (size: string) => {
  return getThemeValue(`space.shadows.${size}`);
};

/**
 * Create responsive styles based on breakpoints
 * @param styles Object with breakpoint keys and style values
 * @example
 * responsive({
 *   base: { fontSize: '16px' },
 *   md: { fontSize: '18px' },
 *   lg: { fontSize: '20px' },
 * })
 */
export const responsive = (styles: Record<string, unknown>) => {
  return (props: { theme: Theme }) => {
    const { theme } = props;
    const breakpoints = theme.space.breakpoints;
    
    // Base styles (no media query)
    let result = styles.base || {};
    
    // Add media queries for each breakpoint
    Object.entries(styles).forEach(([key, value]) => {
      if (key !== 'base' && breakpoints[key as keyof typeof breakpoints]) {
        const breakpointValue = breakpoints[key as keyof typeof breakpoints];
        result = {
          ...result,
          [`@media (min-width: ${breakpointValue})`]: value,
        };
      }
    });
    
    return result;
  };
};

/**
 * Create a variant-based style function
 * @param variants Object with variant options
 * @param defaultVariant Default variant to use
 * @example
 * const buttonVariants = variant({
 *   variants: {
 *     primary: { bg: 'primary.500', color: 'white' },
 *     secondary: { bg: 'transparent', border: '1px solid' },
 *   },
 *   defaultVariant: 'primary',
 * })
 */
export const variant = <T extends Record<string, unknown>>({ variants, defaultVariant }: { 
  variants: Record<string, T>;
  defaultVariant: string;
}) => {
  return (props: { variant?: string }): T => {
    const variantKey = props.variant || defaultVariant;
    return variants[variantKey] || variants[defaultVariant];
  };
};

const themeUtils = {
  getThemeValue,
  getColor,
  getSpacing,
  getTypography,
  getFontFamily,
  getFontSize,
  getRadius,
  getShadow,
  responsive,
  variant,
};

export default themeUtils;
