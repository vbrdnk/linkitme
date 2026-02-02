'use client';

import { useEffect } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { authRepository } from '@/lib/repositories';

/** Query keys for session-related queries */
export const sessionKeys = {
  all: ['session'] as const,
  current: () => [...sessionKeys.all, 'current'] as const,
};

/**
 * Hook for managing the current auth session with React Query.
 * Automatically subscribes to auth state changes and invalidates the query.
 */
export function useSession() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: sessionKeys.current(),
    queryFn: async () => {
      const result = await authRepository.getSession();

      if (!result.success) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    staleTime: Infinity, // Session is managed by subscription, not polling
    gcTime: Infinity,
  });

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authRepository.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.current() });
    });

    return unsubscribe;
  }, [queryClient]);

  return {
    user: query.data?.user ?? null,
    session: query.data?.session ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data?.user,
    error: query.error,
  };
}
