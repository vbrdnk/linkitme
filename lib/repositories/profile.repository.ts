import type { Profile } from '@/types/auth';
import type { ProfileUpdateParams, RepositoryResult } from '@/types/repository';

import { createClient } from '@/lib/supabase/client';

/**
 * Profile repository for handling profile operations
 */
export const profileRepository = {
  /**
   * Gets a profile by user ID
   */
  async getById(userId: string): Promise<RepositoryResult<Profile | null>> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // PGRST116 = no rows found, which is valid (null profile)
      if (error.code === 'PGRST116') {
        return { success: true, data: null };
      }

      return {
        success: false,
        error: { code: error.code, message: error.message },
      };
    }

    return { success: true, data };
  },

  /**
   * Gets a profile by username
   */
  async getByUsername(username: string): Promise<RepositoryResult<Profile | null>> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      // PGRST116 = no rows found
      if (error.code === 'PGRST116') {
        return { success: true, data: null };
      }

      return {
        success: false,
        error: { code: error.code, message: error.message },
      };
    }

    return { success: true, data };
  },

  /**
   * Updates a user's profile
   */
  async update(
    userId: string,
    updates: ProfileUpdateParams
  ): Promise<RepositoryResult<Profile>> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { code: error.code, message: error.message },
      };
    }

    return { success: true, data };
  },
};
