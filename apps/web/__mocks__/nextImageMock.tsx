import React from 'react';

const NextImageMock = ({ src, alt, width, height, ...props }: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}) => {
  return <img src={src} alt={alt} width={width} height={height} {...props} />;
};

export default NextImageMock;
