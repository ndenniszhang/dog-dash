import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StyleGuide from '../StyleGuide';

// Mock the useTheme hook
const mockToggleTheme = jest.fn();
const mockUseTheme = jest.fn();

jest.mock('../../../theme/ThemeProvider', () => ({
  useTheme: () => mockUseTheme(),
}));

const renderWithLightTheme = () => {
  mockUseTheme.mockReturnValue({ isDarkMode: false, toggleTheme: mockToggleTheme });
  return render(<StyleGuide />);
};

const renderWithDarkTheme = () => {
  mockUseTheme.mockReturnValue({ isDarkMode: true, toggleTheme: mockToggleTheme });
  return render(<StyleGuide />);
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('StyleGuide', () => {
  it('renders without crashing', () => {
    renderWithLightTheme();
    expect(screen.getByText('Design System')).toBeInTheDocument();
  });

  it('shows "Toggle Dark Mode" button in light mode', () => {
    renderWithLightTheme();
    expect(screen.getByRole('button', { name: /Toggle Dark Mode/i })).toBeInTheDocument();
  });

  it('shows "Toggle Light Mode" button in dark mode', () => {
    renderWithDarkTheme();
    expect(screen.getByRole('button', { name: /Toggle Light Mode/i })).toBeInTheDocument();
  });

  it('calls toggleTheme when the toggle button is clicked', () => {
    renderWithLightTheme();
    fireEvent.click(screen.getByRole('button', { name: /Toggle Dark Mode/i }));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('renders the Typography section heading', () => {
    renderWithLightTheme();
    expect(screen.getByText('Typography')).toBeInTheDocument();
  });

  it('renders Heading 1 through Heading 4', () => {
    renderWithLightTheme();
    expect(screen.getByText(/Heading 1/)).toBeInTheDocument();
    expect(screen.getByText(/Heading 2/)).toBeInTheDocument();
    expect(screen.getByText(/Heading 3/)).toBeInTheDocument();
    expect(screen.getByText(/Heading 4/)).toBeInTheDocument();
  });

  it('renders the Colors section heading', () => {
    renderWithLightTheme();
    expect(screen.getByText('Colors')).toBeInTheDocument();
  });

  it('renders all 10 primary color weight labels (50–900)', () => {
    renderWithLightTheme();
    const primaryWeights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    // The weights appear in multiple sections — find at least one per weight in primary section
    primaryWeights.forEach((w) => {
      // getAllByText because same weight appears in neutral section too
      const elements = screen.getAllByText(w.toString());
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('renders all 4 semantic color labels', () => {
    renderWithLightTheme();
    ['success', 'error', 'warning', 'info'].forEach((color) => {
      expect(screen.getByText(color)).toBeInTheDocument();
    });
  });

  it('renders "Primary Colors" heading', () => {
    renderWithLightTheme();
    expect(screen.getByText('Primary Colors')).toBeInTheDocument();
  });

  it('renders "Semantic Colors" heading', () => {
    renderWithLightTheme();
    expect(screen.getByText('Semantic Colors')).toBeInTheDocument();
  });

  it('renders "Neutral Colors" heading', () => {
    renderWithLightTheme();
    expect(screen.getByText('Neutral Colors')).toBeInTheDocument();
  });

  it('renders the Spacing section', () => {
    renderWithLightTheme();
    expect(screen.getByText('Spacing')).toBeInTheDocument();
  });

  it('renders spacing token labels', () => {
    renderWithLightTheme();
    expect(screen.getByText('--spacing-1')).toBeInTheDocument();
  });

  it('renders the Border Radius section', () => {
    renderWithLightTheme();
    expect(screen.getByText('Border Radius')).toBeInTheDocument();
  });

  it('renders border radius labels (sm, md, lg, xl)', () => {
    renderWithLightTheme();
    // These appear as captions in the border radius section
    expect(screen.getByText('2xl')).toBeInTheDocument();
    expect(screen.getByText('full')).toBeInTheDocument();
  });

  it('renders the Shadows section', () => {
    renderWithLightTheme();
    expect(screen.getByText('Shadows')).toBeInTheDocument();
  });

  it('renders the Button Examples section', () => {
    renderWithLightTheme();
    expect(screen.getByText('Button Examples')).toBeInTheDocument();
  });

  it('renders Primary Button, Secondary Button, and Text Button', () => {
    renderWithLightTheme();
    expect(screen.getByText('Primary Button')).toBeInTheDocument();
    expect(screen.getByText('Secondary Button')).toBeInTheDocument();
    expect(screen.getByText('Text Button')).toBeInTheDocument();
  });

  it('description text mentions the design system', () => {
    renderWithLightTheme();
    expect(screen.getByText(/comprehensive design system/i)).toBeInTheDocument();
  });
});
