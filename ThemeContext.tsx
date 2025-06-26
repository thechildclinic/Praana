import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Theme, themes, ThemeColors } from './themes';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]); // Default to Pristine Light

  useEffect(() => {
    const savedThemeId = localStorage.getItem('prana-ai-theme');
    const savedTheme = themes.find(t => t.id === savedThemeId);
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value as string);
    });
    localStorage.setItem('prana-ai-theme', currentTheme.id);
  }, [currentTheme]);

  const setThemeById = useCallback((themeId: string) => {
    const newTheme = themes.find(t => t.id === themeId);
    if (newTheme) {
      setCurrentTheme(newTheme);
    } else {
      console.warn(`Theme with id "${themeId}" not found. Defaulting to first theme.`);
      setCurrentTheme(themes[0]);
    }
  }, []);

  const contextValue = useMemo(() => ({
    theme: currentTheme,
    setTheme: setThemeById,
    availableThemes: themes
  }), [currentTheme, setThemeById]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
