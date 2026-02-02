# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**LinkItMe** is a "link in bio" platform built with **Next.js 16**, **React 19**, and **TypeScript**. The application allows users to create personalized landing pages to share all their content, similar to Linktree.

**Tech Stack:**

- **Framework**: Next.js 16.0.1 (App Router, React Server Components)
- **React**: 19.2.0
- **TypeScript**: 5.x (strict mode enabled)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Data Fetching**: @tanstack/react-query
- **Styling**: Tailwind CSS 4 with custom config
- **UI Components**: Shadcn/UI (New York style)
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Package Manager**: pnpm 9.15.0

---

## Development Commands

### Core Commands

```bash
# Start development server (port 3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Format code (via Prettier with import sorting)
pnpm prettier --write .
```

### Adding Shadcn Components

```bash
# Add a specific component
npx shadcn@latest add <component-name>

# Example
npx shadcn@latest add button
```

**Shadcn Configuration** (components.json):

- Style: `new-york`
- RSC: enabled
- Base color: `slate`
- CSS variables: enabled
- Icon library: `lucide`

---

## Database & Authentication

### Supabase Setup

The project uses **Supabase** for both database (PostgreSQL) and authentication.

**Environment Variables** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Schema

**Tables:**

1. **`profiles`** - User profiles (extends Supabase `auth.users`)
   - `id` (UUID, FK to auth.users)
   - `username` (TEXT, UNIQUE)
   - `display_name` (TEXT)
   - `bio` (TEXT)
   - `avatar_url` (TEXT)
   - `created_at`, `updated_at` (TIMESTAMPTZ)

2. **`reserved_usernames`** - System-reserved usernames
   - `username` (TEXT, PK)
   - `reason` (TEXT)
   - `created_at` (TIMESTAMPTZ)

**Database Functions:**
- `is_username_available(check_username TEXT)` - Returns boolean, checks both `profiles` and `reserved_usernames`

**Triggers:**
- `on_auth_user_created` - Auto-creates profile row when user signs up
- `set_profiles_updated_at` - Updates `updated_at` on profile changes

**Row Level Security (RLS):**
- Profiles are publicly readable
- Users can only update their own profile
- Reserved usernames are publicly readable

### Supabase Clients

Three client configurations for different contexts:

| File | Use Case |
|------|----------|
| `lib/supabase/client.ts` | Browser/client components |
| `lib/supabase/server.ts` | Server Components, API routes |
| `lib/supabase/middleware.ts` | Next.js middleware (session refresh) |

**Usage:**
```typescript
// Client component
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

// Server component or API route
import { createClient } from '@/lib/supabase/server';
const supabase = await createClient();
```

### Authentication Flow

1. **Signup**: User claims username on landing → redirects to `/signup?username=xxx`
2. **Profile Creation**: Supabase trigger auto-creates profile with username from `user_metadata`
3. **Session**: Middleware refreshes session on each request
4. **Protected Routes**: Middleware redirects unauthenticated users from `/settings`, `/dashboard`

**Auth Provider** (`providers/AuthProvider.tsx`):
- Provides `useAuth()` hook
- Exposes: `user`, `profile`, `isLoading`, `isAuthenticated`, `signOut()`, `refreshProfile()`

---

## Data Fetching Patterns

### React Query Setup

The app uses `@tanstack/react-query` for client-side data fetching.

**Provider** (`providers/QueryProvider.tsx`):
- Default staleTime: 1 minute
- `refetchOnWindowFocus`: disabled

**Usage:**
```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['profile', userId],
  queryFn: () => fetchProfile(userId),
});
```

### Data Fetching Guidelines

1. **Server Components**: Fetch directly with Supabase server client
2. **Client Components**: Use React Query for caching/deduplication
3. **API Routes**: Use Supabase server client, return typed responses
4. **Real-time**: Use Supabase subscriptions when needed (not yet implemented)

---

## Architecture

### Directory Structure

```
app/
  (auth)/                 # Auth route group
    layout.tsx            # Centered card layout
    login/page.tsx
    signup/page.tsx
    forgot-password/page.tsx
  api/
    auth/callback/        # Supabase auth callback
      route.ts
    check-username/       # Username availability check
      route.ts
  demo/                   # Demo/preview pages
    page.tsx
  layout.tsx              # Root layout with providers
  page.tsx                # Landing page

components/
  auth/                   # Auth form components
    LoginForm.tsx
    SignupForm.tsx
  landing/                # Landing page components
    ExamplesGallery.tsx
    Features.tsx
    Footer.tsx
    Header.tsx
    Hero.tsx
    UsernameClaimForm.tsx
  ui/                     # Shadcn UI components
    button.tsx
    card.tsx
    input.tsx
  linkit-item.tsx         # Core reusable LinkIt item component

lib/
  supabase/               # Supabase client configurations
    client.ts             # Browser client
    server.ts             # Server client
    middleware.ts         # Middleware helper
  utils.ts                # cn() utility for class merging
  validation.ts           # Username, email, password validation

providers/
  AuthProvider.tsx        # Auth context + useAuth() hook
  QueryProvider.tsx       # React Query provider

types/
  auth.ts                 # Auth types (Profile, AuthState, form values)
  database.ts             # Supabase database types
  landing.ts              # Landing page types
  linkit-item.ts          # LinkIt item types

constants/
  landing.ts              # Landing page data

hooks/
  useUsernameCheck.ts     # Username validation/checking hook

middleware.ts             # Auth middleware (session refresh, route protection)
```

