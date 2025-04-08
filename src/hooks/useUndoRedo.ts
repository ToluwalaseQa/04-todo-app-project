// src/hooks/useUndoRedo.ts
import { useState, useCallback } from 'react';

export const useUndoRedo = <T>(initialState: T) => {
  const [state, setState] = useState({
    past: [] as T[],
    present: initialState,
    future: [] as T[],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return undefined;

    const newPast = state.past.slice(0, -1);
    const newPresent = state.past[state.past.length - 1];
    const newFuture = [state.present, ...state.future];

    setState({
      past: newPast,
      present: newPresent,
      future: newFuture,
    });

    return newPresent;
  }, [canUndo, state.past, state.present, state.future]);

  const redo = useCallback(() => {
    if (!canRedo) return undefined;

    const newPast = [...state.past, state.present];
    const newPresent = state.future[0];
    const newFuture = state.future.slice(1);

    setState({
      past: newPast,
      present: newPresent,
      future: newFuture,
    });

    return newPresent;
  }, [canRedo, state.past, state.present, state.future]);

  const set = useCallback((newPresent: T) => {
    setState((prev) => ({
      past: [...prev.past, prev.present],
      present: newPresent,
      future: [],
    }));
  }, []);

  return {
    state: state.present,
    setState: set,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
