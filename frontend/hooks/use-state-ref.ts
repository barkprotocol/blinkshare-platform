import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook to combine useState and useRef for accessing state and persisting it.
 * @param initialValue - The initial state value.
 * @returns A tuple with the current state, a setter function, and a ref holding the current state.
 */
export function useStateRef<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const stateRef = useRef<T>(initialValue);

  // Sync the stateRef with the current state
  const setStateWithRef = useCallback(
    (value: T | ((prevState: T) => T)) => {
      setState((prevState) => {
        const newState = typeof value === 'function' ? (value as any)(prevState) : value;
        stateRef.current = newState;
        return newState;
      });
    },
    []
  );

  return [state, setStateWithRef, stateRef] as const;
}
