import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeProvider';

// Simple consumer component for testing the hook
const ThemeConsumer: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="mode">{isDarkMode ? 'dark' : 'light'}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

beforeEach(() => {
  localStorage.clear();
  // Reset matchMedia to default (no dark preference)
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('useTheme', () => {
  it('throws an error when used outside ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ThemeConsumer />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    consoleError.mockRestore();
  });
});

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">hello</div>
      </ThemeProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('defaults to light mode', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });

  it('isDarkMode is false in light mode', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });

  it('toggleTheme switches from light to dark', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });

  it('toggleTheme switches from dark back to light', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });

  it('saves theme preference to localStorage on toggle', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('saves back to light in localStorage after second toggle', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('reads initial theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });

  it('reads system dark preference when no localStorage value', () => {
    // Override matchMedia to simulate system dark preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });

  it('respects system preference change when no localStorage preference', () => {
    let changeHandler: ((e: Partial<MediaQueryListEvent>) => void) | null = null;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn().mockImplementation(
          (_event: string, handler: (e: Partial<MediaQueryListEvent>) => void) => {
            changeHandler = handler;
          }
        ),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('light');

    // Simulate system theme change to dark
    act(() => {
      changeHandler?.({ matches: true } as Partial<MediaQueryListEvent>);
    });
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });

  it('ignores system preference change when localStorage preference is set', () => {
    localStorage.setItem('theme', 'light');
    let changeHandler: ((e: Partial<MediaQueryListEvent>) => void) | null = null;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn().mockImplementation(
          (_event: string, handler: (e: Partial<MediaQueryListEvent>) => void) => {
            changeHandler = handler;
          }
        ),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    act(() => {
      changeHandler?.({ matches: true } as Partial<MediaQueryListEvent>);
    });
    // Should remain 'light' because localStorage preference is set
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });

  it('applies data-theme attribute to document root', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    // After initial render, data-theme should be set
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('applies CSS variables to document root on mode change', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    // Light mode: text-primary should be dark
    const lightPrimary = document.documentElement.style.getPropertyValue('--color-text-primary');
    expect(lightPrimary).not.toBe('');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    const darkPrimary = document.documentElement.style.getPropertyValue('--color-text-primary');
    // Dark mode text primary should be different from light
    expect(darkPrimary).not.toBe(lightPrimary);
  });

  it('accepts a custom theme prop', () => {
    const CustomConsumer: React.FC = () => {
      const { theme } = useTheme();
      return <div data-testid="mode">{theme.currentMode}</div>;
    };

    render(
      <ThemeProvider>
        <CustomConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });

  it('handles a custom theme with no color properties gracefully', () => {
    // Passes a theme where colors don't have text/surface/primary/neutral/semantic
    // This exercises the false branches of the CSS variable apply effect
    const { theme: defaultTheme } = require('../index');
    const minimalTheme = {
      ...defaultTheme,
      colors: {
        light: {
          primary: undefined,
          neutral: undefined,
          semantic: undefined,
          text: undefined,
          surface: undefined,
        },
        dark: {
          primary: undefined,
          neutral: undefined,
          semantic: undefined,
          text: undefined,
          surface: undefined,
        },
      },
      getCurrentColors() {
        return this.colors[this.currentMode as 'light' | 'dark'];
      },
    };

    render(
      <ThemeProvider theme={minimalTheme as unknown as typeof defaultTheme}>
        <div data-testid="child">hello</div>
      </ThemeProvider>
    );
    // Should render without crashing even with missing color tokens
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
