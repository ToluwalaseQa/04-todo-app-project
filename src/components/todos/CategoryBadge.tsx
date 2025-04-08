import React from 'react';
import { useTodoContext } from '@/context/TodoContext';

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const { state } = useTodoContext();
  const categoryInfo = state.categories.find((c) => c.name === category);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        categoryInfo?.color || 'bg-gray-100'
      } text-white`}
    >
      {category}
    </span>
  );
};

export default CategoryBadge;
