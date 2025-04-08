'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from './ui/Button';
import  ThemeToggle  from '../components/ui/ThemeToggle'; // Adjust path if needed
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className='border-b dark:border-gray-400 sticky top-0 z-10 bg-white/50 dark:bg-gray-800/80 backdrop-blur-md'>
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <h1 className='text-xl font-bold text-gray-800 dark:text-white'>
          Todo App
        </h1>
        <div className='flex items-center space-x-4'>
          <ThemeToggle />
          {isAuthenticated ? (
            <div className='flex items-center space-x-4'>
              <span className='text-xl text-gray-600 dark:text-yellow-400'>
                Hi, {user?.name}
              </span>
              <Button variant='secondary' size='lg' onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
