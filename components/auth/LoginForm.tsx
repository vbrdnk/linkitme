'use client';

import { useState } from 'react';

import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { validateEmail } from '@/lib/validation';

import { useSignIn } from '@/hooks/mutations';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const signInMutation = useSignIn();

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error || 'Invalid email';
    }

    // Only check if password is provided (don't validate strength for login)
    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    signInMutation.mutate({ email, password });
  };

  const error = signInMutation.error?.message ?? null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

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
          disabled={signInMutation.isPending}
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            aria-invalid={!!fieldErrors.password}
            disabled={signInMutation.isPending}
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
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full" disabled={signInMutation.isPending}>
        {signInMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          'Log in'
        )}
      </Button>
    </form>
  );
}
