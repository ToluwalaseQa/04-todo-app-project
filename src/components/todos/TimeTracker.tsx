'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { PlayIcon, StopIcon } from '@heroicons/react/24/outline';
import { formatDuration, calculateDuration } from '@/lib/utils';
import { TimeEntry } from '@/types/todo';
import Input from '../ui/Input';

interface TimeTracking {
  id: string;
  start: string;
  countdownDuration?: number;
}

interface TimeTrackerProps {
  timeEntries: TimeEntry[];
  onStartTracking: (countdownDuration?: number) => void;
  onStopTracking: (duration: number) => void;
  currentTracking?: TimeTracking; // ← Change this
  mode?: 'elapsed' | 'countdown';
  onModeChange?: (mode: 'elapsed' | 'countdown') => void;
  setCountdownDuration?: (duration: number) => void;
}


export const TimeTracker: React.FC<TimeTrackerProps> = ({
  timeEntries,
  onStartTracking,
  onStopTracking,
  currentTracking,
  mode = 'elapsed',
  onModeChange,
  setCountdownDuration,
}) => {
  const [duration, setDuration] = useState(0);
  const [countdownInput, setCountdownInput] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentTracking) {
      interval = setInterval(() => {
        if (mode === 'elapsed') {
          setDuration(calculateDuration(new Date(currentTracking.start)));
        } else if (mode === 'countdown' && currentTracking.countdownDuration) {
          const elapsed = calculateDuration(new Date(currentTracking.start));
          const remaining = currentTracking.countdownDuration - elapsed;
          setDuration(remaining > 0 ? remaining : 0);
          if (remaining <= 0) {
            onStopTracking(currentTracking.countdownDuration); // Auto-stop when countdown reaches 0
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentTracking, mode, onStopTracking]);

  const totalTracked = timeEntries.reduce((total, entry) => {
    if (entry.duration) return total + entry.duration;
    return total;
  }, 0);

  const handleStart = () => {
    if (mode === 'countdown') {
      const seconds = parseInt(countdownInput, 10);
      if (!isNaN(seconds) && seconds > 0) {
        onStartTracking(seconds);
        setCountdownInput('');
      } else {
        alert('Please enter a valid countdown duration in seconds');
      }
    } else {
      onStartTracking();
    }
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <div>
          <span className='text-sm font-medium'>Total tracked: </span>
          <span className='font-mono'>{formatDuration(totalTracked)}</span>
        </div>
        <div className='flex items-center space-x-2'>
          <select
            value={mode}
            onChange={(e) =>
              onModeChange?.(e.target.value as 'elapsed' | 'countdown')
            }
            className='rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
          >
            <option value='elapsed'>Elapsed Time</option>
            <option value='countdown'>Countdown</option>
          </select>
          {currentTracking ? (
            <Button variant='danger' onClick={() => onStopTracking(duration)}>
              <StopIcon className='h-4 w-4 mr-1' />
              Stop ({formatDuration(duration)})
            </Button>
          ) : (
            <Button
              onClick={handleStart}
              disabled={mode === 'countdown' && !countdownInput}
            >
              <PlayIcon className='h-4 w-4 mr-1' />
              Start
            </Button>
          )}
        </div>
      </div>
      {mode === 'countdown' && !currentTracking && (
        <Input
          type='number'
          value={countdownInput}
          onChange={(e) => setCountdownInput(e.target.value)}
          placeholder='Enter countdown duration (seconds)'
          className='w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
        />
      )}
      {timeEntries.length > 0 && (
        <div className='text-sm space-y-1'>
          {timeEntries.map((entry) => (
            <div key={entry.id} className='flex justify-between'>
              <span>
                {new Date(entry.start).toLocaleTimeString()} -{' '}
                {entry.end ? new Date(entry.end).toLocaleTimeString() : ''}
              </span>
              <span className='font-mono'>
                {formatDuration(entry.duration || 0)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
