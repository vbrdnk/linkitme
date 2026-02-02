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
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up - LinkItMe',
  description: 'Create your LinkItMe account',
};

type SignupPageProps = {
  searchParams: Promise<{ username?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { username } = await searchParams;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          {username
            ? `You're claiming linkitme.com/${username}`
            : 'Join thousands of creators sharing their world'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm claimedUsername={username} />
      </CardContent>
      <CardFooter className="justify-center">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-slate-900 hover:underline dark:text-slate-100"
          >
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
