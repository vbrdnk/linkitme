import { NextRequest, NextResponse } from 'next/server';

import type { CheckUsernameResponse } from '@/types/landing';

import { normalizeUsername, validateUsername } from '@/lib/validation';

/**
 * Mock list of taken usernames
 * In production, this would query a database
 */
const TAKEN_USERNAMES = [
  'admin',
  'administrator',
  'root',
  'test',
  'demo',
  'user',
  'support',
  'help',
  'info',
  'contact',
  'sales',
  'marketing',
  'api',
  'www',
  'mail',
  'linkitme',
];

/**
 * GET /api/check-username?username=<username>
 * Checks if a username is available
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

    // Check if username is taken (case-insensitive)
    const normalizedUsername = normalizeUsername(username);
    const isTaken = TAKEN_USERNAMES.includes(normalizedUsername);

    // Simulate network delay for more realistic UX
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json<CheckUsernameResponse>(
      {
        available: !isTaken,
        message: isTaken ? 'Username is already taken' : 'Username is available',
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
