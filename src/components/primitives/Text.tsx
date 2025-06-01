import React from 'react';
import styled from 'styled-components/native';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { textStyles } from '../../theme/typography';

// Define available text variants based on our typography
export type TextVariant = keyof typeof textStyles;

// Define text alignment options
type TextAlign = 'auto' | 'left' | 'right' | 'center' | 'justify';

// Define text props extending React Native's TextProps
export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: TextAlign;
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  italic?: boolean;
  underline?: boolean;
  lineThrough?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

// Create the styled component
const StyledText = styled(RNText)<TextProps>`
  ${({ align }) => align && `text-align: ${align};`}
  ${({ color }) => color && `color: ${color};`}
  ${({ weight, theme }) => weight && `font-weight: ${theme.typography.fontWeights[weight]};`}
  ${({ italic }) => italic && 'font-style: italic;'}
  ${({ underline }) => underline && 'text-decoration: underline;'}
  ${({ lineThrough }) => lineThrough && 'text-decoration: line-through;'}
  ${({ uppercase }) => uppercase && 'text-transform: uppercase;'}
  ${({ lowercase }) => lowercase && 'text-transform: lowercase;'}
  ${({ capitalize }) => capitalize && 'text-transform: capitalize;'}
`;

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color,
  align,
  weight,
  italic,
  underline,
  lineThrough,
  uppercase,
  lowercase,
  capitalize,
  style,
  children,
  ...rest
}) => {
  const { theme } = useTheme();
  const themeColors = theme.getCurrentColors();
  
  // Get the text style from the theme based on the variant
  const variantStyle = theme.typography.textStyles[variant];
  
  // Default text color from theme if not specified
  const textColor = color || themeColors.text.primary;
  
  // Combine styles
  const combinedStyle: TextStyle = {
    fontFamily: weight 
      ? theme.typography.fontFamilies.sans[weight] 
      : theme.typography.fontFamilies.sans.regular,
    fontSize: variantStyle.fontSize,
    lineHeight: variantStyle.lineHeight * variantStyle.fontSize, // Convert to absolute line height for RN
    letterSpacing: variantStyle.letterSpacing,
    color: textColor,
    ...(style as TextStyle),
  };

  return (
    <StyledText
      align={align}
      color={textColor}
      weight={weight || (variantStyle.fontWeight as any)}
      italic={italic}
      underline={underline}
      lineThrough={lineThrough}
      uppercase={uppercase}
      lowercase={lowercase}
      capitalize={capitalize}
      style={combinedStyle}
      {...rest}
    >
      {children}
    </StyledText>
  );
};

export default Text;
