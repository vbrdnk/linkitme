'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { SignInParams } from '@/types/repository';

import { authRepository } from '@/lib/repositories';

import { sessionKeys } from '@/hooks/queries/useSession';

type UseSignInOptions = {
  onSuccess?: () => void;
  onError?: (error: { code: string; message: string }) => void;
};

/**
 * Hook for signing in a user
 */
export function useSignIn(options?: UseSignInOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SignInParams) => {
      const result = await authRepository.signIn(params);

      if (!result.success) {
        throw result.error;
      }

      return result.data;
    },
    onSuccess: (data) => {
      // Invalidate session query
      queryClient.invalidateQueries({ queryKey: sessionKeys.current() });

      // Redirect to user's profile
      const username = data.user.user_metadata?.username;
      router.push(username ? `/${username}` : '/');
      router.refresh();

      options?.onSuccess?.();
    },
    onError: (error: { code: string; message: string }) => {
      options?.onError?.(error);
    },
  });
}
