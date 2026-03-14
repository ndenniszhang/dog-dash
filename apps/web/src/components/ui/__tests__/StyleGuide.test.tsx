import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { StyleGuide } from '../StyleGuide';

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
});

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

describe('StyleGuide', () => {
  it('renders without crashing', () => {
    renderWithTheme(<StyleGuide />);
  });

  it('renders the Design System heading', () => {
    renderWithTheme(<StyleGuide />);
    expect(screen.getByRole('heading', { name: /design system/i, level: 1 })).toBeInTheDocument();
  });

  it('renders the Typography section', () => {
    renderWithTheme(<StyleGuide />);
    expect(screen.getByRole('heading', { name: /typography/i })).toBeInTheDocument();
  });

  it('renders the Colors section', () => {
    renderWithTheme(<StyleGuide />);
    expect(screen.getByRole('heading', { name: 'Colors', level: 2 })).toBeInTheDocument();
  });

  it('renders the theme toggle button', () => {
    renderWithTheme(<StyleGuide />);
    expect(screen.getByRole('button', { name: /toggle/i })).toBeInTheDocument();
  });
});
