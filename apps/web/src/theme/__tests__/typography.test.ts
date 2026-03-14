import typography, {
  fontFamilies,
  fontSizes,
  lineHeights,
  fontWeights,
  letterSpacing,
  textStyles,
} from '../typography';

describe('typography — fontFamilies', () => {
  it('has sans and mono families', () => {
    expect(fontFamilies.sans).toBeDefined();
    expect(fontFamilies.mono).toBeDefined();
  });

  const weights = ['regular', 'medium', 'semiBold', 'bold'] as const;

  it('sans has all 4 weight variants', () => {
    weights.forEach((w) => expect(fontFamilies.sans[w]).toBeDefined());
  });

  it('mono has all 4 weight variants', () => {
    weights.forEach((w) => expect(fontFamilies.mono[w]).toBeDefined());
  });

  it('sans font names contain Geist', () => {
    weights.forEach((w) => expect(fontFamilies.sans[w]).toContain('Geist'));
  });

  it('mono font names contain GeistMono', () => {
    weights.forEach((w) => expect(fontFamilies.mono[w]).toContain('GeistMono'));
  });
});

describe('typography — fontSizes', () => {
  const keys = ['display', 'h1', 'h2', 'h3', 'h4', 'body1', 'body2', 'caption', 'small'] as const;

  it('has all 9 size keys', () => {
    keys.forEach((k) => expect(fontSizes[k]).toBeDefined());
  });

  it('all sizes are positive numbers', () => {
    keys.forEach((k) => {
      expect(typeof fontSizes[k]).toBe('number');
      expect(fontSizes[k]).toBeGreaterThan(0);
    });
  });

  it('display is the largest size', () => {
    keys.forEach((k) => expect(fontSizes.display).toBeGreaterThanOrEqual(fontSizes[k]));
  });

  it('small is the smallest size', () => {
    keys.forEach((k) => expect(fontSizes.small).toBeLessThanOrEqual(fontSizes[k]));
  });

  it('exact values match spec', () => {
    expect(fontSizes.display).toBe(48);
    expect(fontSizes.h1).toBe(36);
    expect(fontSizes.h2).toBe(30);
    expect(fontSizes.h3).toBe(24);
    expect(fontSizes.h4).toBe(20);
    expect(fontSizes.body1).toBe(16);
    expect(fontSizes.body2).toBe(14);
    expect(fontSizes.caption).toBe(12);
    expect(fontSizes.small).toBe(10);
  });
});

describe('typography — lineHeights', () => {
  it('has tight, normal, and relaxed', () => {
    expect(lineHeights.tight).toBeDefined();
    expect(lineHeights.normal).toBeDefined();
    expect(lineHeights.relaxed).toBeDefined();
  });

  it('all values are numbers greater than 1', () => {
    Object.values(lineHeights).forEach((v) => {
      expect(typeof v).toBe('number');
      expect(v).toBeGreaterThan(1);
    });
  });

  it('tight < normal < relaxed', () => {
    expect(lineHeights.tight).toBeLessThan(lineHeights.normal);
    expect(lineHeights.normal).toBeLessThan(lineHeights.relaxed);
  });

  it('exact values match spec', () => {
    expect(lineHeights.tight).toBe(1.25);
    expect(lineHeights.normal).toBe(1.5);
    expect(lineHeights.relaxed).toBe(1.75);
  });
});

describe('typography — fontWeights', () => {
  it('has regular, medium, semiBold, and bold', () => {
    expect(fontWeights.regular).toBeDefined();
    expect(fontWeights.medium).toBeDefined();
    expect(fontWeights.semiBold).toBeDefined();
    expect(fontWeights.bold).toBeDefined();
  });

  it('all values are string representations of numbers', () => {
    Object.values(fontWeights).forEach((v) => {
      expect(typeof v).toBe('string');
      expect(Number(v)).not.toBeNaN();
    });
  });

  it('exact values match spec', () => {
    expect(fontWeights.regular).toBe('400');
    expect(fontWeights.medium).toBe('500');
    expect(fontWeights.semiBold).toBe('600');
    expect(fontWeights.bold).toBe('700');
  });
});

describe('typography — letterSpacing', () => {
  const keys = ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'] as const;

  it('has all 6 keys', () => {
    keys.forEach((k) => expect(letterSpacing[k]).toBeDefined());
  });

  it('normal letterSpacing is "0"', () => {
    expect(letterSpacing.normal).toBe('0');
  });

  it('negative values exist for tighter/tight', () => {
    expect(letterSpacing.tighter).toContain('-');
    expect(letterSpacing.tight).toContain('-');
  });

  it('positive values exist for wide/wider/widest', () => {
    const parseEm = (v: string) => parseFloat(v);
    expect(parseEm(letterSpacing.wide)).toBeGreaterThan(0);
    expect(parseEm(letterSpacing.wider)).toBeGreaterThan(0);
    expect(parseEm(letterSpacing.widest)).toBeGreaterThan(0);
  });
});

describe('typography — textStyles', () => {
  const styleKeys = ['display', 'h1', 'h2', 'h3', 'h4', 'body1', 'body2', 'caption', 'small'] as const;

  it('has all 9 text style keys', () => {
    styleKeys.forEach((k) => expect(textStyles[k]).toBeDefined());
  });

  it('each style has fontSize, lineHeight, fontWeight, letterSpacing', () => {
    styleKeys.forEach((k) => {
      const style = textStyles[k];
      expect(style.fontSize).toBeDefined();
      expect(style.lineHeight).toBeDefined();
      expect(style.fontWeight).toBeDefined();
      expect(style.letterSpacing).toBeDefined();
    });
  });

  it('textStyles.h1.fontSize matches fontSizes.h1', () => {
    expect(textStyles.h1.fontSize).toBe(fontSizes.h1);
  });

  it('textStyles.body1.fontWeight matches fontWeights.regular', () => {
    expect(textStyles.body1.fontWeight).toBe(fontWeights.regular);
  });

  it('textStyles.caption has uppercase textTransform', () => {
    expect(textStyles.caption.textTransform).toBe('uppercase');
  });

  it('display style uses bold weight', () => {
    expect(textStyles.display.fontWeight).toBe(fontWeights.bold);
  });
});

describe('typography default export', () => {
  it('bundles all typography modules', () => {
    expect(typography.fontFamilies).toBe(fontFamilies);
    expect(typography.fontSizes).toBe(fontSizes);
    expect(typography.lineHeights).toBe(lineHeights);
    expect(typography.fontWeights).toBe(fontWeights);
    expect(typography.letterSpacing).toBe(letterSpacing);
    expect(typography.textStyles).toBe(textStyles);
  });
});
