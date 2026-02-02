'use client';

import { createContext, useContext } from 'react';

import type { User } from '@supabase/supabase-js';

import type { AuthState, Profile } from '@/types/auth';

import { useSession, useProfileById } from '@/hooks/queries';
import { useSignOut } from '@/hooks/mutations';

type AuthContextValue = AuthState & {
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isLoading: isSessionLoading } = useSession();

  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useProfileById(user?.id);

  const signOutMutation = useSignOut();

  const signOut = async () => {
    await signOutMutation.mutateAsync();
  };

  const refreshProfile = async () => {
    if (user) {
      await refetchProfile();
    }
  };

  const isLoading = isSessionLoading || (!!user && isProfileLoading);

  const value: AuthContextValue = {
    user: user as User | null,
    profile: (profile ?? null) as Profile | null,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
