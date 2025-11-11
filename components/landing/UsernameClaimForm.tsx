'use client';

import { useUsernameCheck } from '@/hooks/useUsernameCheck';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Username claim form with real-time validation and availability check
 * Features:
 * - Real-time format validation
 * - Debounced availability check
 * - Visual feedback (icons, colors)
 * - Disabled state until valid and available
 */
export function UsernameClaimForm() {
  const { value, isValid, isChecking, isAvailable, error, handleUsernameChange } =
    useUsernameCheck();

  const canSubmit = isValid && isAvailable === true && !isChecking;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      // TODO: Navigate to signup page with username pre-filled
      console.log('Claiming username:', value);
      alert(`Great! "${value}" is available. Redirecting to signup...`);
    }
  };

  // Determine input state styling
  const getInputClassName = () => {
    if (!value) return '';
    if (isChecking) return 'border-blue-500';
    if (error) return 'border-red-500 focus-visible:ring-red-500';
    if (isAvailable) return 'border-green-500 focus-visible:ring-green-500';
    return '';
  };

  // Status icon
  const getStatusIcon = () => {
    if (!value) return null;
    if (isChecking)
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" aria-label="Checking" />;
    if (error) return <XCircle className="h-5 w-5 text-red-500" aria-label="Error" />;
    if (isAvailable)
      return <CheckCircle2 className="h-5 w-5 text-green-500" aria-label="Available" />;
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-3">
        {/* Username input with prefix */}
        <div className="relative">
          <div className="flex items-center bg-background border rounded-lg shadow-lg overflow-hidden">
            {/* Domain prefix */}
            <div className="flex items-center px-4 py-3 bg-muted border-r">
              <span className="text-sm text-muted-foreground font-medium">linkitme/</span>
            </div>

            {/* Input field */}
            <div className="flex-1 relative ">
              <Input
                type="text"
                value={value}
                onChange={e => handleUsernameChange(e.target.value)}
                placeholder="yourname"
                className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10 ${getInputClassName()}`}
                aria-label="Username"
                aria-invalid={!!error}
                aria-describedby={error ? 'username-error' : undefined}
              />

              {/* Status icon */}
              {value && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">{getStatusIcon()}</div>
              )}
            </div>
          </div>

          {/* Error/success message */}
          {/* {value && (error || isAvailable) && ( */}
          {/*   <p */}
          {/*     id="username-error" */}
          {/*     className={`text-sm mt-2 ${error ? 'text-red-500' : 'text-green-500'}`} */}
          {/*     role={error ? 'alert' : 'status'} */}
          {/*   > */}
          {/*     {error || 'Username is available!'} */}
          {/*   </p> */}
          {/* )} */}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isChecking ? 'Checking...' : 'Claim your username'}
        </Button>
      </div>
    </form>
  );
}
