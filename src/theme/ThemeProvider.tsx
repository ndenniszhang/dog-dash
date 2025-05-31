import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { Theme, theme as defaultTheme, ThemeMode } from './index';

interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme: customTheme,
}) => {
  const [currentMode, setCurrentMode] = useState<ThemeMode>('light');
  
  // Initialize theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialMode = savedTheme || (prefersDark ? 'dark' : 'light');
      setCurrentMode(initialMode);
      
      // Set up listener for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (!savedTheme) { // Only change if user hasn't set a preference
          setCurrentMode(e.matches ? 'dark' : 'light');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    setCurrentMode(newMode);
    
    // Save preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newMode);
    }
  };

  // Create the theme object with the current mode
  const theme = useMemo(() => ({
    ...(customTheme || defaultTheme),
    currentMode,
    getCurrentColors() {
      return this.colors[this.currentMode];
    },
  }), [currentMode, customTheme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      isDarkMode: currentMode === 'dark' 
    }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
