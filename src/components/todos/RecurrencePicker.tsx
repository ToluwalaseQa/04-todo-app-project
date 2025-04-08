'use client';

import  Select  from '../ui/Select';
import  Input  from '../ui/Input';
import { Recurrence } from '@/types/todo';

interface RecurrencePickerProps {
  value: Recurrence;
  endDate?: Date;
  onChange: (recurrence: Recurrence, endDate?: Date) => void;
}

const recurrenceOptions = [
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
        />
      )}
    </div>
  );
};
