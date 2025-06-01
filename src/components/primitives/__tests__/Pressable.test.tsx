import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Pressable from '../Pressable';

// Mock the theme provider
jest.mock('../../../theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      getCurrentColors: () => ({
        text: {
          primary: '#000000',
        },
      }),
      currentMode: 'light',
    },
  }),
}));

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(obj => obj.ios),
}));

describe('Pressable Component', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<Pressable testID="test-pressable" />);
    const pressable = getByTestId('test-pressable');
    expect(pressable).toBeTruthy();
  });

  it('handles onPress correctly', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Pressable testID="test-pressable" onPress={onPressMock} />
    );
    const pressable = getByTestId('test-pressable');
    
    fireEvent.press(pressable);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Pressable testID="test-pressable" onPress={onPressMock} disabled />
    );
    const pressable = getByTestId('test-pressable');
    
    fireEvent.press(pressable);
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('applies width and height correctly', () => {
    const { getByTestId } = render(
      <Pressable testID="test-pressable" width={100} height={50} />
    );
    const pressable = getByTestId('test-pressable');
    expect(pressable.props.style).toMatchObject({ width: 100, height: 50 });
  });

  it('applies padding correctly', () => {
    const { getByTestId } = render(
      <Pressable 
        testID="test-pressable" 
        padding={10}
        paddingHorizontal={15}
        paddingVertical={20}
      />
    );
    const pressable = getByTestId('test-pressable');
    expect(pressable.props.style).toMatchObject({ 
      padding: 10,
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 20,
      paddingBottom: 20,
    });
  });

  it('applies margin correctly', () => {
    const { getByTestId } = render(
      <Pressable 
        testID="test-pressable" 
        margin={10}
        marginHorizontal={15}
        marginVertical={20}
      />
    );
    const pressable = getByTestId('test-pressable');
    expect(pressable.props.style).toMatchObject({ 
      margin: 10,
      marginLeft: 15,
      marginRight: 15,
      marginTop: 20,
      marginBottom: 20,
    });
  });

  it('applies border styles correctly', () => {
    const { getByTestId } = render(
      <Pressable 
        testID="test-pressable" 
        borderRadius={8}
        borderWidth={1}
        borderColor="#ccc"
      />
    );
    const pressable = getByTestId('test-pressable');
    expect(pressable.props.style).toMatchObject({ 
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ccc',
    });
  });

  it('applies flex layout styles correctly', () => {
    const { getByTestId } = render(
      <Pressable 
        testID="test-pressable" 
        flex={1}
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
      />
    );
    const pressable = getByTestId('test-pressable');
    expect(pressable.props.style).toMatchObject({ 
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    });
  });

  it('applies accessibility props correctly', () => {
    const { getByTestId } = render(
      <Pressable 
        testID="test-pressable" 
        accessibilityRole="button"
        accessibilityLabel="Test Button"
        accessibilityHint="Press to test"
      />
    );
    const pressable = getByTestId('test-pressable');
    expect(pressable.props.accessibilityRole).toBe('button');
    expect(pressable.props.accessibilityLabel).toBe('Test Button');
    expect(pressable.props.accessibilityHint).toBe('Press to test');
  });
});
