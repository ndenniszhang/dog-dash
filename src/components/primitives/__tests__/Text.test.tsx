import React from 'react';
import { render } from '@testing-library/react-native';
import Text from '../Text';

// Mock the theme provider
jest.mock('../../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      getCurrentColors: () => ({
        text: {
          primary: '#000000',
          secondary: '#666666',
        },
      }),
      typography: {
        textStyles: {
          body1: {
            fontSize: 16,
            lineHeight: 1.5,
            fontWeight: '400',
            letterSpacing: '0',
          },
          h1: {
            fontSize: 36,
            lineHeight: 1.2,
            fontWeight: '700',
            letterSpacing: '-0.025em',
          },
        },
        fontFamilies: {
          sans: {
            regular: 'Geist',
            medium: 'Geist-Medium',
            semiBold: 'Geist-SemiBold',
            bold: 'Geist-Bold',
          },
        },
        fontWeights: {
          regular: '400',
          medium: '500',
          semiBold: '600',
          bold: '700',
        },
      },
    },
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Text Component', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Text>Hello World</Text>);
    const text = getByText('Hello World');
    expect(text).toBeTruthy();
  });

  it('applies variant styles correctly', () => {
    const { getByText } = render(<Text variant="h1">Heading</Text>);
    const text = getByText('Heading');
    expect(text.props.style).toMatchObject({
      fontSize: 36,
      lineHeight: 43.2, // 36 * 1.2
      fontFamily: 'Geist',
    });
  });

  it('applies custom color correctly', () => {
    const { getByText } = render(<Text color="#ff0000">Red Text</Text>);
    const text = getByText('Red Text');
    expect(text.props.style).toMatchObject({
      color: '#ff0000',
    });
  });

  it('applies text alignment correctly', () => {
    const { getByText } = render(<Text align="center">Centered Text</Text>);
    const text = getByText('Centered Text');
    expect(text.props.align).toBe('center');
  });

  it('applies font weight correctly', () => {
    const { getByText } = render(<Text weight="bold">Bold Text</Text>);
    const text = getByText('Bold Text');
    expect(text.props.weight).toBe('bold');
    expect(text.props.style).toMatchObject({
      fontFamily: 'Geist-Bold',
    });
  });

  it('applies text decoration correctly', () => {
    const { getByText } = render(<Text underline>Underlined Text</Text>);
    const text = getByText('Underlined Text');
    expect(text.props.underline).toBe(true);
  });

  it('applies text transformation correctly', () => {
    const { getByText } = render(<Text uppercase>uppercase text</Text>);
    const text = getByText('uppercase text');
    expect(text.props.uppercase).toBe(true);
  });

  it('combines multiple text styles correctly', () => {
    const { getByText } = render(
      <Text 
        variant="h1" 
        color="#0000ff" 
        align="right" 
        weight="bold" 
        italic 
        underline
      >
        Styled Text
      </Text>
    );
    const text = getByText('Styled Text');
    expect(text.props.style).toMatchObject({
      fontSize: 36,
      lineHeight: 43.2,
      fontFamily: 'Geist-Bold',
      color: '#0000ff',
    });
    expect(text.props.align).toBe('right');
    expect(text.props.italic).toBe(true);
    expect(text.props.underline).toBe(true);
  });
});
