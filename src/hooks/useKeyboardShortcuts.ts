import { useEffect } from 'react';

type Shortcut = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
};

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        if (
          e.key === shortcut.key &&
          (shortcut.ctrlKey === undefined || e.ctrlKey === shortcut.ctrlKey) &&
          (shortcut.shiftKey === undefined ||
            e.shiftKey === shortcut.shiftKey) &&
          (shortcut.altKey === undefined || e.altKey === shortcut.altKey)
        ) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};
