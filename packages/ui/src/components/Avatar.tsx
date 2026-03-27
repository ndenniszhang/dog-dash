import React from 'react';
import { Image, View } from 'react-native';
import styled from 'styled-components/native';
import { colors, radii, fontSizes, fontWeights } from '../tokens';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizePx: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const initialsSize: Record<AvatarSize, number> = {
  xs: fontSizes.small,
  sm: fontSizes.caption,
  md: fontSizes.body2,
  lg: fontSizes.body1,
  xl: fontSizes.h3,
};

interface AvatarWrapperProps {
  size: AvatarSize;
}

const AvatarWrapper = styled(View)<AvatarWrapperProps>`
  width: ${({ size }) => sizePx[size]}px;
  height: ${({ size }) => sizePx[size]}px;
  border-radius: ${radii.full}px;
  overflow: hidden;
  background-color: ${colors.primary[100]};
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const InitialsText = styled.Text<{ size: AvatarSize }>`
  font-size: ${({ size }) => initialsSize[size]}px;
  font-weight: ${fontWeights.semiBold};
  color: ${colors.primary[700]};
`;

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  alt?: string;
}

export const Avatar = ({ src, name = '', size = 'md', alt }: AvatarProps) => {
  const [imgError, setImgError] = React.useState(false);
  const showImage = !!src && !imgError;

  return (
    <AvatarWrapper size={size}>
      {showImage ? (
        <AvatarImage
          source={{ uri: src }}
          accessibilityLabel={alt ?? name}
          onError={() => setImgError(true)}
        />
      ) : (
        <InitialsText size={size}>{getInitials(name)}</InitialsText>
      )}
    </AvatarWrapper>
  );
};
