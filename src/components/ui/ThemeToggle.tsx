'use client';

import React, { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component only renders after mounting to avoid SSR mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className='p-2 rounded-full hover:bg-gray-200 transition-colors'
        aria-label='Theme toggle placeholder'
      >
        <MoonIcon className='h-5 w-5 text-gray-700' />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
      aria-label={
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
    >
      {theme === 'dark' ? (
        <SunIcon className='h-5 w-10 text-yellow-400' />
      ) : (
        <MoonIcon className='h-5 w-10 text-blue-500' />
      )}
    </button>
  );
};

export default ThemeToggle;
