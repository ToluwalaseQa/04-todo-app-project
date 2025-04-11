'use client';

import React, { useState, useEffect } from 'react';
import { Task, TimeEntry } from '@/types/todo';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import {
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';
import { useTodoContext } from '@/context/TodoContext';
import { format } from 'date-fns';
import { formatDuration, calculateDuration } from '@/lib/utils';

interface TodoCardProps {
  task: Task;
  index: number;
  isDragged?: boolean;
  isHovered?: boolean;
  onDragStart: (task: Task) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const useTaskTracking = (task: Task, dispatch: React.Dispatch<any>) => {
  const [currentDuration, setCurrentDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (task.activeTracking) {
      const activeTracking = task.activeTracking;
      interval = setInterval(() => {
        const startDate = new Date(activeTracking.start);
        const elapsed = calculateDuration(startDate);

        if (activeTracking.countdownDuration) {
          const remaining = activeTracking.countdownDuration - elapsed;
          setCurrentDuration(remaining > 0 ? remaining : 0);

          if (remaining <= 0) {
            dispatch({
              type: 'UPDATE_TASK',
              payload: {
                ...task,
                activeTracking: null,
                timeEntries: [
                  ...(task.timeEntries || []),
                  {
                    id: Date.now().toString(),
                    start: new Date(activeTracking.start),
                    end: new Date(),
                    duration: activeTracking.countdownDuration,
                  } as TimeEntry,
                ],
              },
            });
          }
        } else {
          setCurrentDuration(elapsed);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [task, dispatch]);

  return currentDuration;
};

const TodoCard: React.FC<TodoCardProps> = ({
  task,
  isDragged,
  isHovered,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const { dispatch } = useTodoContext();
  const currentDuration = useTaskTracking(task, dispatch);

  const handleToggle = () => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        ...task,
        completed: !task.completed,
        status: !task.completed ? 'completed' : 'in-progress', // Sync status with completion
      },
    });
  };

  const handleEdit = () => {
    dispatch({ type: 'SET_EDITING_TASK', payload: task });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: task.id });
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        onDragStart(task);
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`border rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800 cursor-move
        ${isDragged ? 'opacity-50 border-dashed border-2 border-gray-400' : ''}
        ${isHovered ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex items-start space-x-3 flex-1'>
          <Checkbox
            checked={task.completed}
            onChange={handleToggle}
            className='mt-1'
          />
          <div className='flex-1'>
            <h3
              className={`text-lg font-medium ${
                task.completed
                  ? 'line-through text-gray-400 dark:text-gray-500'
                  : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`text-sm ${
                  task.completed
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {task.description}
              </p>
            )}
            <div className='flex flex-wrap gap-2 mt-2'>
              <PriorityBadge priority={task.priority} />
              <CategoryBadge category={task.category} />
              <span
                className={`text-sm ${
                  task.status === 'in-progress'
                    ? 'text-yellow-600'
                    : task.status === 'completed'
                    ? 'text-green-600'
                    : 'text-gray-600'
                }`}
              >
                {task.status}
              </span>
              {task.dueDate && (
                <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                  <CalendarIcon className='h-4 w-4 mr-1' />
                  {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </div>
              )}
              {task.activeTracking && (
                <div className='flex items-center text-sm text-blue-500 dark:text-blue-400'>
                  <ClockIcon className='h-4 w-4 mr-1' />
                  {task.activeTracking.countdownDuration
                    ? `Countdown: ${formatDuration(currentDuration)}`
                    : `Tracking: ${formatDuration(currentDuration)}`}
                </div>
              )}
            </div>
            {task.subtasks && task.subtasks.length > 0 && (
              <div className='mt-2 flex flex-wrap gap-2'>
                {task.subtasks.map((subtask) => (
                  <span
                    key={subtask.id}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      subtask.completed
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {subtask.completed && (
                      <CheckCircleIcon className='h-3 w-3 mr-1' />
                    )}
                    <span className={subtask.completed ? 'line-through' : ''}>
                      {subtask.title}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='flex space-x-1'>
          <Button
            variant='secondary'
            size='sm'
            onClick={handleEdit}
            aria-label={`Edit task: ${task.title}`}
          >
            <PencilIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleDelete}
            aria-label={`Delete task: ${task.title}`}
          >
            <TrashIcon className='h-4 w-4 text-red-500' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TodoCard);
