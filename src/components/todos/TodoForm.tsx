'use client';

import React, { useState, useEffect } from 'react';
import { Task, TimeEntry } from '@/types/todo';
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
    activeTracking: null, // New field to store active tracking
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [trackingMode, setTrackingMode] = useState<'elapsed' | 'countdown'>(
    'elapsed'
  );
  const [countdownDuration, setCountdownDuration] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (!isOpen) {
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
      setErrors({});
      return;
    }

    if (state.editingTask) {
      setTask({
        ...state.editingTask,
        activeTracking: state.editingTask.activeTracking || null,
      });
      setTrackingMode(
        state.editingTask.activeTracking?.countdownDuration
          ? 'countdown'
          : 'elapsed'
      );
      setCountdownDuration(
        state.editingTask.activeTracking?.countdownDuration || null
      );
    } else {
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
    }
  }, [state.editingTask, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!task.title) newErrors.title = 'Title is required';
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
      activeTracking: {
        id: 'current',
        start: new Date(),
        countdownDuration,
      },
    }));
    if (countdownDuration) {
      setCountdownDuration(countdownDuration);
    }
  };

  const handleStopTracking = (duration: number) => {
    if (task.activeTracking) {
      const endTime = new Date();
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        start: task.activeTracking.start,
        end: endTime,
        duration,
      };
      setTask((prevTask) => ({
        ...prevTask,
        timeEntries: [...(prevTask.timeEntries || []), newEntry],
        activeTracking: null,
      }));
      setCountdownDuration(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={state.editingTask ? 'Edit Task' : 'Add New Task'}
      className='max-w-2xl w-full mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg'
    >
      <form onSubmit={handleSubmit} className='p-6 space-y-6'>
        <div className='space-y-2'>
          <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200'>
            Task Title
          </label>
          <Input
            value={task.title || ''}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            error={errors.title}
            required
            placeholder='Enter task title'
            className='w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200'>
            Description
          </label>
          <textarea
            value={task.description || ''}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            rows={4}
            placeholder='Add some details about your task...'
            className='w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm p-3 resize-y'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200'>
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
          <div className='space-y-2'>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200'>
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
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200'>
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
                dueDate: e.target.value ? new Date(e.target.value) : undefined,
              })
            }
            className='w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200'>
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
            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200'>
                Subtasks
              </label>
              <SubtaskList
                subtasks={task.subtasks || []}
                onSubtasksChange={(subtasks) => setTask({ ...task, subtasks })}
              />
            </div>
          </div>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-gray-700 dark:text-gray-200'>
                Time Tracking
              </label>
              <TimeTracker
                timeEntries={task.timeEntries || []}
                currentTracking={task.activeTracking}
                onStartTracking={handleStartTracking}
                onStopTracking={handleStopTracking}
                mode={trackingMode}
                onModeChange={setTrackingMode}
              />
            </div>
            <Button
              variant='ghost'
              onClick={() => setIsShareModalOpen(true)}
              className='w-full border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-gray-700 transition-all'
            >
              Share Task
            </Button>
          </div>
        </div>

        <div className='mt-6 flex justify-end space-x-3'>
          <Button
            variant='ghost'
            onClick={handleClose}
            type='button'
            className='px-4 py-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            className='px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all'
          >
            {state.editingTask ? 'Update Task' : 'Add Task'}
          </Button>
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
