"use client"

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
  
  // Apply CSS variables based on the current theme
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const colors = theme.getCurrentColors();
      
      // Apply text colors
      if (colors.text) {
        root.style.setProperty('--color-text-primary', colors.text.primary);
        root.style.setProperty('--color-text-secondary', colors.text.secondary);
        root.style.setProperty('--color-text-disabled', colors.text.disabled);
        root.style.setProperty('--color-text-inverse', colors.text.inverse);
      }
      
      // Apply surface colors
      if (colors.surface) {
        root.style.setProperty('--color-background', colors.surface.background);
        root.style.setProperty('--color-surface', colors.surface.paper);
        root.style.setProperty('--color-border', colors.surface.border);
        root.style.setProperty('--color-divider', colors.surface.divider);
      }
      
      // Apply primary colors
      if (colors.primary) {
        Object.entries(colors.primary).forEach(([key, value]) => {
          if (value) root.style.setProperty(`--color-primary-${key}`, value.toString());
        });
      }
      
      // Apply neutral colors
      if (colors.neutral) {
        Object.entries(colors.neutral).forEach(([key, value]) => {
          if (value) root.style.setProperty(`--color-neutral-${key}`, value.toString());
        });
      }
      
      // Apply semantic colors
      if (colors.semantic) {
        Object.entries(colors.semantic).forEach(([category, values]) => {
          if (values) {
            Object.entries(values as Record<string, string>).forEach(([key, value]) => {
              if (value) root.style.setProperty(`--color-${category}-${key}`, value.toString());
            });
          }
        });
      }
      
      // Add a data-theme attribute for additional CSS selectors
      root.setAttribute('data-theme', currentMode);
    }
  }, [currentMode, theme]);

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
