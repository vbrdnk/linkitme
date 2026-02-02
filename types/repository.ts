import type { Session, User } from '@supabase/supabase-js';

import type { Profile } from './auth';

/** Generic repository result type for success/error handling */
export type RepositoryResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

/** Parameters for signing up a new user */
export type SignUpParams = {
  email: string;
  password: string;
  username: string;
  displayName?: string;
};

/** Result of a successful signup */
export type SignUpResult = {
  user: User;
  session: Session | null;
};

/** Parameters for signing in a user */
export type SignInParams = {
  email: string;
  password: string;
};

/** Result of a successful sign in */
export type SignInResult = {
  user: User;
  session: Session;
};

/** Current session data */
export type SessionData = {
  user: User;
  session: Session;
} | null;

/** Profile update parameters */
export type ProfileUpdateParams = Partial<
  Pick<Profile, 'username' | 'display_name' | 'bio' | 'avatar_url'>
>;
