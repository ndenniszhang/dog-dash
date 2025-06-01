import React from 'react';
import { ViewProps } from 'react-native';
import * as ExpoIcons from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import Box from './Box';

// Define all available icon families from Expo
type IconFamily = 
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Fontisto'
  | 'Foundation'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

// Define the props for our Icon component
export interface IconProps extends ViewProps {
  // Icon properties
  name: string;
  family?: IconFamily;
  size?: number;
  color?: string;
  
  // Optional styling
  opacity?: number;
  
  // Optional accessibility
  accessibilityLabel?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  family = 'MaterialIcons',
  size = 24,
  color,
  style,
  opacity,
  accessibilityLabel,
  ...rest
}) => {
  const { theme } = useTheme();
  const themeColors = theme.getCurrentColors();
  
  // Default color from theme if not specified
  const iconColor = color || themeColors.text.primary;
  
  // Get the appropriate icon component from Expo icons
  const IconComponent = ExpoIcons[family];
  
  if (!IconComponent) {
    console.error(`Icon family "${family}" not found`);
    return null;
  }
  
  return (
    <Box 
      style={style} 
      opacity={opacity}
      accessibilityLabel={accessibilityLabel}
      {...rest}
    >
      <IconComponent name={name} size={size} color={iconColor} />
    </Box>
  );
};

// Create a helper function to check if an icon name exists in a family
export const iconExists = (name: string, family: IconFamily = 'MaterialIcons'): boolean => {
  try {
    const IconComponent = ExpoIcons[family];
    // This is a simple check that works for most icon sets
    // Some icon sets might require different approaches
    return IconComponent.glyphMap && !!IconComponent.glyphMap[name];
  } catch (error) {
    return false;
  }
};

export default Icon;
