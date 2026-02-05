import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

const StyledButton = styled(TouchableOpacity)`
  padding: 10px 20px;
  background-color: #007AFF;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled(Text)`
  color: white;
  font-weight: bold;
`;

interface ButtonProps {
    title: string;
    onPress: () => void;
}

export const Button = ({ title, onPress }: ButtonProps) => {
    return (
        <StyledButton onPress={onPress}>
            <ButtonText>{title}</ButtonText>
        </StyledButton>
    );
};
