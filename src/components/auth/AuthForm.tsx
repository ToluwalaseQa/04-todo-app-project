'use client';

import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuthFormProps {
  isLogin?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin = true }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let success;
      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        success = await register(name, email, password);
        if (!success) {
          setError(
            'Email already registered. Please log in or use a different email.'
          );
        }
      }

      if (success) {
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800'>
      <h2 className='text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white'>
        {isLogin ? 'Login' : 'Register'}
      </h2>
      {error && (
        <div className='mb-4 p-2 bg-red-100 text-red-700 rounded dark:bg-red-900/30 dark:text-red-300'>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className='space-y-4'>
        {!isLogin && (
          <Input
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <Input
          label='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type='submit' className='w-full btn-primary'>
          {isLogin ? 'Login' : 'Register'}
        </Button>
      </form>
      <div className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <Link
              href='/register'
              className='text-blue-600 hover:underline dark:text-blue-400'
            >
              Register
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-blue-600 hover:underline dark:text-blue-400'
            >
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
