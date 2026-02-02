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

