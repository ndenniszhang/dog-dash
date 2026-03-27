import {
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
} from '../utils';
import { theme } from '../index';

// Helper: build a props object with the real theme
const withTheme = (overrides: Record<string, unknown> = {}) => ({
  theme: { ...theme, ...overrides },
});

describe('getThemeValue', () => {
  it('returns a value at a valid top-level path', () => {
    const fn = getThemeValue('currentMode');
    expect(fn(withTheme())).toBe('light');
  });

  it('returns a value at a nested path', () => {
    const fn = getThemeValue('typography.fontSizes.h1');
    expect(fn(withTheme())).toBe(36);
  });

  it('returns undefined for a missing path', () => {
    const fn = getThemeValue('nonexistent.path');
    expect(fn(withTheme())).toBeUndefined();
  });

  it('returns the fallback when the path is missing', () => {
    const fn = getThemeValue('nonexistent.path', 'fallback-value');
    expect(fn(withTheme())).toBe('fallback-value');
  });

  it('returns the fallback when the path resolves to undefined', () => {
    const fn = getThemeValue<string>('colors.light.text.nonexistent', 'fallback');
    expect(fn(withTheme())).toBe('fallback');
  });

  it('handles null mid-chain (stops traversal)', () => {
    const fn = getThemeValue('colors.light.text.primary.deeper');
    // colors.light.text.primary is a string — traversal cannot continue
    expect(fn(withTheme())).toBeUndefined();
  });

  it('returns actual value even when fallback is provided', () => {
    const fn = getThemeValue('typography.fontSizes.body1', 999);
    expect(fn(withTheme())).toBe(16);
  });
});

describe('getColor', () => {
  it('returns color from nested colors path', () => {
    const fn = getColor('light.text.primary');
    expect(fn(withTheme())).toBe(theme.colors.light.text.primary);
  });

  it('uses fallback for missing color', () => {
    const fn = getColor('nonexistent.color', '#fallback');
    expect(fn(withTheme())).toBe('#fallback');
  });

  it('prefixes path with "colors."', () => {
    // Equivalent: getThemeValue('colors.light.primary.500')
    const fn = getColor('light.primary.500');
    const expected = getThemeValue('colors.light.primary.500')(withTheme());
    expect(fn(withTheme())).toBe(expected);
  });
});

describe('getSpacing', () => {
  it('returns spacing value for a numeric key', () => {
    const fn = getSpacing(4);
    expect(fn(withTheme())).toBe('16px');
  });

  it('returns spacing value for a string key', () => {
    const fn = getSpacing('md');
    expect(fn(withTheme())).toBe('16px');
  });

  it('returns undefined for a missing key', () => {
    const fn = getSpacing('nonexistent');
    expect(fn(withTheme())).toBeUndefined();
  });
});

describe('getTypography', () => {
  it('returns typography textStyles for h1', () => {
    const fn = getTypography('h1');
    const result = fn(withTheme()) as Record<string, unknown>;
    expect(result.fontSize).toBe(36);
  });

  it('returns typography textStyles for body1', () => {
    const fn = getTypography('body1');
    const result = fn(withTheme()) as Record<string, unknown>;
    expect(result.fontSize).toBe(16);
  });

  it('returns undefined for unknown variant', () => {
    const fn = getTypography('unknown');
    expect(fn(withTheme())).toBeUndefined();
  });
});

describe('getFontFamily', () => {
  it('returns sans regular font', () => {
    const fn = getFontFamily('sans', 'regular');
    expect(fn(withTheme())).toBe('Geist');
  });

  it('returns mono bold font', () => {
    const fn = getFontFamily('mono', 'bold');
    expect(fn(withTheme())).toBe('GeistMono-Bold');
  });

  it('returns sans semiBold font', () => {
    const fn = getFontFamily('sans', 'semiBold');
    expect(fn(withTheme())).toBe('Geist-SemiBold');
  });
});

