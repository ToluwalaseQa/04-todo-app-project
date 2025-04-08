// components/TodoFilters.tsx
'use client';

import React from 'react';
import { useTodoContext } from '@/context/TodoContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { PRIORITIES } from '@/constants/priorities';
import { Filter } from 'lucide-react'; 

export const TodoFilters = () => {
  const { state, dispatch } = useTodoContext();

  const handleFilterChange = (key: string, value: string) => {
    dispatch({
      type: 'SET_FILTER_OPTIONS',
      payload: { [key]: value },
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('search', e.target.value);
  };

  return (
    <div className='mb-6 bg-white p-4 rounded-lg shadow dark:bg-gray-800'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-medium flex items-center'>
          <Filter className='h-5 w-5 mr-2' />
          Filters
        </h3>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
        {/* Status Filter */}
        <Select
          label='Status'
          value={state.filterOptions.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          options={[
            { value: 'all', label: 'All Tasks' },
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
          ]}
        />

        {/* Priority Filter */}
        <Select
          label='Priority'
          value={state.filterOptions.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          options={[
            { value: 'all', label: 'All Priorities' },
            ...PRIORITIES.map((p) => ({
              value: p.value,
              label: p.label,
            })),
          ]}
        />

        {/* Category Filter */}
        <Select
          label='Category'
          value={state.filterOptions.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          options={[
            { value: 'all', label: 'All Categories' },
            ...state.categories.map((c) => ({
              value: c.name,
              label: c.name,
            })),
          ]}
        />

        {/* Due Date Filter */}
        <Select
          label='Due Date'
          value={state.filterOptions.dueDate}
          onChange={(e) => handleFilterChange('dueDate', e.target.value)}
          options={[
            { value: 'all', label: 'All Dates' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
          ]}
        />

        {/* Search Input */}
        <Input
          label='Search'
          value={state.filterOptions.search}
          onChange={handleSearchChange}
          placeholder='Search tasks...'
        />
      </div>
    </div>
  );
};

export default TodoFilters;
