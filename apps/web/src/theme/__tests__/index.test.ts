import { theme, themeGet } from '../index';

describe('theme object', () => {
  it('has light and dark color keys', () => {
    expect(theme.colors).toHaveProperty('light');
    expect(theme.colors).toHaveProperty('dark');
  });

  it('defaults to light mode', () => {
    expect(theme.currentMode).toBe('light');
  });

  it('getCurrentColors returns the light palette by default', () => {
    const colors = theme.getCurrentColors();
    expect(colors).toBe(theme.colors.light);
  });

  it('has typography and space properties', () => {
    expect(theme.typography).toBeDefined();
    expect(theme.space).toBeDefined();
  });

  it('light palette has text and surface keys', () => {
    const light = theme.colors.light;
    expect(light.text).toBeDefined();
    expect(light.surface).toBeDefined();
  });

  it('dark palette has text and surface keys', () => {
    const dark = theme.colors.dark;
    expect(dark.text).toBeDefined();
    expect(dark.surface).toBeDefined();
  });
});

describe('themeGet', () => {
  it('returns the typography object', () => {
    const getter = themeGet('typography');
    const result = getter({ theme });
    expect(result).toBe(theme.typography);
  });

  it('returns the space object', () => {
    const getter = themeGet('space');
    const result = getter({ theme });
    expect(result).toBe(theme.space);
  });

  it('returns current mode primary colors when path starts with "colors"', () => {
    const getter = themeGet('colors.primary');
    const result = getter({ theme });
    expect(result).toBe(theme.colors.light.primary);
  });

  it('returns undefined for an unknown top-level path', () => {
    const getter = themeGet('nonexistent');
    const result = getter({ theme });
    expect(result).toBeUndefined();
  });
});
