import React from 'react';
import styled from 'styled-components/native';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

// Define the props for our Box component
export interface BoxProps extends ViewProps {
  // Layout props
  flex?: number;
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  paddingTop?: number | string;
  paddingRight?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingHorizontal?: number | string;
  paddingVertical?: number | string;
  margin?: number | string;
  marginTop?: number | string;
  marginRight?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginHorizontal?: number | string;
  marginVertical?: number | string;
  
  // Flexbox props
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  
  // Background and border props
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  
  // Position props
  position?: 'absolute' | 'relative';
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: number;
  
  // Shadow props (for web and iOS)
  elevation?: number; // Android elevation
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  
  // Other props
  overflow?: 'visible' | 'hidden' | 'scroll';
  opacity?: number;
  
  // Responsive props
  testID?: string;
}

// Create the styled component
const StyledBox = styled(View)<BoxProps>`
  ${({ flex }) => flex !== undefined && `flex: ${flex};`}
  ${({ width }) => width !== undefined && `width: ${typeof width === 'number' ? `${width}px` : width};`}
  ${({ height }) => height !== undefined && `height: ${typeof height === 'number' ? `${height}px` : height};`}
  
  ${({ padding }) => padding !== undefined && `padding: ${typeof padding === 'number' ? `${padding}px` : padding};`}
  ${({ paddingTop }) => paddingTop !== undefined && `padding-top: ${typeof paddingTop === 'number' ? `${paddingTop}px` : paddingTop};`}
  ${({ paddingRight }) => paddingRight !== undefined && `padding-right: ${typeof paddingRight === 'number' ? `${paddingRight}px` : paddingRight};`}
  ${({ paddingBottom }) => paddingBottom !== undefined && `padding-bottom: ${typeof paddingBottom === 'number' ? `${paddingBottom}px` : paddingBottom};`}
  ${({ paddingLeft }) => paddingLeft !== undefined && `padding-left: ${typeof paddingLeft === 'number' ? `${paddingLeft}px` : paddingLeft};`}
  ${({ paddingHorizontal }) => paddingHorizontal !== undefined && `
    padding-left: ${typeof paddingHorizontal === 'number' ? `${paddingHorizontal}px` : paddingHorizontal};
    padding-right: ${typeof paddingHorizontal === 'number' ? `${paddingHorizontal}px` : paddingHorizontal};
  `}
  ${({ paddingVertical }) => paddingVertical !== undefined && `
    padding-top: ${typeof paddingVertical === 'number' ? `${paddingVertical}px` : paddingVertical};
    padding-bottom: ${typeof paddingVertical === 'number' ? `${paddingVertical}px` : paddingVertical};
  `}
  
  ${({ margin }) => margin !== undefined && `margin: ${typeof margin === 'number' ? `${margin}px` : margin};`}
  ${({ marginTop }) => marginTop !== undefined && `margin-top: ${typeof marginTop === 'number' ? `${marginTop}px` : marginTop};`}
  ${({ marginRight }) => marginRight !== undefined && `margin-right: ${typeof marginRight === 'number' ? `${marginRight}px` : marginRight};`}
  ${({ marginBottom }) => marginBottom !== undefined && `margin-bottom: ${typeof marginBottom === 'number' ? `${marginBottom}px` : marginBottom};`}
  ${({ marginLeft }) => marginLeft !== undefined && `margin-left: ${typeof marginLeft === 'number' ? `${marginLeft}px` : marginLeft};`}
  ${({ marginHorizontal }) => marginHorizontal !== undefined && `
    margin-left: ${typeof marginHorizontal === 'number' ? `${marginHorizontal}px` : marginHorizontal};
    margin-right: ${typeof marginHorizontal === 'number' ? `${marginHorizontal}px` : marginHorizontal};
  `}
  ${({ marginVertical }) => marginVertical !== undefined && `
    margin-top: ${typeof marginVertical === 'number' ? `${marginVertical}px` : marginVertical};
    margin-bottom: ${typeof marginVertical === 'number' ? `${marginVertical}px` : marginVertical};
  `}
  
  ${({ alignItems }) => alignItems && `align-items: ${alignItems};`}
  ${({ alignSelf }) => alignSelf && `align-self: ${alignSelf};`}
  ${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent};`}
  ${({ flexDirection }) => flexDirection && `flex-direction: ${flexDirection};`}
  ${({ flexWrap }) => flexWrap && `flex-wrap: ${flexWrap};`}
  
  ${({ backgroundColor }) => backgroundColor && `background-color: ${backgroundColor};`}
  ${({ borderRadius }) => borderRadius !== undefined && `border-radius: ${borderRadius}px;`}
  ${({ borderWidth }) => borderWidth !== undefined && `border-width: ${borderWidth}px;`}
  ${({ borderColor }) => borderColor && `border-color: ${borderColor};`}
  
  ${({ position }) => position && `position: ${position};`}
  ${({ top }) => top !== undefined && `top: ${typeof top === 'number' ? `${top}px` : top};`}
  ${({ right }) => right !== undefined && `right: ${typeof right === 'number' ? `${right}px` : right};`}
  ${({ bottom }) => bottom !== undefined && `bottom: ${typeof bottom === 'number' ? `${bottom}px` : bottom};`}
  ${({ left }) => left !== undefined && `left: ${typeof left === 'number' ? `${left}px` : left};`}
  ${({ zIndex }) => zIndex !== undefined && `z-index: ${zIndex};`}
  
  ${({ elevation }) => elevation !== undefined && `elevation: ${elevation};`}
  ${({ shadowColor, shadowOffset, shadowOpacity, shadowRadius }) => 
    shadowColor && shadowOffset && shadowOpacity !== undefined && shadowRadius !== undefined && `
    shadow-color: ${shadowColor};
    shadow-offset: ${shadowOffset.width}px ${shadowOffset.height}px;
    shadow-opacity: ${shadowOpacity};
    shadow-radius: ${shadowRadius}px;
  `}
  
  ${({ overflow }) => overflow && `overflow: ${overflow};`}
  ${({ opacity }) => opacity !== undefined && `opacity: ${opacity};`}
`;

export const Box: React.FC<BoxProps> = (props) => {
  const { theme } = useTheme();
  
  // Default props with theme values
  const defaultProps = {
    backgroundColor: props.backgroundColor || undefined,
    borderColor: props.borderColor || theme.getCurrentColors().surface.border,
  };
  
  return <StyledBox {...defaultProps} {...props} />;
};

export default Box;
