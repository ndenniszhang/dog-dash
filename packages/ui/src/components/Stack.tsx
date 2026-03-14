import React from 'react';
import { View, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import { space as spaceTokens } from '../tokens';

type GapKey = keyof typeof spaceTokens;
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

interface StackStyleProps {
  direction: 'vertical' | 'horizontal';
  gap: GapKey;
  align: AlignItems;
  justify: JustifyContent;
  wrap: boolean;
}

const StyledStack = styled(View)<StackStyleProps>`
  flex-direction: ${({ direction }) => (direction === 'horizontal' ? 'row' : 'column')};
  gap: ${({ gap }) => spaceTokens[gap]}px;
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
`;

export interface StackProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  gap?: GapKey;
  align?: AlignItems;
  justify?: JustifyContent;
  wrap?: boolean;
}

export const Stack = ({
  children,
  direction = 'vertical',
  gap = 'md',
  align = 'flex-start',
  justify = 'flex-start',
  wrap = false,
  ...rest
}: StackProps) => (
  <StyledStack
    direction={direction}
    gap={gap}
    align={align}
    justify={justify}
    wrap={wrap}
    {...rest}
  >
    {children}
  </StyledStack>
);

export const VStack = (props: Omit<StackProps, 'direction'>) => (
  <Stack direction="vertical" {...props} />
);

export const HStack = (props: Omit<StackProps, 'direction'>) => (
  <Stack direction="horizontal" {...props} />
);
