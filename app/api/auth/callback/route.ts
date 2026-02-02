import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/auth/callback
 * Handles Supabase auth callbacks (email confirmation, OAuth)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Get the user's username from metadata to redirect to their profile
      const username = data.user.user_metadata?.username;

      if (username) {
        return NextResponse.redirect(new URL(`/${username}`, requestUrl.origin));
      }

      // Fall back to the next parameter or home
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // If there's an error or no code, redirect to home with error
  return NextResponse.redirect(new URL('/?error=auth_callback_error', requestUrl.origin));
}
