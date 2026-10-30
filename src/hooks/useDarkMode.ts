import { useState, useEffect } from 'react';

/**
 * Custom React hook managing application dark mode state and DOM class synchronization.
 *
 * @returns Object containing isDarkMode boolean and toggleDarkMode function
 */
export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('celebration_os_theme');
      if (stored) {
        return stored === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('celebration_os_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('celebration_os_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return { isDarkMode, toggleDarkMode, setIsDarkMode };
}
