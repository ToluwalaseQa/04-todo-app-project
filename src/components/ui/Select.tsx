import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className,
  ...props
}) => {
  return (
    <div className='w-full'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
          {label}
        </label>
      )}
      <select
        className={twMerge(
          'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default Select;
