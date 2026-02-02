# Phase 3: Authentication Pages - Implementation Plan

## Summary

Implement authentication pages (login/signup) for LinkItMe using **Supabase Auth** with **@tanstack/react-query** for data fetching. The flow follows: claim username on landing → redirect to signup with username pre-filled → create account → redirect to profile page.

**Status: COMPLETED**

---

## Prerequisites (User Setup)

### 1. Create Supabase Project [DONE]
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to initialize
3. Note down:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Run Database Migrations [DONE]
Execute this SQL in Supabase SQL Editor:

```sql
-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for username lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_username_lower ON public.profiles(LOWER(username));

-- Reserved usernames table
CREATE TABLE public.reserved_usernames (
  username TEXT PRIMARY KEY,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seed reserved usernames
INSERT INTO public.reserved_usernames (username, reason) VALUES
  ('admin', 'system'), ('api', 'system'), ('login', 'system'),
  ('signup', 'system'), ('settings', 'system'), ('profile', 'system'),
  ('dashboard', 'system'), ('help', 'system'), ('support', 'system'),
  ('about', 'system'), ('terms', 'system'), ('privacy', 'system'),
  ('demo', 'system'), ('forgot-password', 'system'), ('reset-password', 'system');

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserved_usernames ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Reserved usernames are viewable by everyone" ON public.reserved_usernames FOR SELECT USING (true);

-- Function: Check username availability
CREATE OR REPLACE FUNCTION public.is_username_available(check_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE LOWER(username) = LOWER(check_username)) THEN
    RETURN FALSE;
  END IF;
  IF EXISTS (SELECT 1 FROM public.reserved_usernames WHERE LOWER(username) = LOWER(check_username)) THEN
    RETURN FALSE;
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

### 3. Configure Email Settings (Optional)
In Supabase Dashboard → Authentication → Email Templates:
- Consider disabling email confirmation for MVP (Settings → Auth → Email Confirm = OFF)
- Or customize confirmation email template

---

## Implementation Steps

### Step 1: Install Dependencies [DONE]

```bash
pnpm add @supabase/supabase-js @supabase/ssr @tanstack/react-query
```

### Step 2: Create Environment File [DONE]

**File: `.env.local`** (create new)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Create Supabase Clients [DONE]

**File: `lib/supabase/client.ts`** (new)
- Browser Supabase client for client components

**File: `lib/supabase/server.ts`** (new)
- Server-side Supabase client for Server Components and API routes

**File: `lib/supabase/middleware.ts`** (new)
- Helper for session refresh in middleware

### Step 4: Create Type Definitions [DONE]

**File: `types/auth.ts`** (new)
- `Profile` - User profile from profiles table
- `AuthUser` - Auth user with profile
- `AuthState` - Auth context state
- `LoginFormValues`, `SignupFormValues` - Form types
- `AuthError`, `AuthErrorCode` - Error handling

**File: `types/database.ts`** (new)
- Database types for Supabase tables (can be auto-generated later)

### Step 5: Create Providers [DONE]

**File: `providers/QueryProvider.tsx`** (new)
- React Query provider with default options

**File: `providers/AuthProvider.tsx`** (new)
- Auth context with session management
- Exports `useAuth()` hook
- Handles auth state changes, profile fetching, sign out

### Step 6: Update Root Layout [DONE]

**File: `app/layout.tsx`** (modify)
- Wrap children with `QueryProvider` and `AuthProvider`

### Step 7: Create Middleware [DONE]

**File: `middleware.ts`** (new at project root)
- Refresh Supabase session on each request
- Protect routes like `/settings`, `/dashboard`
- Redirect authenticated users away from `/login`, `/signup`

### Step 8: Add Email/Password Validation [DONE]

**File: `lib/validation.ts`** (modify)
- Add `validateEmail()` function
- Add `validatePassword()` function (min 8 chars, uppercase, lowercase, number)
- Add `validateConfirmPassword()` function

### Step 9: Update check-username API Route [DONE]

**File: `app/api/check-username/route.ts`** (modify)
- Replace mock data with Supabase `is_username_available` RPC call
- Keep existing response format for backward compatibility

### Step 10: Create Auth Callback Route [DONE]

**File: `app/api/auth/callback/route.ts`** (new)
- Handle Supabase auth callbacks (email confirmation, OAuth)
- Exchange code for session
- Redirect to user's profile page

### Step 11: Create Auth Layout [DONE]

**File: `app/(auth)/layout.tsx`** (new)
- Route group for auth pages
- Centered card layout with logo
- Footer with terms/privacy links

### Step 12: Create Login Page [DONE]

**File: `app/(auth)/login/page.tsx`** (new)
- Server component wrapper with Card
- Links to forgot-password and signup

**File: `components/auth/LoginForm.tsx`** (new)
- Client component with email/password inputs
- Form validation using `lib/validation.ts`
- Supabase `signInWithPassword` on submit
- Redirect to user's profile page on success
- Error message display

### Step 13: Create Signup Page [DONE]

**File: `app/(auth)/signup/page.tsx`** (new)
- Server component that reads `?username` search param
- Passes claimed username to SignupForm

**File: `components/auth/SignupForm.tsx`** (new)
- Client component with username, email, password, confirm password
- Reuses `useUsernameCheck` hook for username validation
- Pre-fills username if provided via URL param
- Supabase `signUp` with username in `user_metadata`
- Redirect to user's profile page on success

### Step 14: Create Forgot Password Page [DONE]

**File: `app/(auth)/forgot-password/page.tsx`** (new)
- Email input form
- Supabase `resetPasswordForEmail` call
- Success message with "check your email"

### Step 15: Update UsernameClaimForm [DONE]

**File: `components/landing/UsernameClaimForm.tsx`** (modify)
- Add `useRouter` import
- Update `handleSubmit` to redirect to `/signup?username={username}`

---

## File Structure (New/Modified Files)

```
linkitme/
├── .env.local                              # NEW - Environment variables
├── middleware.ts                           # NEW - Auth middleware
├── app/
│   ├── layout.tsx                          # MODIFY - Add providers
│   ├── (auth)/                             # NEW - Route group
│   │   ├── layout.tsx                      # NEW - Auth layout
│   │   ├── login/page.tsx                  # NEW - Login page
│   │   ├── signup/page.tsx                 # NEW - Signup page
│   │   └── forgot-password/page.tsx        # NEW - Forgot password
│   └── api/
│       ├── auth/callback/route.ts          # NEW - Auth callback
│       └── check-username/route.ts         # MODIFY - Use Supabase
├── components/
│   ├── auth/                               # NEW - Auth components
│   │   ├── LoginForm.tsx                   # NEW
│   │   └── SignupForm.tsx                  # NEW
│   └── landing/
│       └── UsernameClaimForm.tsx           # MODIFY - Add redirect
├── lib/
│   ├── supabase/                           # NEW - Supabase clients
│   │   ├── client.ts                       # NEW
│   │   ├── server.ts                       # NEW
│   │   └── middleware.ts                   # NEW
│   └── validation.ts                       # MODIFY - Add email/password
├── providers/                              # NEW - React providers
│   ├── QueryProvider.tsx                   # NEW
│   └── AuthProvider.tsx                    # NEW
└── types/
    ├── auth.ts                             # NEW
    └── database.ts                         # NEW