describe('getFontSize', () => {
  it('returns h1 font size (36)', () => {
    const fn = getFontSize('h1');
    expect(fn(withTheme())).toBe(36);
  });

  it('returns display font size (48)', () => {
    const fn = getFontSize('display');
    expect(fn(withTheme())).toBe(48);
  });

  it('returns undefined for unknown size', () => {
    const fn = getFontSize('unknown');
    expect(fn(withTheme())).toBeUndefined();
  });
});

describe('getRadius', () => {
  it('returns lg radius (8px)', () => {
    const fn = getRadius('lg');
    expect(fn(withTheme())).toBe('8px');
  });

  it('returns full radius (9999px)', () => {
    const fn = getRadius('full');
    expect(fn(withTheme())).toBe('9999px');
  });

  it('returns none radius (0px)', () => {
    const fn = getRadius('none');
    expect(fn(withTheme())).toBe('0px');
  });

  it('returns undefined for unknown radius', () => {
    const fn = getRadius('unknown');
    expect(fn(withTheme())).toBeUndefined();
  });
});

describe('getShadow', () => {
  it('returns sm shadow string', () => {
    const fn = getShadow('sm');
    const result = fn(withTheme()) as string;
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns none shadow as "none"', () => {
    const fn = getShadow('none');
    expect(fn(withTheme())).toBe('none');
  });

  it('returns inner shadow containing "inset"', () => {
    const fn = getShadow('inner');
    expect(fn(withTheme())).toContain('inset');
  });

  it('returns undefined for unknown shadow', () => {
    const fn = getShadow('unknown');
    expect(fn(withTheme())).toBeUndefined();
  });
});

describe('responsive', () => {
  it('returns base styles when only base key is provided', () => {
    const fn = responsive({ base: { fontSize: '16px' } });
    const result = fn(withTheme());
    expect(result).toEqual({ fontSize: '16px' });
  });

  it('adds media query for a known breakpoint (md)', () => {
    const fn = responsive({
      base: { fontSize: '16px' },
      md: { fontSize: '18px' },
    });
    const result = fn(withTheme()) as Record<string, unknown>;
    const key = '@media (min-width: 768px)';
    expect(result[key]).toEqual({ fontSize: '18px' });
  });

  it('adds media queries for multiple breakpoints', () => {
    const fn = responsive({
      base: { fontSize: '14px' },
      sm: { fontSize: '16px' },
      lg: { fontSize: '20px' },
    });
    const result = fn(withTheme()) as Record<string, unknown>;
    expect(result['@media (min-width: 640px)']).toEqual({ fontSize: '16px' });
    expect(result['@media (min-width: 1024px)']).toEqual({ fontSize: '20px' });
  });

  it('ignores unknown breakpoint keys', () => {
    const fn = responsive({
      base: { fontSize: '16px' },
      unknown: { fontSize: '99px' },
    });
    const result = fn(withTheme()) as Record<string, unknown>;
    const keys = Object.keys(result);
    expect(keys.some((k) => k.includes('unknown'))).toBe(false);
  });

  it('returns empty object when no base and no breakpoints', () => {
    const fn = responsive({});
    const result = fn(withTheme());
    expect(result).toEqual({});
  });
});

describe('variant', () => {
  const variants = {
    primary: { bg: 'blue', color: 'white' },
    secondary: { bg: 'transparent', color: 'blue' },
  };

  it('returns styles for the specified variant', () => {
    const fn = variant({ variants, defaultVariant: 'primary' });
    expect(fn({ variant: 'secondary' })).toEqual(variants.secondary);
  });

  it('returns default variant styles when no variant prop is provided', () => {
    const fn = variant({ variants, defaultVariant: 'primary' });
    expect(fn({})).toEqual(variants.primary);
  });

  it('returns default variant styles for an unknown variant key', () => {
    const fn = variant({ variants, defaultVariant: 'primary' });
    expect(fn({ variant: 'unknown' })).toEqual(variants.primary);
  });

  it('returns correct variant when variant prop matches', () => {
    const fn = variant({ variants, defaultVariant: 'secondary' });
    expect(fn({ variant: 'primary' })).toEqual(variants.primary);
  });
});
