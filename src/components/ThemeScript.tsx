'use client';

import { useEffect } from 'react';

export const ThemeScript = () => {
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  return null;
};
