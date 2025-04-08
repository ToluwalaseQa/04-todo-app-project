import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, className, ...props }) => {
  return (
    <label className='flex items-center space-x-2'>
      <input
        type='checkbox'
        className={twMerge(
          'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700',
          className
        )}
        {...props}
      />
      {label && (
        <span className='text-gray-700 dark:text-gray-300'>{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
