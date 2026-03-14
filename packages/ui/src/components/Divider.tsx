import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../tokens';

export type DividerOrientation = 'horizontal' | 'vertical';

interface DividerStyleProps {
  orientation: DividerOrientation;
  thickness: number;
  color: string;
}

const StyledDivider = styled(View)<DividerStyleProps>`
  background-color: ${({ color }) => color};
  ${({ orientation, thickness }) =>
    orientation === 'horizontal'
      ? `height: ${thickness}px; align-self: stretch;`
      : `width: ${thickness}px; align-self: stretch;`}
`;

export interface DividerProps {
  orientation?: DividerOrientation;
  thickness?: number;
  color?: string;
}

export const Divider = ({
  orientation = 'horizontal',
  thickness = 1,
  color = colors.surface.divider,
}: DividerProps) => (
  <StyledDivider orientation={orientation} thickness={thickness} color={color} />
);
