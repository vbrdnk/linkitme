import { useCallback, useEffect, useRef, useState } from 'react';

import type { CheckUsernameResponse, UsernameState } from '@/types/landing';

import { validateUsername } from '@/lib/validation';

const DEBOUNCE_DELAY = 500; // ms

/**
 * Custom hook for username validation and availability checking
 * Features:
 * - Real-time validation
 * - Debounced API calls
 * - Loading states
 * - Error handling
 */
export function useUsernameCheck() {
  const [state, setState] = useState<UsernameState>({
    value: '',
    isValid: false,
    isChecking: false,
    isAvailable: null,
    error: null,
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Check username availability via API
   */
  const checkAvailability = useCallback(async (username: string) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      isChecking: true,
      isAvailable: null,
      error: null,
    }));

    try {
      const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`, {
        signal: abortControllerRef.current.signal,
      });

      const data: CheckUsernameResponse = await response.json();

      if (!response.ok) {
        setState(prev => ({
          ...prev,
          isChecking: false,
          isAvailable: false,
          error: data.message || 'Unable to check availability',
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        isChecking: false,
        isAvailable: data.available,
        error: data.available ? null : data.message || 'Username is taken',
      }));
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      setState(prev => ({
        ...prev,
        isChecking: false,
        isAvailable: false,
        error: 'Unable to check availability. Please try again.',
      }));
    }
  }, []);

  /**
   * Handle username input change
   */
  const handleUsernameChange = useCallback(
    (username: string) => {
      // Clear any pending debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Update value immediately
      setState(prev => ({
        ...prev,
        value: username,
        isAvailable: null,
        error: null,
      }));

      // Validate format
      const validation = validateUsername(username);

      if (!validation.isValid) {
        setState(prev => ({
          ...prev,
          isValid: false,
          isAvailable: null,
          error: validation.error,
        }));
        return;
      }

      // Valid format - mark as valid and debounce API call
      setState(prev => ({
        ...prev,
        isValid: true,
        error: null,
      }));

      // Debounce the availability check
      debounceTimerRef.current = setTimeout(() => {
        checkAvailability(username);
      }, DEBOUNCE_DELAY);
    },
    [checkAvailability]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      value: '',
      isValid: false,
      isChecking: false,
      isAvailable: null,
      error: null,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    handleUsernameChange,
    reset,
  };
}
