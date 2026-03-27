import React, { useState } from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { colors, space, radii, fontSizes, fontWeights } from '../tokens';
import { Text } from './Text';

interface InputContainerProps {
  fullWidth?: boolean;
}

const Container = styled(View)<InputContainerProps>`
  align-self: ${({ fullWidth }) => (fullWidth ? 'stretch' : 'flex-start')};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const LabelText = styled.Text`
  font-size: ${fontSizes.body2}px;
  font-weight: ${fontWeights.medium};
  color: ${colors.text.primary};
  margin-bottom: ${space.xs}px;
`;

interface InputWrapperProps {
  focused: boolean;
  hasError: boolean;
  disabled: boolean;
}

const InputWrapper = styled(View)<InputWrapperProps>`
  flex-direction: row;
  align-items: center;
  height: 48px;
  border-radius: ${radii.lg}px;
  border-width: 1.5px;
  border-color: ${({ focused, hasError, disabled }) => {
    if (disabled) return colors.neutral[200];
    if (hasError) return colors.semantic.error[500];
    if (focused) return colors.primary[500];
    return colors.surface.border;
  }};
  background-color: ${({ disabled }) =>
    disabled ? colors.neutral[50] : colors.surface.background};
  padding-horizontal: ${space.md}px;
`;

const StyledInput = styled(TextInput)`
  flex: 1;
  font-size: ${fontSizes.body1}px;
  color: ${colors.text.primary};
  padding: 0;
`;

const IconWrapper = styled(View)<{ side: 'left' | 'right' }>`
  margin-left: ${({ side }) => (side === 'right' ? space.sm : 0)}px;
  margin-right: ${({ side }) => (side === 'left' ? space.sm : 0)}px;
`;

const HelperText = styled.Text<{ isError: boolean }>`
  font-size: ${fontSizes.caption}px;
  color: ${({ isError }) =>
    isError ? colors.semantic.error[500] : colors.text.secondary};
  margin-top: ${space.xs}px;
`;

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = ({
  label,
  error,
  helperText,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  ...rest
}: InputProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <Container fullWidth={fullWidth}>
      {label && <LabelText>{label}</LabelText>}
      <InputWrapper focused={focused} hasError={!!error} disabled={disabled}>
        {leftIcon && <IconWrapper side="left">{leftIcon}</IconWrapper>}
        <StyledInput
          editable={!disabled}
          placeholderTextColor={colors.text.disabled}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightIcon && <IconWrapper side="right">{rightIcon}</IconWrapper>}
      </InputWrapper>
      {(error || helperText) && (
        <HelperText isError={!!error}>{error ?? helperText}</HelperText>
      )}
    </Container>
  );
};
