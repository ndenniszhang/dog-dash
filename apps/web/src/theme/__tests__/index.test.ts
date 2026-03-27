import theme, { themeGet, ThemeMode } from '../index';

describe('theme object structure', () => {
  it('has colors with light and dark keys', () => {
    expect(theme.colors).toBeDefined();
    expect(theme.colors.light).toBeDefined();
    expect(theme.colors.dark).toBeDefined();
  });

  it('has typography', () => {
    expect(theme.typography).toBeDefined();
    expect(theme.typography.fontSizes).toBeDefined();
    expect(theme.typography.fontFamilies).toBeDefined();
  });

  it('has space', () => {
    expect(theme.space).toBeDefined();
    expect(theme.space.breakpoints).toBeDefined();
    expect(theme.space.radii).toBeDefined();
  });

  it('defaults to light mode', () => {
    expect(theme.currentMode).toBe('light');
  });

  it('has getCurrentColors function', () => {
    expect(typeof theme.getCurrentColors).toBe('function');
  });

  it('getCurrentColors returns light palette by default', () => {
    const colors = theme.getCurrentColors();
    expect(colors).toBe(theme.colors.light);
  });

  it('getCurrentColors returns dark palette when mode is dark', () => {
    const darkTheme = { ...theme, currentMode: 'dark' as ThemeMode };
    const colors = darkTheme.getCurrentColors();
    expect(colors).toBe(theme.colors.dark);
  });

  it('light palette has text and surface', () => {
    expect(theme.colors.light.text).toBeDefined();
    expect(theme.colors.light.surface).toBeDefined();
  });

  it('dark palette has different text.primary than light', () => {
    expect(theme.colors.dark.text.primary).not.toBe(theme.colors.light.text.primary);
  });
});

describe('themeGet', () => {
  const withTheme = (mode: ThemeMode = 'light') => ({
    theme: {
      ...theme,
      currentMode: mode,
      getCurrentColors() {
        return this.colors[this.currentMode];
      },
    },
  });

  it('retrieves a top-level non-color value', () => {
    const fn = themeGet('currentMode');
    expect(fn(withTheme())).toBe('light');
  });

  it('retrieves a nested non-color value', () => {
    const fn = themeGet('typography.fontSizes.h1');
    expect(fn(withTheme())).toBe(36);
  });

  it('retrieves a color value using getCurrentColors (light mode)', () => {
    const fn = themeGet('colors.text.primary');
    const result = fn(withTheme('light'));
    expect(result).toBe(theme.colors.light.text.primary);
  });

  it('retrieves a color value in dark mode', () => {
    const fn = themeGet('colors.text.primary');
    const result = fn(withTheme('dark'));
    expect(result).toBe(theme.colors.dark.text.primary);
  });

  it('returns undefined for a completely unknown path', () => {
    const fn = themeGet('nonexistent.key');
    expect(fn(withTheme())).toBeUndefined();
  });

  it('returns undefined when mid-chain value is null/undefined', () => {
    const fn = themeGet('typography.nonexistent.key');
    expect(fn(withTheme())).toBeUndefined();
  });

  it('handles colors prefix correctly (removes "colors" from path)', () => {
    // themeGet('colors.text.primary') should NOT include 'colors' in traversal
    // after the getCurrentColors() branch
    const fn = themeGet('colors.surface.background');
    const result = fn(withTheme('light'));
    expect(result).toBe(theme.colors.light.surface.background);
  });
});
