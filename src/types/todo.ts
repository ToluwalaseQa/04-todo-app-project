export type Priority = 'high' | 'medium' | 'low';
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';


export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface SharedWith {
  userId: string;
  email: string;
  permission: 'view' | 'edit';
}

export interface TimeEntry {
  id: string;
  start: Date;
  end: Date;
  duration: number;
}

interface TimeTracking {
  id: string;
  start: string;
  countdownDuration?: number;
}

interface TimeTrackerProps {
  timeEntries: TimeEntry[];
  onStartTracking: (countdownDuration?: number) => void;
  onStopTracking: (duration: number) => void;
  currentTracking?: TimeTracking; // ← Change this
  mode?: 'elapsed' | 'countdown';
  onModeChange?: (mode: 'elapsed' | 'countdown') => void;
  setCountdownDuration?: (duration: number) => void;
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
  recurrence?: Recurrence; // Changed from string to Recurrence
  recurrenceEndDate?: Date;
  subtasks?: Subtask[];
  timeEntries?: TimeEntry[];
  sharedWith?: SharedWith[];
  status: TaskStatus;
  activeTracking: TimeTracking | null | undefined; // Fixed typo from Undefined to null
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

export type SortOptions = 'newest' | 'oldest' | 'dueDate' | 'priority' | 'none';
