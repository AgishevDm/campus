import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('app-theme');
    return savedTheme ? (savedTheme as Theme) : 'system';
  });

  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  };

  const getEffectiveTheme = (): 'light' | 'dark' => {
    return theme === 'system' ? getSystemTheme() : theme;
  };

  const toggleTheme = () => {
    setThemeState(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme', newTheme);
      applyTheme(newTheme);
      return newTheme;
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    // Не сохраняем в localStorage здесь, только при явном сохранении
  };

  const applyTheme = (themeToApply: Theme) => {
    const root = document.documentElement;
    const effectiveTheme = themeToApply === 'system' ? getSystemTheme() : themeToApply;
    
    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(`${effectiveTheme}-theme`);

    if (effectiveTheme === 'dark') {
      root.style.setProperty('--text-primary', '#e0e0e0');
      root.style.setProperty('--text-secondary', '#a0a0a5');
      root.style.setProperty('--background', '#171717');
      root.style.setProperty('--container-bg', '#2c2c2c');
      root.style.setProperty('--border-color', '#555555');
      root.style.setProperty('--error-color', '#f66');
      root.style.setProperty('--shadow', '0 4px 24px rgba(0, 0, 0, 0.12)');
      root.style.setProperty('--scrollbar-track', '#2c2c2c');
      root.style.setProperty('--scrollbar-thumb', '#555555');
      root.style.setProperty('--hover', '#555555');
    } else {
      root.style.setProperty('--text-primary', '#1d1d1f');
      root.style.setProperty('--text-secondary', '#86868b');
      root.style.setProperty('--background', '#f5f5f7');
      root.style.setProperty('--container-bg', '#ffffff');
      root.style.setProperty('--border-color', '#d2d2d7');
      root.style.setProperty('--error-color', '#dc2626');
      root.style.setProperty('--shadow', '0 4px 24px rgba(0,0,0,0.08)');
      root.style.setProperty('--scrollbar-track', '#f1f1f1');
      root.style.setProperty('--scrollbar-thumb', '#888');
      root.style.setProperty('--hover', '#f5f5f7');
    }
  };

  // Применяем тему при монтировании
  useEffect(() => {
    applyTheme(theme);
    // Сохраняем в localStorage только при инициализации
    localStorage.setItem('app-theme', theme);
  }, []);

  // Слушаем изменения системной темы
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
