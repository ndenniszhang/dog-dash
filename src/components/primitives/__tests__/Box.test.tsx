import React from 'react';
import { render } from '@testing-library/react-native';
import Box from '../Box';

// Mock the theme provider
jest.mock('../../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      getCurrentColors: () => ({
        surface: {
          border: '#e2e8f0',
        },
      }),
    },
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Box Component', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<Box testID="test-box" />);
    const box = getByTestId('test-box');
    expect(box).toBeTruthy();
  });

  it('applies flex style correctly', () => {
    const { getByTestId } = render(<Box testID="test-box" flex={1} />);
    const box = getByTestId('test-box');
    expect(box.props.style).toMatchObject({ flex: 1 });
  });

  it('applies width and height correctly', () => {
    const { getByTestId } = render(<Box testID="test-box" width={100} height={200} />);
    const box = getByTestId('test-box');
    expect(box.props.style).toMatchObject({ width: 100, height: 200 });
  });

  it('applies padding correctly', () => {
    const { getByTestId } = render(
      <Box 
        testID="test-box" 
        padding={10}
        paddingTop={5}
        paddingHorizontal={15}
      />
    );
    const box = getByTestId('test-box');
    expect(box.props.style).toMatchObject({ 
      padding: 10,
      paddingTop: 5,
      paddingLeft: 15,
      paddingRight: 15,
    });
  });

  it('applies margin correctly', () => {
    const { getByTestId } = render(
      <Box 
        testID="test-box" 
        margin={10}
        marginBottom={20}
        marginHorizontal={15}
      />
    );
    const box = getByTestId('test-box');
    expect(box.props.style).toMatchObject({ 
      margin: 10,
      marginBottom: 20,
      marginLeft: 15,
      marginRight: 15,
    });
  });

  it('applies background and border styles correctly', () => {
    const { getByTestId } = render(
      <Box 
        testID="test-box" 
        backgroundColor="#f0f0f0"
        borderRadius={8}
        borderWidth={1}
        borderColor="#ccc"
      />
    );
    const box = getByTestId('test-box');
    expect(box.props.style).toMatchObject({ 
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ccc',
    });
  });

  it('applies position styles correctly', () => {
    const { getByTestId } = render(
      <Box 
        testID="test-box" 
        position="absolute"
        top={10}
        left={20}
        zIndex={5}
      />
    );
    const box = getByTestId('test-box');
    expect(box.props.style).toMatchObject({ 
      position: 'absolute',
      top: 10,
      left: 20,
      zIndex: 5,
    });
  });

  it('applies flex layout styles correctly', () => {
    const { getByTestId } = render(
      <Box 
        testID="test-box" 
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
      />
    );
    const box = getByTestId('test-box');
    expect(box.props.style).toMatchObject({ 
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    });
  });
});
