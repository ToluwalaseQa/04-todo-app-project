export type Priority = 'high' | 'medium' | 'low';
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// export interface TimeEntry {
//   id: string;
//   start: Date;
//   end?: Date;
//   duration?: number; // in minutes
// }

export interface SharedWith {
  userId: string;
  email: string;
  permission: 'view' | 'edit';
}

export interface TimeEntry {
  id: string;
  start: Date;
  end?: Date;
  duration?: number;
  countdownDuration?: number; // Optional for countdown mode
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  category: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  recurrence?: string;
  recurrenceEndDate?: Date;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  timeEntries?: TimeEntry[];
  sharedWith?: string[];
  status: 'pending' | 'completed';
  activeTracking?: TimeEntry | null; // New field for active tracking
}


export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type FilterOptions = {
  status: 'all' | 'active' | 'completed';
  category: string;
  priority: Priority | 'all';
  dueDate: 'all' | 'today' | 'week' | 'month';
  search: string;
};

export type SortOptions = 'newest' | 'oldest' | 'dueDate' | 'priority';