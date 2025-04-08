'use client';

import React from 'react';
import { useTodos } from '@/hooks/useTodos';

const TodoStats = () => {
  const { tasks } = useTodos();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress').length;
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;

  return (
    <div className='grid grid-cols-4 gap-4 mb-6'>
      <div className='bg-blue-50 dark:bg-blue-900/80 p-4 rounded-lg'>
        <h3 className='text-sm font-medium text-blue-700 dark:text-blue-200 text-center'>
          Total Tasks
        </h3>
        <p className='text-2xl font-bold text-blue-600 dark:text-blue-300 text-center'>
          {totalTasks}
        </p>
      </div>
      <div className='bg-green-50 dark:bg-green-900/80 p-4 rounded-lg'>
        <h3 className='text-sm font-medium text-green-800 dark:text-green-200 text-center'>
          Completed
        </h3>
        <p className='text-2xl font-bold text-green-600 dark:text-green-300 text-center'>
          {completedTasks}
        </p>
      </div>
      <div className='bg-yellow-50 dark:bg-yellow-900/80 p-4 rounded-lg'>
        <h3 className='text-sm font-medium text-yellow-800 dark:text-yellow-200 text-center'>
          In Progress
        </h3>
        <p className='text-2xl font-bold text-yellow-600 dark:text-yellow-300 text-center'>
          {inProgressTasks}
        </p>
      </div>
      <div className='bg-red-50 dark:bg-red-800/80 p-4 rounded-lg'>
        <h3 className='text-sm font-medium text-red-800 dark:text-red-200 text-center'>
          Pending
        </h3>
        <p className='text-2xl font-bold text-red-600 dark:text-red-300 text-center'>
          {pendingTasks}
        </p>
      </div>
    </div>
  );
};

export default TodoStats;