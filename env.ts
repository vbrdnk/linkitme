import { z } from 'zod';

// Schema for public (client-safe) environment variables
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

// Schema for server-only environment variables
const serverEnvSchema = z.object({
  // Add server-only vars here, e.g.:
  // SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const envSchema = clientEnvSchema.merge(serverEnvSchema);

// Next.js requires direct access to process.env.NEXT_PUBLIC_* for client-side inlining
// Validate public env (works on both client and server)
const env = clientEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

// Extend global NodeJS ProcessEnv interface
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

// Export the validated environment variables
export default env;
