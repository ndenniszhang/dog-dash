import React, { useState } from 'react';
import { Box, Text, Pressable, Icon } from './index';
import { useTheme } from '../../theme/ThemeProvider';

export const PrimitiveDemo: React.FC = () => {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [count, setCount] = useState(0);
  
  const colors = theme.getCurrentColors();
  
  return (
    <Box 
      flex={1}
      padding={16}
      backgroundColor={colors.surface.background}
    >
      <Box 
        marginBottom={24}
        padding={16}
        borderRadius={8}
        backgroundColor={colors.surface.paper}
        borderWidth={1}
        borderColor={colors.surface.border}
      >
        <Text variant="h2" marginBottom={8}>Primitive Components</Text>
        <Text variant="body1" marginBottom={16}>
          This is a demonstration of the primitive components from Phase 2.1 of our design system implementation.
        </Text>
        
        <Box 
          flexDirection="row" 
          alignItems="center" 
          marginBottom={16}
        >
          <Icon 
            name="lightbulb" 
            size={24} 
            color={colors.primary[500]} 
            marginRight={8} 
          />
          <Text variant="body1">
            Current theme: <Text weight="bold">{isDarkMode ? 'Dark' : 'Light'}</Text>
          </Text>
        </Box>
        
        <Pressable
          backgroundColor={colors.primary[500]}
          paddingVertical={12}
          paddingHorizontal={16}
          borderRadius={8}
          alignItems="center"
          justifyContent="center"
          marginBottom={16}
          onPress={toggleTheme}
        >
          <Box flexDirection="row" alignItems="center">
            <Icon 
              name={isDarkMode ? 'light-mode' : 'dark-mode'} 
              color="#FFFFFF" 
              marginRight={8} 
            />
            <Text color="#FFFFFF" weight="medium">
              Toggle Theme
            </Text>
          </Box>
        </Pressable>
      </Box>
      
      <Box 
        padding={16}
        borderRadius={8}
        backgroundColor={colors.surface.paper}
        borderWidth={1}
        borderColor={colors.surface.border}
        marginBottom={24}
      >
        <Text variant="h3" marginBottom={16}>Counter Example</Text>
        
        <Box 
          flexDirection="row" 
          alignItems="center" 
          justifyContent="center"
          marginBottom={16}
        >
          <Pressable
            backgroundColor={colors.semantic.error[500]}
            width={40}
            height={40}
            borderRadius={20}
            alignItems="center"
            justifyContent="center"
            onPress={() => setCount(prev => Math.max(0, prev - 1))}
            disabled={count === 0}
            opacity={count === 0 ? 0.5 : 1}
          >
            <Icon name="remove" color="#FFFFFF" />
          </Pressable>
          
          <Box 
            width={80} 
            alignItems="center" 
            justifyContent="center"
          >
            <Text variant="h2">{count}</Text>
          </Box>
          
          <Pressable
            backgroundColor={colors.semantic.success[500]}
            width={40}
            height={40}
            borderRadius={20}
            alignItems="center"
            justifyContent="center"
            onPress={() => setCount(prev => prev + 1)}
          >
            <Icon name="add" color="#FFFFFF" />
          </Pressable>
        </Box>
        
        <Text align="center" variant="body2" color={colors.text.secondary}>
          Press the buttons to update the counter
        </Text>
      </Box>
      
      <Box 
        padding={16}
        borderRadius={8}
        backgroundColor={colors.surface.paper}
        borderWidth={1}
        borderColor={colors.surface.border}
      >
        <Text variant="h3" marginBottom={16}>Typography Examples</Text>
        
        <Box marginBottom={24}>
          <Text variant="h1" marginBottom={8}>Heading 1</Text>
          <Text variant="h2" marginBottom={8}>Heading 2</Text>
          <Text variant="h3" marginBottom={8}>Heading 3</Text>
          <Text variant="h4" marginBottom={8}>Heading 4</Text>
          <Text variant="body1" marginBottom={8}>Body 1 - Regular text for main content</Text>
          <Text variant="body2" marginBottom={8}>Body 2 - Smaller text for secondary content</Text>
          <Text variant="caption" marginBottom={8}>CAPTION TEXT</Text>
          <Text variant="small">Small text for fine print</Text>
        </Box>
        
        <Text variant="h4" marginBottom={8}>Text Styles</Text>
        <Box marginBottom={4}>
          <Text weight="bold" marginBottom={4}>Bold text</Text>
          <Text weight="semiBold" marginBottom={4}>Semi-bold text</Text>
          <Text weight="medium" marginBottom={4}>Medium text</Text>
          <Text italic marginBottom={4}>Italic text</Text>
          <Text underline marginBottom={4}>Underlined text</Text>
          <Text uppercase marginBottom={4}>Uppercase text</Text>
          <Text color={colors.semantic.info[500]}>Colored text</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default PrimitiveDemo;
