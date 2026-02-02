import Link from 'next/link';

import type { Metadata } from 'next';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Log In - LinkItMe',
  description: 'Log in to your LinkItMe account',
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Link
          href="/forgot-password"
          className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
        >
          Forgot your password?
        </Link>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-slate-900 hover:underline dark:text-slate-100"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
