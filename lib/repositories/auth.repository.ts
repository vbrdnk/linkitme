import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import type {
  RepositoryResult,
  SessionData,
  SignInParams,
  SignInResult,
  SignUpParams,
  SignUpResult,
} from '@/types/repository';

import { createClient } from '@/lib/supabase/client';

/**
 * Maps Supabase auth errors to user-friendly error objects
 */
function mapAuthError(error: { message: string; code?: string }): { code: string; message: string } {
  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials') || message.includes('invalid_credentials')) {
    return {
      code: 'invalid_credentials',
      message: 'Invalid email or password',
    };
  }

  if (message.includes('email not confirmed')) {
    return {
      code: 'email_not_confirmed',
      message: 'Please verify your email before logging in',
    };
  }

  if (message.includes('user not found')) {
    return {
      code: 'user_not_found',
      message: 'No account found with this email',
    };
  }

  if (message.includes('weak password') || message.includes('password')) {
    return {
      code: 'weak_password',
      message: 'Password does not meet requirements',
    };
  }

  if (message.includes('already registered') || message.includes('email')) {
    return {
      code: 'email_taken',
      message: 'An account with this email already exists',
    };
  }

  if (message.includes('rate limit') || message.includes('too many')) {
    return {
      code: 'rate_limit_exceeded',
      message: 'Too many attempts. Please try again later.',
    };
  }

  return {
    code: 'unknown',
    message: error.message || 'An unexpected error occurred',
  };
}

/**
 * Auth repository for handling authentication operations
 */
export const authRepository = {
  /**
   * Signs up a new user with email, password, and username
   */
  async signUp(params: SignUpParams): Promise<RepositoryResult<SignUpResult>> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          username: params.username,
          display_name: params.displayName ?? params.username,
        },
      },
    });

    if (error) {
      return { success: false, error: mapAuthError(error) };
    }

    if (!data.user) {
      return {
        success: false,
        error: { code: 'unknown', message: 'Failed to create user' },
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  },

  /**
   * Signs in a user with email and password
   */
  async signIn(params: SignInParams): Promise<RepositoryResult<SignInResult>> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    });

    if (error) {
      return { success: false, error: mapAuthError(error) };
    }

    if (!data.user || !data.session) {
      return {
        success: false,
        error: { code: 'unknown', message: 'Failed to sign in' },
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  },

  /**
   * Signs out the current user
   */
  async signOut(): Promise<RepositoryResult<void>> {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error: mapAuthError(error) };
    }

    return { success: true, data: undefined };
  },

  /**
   * Sends a password reset email
   */
  async resetPasswordForEmail(
    email: string,
    redirectTo: string
  ): Promise<RepositoryResult<void>> {
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      return { success: false, error: mapAuthError(error) };
    }

    return { success: true, data: undefined };
  },

  /**
   * Gets the current session
   */
  async getSession(): Promise<RepositoryResult<SessionData>> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return { success: false, error: mapAuthError(error) };
    }

    if (!data.session) {
      return { success: true, data: null };
    }

    return {
      success: true,
      data: {
        user: data.session.user,
        session: data.session,
      },
    };
  },

  /**
   * Subscribes to auth state changes
   * Returns an unsubscribe function
   */
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ): () => void {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);

    return () => subscription.unsubscribe();
  },
};
