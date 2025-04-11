import { Task, FilterOptions } from '@/types/todo';

export function matchesFilters(task: Task, filters: FilterOptions): boolean {
  const matchesStatus =
    filters.status === 'all' ||
    (filters.status === 'active' && !task.completed) ||
    (filters.status === 'completed' && task.completed);

  const matchesCategory =
    filters.category === 'all' || task.category === filters.category;
  const matchesPriority =
    filters.priority === 'all' || task.priority === filters.priority;

  const matchesSearch =
    filters.search === '' ||
    task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    (task.description?.toLowerCase().includes(filters.search.toLowerCase()) ??
      false);

  return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
}
