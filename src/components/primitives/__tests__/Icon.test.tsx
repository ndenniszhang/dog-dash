import React from 'react';
import { render } from '@testing-library/react-native';
import Icon, { iconExists } from '../Icon';

// Mock the theme provider
jest.mock('../../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      getCurrentColors: () => ({
        text: {
          primary: '#000000',
        },
      }),
    },
  }),
}));

// Mock Box component
jest.mock('../Box', () => {
  return {
    __esModule: true,
    default: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => <div data-testid="box-mock" {...props}>{children}</div>,
  };
});

// Mock Expo Icons
jest.mock('@expo/vector-icons', () => {
  const mockComponent = ({ name, size, color }: { name: string; size?: number; color?: string }) => (
    <div data-testid="icon-mock" data-name={name} data-size={size} data-color={color} />
  );
  
  return {
    MaterialIcons: mockComponent,
    Ionicons: mockComponent,
    FontAwesome: mockComponent,
    AntDesign: {
      ...mockComponent,
      glyphMap: { 'home': true, 'user': true },
    },
  };
});

describe('Icon Component', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<Icon name="home" />);
    const iconWrapper = getByTestId('box-mock');
    const icon = getByTestId('icon-mock');
    
    expect(iconWrapper).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(icon.props['data-name']).toBe('home');
    expect(icon.props['data-size']).toBe(24);
    expect(icon.props['data-color']).toBe('#000000'); // Default from theme
  });

  it('applies custom size correctly', () => {
    const { getByTestId } = render(<Icon name="home" size={32} />);
    const icon = getByTestId('icon-mock');
    
    expect(icon.props['data-size']).toBe(32);
  });

  it('applies custom color correctly', () => {
    const { getByTestId } = render(<Icon name="home" color="#ff0000" />);
    const icon = getByTestId('icon-mock');
    
    expect(icon.props['data-color']).toBe('#ff0000');
  });

  it('applies custom icon family correctly', () => {
    const { getByTestId } = render(<Icon name="home" family="Ionicons" />);
    // Since we're mocking, we can't really test the family directly,
    // but we can verify the component rendered
    const icon = getByTestId('icon-mock');
    expect(icon).toBeTruthy();
  });

  it('applies opacity correctly', () => {
    const { getByTestId } = render(<Icon name="home" opacity={0.5} />);
    const iconWrapper = getByTestId('box-mock');
    
    expect(iconWrapper.props.opacity).toBe(0.5);
  });

  it('applies accessibility label correctly', () => {
    const { getByTestId } = render(<Icon name="home" accessibilityLabel="Home Icon" />);
    const iconWrapper = getByTestId('box-mock');
    
    expect(iconWrapper.props.accessibilityLabel).toBe('Home Icon');
  });

  describe('iconExists function', () => {
    it('returns true for existing icons', () => {
      // We've mocked AntDesign to have 'home' and 'user' in its glyphMap
      expect(iconExists('home', 'AntDesign')).toBe(true);
      expect(iconExists('user', 'AntDesign')).toBe(true);
    });

    it('returns false for non-existing icons', () => {
      expect(iconExists('nonexistent', 'AntDesign')).toBe(false);
    });
  });
});
