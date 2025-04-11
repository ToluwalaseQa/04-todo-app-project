import { useMemo } from 'react';
import { useTodoContext } from '@/context/TodoContext';
import { Task } from '@/types/todo';
import { matchesFilters } from '@/lib/taskUtils';

export function useFilteredAndSortedTasks(): Task[] {
  const { state } = useTodoContext();
  const { tasks, filterOptions, sortOption } = state;

  return useMemo(() => {
    // Step 1: Apply filters to the raw tasks
    const filtered = tasks.filter((task) =>
      matchesFilters(task, filterOptions)
    );

    // Step 2: Only sort if sortOption is explicitly set and not 'none'
    if (sortOption && sortOption !== 'none') {
      const sorted = [...filtered];
      switch (sortOption) {
        case 'newest':
          return sorted.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'oldest':
          return sorted.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case 'dueDate':
          return sorted.sort((a, b) => {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return (
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );
          });
        case 'priority':
          const priorities = { high: 0, medium: 1, low: 2 };
          return sorted.sort(
            (a, b) => priorities[a.priority] - priorities[b.priority]
          );
        default:
          return filtered; // Fallback to filtered order (shouldn’t hit this with proper typing)
      }
    }

    // Step 3: Return filtered tasks in their raw order if no sorting
    return filtered;
  }, [tasks, filterOptions, sortOption]);
}
