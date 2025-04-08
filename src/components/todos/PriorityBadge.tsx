import React from 'react';
import { Priority } from '@/types/todo';
import { PRIORITIES } from '@/constants/priorities';

interface PriorityBadgeProps {
  priority: Priority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const priorityInfo = PRIORITIES.find((p) => p.value === priority);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        priorityInfo?.color || 'bg-gray-100'
      } text-white`}
    >
      {priorityInfo?.label || priority}
    </span>
  );
};

export default PriorityBadge;