import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Load saved preferences or default to 'dark' and 'ocean'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [colorPalette, setColorPalette] = useState(() => localStorage.getItem('colorPalette') || 'ocean');

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-color', colorPalette);

    localStorage.setItem('theme', theme);
    localStorage.setItem('colorPalette', colorPalette);
  }, [theme, colorPalette]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorPalette, setColorPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
