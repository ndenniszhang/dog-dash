import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { colors, space, radii, fontSizes, fontWeights } from '../tokens';

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md';

interface BadgeStyleProps {
  variant: BadgeVariant;
  size: BadgeSize;
}

const badgeBg: Record<BadgeVariant, string> = {
  success: colors.semantic.success[50],
  error:   colors.semantic.error[50],
  warning: colors.semantic.warning[50],
  info:    colors.semantic.info[50],
  neutral: colors.neutral[100],
};

const badgeTextColor: Record<BadgeVariant, string> = {
  success: colors.semantic.success[500],
  error:   colors.semantic.error[500],
  warning: colors.semantic.warning[500],
  info:    colors.semantic.info[500],
  neutral: colors.text.secondary,
};

const badgeBorderColor: Record<BadgeVariant, string> = {
  success: colors.semantic.success[500],
  error:   colors.semantic.error[500],
  warning: colors.semantic.warning[500],
  info:    colors.semantic.info[500],
  neutral: colors.neutral[300],
};

const sizeStyles = {
  sm: { paddingVertical: 2,      paddingHorizontal: space.xs, fontSize: fontSizes.small },
  md: { paddingVertical: space.xs, paddingHorizontal: space.sm,  fontSize: fontSizes.caption },
} as const;

const StyledBadge = styled(View)<BadgeStyleProps>`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  background-color: ${({ variant }) => badgeBg[variant]};
  border-radius: ${radii.full}px;
  border-width: 1px;
  border-color: ${({ variant }) => badgeBorderColor[variant]};
  padding-vertical: ${({ size }) => sizeStyles[size].paddingVertical}px;
  padding-horizontal: ${({ size }) => sizeStyles[size].paddingHorizontal}px;
`;

const BadgeText = styled.Text<BadgeStyleProps>`
  font-size: ${({ size }) => sizeStyles[size].fontSize}px;
  font-weight: ${fontWeights.semiBold};
  color: ${({ variant }) => badgeTextColor[variant]};
`;

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export const Badge = ({ label, variant = 'neutral', size = 'md' }: BadgeProps) => (
  <StyledBadge variant={variant} size={size}>
    <BadgeText variant={variant} size={size}>{label}</BadgeText>
  </StyledBadge>
);
