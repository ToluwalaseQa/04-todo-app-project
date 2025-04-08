'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTodos } from '@/hooks/useTodos';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#601EF9', '#9ACD32']; // Green for Completed, Yellow for In Progress, Orange for Pending

export const TaskCharts = () => {
  const { tasks } = useTodos();

  const categoryData = tasks.reduce((acc, task) => {
    const existing = acc.find((item) => item.name === task.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: task.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const priorityData = [
    { name: 'High', value: tasks.filter((t) => t.priority === 'high').length },
    {
      name: 'Medium',
      value: tasks.filter((t) => t.priority === 'medium').length,
    },
    { name: 'Low', value: tasks.filter((t) => t.priority === 'low').length },
  ];

  const statusData = [
    {
      name: 'Pending',
      value: tasks.filter((t) => t.status === 'pending').length,
    },
    {
      name: 'In Progress',
      value: tasks.filter((t) => t.status === 'in-progress').length,
    },
    {
      name: 'Completed',
      value: tasks.filter((t) => t.status === 'completed').length,
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
      <div className='bg-white p-4 rounded-lg shadow dark:bg-gray-800'>
        <h3 className='text-lg font-medium mb-4 text-gray-800 dark:text-gray-200'>
          Tasks by Category
        </h3>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx='50%'
              cy='50%'
              labelLine={false}
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'
              nameKey='name'
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className='bg-white p-4 rounded-lg shadow dark:bg-gray-800'>
        <h3 className='text-lg font-medium mb-4 text-gray-800 dark:text-gray-200'>
          Tasks by Status
        </h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='value'>
              {statusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskCharts;