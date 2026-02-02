'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Check, Eye, EyeOff, Loader2, X } from 'lucide-react';

import { mapAuthError } from '@/types/auth';

import { createClient } from '@/lib/supabase/client';
import { validateConfirmPassword, validateEmail, validatePassword } from '@/lib/validation';

import { useUsernameCheck } from '@/hooks/useUsernameCheck';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SignupFormProps = {
  claimedUsername?: string;
};

export function SignupForm({ claimedUsername }: SignupFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const {
    value: username,
    isValid: isUsernameValid,
    isChecking: isCheckingUsername,
    isAvailable: isUsernameAvailable,
    error: usernameError,
    handleUsernameChange,
  } = useUsernameCheck();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Pre-fill username if provided via URL param
  useEffect(() => {
    if (claimedUsername) {
      handleUsernameChange(claimedUsername);
    }
  }, [claimedUsername, handleUsernameChange]);

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string; confirmPassword?: string } = {};

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error || 'Invalid email';
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error || 'Invalid password';
    }

    const confirmValidation = validateConfirmPassword(password, confirmPassword);
    if (!confirmValidation.isValid) {
      errors.confirmPassword = confirmValidation.error || 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid =
    isUsernameValid &&
    isUsernameAvailable === true &&
    email.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check username is available
    if (!isUsernameValid || !isUsernameAvailable) {
      setError('Please choose an available username');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            display_name: username, // Default display name to username
          },
        },
      });

      if (signUpError) {
        const authError = mapAuthError(signUpError);
        setError(authError.message);
        return;
      }

      if (data.user) {
        // If email confirmation is required, the session might be null
        if (data.session) {
          // User is signed in, redirect to their profile
          router.push(`/${username}`);
          router.refresh();
        } else {
          // Email confirmation required
          router.push(`/login?message=check-email&email=${encodeURIComponent(email)}`);
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUsernameStatus = () => {
    if (!username) return null;
    if (isCheckingUsername) {
      return <Loader2 className="h-4 w-4 animate-spin text-slate-400" />;
    }
    if (isUsernameAvailable === true) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (isUsernameAvailable === false || usernameError) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Username field */}
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-sm text-slate-400">linkitme.com/</span>
          </div>
          <Input
            id="username"
            type="text"
            placeholder="yourname"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            aria-invalid={!!usernameError}
            disabled={isSubmitting}
            className="pl-[7.5rem] pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {getUsernameStatus()}
          </div>
        </div>
        {usernameError && (
          <p className="text-sm text-red-500 dark:text-red-400">{usernameError}</p>
        )}
        {isUsernameAvailable === true && (
          <p className="text-sm text-green-500 dark:text-green-400">Username is available!</p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) {
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          aria-invalid={!!fieldErrors.email}
          disabled={isSubmitting}
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-500 dark:text-red-400">{fieldErrors.email}</p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            aria-invalid={!!fieldErrors.password}
            disabled={isSubmitting}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-sm text-red-500 dark:text-red-400">{fieldErrors.password}</p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-400">
          At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        </p>
      </div>

      {/* Confirm password field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword) {
                setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }
            }}
            aria-invalid={!!fieldErrors.confirmPassword}
            disabled={isSubmitting}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {fieldErrors.confirmPassword && (
          <p className="text-sm text-red-500 dark:text-red-400">{fieldErrors.confirmPassword}</p>
        )}
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full" disabled={isSubmitting || !isFormValid}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </Button>

      {/* Terms notice */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        By signing up, you agree to our{' '}
        <a href="/terms" className="underline hover:text-slate-700 dark:hover:text-slate-300">
          Terms
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-slate-700 dark:hover:text-slate-300">
          Privacy Policy
        </a>
      </p>
    </form>
  );
}
