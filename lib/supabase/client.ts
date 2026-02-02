import { createBrowserClient } from '@supabase/ssr';

import type { Database } from '@/types/database';

/**
 * Creates a Supabase client for use in browser/client components.
 * This client is safe to use in React components and hooks.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
