'use client';

import Select from '../ui/Select';
import Input from '../ui/Input';
import { Recurrence } from '@/types/todo';

interface RecurrencePickerProps {
  value: Recurrence;
  endDate?: Date;
  onChange: (recurrence: Recurrence, endDate?: Date) => void;
}

// Define options without `as const` to avoid readonly type
const recurrenceOptions: { value: Recurrence; label: string }[] = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const RecurrencePicker: React.FC<RecurrencePickerProps> = ({
  value,
  endDate,
  onChange,
}) => {
  return (
    <div className='space-y-2'>
      <Select
        label='Recurrence'
        value={value}
        onChange={(e) => onChange(e.target.value as Recurrence, endDate)}
        options={recurrenceOptions}
        className='w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all'
      />
      {value !== 'none' && (
        <Input
          label='Ends on'
          type='date'
          value={endDate ? new Date(endDate).toISOString().split('T')[0] : ''}
          onChange={(e) =>
            onChange(
              value,
              e.target.value ? new Date(e.target.value) : undefined
            )
          }
          className='w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all'
        />
      )}
    </div>
  );
};
