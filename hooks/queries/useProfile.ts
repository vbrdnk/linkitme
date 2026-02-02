'use client';

import { useQuery } from '@tanstack/react-query';

import { profileRepository } from '@/lib/repositories';

/** Query keys for profile-related queries */
export const profileKeys = {
  all: ['profile'] as const,
  byId: (id: string) => [...profileKeys.all, 'id', id] as const,
  byUsername: (username: string) => [...profileKeys.all, 'username', username] as const,
};

/**
 * Hook for fetching a profile by user ID
 */
export function useProfileById(userId: string | null | undefined) {
  return useQuery({
    queryKey: profileKeys.byId(userId ?? ''),
    queryFn: async () => {
      if (!userId) return null;

      const result = await profileRepository.getById(userId);

      if (!result.success) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    enabled: !!userId,
  });
}

/**
 * Hook for fetching a profile by username
 */
export function useProfileByUsername(username: string | null | undefined) {
  return useQuery({
    queryKey: profileKeys.byUsername(username ?? ''),
    queryFn: async () => {
      if (!username) return null;

      const result = await profileRepository.getByUsername(username);

      if (!result.success) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    enabled: !!username,
  });
}
