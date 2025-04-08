// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;

      const item = window.localStorage.getItem(key);
      // For theme, we want to return the string directly, not parse as JSON
      return item ? (key === 'theme' ? item : JSON.parse(item)) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        // For theme, store as plain string
        window.localStorage.setItem(
          key,
          key === 'theme' ? String(value) : JSON.stringify(value)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
