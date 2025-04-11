'use client';

import React, { useState, useEffect } from 'react';
import { Task, TimeEntry, SharedWith } from '@/types/todo';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { PRIORITIES } from '@/constants/priorities';
import { useTodoContext } from '@/context/TodoContext';
import Modal from '../ui/Modal';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { RecurrencePicker } from './RecurrencePicker';
import { SubtaskList } from './SubtaskList';
import { TimeTracker } from './TimeTracker';
import { ShareModal } from './ShareModal';
import { formatDuration, calculateDuration } from '@/lib/utils';

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useTodoContext();
  const [task, setTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    category: DEFAULT_CATEGORIES[0].name,
    recurrence: 'none',
    subtasks: [],
    timeEntries: [],
    sharedWith: [],
    status: 'pending',
    activeTracking: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [trackingMode, setTrackingMode] = useState<'elapsed' | 'countdown'>(
    'elapsed'
  );
  const [countdownDuration, setCountdownDuration] = useState<number | null>(
    null
  );
  const [elapsedTime, setElapsedTime] = useState(0);

  // Real-time elapsed time effect with type guards
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (task.activeTracking) {
      const startDate = new Date(task.activeTracking.start);

      if (trackingMode === 'elapsed') {
        interval = setInterval(() => {
          const elapsed = calculateDuration(startDate);
          setElapsedTime(elapsed);
        }, 1000);
      } else if (
        trackingMode === 'countdown' &&
        task.activeTracking.countdownDuration !== undefined
      ) {
        const countdownDuration = task.activeTracking.countdownDuration; // Store locally as number
        interval = setInterval(() => {
          const elapsed = calculateDuration(startDate);
          const remaining = countdownDuration - elapsed;
          setElapsedTime(remaining > 0 ? remaining : 0);
          if (remaining <= 0) {
            handleStopTracking(countdownDuration); // Use the stored number
          }
        }, 1000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [task.activeTracking, trackingMode]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    if (state.editingTask) {
      setTask({
        ...state.editingTask,
        activeTracking: state.editingTask.activeTracking || null,
        recurrence: state.editingTask.recurrence || 'none',
      });
      setTrackingMode(
        state.editingTask.activeTracking?.countdownDuration !== undefined
          ? 'countdown'
          : 'elapsed'
      );
      setCountdownDuration(
        state.editingTask.activeTracking?.countdownDuration || null
      );
      setElapsedTime(0);
    } else {
      resetForm();
    }
  }, [state.editingTask, isOpen]);

  const resetForm = () => {
    setTask({
      title: '',
      description: '',
      priority: 'medium',
      category: DEFAULT_CATEGORIES[0].name,
      recurrence: 'none',
      subtasks: [],
      timeEntries: [],
      sharedWith: [],
      status: 'pending',
      activeTracking: null,
    });
    setTrackingMode('elapsed');
    setCountdownDuration(null);
    setElapsedTime(0);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!task.title) newErrors.title = 'Please enter a task title';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date();
    const newTask: Task = {
      id: state.editingTask?.id || Date.now().toString(),
      title: task.title || '',
      description: task.description,
      completed: state.editingTask?.completed || false,
      createdAt: state.editingTask?.createdAt || now,
      updatedAt: now,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      category: task.category || DEFAULT_CATEGORIES[0].name,
      priority: task.priority || 'medium',
      notes: task.notes,
      recurrence: task.recurrence || 'none',
      recurrenceEndDate: task.recurrenceEndDate,
      subtasks: task.subtasks || [],
      timeEntries: task.timeEntries || [],
      sharedWith: task.sharedWith || [],
      status: task.status || 'pending',
      activeTracking: task.activeTracking,
    };

    if (state.editingTask) {
      dispatch({ type: 'UPDATE_TASK', payload: newTask });
    } else {
      dispatch({ type: 'ADD_TASK', payload: newTask });
    }

    handleClose();
  };

  const handleClose = () => {
    dispatch({ type: 'SET_EDITING_TASK', payload: null });
    onClose();
  };

  const handleStartTracking = (countdownDuration?: number) => {
    setTask((prevTask) => ({
      ...prevTask,
      status: 'in-progress',
      activeTracking: {
        id: 'current',
        start: new Date().toISOString(),
        countdownDuration,
      },
    }));
    if (countdownDuration !== undefined)
      setCountdownDuration(countdownDuration);
    setElapsedTime(0);
  };

  const handleStopTracking = (duration?: number) => {
    if (task.activeTracking) {
      const endTime = new Date();
      const calculatedDuration =
        duration ?? calculateDuration(new Date(task.activeTracking.start));
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        start: new Date(task.activeTracking.start),
        end: endTime,
        duration: calculatedDuration,
      };
      setTask((prevTask) => ({
        ...prevTask,
        timeEntries: [...(prevTask.timeEntries || []), newEntry],
        activeTracking: null,
      }));
      setCountdownDuration(null);
      setElapsedTime(0);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={state.editingTask ? 'Edit Task' : 'Create a New Task'}
      className='max-w-2xl w-full mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg'
    >
      <form onSubmit={handleSubmit} className='p-6 space-y-8'>
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Basic Information
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Task Title <span className='text-red-500'>*</span>
              </label>
              <Input
                value={task.title || ''}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                error={errors.title}
                required
                placeholder='e.g., Finish project report'
                className='w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Description
              </label>
              <textarea
                value={task.description || ''}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
                rows={3}
                placeholder='Add details about your task (optional)'
                className='w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all p-3 resize-y'
              />
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Categorization
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Priority
              </label>
              <Select
                value={task.priority}
                onChange={(e) =>
                  setTask({
                    ...task,
                    priority: e.target.value as 'high' | 'medium' | 'low',
                  })
                }
                options={PRIORITIES.map((p) => ({
                  value: p.value,
                  label: p.label,
                }))}
                className='w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Category
              </label>
              <Select
                value={task.category}
                onChange={(e) => setTask({ ...task, category: e.target.value })}
                options={state.categories.map((c) => ({
                  value: c.name,
                  label: c.name,
                }))}
                className='w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Status
              </label>
              <Select
                value={task.status}
                onChange={(e) =>
                  setTask({
                    ...task,
                    status: e.target.value as
                      | 'pending'
                      | 'in-progress'
                      | 'completed',
                  })
                }
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                ]}
                className='w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all'
              />
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Scheduling
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Due Date
              </label>
              <Input
                type='date'
                value={
                  task.dueDate instanceof Date
                    ? task.dueDate.toISOString().split('T')[0]
                    : task.dueDate || ''
                }
                onChange={(e) =>
                  setTask({
                    ...task,
                    dueDate: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
                className='w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Recurrence
              </label>
              <RecurrencePicker
                value={task.recurrence || 'none'}
                endDate={task.recurrenceEndDate}
                onChange={(recurrence, endDate) =>
                  setTask({ ...task, recurrence, recurrenceEndDate: endDate })
                }
              />
            </div>
          </div>
        </div>

        <div className='space-y-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Additional Details
          </h3>
          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Subtasks
              </label>
              <SubtaskList
                subtasks={task.subtasks || []}
                onSubtasksChange={(subtasks) => setTask({ ...task, subtasks })}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Time Tracking
              </label>
              <TimeTracker
                timeEntries={task.timeEntries || []}
                currentTracking={task.activeTracking ?? undefined}
                onStartTracking={handleStartTracking}
                onStopTracking={handleStopTracking}
                mode={trackingMode}
                onModeChange={setTrackingMode}
              />
              {task.activeTracking && (
                <div className='mt-2 text-sm text-blue-500 dark:text-blue-400'>
                  Current Tracking: {formatDuration(elapsedTime)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex justify-between items-center'>
          <Button
            variant='ghost'
            onClick={() => setIsShareModalOpen(true)}
            className='text-indigo-600 dark:text-indigo-400 border-indigo-500 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all'
          >
            Share Task
          </Button>
          <div className='flex space-x-3'>
            <Button
              variant='ghost'
              onClick={handleClose}
              type='button'
              className='px-4 py-2 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all'
            >
              {state.editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </div>
      </form>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        sharedWith={task.sharedWith || []}
        onShareChange={(sharedWith) => setTask({ ...task, sharedWith })}
      />
    </Modal>
  );
};

export default TodoForm;
