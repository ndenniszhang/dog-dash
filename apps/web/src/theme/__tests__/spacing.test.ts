import space from '../spacing';

const PX_REGEX = /^\d+(\.\d+)?px$/;

describe('spacing — numeric pixel values', () => {
  const numericKeys: Array<keyof typeof space> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  it('all numeric keys produce pixel strings', () => {
    numericKeys.forEach((key) => {
      const val = space[key];
      expect(typeof val).toBe('string');
      expect(val as string).toMatch(PX_REGEX);
    });
  });

  it('space[4] is 16px', () => {
    expect(space[4]).toBe('16px');
  });

  it('space[8] is 32px', () => {
    expect(space[8]).toBe('32px');
  });

  it('space[0] is 0px', () => {
    expect(space[0]).toBe('0px');
  });

  it('space.px is 1px', () => {
    expect(space.px).toBe('1px');
  });
});

describe('spacing — semantic names', () => {
  it('xs is 4px', () => {
    expect(space.xs).toBe('4px');
  });

  it('sm is 8px', () => {
    expect(space.sm).toBe('8px');
  });

  it('md is 16px', () => {
    expect(space.md).toBe('16px');
  });

  it('lg is 24px', () => {
    expect(space.lg).toBe('24px');
  });

  it('xl is 32px', () => {
    expect(space.xl).toBe('32px');
  });

  it('2xl is 48px', () => {
    expect(space['2xl']).toBe('48px');
  });

  it('3xl is 64px', () => {
    expect(space['3xl']).toBe('64px');
  });

  it('4xl is 80px', () => {
    expect(space['4xl']).toBe('80px');
  });

  it('5xl is 96px', () => {
    expect(space['5xl']).toBe('96px');
  });

  it('6xl is 128px', () => {
    expect(space['6xl']).toBe('128px');
  });
});

describe('spacing — container widths', () => {
  it('has sm, md, lg, xl, and 2xl containers', () => {
    expect(space.container.sm).toBe('640px');
    expect(space.container.md).toBe('768px');
    expect(space.container.lg).toBe('1024px');
    expect(space.container.xl).toBe('1280px');
    expect(space.container['2xl']).toBe('1536px');
  });
});

describe('spacing — breakpoints', () => {
  it('breakpoints match container widths', () => {
    expect(space.breakpoints.sm).toBe(space.container.sm);
    expect(space.breakpoints.md).toBe(space.container.md);
    expect(space.breakpoints.lg).toBe(space.container.lg);
    expect(space.breakpoints.xl).toBe(space.container.xl);
    expect(space.breakpoints['2xl']).toBe(space.container['2xl']);
  });

  it('breakpoints are in ascending order', () => {
    const parsePx = (v: string) => parseInt(v);
    const bps = [
      parsePx(space.breakpoints.sm),
      parsePx(space.breakpoints.md),
      parsePx(space.breakpoints.lg),
      parsePx(space.breakpoints.xl),
      parsePx(space.breakpoints['2xl']),
    ];
    for (let i = 1; i < bps.length; i++) {
      expect(bps[i]).toBeGreaterThan(bps[i - 1]);
    }
  });
});

describe('spacing — radii', () => {
  it('has expected radius keys', () => {
    expect(space.radii.none).toBe('0px');
    expect(space.radii.sm).toBeDefined();
    expect(space.radii.DEFAULT).toBeDefined();
    expect(space.radii.md).toBeDefined();
    expect(space.radii.lg).toBeDefined();
    expect(space.radii.xl).toBeDefined();
    expect(space.radii['2xl']).toBeDefined();
    expect(space.radii['3xl']).toBeDefined();
    expect(space.radii.full).toBe('9999px');
  });

  it('full is the largest radius', () => {
    const keys = ['none', 'sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
    keys.forEach((k) => {
      expect(parseInt(space.radii.full)).toBeGreaterThan(parseInt(space.radii[k]));
    });
  });
});

describe('spacing — shadows', () => {
  it('has expected shadow keys', () => {
    const keys = ['xs', 'sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', 'inner', 'none'] as const;
    keys.forEach((k) => expect(space.shadows[k]).toBeDefined());
  });

  it('none shadow is the string "none"', () => {
    expect(space.shadows.none).toBe('none');
  });

  it('inner shadow contains "inset"', () => {
    expect(space.shadows.inner).toContain('inset');
  });

  it('non-none shadows are non-empty strings', () => {
    const keys = ['xs', 'sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl', 'inner'] as const;
    keys.forEach((k) => {
      expect(space.shadows[k].length).toBeGreaterThan(0);
    });
  });
});

describe('spacing — z-indices', () => {
  it('hide is -1', () => {
    expect(space.zIndices.hide).toBe(-1);
  });

  it('base is 0', () => {
    expect(space.zIndices.base).toBe(0);
  });

  it('tooltip is the highest (1800)', () => {
    expect(space.zIndices.tooltip).toBe(1800);
  });

  it('modal < popover < tooltip', () => {
    expect(space.zIndices.modal).toBeLessThan(space.zIndices.popover);
    expect(space.zIndices.popover).toBeLessThan(space.zIndices.tooltip);
  });

  it('dropdown < sticky < banner', () => {
    expect(space.zIndices.dropdown).toBeLessThan(space.zIndices.sticky);
    expect(space.zIndices.sticky).toBeLessThan(space.zIndices.banner);
  });
});
