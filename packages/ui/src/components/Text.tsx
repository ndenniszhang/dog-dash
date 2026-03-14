import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import styled from 'styled-components/native';
import { colors, fontSizes, fontWeights } from '../tokens';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'small';

export type TextWeight = 'regular' | 'medium' | 'semiBold' | 'bold';
export type TextAlign = 'left' | 'center' | 'right';

interface StyledTextProps {
  variant: TextVariant;
  weight?: TextWeight;
  color?: string;
  align?: TextAlign;
}

const variantStyles: Record<TextVariant, { fontSize: number; fontWeight: string; lineHeight: number }> = {
  display: { fontSize: fontSizes.display, fontWeight: fontWeights.bold,     lineHeight: fontSizes.display * 1.2 },
  h1:      { fontSize: fontSizes.h1,      fontWeight: fontWeights.bold,     lineHeight: fontSizes.h1 * 1.2 },
  h2:      { fontSize: fontSizes.h2,      fontWeight: fontWeights.bold,     lineHeight: fontSizes.h2 * 1.25 },
  h3:      { fontSize: fontSizes.h3,      fontWeight: fontWeights.semiBold, lineHeight: fontSizes.h3 * 1.3 },
  h4:      { fontSize: fontSizes.h4,      fontWeight: fontWeights.semiBold, lineHeight: fontSizes.h4 * 1.35 },
  body1:   { fontSize: fontSizes.body1,   fontWeight: fontWeights.regular,  lineHeight: fontSizes.body1 * 1.5 },
  body2:   { fontSize: fontSizes.body2,   fontWeight: fontWeights.regular,  lineHeight: fontSizes.body2 * 1.5 },
  caption: { fontSize: fontSizes.caption, fontWeight: fontWeights.medium,   lineHeight: fontSizes.caption * 1.5 },
  small:   { fontSize: fontSizes.small,   fontWeight: fontWeights.regular,  lineHeight: fontSizes.small * 1.5 },
};

const StyledText = styled(RNText)<StyledTextProps>`
  font-size: ${({ variant }) => variantStyles[variant].fontSize}px;
  font-weight: ${({ variant, weight }) =>
    weight ? fontWeights[weight] : variantStyles[variant].fontWeight};
  line-height: ${({ variant }) => variantStyles[variant].lineHeight}px;
  color: ${({ color }) => color ?? colors.text.primary};
  text-align: ${({ align }) => align ?? 'left'};
`;

export interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: string;
  align?: TextAlign;
  children: React.ReactNode;
}

export const Text = ({
  variant = 'body1',
  weight,
  color,
  align,
  children,
  ...rest
}: TextProps) => (
  <StyledText variant={variant} weight={weight} color={color} align={align} {...rest}>
    {children}
  </StyledText>
);
