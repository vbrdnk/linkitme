'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authRepository } from '@/lib/repositories';

import { sessionKeys } from '@/hooks/queries/useSession';
import { profileKeys } from '@/hooks/queries/useProfile';

type UseSignOutOptions = {
  onSuccess?: () => void;
  onError?: (error: { code: string; message: string }) => void;
};

/**
 * Hook for signing out the current user
 */
export function useSignOut(options?: UseSignOutOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await authRepository.signOut();

      if (!result.success) {
        throw result.error;
      }

      return result.data;
    },
    onSuccess: () => {
      // Clear all cached queries
      queryClient.removeQueries({ queryKey: sessionKeys.all });
      queryClient.removeQueries({ queryKey: profileKeys.all });

      // Redirect to home
      router.push('/');
      router.refresh();

      options?.onSuccess?.();
    },
    onError: (error: { code: string; message: string }) => {
      options?.onError?.(error);
    },
  });
}
