'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from 'react';
import { Task, Category, FilterOptions, SortOptions } from '@/types/todo';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useUndoRedo } from '@/hooks/useUndoRedo';

type TodoState = {
  tasks: Task[];
  categories: Category[];
  filterOptions: FilterOptions;
  sortOption: SortOptions;
  editingTask: Task | null;
};

type TodoAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_EDITING_TASK'; payload: Task | null }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_FILTER_OPTIONS'; payload: Partial<FilterOptions> }
  | { type: 'SET_SORT_OPTION'; payload: SortOptions }
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'LOAD_CATEGORIES'; payload: Category[] }
  | { type: 'REORDER_TASKS'; payload: Task[] }
  | { type: 'UNDO'; payload?: TodoState }
  | { type: 'REDO'; payload?: TodoState }
  | { type: 'SET_STATE'; payload: TodoState };

interface TodoContextType {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  canUndo: boolean;
  canRedo: boolean;
}

const initialState: TodoState = {
  tasks: [],
  categories: DEFAULT_CATEGORIES,
  filterOptions: {
    status: 'all',
    category: 'all',
    priority: 'all',
    dueDate: 'all',
    search: '',
  },
  sortOption: 'none',
  editingTask: null,
};

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    // TodoContext.tsx
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? {
                ...task,
                completed: !task.completed,
                status: !task.completed ? 'completed' : 'pending',
              }
            : task
        ),
      };
    case 'SET_EDITING_TASK':
      return { ...state, editingTask: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.id !== action.payload
        ),
      };
    case 'SET_FILTER_OPTIONS':
      return {
        ...state,
        filterOptions: { ...state.filterOptions, ...action.payload },
      };
    case 'SET_SORT_OPTION':
      return { ...state, sortOption: action.payload };
    case 'LOAD_TASKS':
      return { ...state, tasks: action.payload };
    case 'LOAD_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'REORDER_TASKS':
      console.log(
        'Context Reordered:',
        action.payload.map((t) => t.id)
      );
      return {
        ...state,
        tasks: [...action.payload],
      };
    case 'SET_STATE':
      return action.payload;
    default:
      return state;
  }
};

const TodoContext = createContext<TodoContextType>({
  state: initialState,
  dispatch: () => null,
  canUndo: false,
  canRedo: false,
});

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [storedTasks, setStoredTasks] = useLocalStorage<Task[]>('tasks', []);
  const [storedCategories, setStoredCategories] = useLocalStorage<Category[]>(
    'categories',
    DEFAULT_CATEGORIES
  );

  const [state, dispatch] = useReducer(todoReducer, {
    ...initialState,
    tasks: storedTasks,
    categories: storedCategories,
  });

  const {
    setState: setUndoRedoState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo({
    ...initialState,
    tasks: storedTasks,
    categories: storedCategories,
  });

  // Load initial data
  useEffect(() => {
    dispatch({ type: 'LOAD_TASKS', payload: storedTasks });
    dispatch({ type: 'LOAD_CATEGORIES', payload: storedCategories });
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save tasks to localStorage when they change
  useEffect(() => {
    setStoredTasks(state.tasks);
  }, [state.tasks, setStoredTasks]);

  // Save categories to localStorage when they change
  useEffect(() => {
    setStoredCategories(state.categories);
  }, [state.categories, setStoredCategories]);

  // Update undo/redo state when the entire state changes
  useEffect(() => {
    setUndoRedoState(state);
  }, [state, setUndoRedoState]);

  const dispatchWithUndoRedo = useCallback(
    (action: TodoAction) => {
      if (action.type === 'UNDO') {
        const previousState = undo();
        if (previousState) {
          dispatch({ type: 'SET_STATE', payload: previousState });
        }
      } else if (action.type === 'REDO') {
        const nextState = redo();
        if (nextState) {
          dispatch({ type: 'SET_STATE', payload: nextState });
        }
      } else {
        dispatch(action);
      }
    },
    [undo, redo]
  );

  return (
    <TodoContext.Provider
      value={{
        state,
        dispatch: dispatchWithUndoRedo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error('useTodoContext must be used within a TodoProvider');
  return context;
};
