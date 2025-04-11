'use client';

import React from 'react';
import TodoCard from './TodoCard';
import Button from '../ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useTodoContext } from '@/context/TodoContext';
import { Task } from '@/types/todo';
import { useFilteredAndSortedTasks } from '@/hooks/useFilteredAndSortedTasks';

interface TodoListProps {
  onAddTask: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ onAddTask }) => {
  const { state, dispatch } = useTodoContext();
  const filteredTasks = useFilteredAndSortedTasks();

  const { handleDragStart, handleDragOver, handleDrop } = useDragAndDrop(
    state.tasks,
    (newTasks: Task[]) => {
      console.log(
        'Dispatching REORDER_TASKS with:',
        newTasks.map((t) => t.id)
      );
      dispatch({ type: 'REORDER_TASKS', payload: newTasks });
    },
    {
      setDraggedId: (id) => setDraggedId(id),
      setHoveredId: (id) => setHoveredId(id),
    }
  );

  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <div className='mt-6'>
      <div className='flex justify-end mb-4'>
        <Button onClick={onAddTask} className='flex items-center'>
          <PlusIcon className='h-4 w-4 mr-1' />
          Add Task
        </Button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className='text-center py-12'>
          <h3 className='text-lg font-medium text-gray-500 dark:text-gray-400'>
            No tasks found
          </h3>
          <p className='mt-1 text-sm text-gray-400 dark:text-gray-500'>
            Try adjusting your filters or add a new task
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {filteredTasks.map((task) => (
            <TodoCard
              key={task.id}
              task={task}
              index={state.tasks.findIndex((t) => t.id === task.id)}
              isDragged={task.id === draggedId}
              isHovered={task.id === hoveredId}
              onDragStart={handleDragStart}
              onDragOver={(e) => handleDragOver(e, task.id)}
              onDrop={(e) => handleDrop(e, task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
