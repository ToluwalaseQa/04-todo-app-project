'use client';

import React, { useState } from 'react';
import Checkbox from '../ui/Checkbox';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Subtask } from '@/types/todo';

interface SubtaskListProps {
  subtasks: Subtask[];
  onSubtasksChange: (subtasks: Subtask[]) => void;
}

export const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  onSubtasksChange,
}) => {
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    const newSubtasks = [
      ...subtasks,
      {
        id: Date.now().toString(),
        title: newSubtask,
        completed: false,
        createdAt: new Date(),
      },
    ];
    onSubtasksChange(newSubtasks);
    setNewSubtask(''); // Clear input, but don’t close the form
  };

  const handleToggleSubtask = (id: string) => {
    const newSubtasks = subtasks.map((subtask) =>
      subtask.id === id
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    onSubtasksChange(newSubtasks);
  };

  const handleDeleteSubtask = (id: string) => {
    const newSubtasks = subtasks.filter((subtask) => subtask.id !== id);
    onSubtasksChange(newSubtasks);
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-center space-x-2'>
        <Input
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          placeholder='Add a subtask'
          className='flex-1'
          onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
        />
        <Button
          type='button' // Explicitly prevent form submission
          size='sm'
          onClick={handleAddSubtask}
        >
          <PlusIcon className='h-4 w-4' />
        </Button>
      </div>
      <div className='space-y-1'>
        {subtasks.map((subtask) => (
          <div key={subtask.id} className='flex items-center space-x-2'>
            <Checkbox
              checked={subtask.completed}
              onChange={() => handleToggleSubtask(subtask.id)}
            />
            <span
              className={`flex-1 ${
                subtask.completed
                  ? 'line-through text-gray-500 dark:text-gray-400'
                  : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              {subtask.title}
            </span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleDeleteSubtask(subtask.id)}
            >
              <TrashIcon className='h-4 w-4 text-red-500' />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
