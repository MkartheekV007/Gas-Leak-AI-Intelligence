import React, { createContext, useContext, useState, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const s = localStorage.getItem('safegas_settings');
      return s ? JSON.parse(s) : {};
    } catch (e) { return {}; }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const s = localStorage.getItem('safegas_settings');
        setSettings(s ? JSON.parse(s) : {});
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('safegas_settings_changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('safegas_settings_changed', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Theme
    const theme = settings.theme || 'dark';
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Accent Color
    if (settings.accent) {
      root.style.setProperty('--primary', settings.accent);
    } else {
      root.style.removeProperty('--primary');
    }

    // Glassmorphism
    if (settings.glassmorphism === false) root.classList.add('no-glass');
    else root.classList.remove('no-glass');

    // Animated BG
    if (settings.animatedBg === false) root.classList.add('no-animated-bg');
    else root.classList.remove('no-animated-bg');

    // Accessibility
    if (settings.highContrast) root.classList.add('high-contrast');
    else root.classList.remove('high-contrast');

    if (settings.reduceMotion) root.classList.add('reduce-motion');
    else root.classList.remove('reduce-motion');

    // 3D Effects
    if (settings.effects3d === false) root.classList.add('no-3d');
    else root.classList.remove('no-3d');

    if (settings.fontSize) root.style.fontSize = `${settings.fontSize}px`;
    else root.style.fontSize = '';

  }, [settings]);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const nextSettings = { ...settings, theme: nextTheme };
    localStorage.setItem('safegas_settings', JSON.stringify(nextSettings));
    window.dispatchEvent(new Event('safegas_settings_changed'));
  };

  return (
    <ThemeContext.Provider value={{ theme: settings.theme || 'dark', toggleTheme, settings }}>
      <MotionConfig reducedMotion={settings.reduceMotion ? "always" : "user"}>
        {children}
      </MotionConfig>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
