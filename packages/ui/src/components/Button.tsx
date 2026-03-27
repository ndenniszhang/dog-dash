import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import { colors, space, radii, fontSizes, fontWeights } from '../tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonStyleProps {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  fullWidth: boolean;
}

const sizeStyles = {
  sm: { paddingVertical: space.xs,  paddingHorizontal: space.md,  fontSize: fontSizes.body2, height: 32 },
  md: { paddingVertical: space.sm,  paddingHorizontal: space.lg,  fontSize: fontSizes.body1, height: 44 },
  lg: { paddingVertical: space.md,  paddingHorizontal: space.xl,  fontSize: fontSizes.h4,    height: 52 },
} as const;

const variantBg: Record<ButtonVariant, string> = {
  primary:   colors.primary[500],
  secondary: colors.neutral[100],
  outline:   'transparent',
  ghost:     'transparent',
};

const variantBgPressed: Record<ButtonVariant, string> = {
  primary:   colors.primary[600],
  secondary: colors.neutral[200],
  outline:   colors.primary[50],
  ghost:     colors.neutral[100],
};

const variantBorder: Record<ButtonVariant, string> = {
  primary:   colors.primary[500],
  secondary: colors.neutral[100],
  outline:   colors.primary[500],
  ghost:     'transparent',
};

const variantTextColor: Record<ButtonVariant, string> = {
  primary:   colors.text.inverse,
  secondary: colors.text.primary,
  outline:   colors.primary[500],
  ghost:     colors.primary[500],
};

const StyledTouchable = styled(TouchableOpacity)<ButtonStyleProps>`
  height: ${({ size }) => sizeStyles[size].height}px;
  padding-horizontal: ${({ size }) => sizeStyles[size].paddingHorizontal}px;
  background-color: ${({ variant, disabled }) =>
    disabled ? colors.neutral[200] : variantBg[variant]};
  border-radius: ${radii.lg}px;
  border-width: 1.5px;
  border-color: ${({ variant, disabled }) =>
    disabled ? colors.neutral[300] : variantBorder[variant]};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: ${({ fullWidth }) => (fullWidth ? 'stretch' : 'flex-start')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const StyledLabel = styled.Text<{ variant: ButtonVariant; size: ButtonSize; disabled: boolean }>`
  font-size: ${({ size }) => sizeStyles[size].fontSize}px;
  font-weight: ${fontWeights.semiBold};
  color: ${({ variant, disabled }) =>
    disabled ? colors.text.disabled : variantTextColor[variant]};
`;

const IconWrapper = styled(View)<{ side: 'left' | 'right' }>`
  margin-left: ${({ side }) => (side === 'right' ? space.xs : 0)}px;
  margin-right: ${({ side }) => (side === 'left' ? space.xs : 0)}px;
`;

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <StyledTouchable
      variant={variant}
      size={size}
      disabled={isDisabled}
      fullWidth={fullWidth}
      activeOpacity={0.75}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.text.inverse : colors.primary[500]}
        />
      ) : (
        <>
          {leftIcon && <IconWrapper side="left">{leftIcon}</IconWrapper>}
          <StyledLabel variant={variant} size={size} disabled={isDisabled}>
            {label}
          </StyledLabel>
          {rightIcon && <IconWrapper side="right">{rightIcon}</IconWrapper>}
        </>
      )}
    </StyledTouchable>
  );
};
