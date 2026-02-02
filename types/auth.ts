import type { User } from '@supabase/supabase-js';

import type { Tables } from './database';

/** User profile from the profiles table */
export type Profile = Tables<'profiles'>;

/** Auth user with associated profile */
export type AuthUser = {
  user: User;
  profile: Profile | null;
};

/** Auth context state */
export type AuthState = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

/** Login form values */
export type LoginFormValues = {
  email: string;
  password: string;
};

/** Signup form values */
export type SignupFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/** Forgot password form values */
export type ForgotPasswordFormValues = {
  email: string;
};

/** Auth error codes */
export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'user_not_found'
  | 'weak_password'
  | 'email_taken'
  | 'username_taken'
  | 'rate_limit_exceeded'
  | 'unknown';

/** Auth error with code and message */
export type AuthError = {
  code: AuthErrorCode;
  message: string;
};

/**
 * Maps Supabase auth errors to user-friendly error objects
 */
export function mapAuthError(error: { message: string; code?: string }): AuthError {
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
