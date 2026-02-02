import { NextRequest, NextResponse } from 'next/server';

import type { CheckUsernameResponse } from '@/types/landing';

import { createClient } from '@/lib/supabase/server';
import { normalizeUsername, validateUsername } from '@/lib/validation';

/**
 * GET /api/check-username?username=<username>
 * Checks if a username is available using Supabase
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get('username');

    // Validate username is provided
    if (!username) {
      return NextResponse.json<CheckUsernameResponse>(
        {
          available: false,
          message: 'Username is required',
        },
        { status: 400 }
      );
    }

    // Validate username format
    const validation = validateUsername(username);
    if (!validation.isValid) {
      return NextResponse.json<CheckUsernameResponse>(
        {
          available: false,
          message: validation.error || 'Invalid username format',
        },
        { status: 400 }
      );
    }

    // Check username availability using Supabase RPC
    const normalizedUsername = normalizeUsername(username);
    const supabase = await createClient();

    const { data: isAvailable, error } = await supabase.rpc('is_username_available', {
      check_username: normalizedUsername,
    });

    if (error) {
      console.error('Supabase error checking username:', error);
      return NextResponse.json<CheckUsernameResponse>(
        {
          available: false,
          message: 'Unable to check username availability',
        },
        { status: 500 }
      );
    }

    return NextResponse.json<CheckUsernameResponse>(
      {
        available: isAvailable,
        message: isAvailable ? 'Username is available' : 'Username is already taken',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json<CheckUsernameResponse>(
      {
        available: false,
        message: 'Unable to check username availability',
      },
      { status: 500 }
    );
  }
}
