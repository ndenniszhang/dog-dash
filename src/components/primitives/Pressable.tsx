import React, { useState } from 'react';
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import styled from 'styled-components/native';

export interface PressableProps extends RNPressableProps {
  // Custom props
  hitSlop?: number;
  activeOpacity?: number;
  disabled?: boolean;
  disabledOpacity?: number;
  
  // Styling props
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  paddingHorizontal?: number | string;
  paddingVertical?: number | string;
  margin?: number | string;
  marginHorizontal?: number | string;
  marginVertical?: number | string;
  borderRadius?: number;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  
  // Flexbox props
  flex?: number;
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  
  // Feedback props
  feedbackColor?: string;
  
  // Accessibility
  accessibilityRole?: 'button' | 'link' | 'checkbox' | 'radio' | 'menuitem' | 'tab';
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Create a styled wrapper for our Pressable
const StyledPressable = styled(RNPressable)<PressableProps>`
  ${({ flex }) => flex !== undefined && `flex: ${flex};`}
  ${({ width }) => width !== undefined && `width: ${typeof width === 'number' ? `${width}px` : width};`}
  ${({ height }) => height !== undefined && `height: ${typeof height === 'number' ? `${height}px` : height};`}
  
  ${({ padding }) => padding !== undefined && `padding: ${typeof padding === 'number' ? `${padding}px` : padding};`}
  ${({ paddingHorizontal }) => paddingHorizontal !== undefined && `
    padding-left: ${typeof paddingHorizontal === 'number' ? `${paddingHorizontal}px` : paddingHorizontal};
    padding-right: ${typeof paddingHorizontal === 'number' ? `${paddingHorizontal}px` : paddingHorizontal};
  `}
  ${({ paddingVertical }) => paddingVertical !== undefined && `
    padding-top: ${typeof paddingVertical === 'number' ? `${paddingVertical}px` : paddingVertical};
    padding-bottom: ${typeof paddingVertical === 'number' ? `${paddingVertical}px` : paddingVertical};
  `}
  
  ${({ margin }) => margin !== undefined && `margin: ${typeof margin === 'number' ? `${margin}px` : margin};`}
  ${({ marginHorizontal }) => marginHorizontal !== undefined && `
    margin-left: ${typeof marginHorizontal === 'number' ? `${marginHorizontal}px` : marginHorizontal};
    margin-right: ${typeof marginHorizontal === 'number' ? `${marginHorizontal}px` : marginHorizontal};
  `}
  ${({ marginVertical }) => marginVertical !== undefined && `
    margin-top: ${typeof marginVertical === 'number' ? `${marginVertical}px` : marginVertical};
    margin-bottom: ${typeof marginVertical === 'number' ? `${marginVertical}px` : marginVertical};
  `}
  
  ${({ borderRadius }) => borderRadius !== undefined && `border-radius: ${borderRadius}px;`}
  ${({ backgroundColor }) => backgroundColor && `background-color: ${backgroundColor};`}
  ${({ borderWidth }) => borderWidth !== undefined && `border-width: ${borderWidth}px;`}
  ${({ borderColor }) => borderColor && `border-color: ${borderColor};`}
  
  ${({ alignItems }) => alignItems && `align-items: ${alignItems};`}
  ${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent};`}
  ${({ flexDirection }) => flexDirection && `flex-direction: ${flexDirection};`}
`;

export const Pressable: React.FC<PressableProps> = ({
  children,
  style,
  hitSlop = 8,
  activeOpacity = 0.7,
  disabled = false,
  disabledOpacity = 0.5,
  onPress,
  onPressIn,
  onPressOut,
  feedbackColor,
  ...rest
}) => {
  const { theme } = useTheme();
  const themeColors = theme.getCurrentColors();
  
  // State to track if the button is being pressed
  const [isPressed, setIsPressed] = useState(false);
  
  // Default feedback color if not provided
  const defaultFeedbackColor = feedbackColor || 
    (theme.currentMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)');
  
  // Handle press in
  const handlePressIn = (e: any) => {
    setIsPressed(true);
    onPressIn?.(e);
  };
  
  // Handle press out
  const handlePressOut = (e: any) => {
    setIsPressed(false);
    onPressOut?.(e);
  };
  
  // Convert hitSlop number to object if needed
  const hitSlopValue = typeof hitSlop === 'number'
    ? { top: hitSlop, right: hitSlop, bottom: hitSlop, left: hitSlop }
    : hitSlop;
  
  // Create styles based on state
  const getStateStyle = (): ViewStyle => {
    if (disabled) {
      return { opacity: disabledOpacity };
    }
    
    if (isPressed) {
      // For web, we use opacity. For native, we use the android_ripple or highlight color
      if (Platform.OS === 'web') {
        return { opacity: activeOpacity };
      }
      
      // For iOS, we don't add any special style here as we'll use the pressRetentionOffset
      return {};
    }
    
    return {};
  };
  
  // Android ripple effect config
  const androidRippleConfig = Platform.OS === 'android' && !disabled
    ? {
        color: defaultFeedbackColor,
        borderless: false,
        radius: -1, // -1 means the ripple will match the bounds of the pressable
      }
    : undefined;
  
  return (
    <StyledPressable
      accessible
      accessibilityRole={rest.accessibilityRole || 'button'}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={hitSlopValue}
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      android_ripple={androidRippleConfig}
      style={({ pressed }) => [
        StyleSheet.flatten(style),
        getStateStyle(),
        Platform.OS === 'ios' && pressed && !disabled
          ? { backgroundColor: defaultFeedbackColor }
          : {},
      ]}
      {...rest}
    >
      {children}
    </StyledPressable>
  );
};

export default Pressable;
