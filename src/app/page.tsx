'use client';

import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import TodoList from '@/components/todos/TodoList';
import TodoFilters from '@/components/todos/TodoFilters';
import TodoStats from '@/components/todos/TodoStats';
import { useState, useEffect } from 'react';
import TodoForm from '@/components/todos/TodoForm';
import { TaskCharts } from '@/components/todos/TaskCharts';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePWA } from '@/hooks/usePWA';
import Button from '@/components/ui/Button';
import { useTodoContext } from '@/context/TodoContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { state, dispatch, canUndo, canRedo } = useTodoContext();
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state on client-side only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle editingTask state change after mounting
  useEffect(() => {
    if (isMounted && state.editingTask) {
      setIsFormOpen(true); // Open form when editingTask is set
    }
  }, [isMounted, state.editingTask]);

  // Register keyboard shortcuts only after mounting
  useKeyboardShortcuts(
    isMounted
      ? [
          { key: 'n', ctrlKey: true, action: () => setIsFormOpen(true) },
          { key: 'z', ctrlKey: true, action: () => dispatch({ type: 'UNDO' }) },
          { key: 'y', ctrlKey: true, action: () => dispatch({ type: 'REDO' }) },
        ]
      : []
  );

  usePWA();

  // Render nothing during SSR until mounted
  if (!isMounted) {
    return null; // Or a minimal placeholder like <div>Loading...</div>
  }

  // After mounting, render based on authentication state
  if (!isAuthenticated) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Please login to continue</h1>
          <a
            href='/login'
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className='container mx-auto p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold text-black dark:text-white'>
            My Tasks
          </h1>
          <div className='flex space-x-2'>
            <Button
              variant='text'
              onClick={() => dispatch({ type: 'UNDO' })}
              disabled={!canUndo}
              title='Undo (Ctrl+Z)'
              className='text-gray-900 dark:text-gray-100'
            >
              Undo
            </Button>
            <Button
              variant='text'
              onClick={() => dispatch({ type: 'REDO' })}
              disabled={!canRedo}
              title='Redo (Ctrl+Y)'
              className='text-gray-900 dark:text-gray-100'
            >
              Redo
            </Button>
            <NotificationCenter />
          </div>
        </div>
        <TodoStats />
        <TodoFilters />
        <TodoList onAddTask={() => setIsFormOpen(true)} />
        <TaskCharts />
        <TodoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      </main>
    </div>
  );
}
