import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { colors, space, radii } from '../tokens';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

interface CardStyleProps {
  variant: CardVariant;
  padding: keyof typeof space;
}

const cardBg: Record<CardVariant, string> = {
  elevated: colors.surface.background,
  outlined: colors.surface.background,
  filled:   colors.surface.paper,
};

const cardBorder: Record<CardVariant, string> = {
  elevated: 'transparent',
  outlined: colors.surface.border,
  filled:   'transparent',
};

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
};

const StyledView = styled(View)<CardStyleProps>`
  background-color: ${({ variant }) => cardBg[variant]};
  border-radius: ${radii.xl}px;
  border-width: 1px;
  border-color: ${({ variant }) => cardBorder[variant]};
  padding: ${({ padding }) => space[padding]}px;
`;

const StyledTouchable = styled(TouchableOpacity)<CardStyleProps>`
  background-color: ${({ variant }) => cardBg[variant]};
  border-radius: ${radii.xl}px;
  border-width: 1px;
  border-color: ${({ variant }) => cardBorder[variant]};
  padding: ${({ padding }) => space[padding]}px;
`;

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: keyof typeof space;
  onPress?: () => void;
}

export const Card = ({
  children,
  variant = 'elevated',
  padding = 'md',
  onPress,
}: CardProps) => {
  const shadow = variant === 'elevated' ? cardShadow : {};

  if (onPress) {
    return (
      <StyledTouchable
        variant={variant}
        padding={padding}
        onPress={onPress}
        activeOpacity={0.85}
        style={shadow}
      >
        {children}
      </StyledTouchable>
    );
  }

  return (
    <StyledView variant={variant} padding={padding} style={shadow}>
      {children}
    </StyledView>
  );
};
