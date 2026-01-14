import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIGHT_THEME = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1a1a1a',
  textMuted: '#666666',
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  border: '#E0E0E0',
  cardBackground: '#FFFFFF',
};

const DARK_THEME = {
  background: '#1a1a1a',
  surface: '#2a2a2a',
  text: '#FFFFFF',
  textMuted: '#AAAAAA',
  primary: '#0A84FF',
  success: '#30B0C0',
  warning: '#FF9500',
  danger: '#FF453A',
  border: '#404040',
  cardBackground: '#2a2a2a',
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar preferencia al montar
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const darkModeSetting = await AsyncStorage.getItem('setting_darkMode');
      if (darkModeSetting !== null) {
        setIsDarkMode(darkModeSetting === 'true');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading theme preference:', error);
      setIsLoading(false);
    }
  };

  const toggleDarkMode = async (value) => {
    try {
      setIsDarkMode(value);
      await AsyncStorage.setItem('setting_darkMode', value.toString());
      console.log('🌙 Tema cambiado a:', value ? 'Oscuro' : 'Claro');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const currentTheme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const value = {
    isDarkMode,
    toggleDarkMode,
    colors: currentTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
