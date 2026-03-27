import React from 'react';
import { render, screen } from '@testing-library/react';
import DesignSystemPage from '../page';

// Mock StyleGuide to isolate the page component
jest.mock('@/components/ui/StyleGuide', () => ({
  __esModule: true,
  default: () => <div data-testid="style-guide-mock">StyleGuide</div>,
}));

describe('DesignSystemPage', () => {
  it('renders without crashing', () => {
    render(<DesignSystemPage />);
    expect(screen.getByTestId('style-guide-mock')).toBeInTheDocument();
  });

  it('renders the StyleGuide component', () => {
    render(<DesignSystemPage />);
    expect(screen.getByText('StyleGuide')).toBeInTheDocument();
  });
});