```

---

## Data Flow

```
[Landing Page]
     │ User enters username
     ▼
[UsernameClaimForm] ──► GET /api/check-username ──► Supabase RPC
     │                                               is_username_available()
     │ If available, redirect
     ▼
[/signup?username=xyz]
     │ User enters email + password
     ▼
[SignupForm] ──► supabase.auth.signUp({
     │            email, password,
     │            options: { data: { username } }
     │          })
     │                    │
     │                    ▼
     │           [Supabase Auth] ──► Trigger: on_auth_user_created
     │                    │                   │
     │                    │                   ▼
     │                    │           [profiles table] ← Creates row
     │                    │
     │ If email confirm disabled
     ▼
[Redirect to /username]
```

---

## Verification & Testing

### Manual Test Cases

| # | Test Case | Steps | Expected | Status |
|---|-----------|-------|----------|--------|
| 1 | Username claim → signup | Enter valid username on landing, click claim | Redirects to `/signup?username=xyz` | PASSED |
| 2 | Signup creates account | Fill signup form, submit | Account created, redirected to `/[username]` | PASSED |
| 3 | Login success | Enter valid email/password | Redirected to user's profile | PASSED |
| 4 | Login failure | Enter wrong password | Error: "Invalid login credentials" | PASSED |
| 5 | Username taken | Enter existing username in signup | Error shown, submit disabled | PASSED |
| 6 | Reserved username | Enter "admin" as username | Error: "Username is already taken" | PASSED |
| 7 | Auth redirect | Visit `/login` while logged in | Redirected away | PASSED |

### Verification Commands

```bash
# 1. Start dev server
pnpm dev

# 2. Test username check API
curl "http://localhost:3000/api/check-username?username=testuser"

# 3. Verify Supabase connection by checking browser console for auth state
```

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Username race condition (claimed between check and signup) | DB trigger with UNIQUE constraint will fail gracefully |
| Email confirmation requirement | Consider disabling for MVP or implement proper "check email" flow |
| Type drift from database | Run `npx supabase gen types typescript` periodically |

---

## Out of Scope (Future Phases)

- Password reset flow (Phase 3.2 - partial, forgot-password page only)
- OAuth providers (Google, GitHub, etc.)
- Email verification UI
- Remember me functionality
- Protected dashboard/settings routes (middleware is ready, pages are not)
