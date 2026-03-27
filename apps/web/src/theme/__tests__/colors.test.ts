import colorTokens, {
  primary,
  semantic,
  neutral,
  text,
  surface,
  dark,
} from '../colors';

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

describe('colors — primary', () => {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

  it('has all 10 shades', () => {
    shades.forEach((shade) => {
      expect(primary[shade]).toBeDefined();
    });
  });

  it('every shade is a valid hex color', () => {
    shades.forEach((shade) => {
      expect(primary[shade]).toMatch(HEX_REGEX);
    });
  });

  it('base primary (500) is #3B82F6', () => {
    expect(primary[500]).toBe('#3B82F6');
  });

  it('shades get darker as weight increases (50 lightest, 900 darkest)', () => {
    // 50 should be very light (high lightness), 900 very dark
    expect(primary[50]).toBe('#EFF6FF');
    expect(primary[900]).toBe('#1E3A8A');
  });
});

describe('colors — semantic', () => {
  const categories = ['success', 'error', 'warning', 'info'] as const;

  it('has all 4 semantic categories', () => {
    categories.forEach((cat) => {
      expect(semantic[cat]).toBeDefined();
    });
  });

  it('each category has 50, 500, and 900 shades', () => {
    categories.forEach((cat) => {
      expect(semantic[cat][50]).toBeDefined();
      expect(semantic[cat][500]).toBeDefined();
      expect(semantic[cat][900]).toBeDefined();
    });
  });

  it('each shade is a valid hex color', () => {
    categories.forEach((cat) => {
      [50, 500, 900].forEach((shade) => {
        expect(semantic[cat][shade]).toMatch(HEX_REGEX);
      });
    });
  });

  it('success base is #10B981', () => {
    expect(semantic.success[500]).toBe('#10B981');
  });

  it('error base is #EF4444', () => {
    expect(semantic.error[500]).toBe('#EF4444');
  });

  it('warning base is #F59E0B', () => {
    expect(semantic.warning[500]).toBe('#F59E0B');
  });

  it('info base is #3B82F6 (same as primary)', () => {
    expect(semantic.info[500]).toBe('#3B82F6');
    expect(semantic.info[500]).toBe(primary[500]);
  });
});

describe('colors — neutral', () => {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

  it('has all 10 shades', () => {
    shades.forEach((shade) => {
      expect(neutral[shade]).toBeDefined();
    });
  });

  it('every shade is a valid hex color', () => {
    shades.forEach((shade) => {
      expect(neutral[shade]).toMatch(HEX_REGEX);
    });
  });

  it('lightest neutral (50) is #F8FAFC', () => {
    expect(neutral[50]).toBe('#F8FAFC');
  });

  it('darkest neutral (900) is #0F172A', () => {
    expect(neutral[900]).toBe('#0F172A');
  });
});

describe('colors — text', () => {
  it('has primary, secondary, disabled, and inverse keys', () => {
    expect(text.primary).toBeDefined();
    expect(text.secondary).toBeDefined();
    expect(text.disabled).toBeDefined();
    expect(text.inverse).toBeDefined();
  });

  it('text.primary derives from neutral[900]', () => {
    expect(text.primary).toBe(neutral[900]);
  });

  it('text.secondary derives from neutral[600]', () => {
    expect(text.secondary).toBe(neutral[600]);
  });

  it('text.disabled derives from neutral[400]', () => {
    expect(text.disabled).toBe(neutral[400]);
  });

  it('text.inverse is white (#FFFFFF)', () => {
    expect(text.inverse).toBe('#FFFFFF');
  });
});

describe('colors — surface', () => {
  it('has background, paper, border, and divider keys', () => {
    expect(surface.background).toBeDefined();
    expect(surface.paper).toBeDefined();
    expect(surface.border).toBeDefined();
    expect(surface.divider).toBeDefined();
  });

  it('background is white', () => {
    expect(surface.background).toBe('#FFFFFF');
  });

  it('paper derives from neutral[50]', () => {
    expect(surface.paper).toBe(neutral[50]);
  });

  it('border derives from neutral[200]', () => {
    expect(surface.border).toBe(neutral[200]);
  });

  it('divider derives from neutral[100]', () => {
    expect(surface.divider).toBe(neutral[100]);
  });
});

describe('colors — dark mode overrides', () => {
  it('has text and surface sub-objects', () => {
    expect(dark.text).toBeDefined();
    expect(dark.surface).toBeDefined();
  });

  it('dark text.primary is a light color', () => {
    expect(dark.text.primary).toBe('#F8FAFC');
  });

  it('dark surface.background is a dark color', () => {
    expect(dark.surface.background).toBe('#0F172A');
  });

  it('dark text colors are all valid hex', () => {
    Object.values(dark.text).forEach((value) => {
      expect(value).toMatch(HEX_REGEX);
    });
  });

  it('dark surface colors are all valid hex', () => {
    Object.values(dark.surface).forEach((value) => {
      expect(value).toMatch(HEX_REGEX);
    });
  });
});

describe('colorTokens default export', () => {
  it('bundles all color modules', () => {
    expect(colorTokens.primary).toBe(primary);
    expect(colorTokens.semantic).toBe(semantic);
    expect(colorTokens.neutral).toBe(neutral);
    expect(colorTokens.text).toBe(text);
    expect(colorTokens.surface).toBe(surface);
    expect(colorTokens.dark).toBe(dark);
  });
});
