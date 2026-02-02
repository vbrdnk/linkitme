'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { SignUpParams } from '@/types/repository';

import { authRepository } from '@/lib/repositories';

import { sessionKeys } from '@/hooks/queries/useSession';

type UseSignUpOptions = {
  onSuccess?: () => void;
  onError?: (error: { code: string; message: string }) => void;
};

/**
 * Hook for signing up a new user
 */
export function useSignUp(options?: UseSignUpOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SignUpParams) => {
      const result = await authRepository.signUp(params);

      if (!result.success) {
        throw result.error;
      }

      return result.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate session query
      queryClient.invalidateQueries({ queryKey: sessionKeys.current() });

      if (data.session) {
        // User is signed in, redirect to their profile
        router.push(`/${variables.username}`);
        router.refresh();
      } else {
        // Email confirmation required
        router.push(
          `/login?message=check-email&email=${encodeURIComponent(variables.email)}`
        );
      }

      options?.onSuccess?.();
    },
    onError: (error: { code: string; message: string }) => {
      options?.onError?.(error);
    },
  });
}