### Key Architectural Patterns

**1. Component Organization**

- **Feature-based**: Components grouped by feature (`components/auth/`, `components/landing/`)
- **UI primitives**: Reusable Shadcn components in `components/ui/`
- **Shared components**: Root-level components for cross-feature use

**2. Type Safety**

- All components use **TypeScript types** (not interfaces) for props
- Database types in `types/database.ts` (can be auto-generated with `npx supabase gen types typescript`)
- Auth types in `types/auth.ts`

**3. Server/Client Boundaries**

- Most components are **Server Components** by default
- Client components marked with `'use client'`
- Auth forms, interactive components are client-side
- API routes use server-side Supabase client

**4. Styling Patterns**

- **Tailwind CSS 4** with `@tailwindcss/postcss`
- **Class variance authority (CVA)** for component variants
- **cn()** utility for conditional class merging
- **Framer Motion** for animations

---

## Code Conventions

### Import Order (Prettier Plugin)

Imports are automatically sorted via `@trivago/prettier-plugin-sort-imports`:

1. React imports (`react/*`)
2. Next.js imports (`next/*`)
3. Third-party modules
4. Types (`@/types/*`)
5. Lib/utils (`@/lib/*`)
6. Tests (`@/tests/*`)
7. Components (`@/components/*`)
8. Styles (`@/styles/*`)
9. Relative imports (`./`, `../`)

### Component Props

- Use **type** (not interface) for component props
- **Collocate** props type with the component when it's only used in one file
- Example:

```typescript
type LoginFormProps = {
  redirectTo?: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  // ...
}
```

### Path Aliases

Uses `@/*` for absolute imports (configured in `tsconfig.json`):

```typescript
import { cn } from '@/lib/utils';
import type { Profile } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
```

### Validation Pattern

Validation functions are centralized in `lib/validation.ts`:

- `validateUsername()` - 3-30 chars, alphanumeric + hyphens/underscores
- `validateEmail()` - Basic email format
- `validatePassword()` - Min 8 chars, uppercase, lowercase, number
- `validateConfirmPassword()` - Matches password

Used both client-side (forms) and server-side (API routes).

---

## API Routes

### `GET /api/check-username?username=<username>`

Checks username availability against Supabase.

**Response:**
```typescript
{ available: boolean; message?: string; }
```

### `GET /api/auth/callback`

Handles Supabase auth callbacks (email confirmation, OAuth).
Exchanges code for session, redirects to user's profile.

---

## Authentication Pages

### Login (`/login`)
- Email/password form
- Links to forgot-password and signup
- Redirects to user's profile on success

### Signup (`/signup`)
- Accepts `?username` query param (pre-fills from landing page claim)
- Username, email, password, confirm password
- Real-time username availability check
- Creates account with username in `user_metadata`

### Forgot Password (`/forgot-password`)
- Email input
- Sends password reset email via Supabase

---

## Middleware

**File:** `middleware.ts`

**Responsibilities:**
1. Refresh Supabase session on each request
2. Protect routes (`/settings`, `/dashboard`) - redirect to `/login`
3. Redirect authenticated users away from auth routes (`/login`, `/signup`)

---

## Styling & Design System

### Tailwind Configuration

- **Version**: Tailwind CSS 4
- **Custom plugin**: `tw-animate-css` for animations
- **Base color**: `slate` (from Shadcn)
- **Fonts**: Geist Sans and Geist Mono (loaded via `next/font`)

### Shadcn Components

Currently installed: `button`, `card`, `input`

To add more:
```bash
npx shadcn@latest add <component>
```

---

## Testing & Quality

### ESLint

- Config: `eslint-config-next` (core web vitals + TypeScript)
- Extends Prettier for formatting compatibility

### Prettier

- Print width: 100
- Single quotes
- Trailing commas: ES5
- Import sorting enabled

---

## When Adding Features

### New Database Tables

1. Add table in Supabase SQL Editor
2. Update `types/database.ts` (or run `npx supabase gen types typescript`)
3. Add RLS policies
4. Create API routes or direct Supabase queries as needed

### New API Routes

1. Place in `app/api/<route-name>/route.ts`
2. Use `createClient` from `@/lib/supabase/server`
3. Define response types in `types/`
4. Return typed JSON responses

### New Protected Pages

1. Add route to `PROTECTED_ROUTES` in `middleware.ts`
2. Use `useAuth()` hook for user/profile data
3. Handle loading states

### New Auth Features

1. Use Supabase Auth methods (`supabase.auth.*`)
2. Update `AuthProvider` if new state needed
3. Add to middleware if route protection needed

---

## Current State

**Implemented:**
- Landing page with username claim
- Auth pages (login, signup, forgot-password)
- Supabase integration (auth + database)
- Username availability check (real DB)
- Session management via middleware
- Auth context with `useAuth()` hook

**Not Yet Implemented:**
- User profile pages (`/[username]`)
- Dashboard/settings pages
- OAuth providers (Google, GitHub)
- Password reset completion page
- Link management (CRUD)
- Real-time updates

---

## Notes

- **Database migrations**: See `phase-3-auth-implementation.md` for full SQL
- **Type generation**: Run `npx supabase gen types typescript` to update database types
- **No tests yet**: Consider adding Jest/React Testing Library
- **React 19**: Uses Server Components and modern patterns
