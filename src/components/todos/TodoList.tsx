'use client';

import React from 'react';
import TodoCard from './TodoCard';
import { useTodos } from '@/hooks/useTodos';
import Button from '../ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useTodoContext } from '@/context/TodoContext';

interface TodoListProps {
  onAddTask: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ onAddTask }) => {
  const { tasks } = useTodos();
  const { dispatch } = useTodoContext();

  const { handleDragStart, handleDragOver, handleDrop } = useDragAndDrop(
    tasks,
    (newTasks) => {
      dispatch({ type: 'REORDER_TASKS', payload: newTasks });
    }
  );

  return (
    <div className='mt-6'>
      <div className='flex justify-end mb-4'>
        <Button onClick={onAddTask} className='flex items-center'>
          <PlusIcon className='h-4 w-4 mr-1' />
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className='text-center py-12'>
          <h3 className='text-lg font-medium text-gray-500 dark:text-gray-400'>
            No tasks found
          </h3>
          <p className='mt-1 text-sm text-gray-400 dark:text-gray-500'>
            Try adjusting your filters or add a new task
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {tasks.map((task, index) => (
            <TodoCard
              key={task.id}
              task={task}
              onDragStart={() => handleDragStart(task)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
