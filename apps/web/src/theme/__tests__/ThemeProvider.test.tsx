import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeProvider';

// jsdom does not implement matchMedia; provide a minimal stub
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
  localStorage.clear();
});

// Helper component that reads from context and renders values
const ThemeConsumer: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="mode">{isDarkMode ? 'dark' : 'light'}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  it('renders children without crashing', () => {
    render(
      <ThemeProvider>
        <p>hello</p>
      </ThemeProvider>
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('provides light mode by default', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('light');
  });

  it('toggleTheme switches to dark mode', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('mode').textContent).toBe('light');
    await act(async () => {
      screen.getByText('toggle').click();
    });
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });

  it('toggleTheme saves preference to localStorage', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    await act(async () => {
      screen.getByText('toggle').click();
    });
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('reads saved theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'dark');
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    // useEffect runs async; after initial render it should reflect the saved value
    // We wrap in act to flush effects
    act(() => {});
    expect(screen.getByTestId('mode').textContent).toBe('dark');
  });
});

describe('useTheme', () => {
  it('throws when used outside ThemeProvider', () => {
    const BadConsumer = () => {
      useTheme();
      return null;
    };
    // Suppress the expected console error from React
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<BadConsumer />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    spy.mockRestore();
  });
});
