'use client';

import { useMutation } from '@tanstack/react-query';

import { authRepository } from '@/lib/repositories';

type ResetPasswordParams = {
  email: string;
  redirectTo: string;
};

type UseResetPasswordOptions = {
  onSuccess?: () => void;
  onError?: (error: { code: string; message: string }) => void;
};

/**
 * Hook for sending a password reset email
 */
export function useResetPassword(options?: UseResetPasswordOptions) {
  return useMutation({
    mutationFn: async (params: ResetPasswordParams) => {
      const result = await authRepository.resetPasswordForEmail(
        params.email,
        params.redirectTo
      );

      if (!result.success) {
        throw result.error;
      }

      return result.data;
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error: { code: string; message: string }) => {
      options?.onError?.(error);
    },
  });
}
