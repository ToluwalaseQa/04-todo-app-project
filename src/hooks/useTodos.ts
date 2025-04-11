import { useTodoContext } from '@/context/TodoContext';
import { Task, FilterOptions, SortOptions } from '@/types/todo';
import { useMemo } from 'react';

export const useTodos = () => {
  const { state } = useTodoContext();

  const filteredTasks = useMemo(() => {
    let tasks = [...state.tasks];

    // Filter by status
    if (state.filterOptions.status === 'active') {
      tasks = tasks.filter((task) => !task.completed);
    } else if (state.filterOptions.status === 'completed') {
      tasks = tasks.filter((task) => task.completed);
    }

    // Filter by category
    if (state.filterOptions.category !== 'all') {
      tasks = tasks.filter(
        (task) => task.category === state.filterOptions.category
      );
    }

    // Filter by priority
    if (state.filterOptions.priority !== 'all') {
      tasks = tasks.filter(
        (task) => task.priority === state.filterOptions.priority
      );
    }

    // Filter by due date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (state.filterOptions.dueDate === 'today') {
      tasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      });
    } else if (state.filterOptions.dueDate === 'week') {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      tasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextWeek;
      });
    } else if (state.filterOptions.dueDate === 'month') {
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      tasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextMonth;
      });
    }

    // Filter by search
    if (state.filterOptions.search) {
      const searchTerm = state.filterOptions.search.toLowerCase();
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm) ||
          (task.description &&
            task.description.toLowerCase().includes(searchTerm))
      );
    }

    // Sort tasks
    switch (state.sortOption) {
      case 'newest':
        tasks.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        tasks.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'dueDate':
        tasks.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        tasks.sort(
          (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
        );
        break;
    }

    return tasks;
  }, [state.tasks, state.filterOptions, state.sortOption]);

  return {
    tasks: state.tasks, // Raw tasks for reordering
    filteredTasks, // Filtered and sorted tasks
    categories: state.categories,
    filterOptions: state.filterOptions,
    sortOption: state.sortOption,
    editingTask: state.editingTask,
  };
};
