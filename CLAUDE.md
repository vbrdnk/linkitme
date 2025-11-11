# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**LinkItMe** is a "link in bio" platform built with **Next.js 16**, **React 19**, and **TypeScript**. The application allows users to create personalized landing pages to share all their content, similar to Linktree.

**Tech Stack:**

- **Framework**: Next.js 16.0.1 (App Router, React Server Components)
- **React**: 19.2.0
- **TypeScript**: 5.x (strict mode enabled)
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

## Architecture

### Directory Structure

```
app/
  api/
    check-username/     # Username availability API endpoint
      route.ts
  demo/                 # Demo/preview pages
    page.tsx
  layout.tsx            # Root layout with Geist fonts
  page.tsx              # Landing page (main entry)
  globals.css           # Global Tailwind styles

components/
  landing/              # Landing page-specific components
    ExamplesGallery.tsx
    Features.tsx
    Footer.tsx
    Header.tsx
    Hero.tsx
    UsernameClaimForm.tsx
  ui/                   # Shadcn UI components
    button.tsx
    card.tsx
    input.tsx
  linkit-item.tsx       # Core reusable LinkIt item component

lib/
  utils.ts              # cn() utility for class merging
  validation.ts         # Username validation logic

types/
  landing.ts            # Types for landing page (Feature, ExamplePage, etc.)
  linkit-item.ts        # Types for LinkIt item component

constants/
  landing.ts            # Landing page data (FEATURES, EXAMPLE_PAGES, NAV_LINKS, etc.)

hooks/
  useUsernameCheck.ts   # Custom hook for username validation/checking
```

### Key Architectural Patterns

**1. Component Organization**

- **Feature-based**: Landing page components are grouped in `components/landing/`
- **UI primitives**: Reusable Shadcn components in `components/ui/`
- **Shared components**: Root-level components like `linkit-item.tsx` for cross-feature use

**2. Type Safety**

- All components use **TypeScript types** (not interfaces) for props
- Types are **collocated** with components when simple, or centralized in `types/` when shared
- Example: `LinkitItemProps` is in `types/linkit-item.ts` because it's used across files

**3. Data Flow**

- **Constants** are centralized in `constants/` (e.g., `FEATURES`, `EXAMPLE_PAGES`)
- **API routes** follow Next.js App Router conventions (`app/api/*/route.ts`)
- **Client hooks** handle async operations (e.g., `useUsernameCheck` for debounced API calls)

**4. Styling Patterns**

- **Tailwind CSS 4** with `@tailwindcss/postcss`
- **Class variance authority (CVA)** for component variants (see `linkit-item.tsx`)
- **cn()** utility (from `lib/utils.ts`) for conditional class merging
- **Framer Motion** for animations

**5. Server/Client Boundaries**

- Most components are **Server Components** by default
- Client components are marked with `'use client'` (e.g., `linkit-item.tsx`, `UsernameClaimForm.tsx`)
- API routes use **Next.js Route Handlers** (`app/api/*/route.ts`)

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

- Use **type** (not interface) for component props unless they're overly complex
- **Collocate** props type with the component when it's only used in one file
- Example from `linkit-item.tsx`:

```typescript
export type LinkitItemProps = {
  children: React.ReactNode;
  size?: LinkitItemSize;
  onSizeChange?: (size: LinkitItemSize) => void;
  onDelete?: () => void;
  className?: string;
  disabled?: boolean;
};
```

### Path Aliases

Uses `@/*` for absolute imports (configured in `tsconfig.json`):

```typescript
import { cn } from '@/lib/utils';
import type { LinkitItemProps } from '@/types/linkit-item';
import { Button } from '@/components/ui/button';
```

### Validation Pattern

Username validation is split into two layers:

1. **Client-side**: `lib/validation.ts` exports `validateUsername()` and `normalizeUsername()`
2. **Server-side**: API route (`app/api/check-username/route.ts`) reuses the same validators

**Rules:**

- 3-30 characters
- Alphanumeric, hyphens, underscores only
- Cannot start/end with hyphen or underscore
- Case-insensitive

---

## Component Patterns

### LinkIt Item Component

The core reusable component for displaying content blocks in a masonry-style layout.

**Features:**

- 5 size variants: `xs`, `sm`, `md`, `lg`, `xl`
- Hover controls: resize toolbar (bottom) and delete button (top-left)
- Controlled/uncontrolled state support
- Uses CVA for variant styling

**Usage:**

```tsx
<LinkitItem size="md" onSizeChange={handleResize} onDelete={handleDelete}>
  {/* Content here */}
</LinkitItem>
```

### Custom Hooks

**`useUsernameCheck`** (in `hooks/useUsernameCheck.ts`):

- Debounced username validation
- Calls `/api/check-username` endpoint
- Returns `{ username, setUsername, isValid, isChecking, isAvailable, error }`

---

## API Routes

### `GET /api/check-username?username=<username>`

**Response:**

```typescript
{
  available: boolean;
  message?: string;
}
```

**Behavior:**

- Validates format using `validateUsername()`
- Checks against mock list of reserved usernames (in production, query DB)
- Returns 400 for invalid format, 200 for valid check

---

## Styling & Design System

### Tailwind Configuration

- **Version**: Tailwind CSS 4
- **Custom plugin**: `tw-animate-css` for animations
- **Base color**: `slate` (from Shadcn)
- **Fonts**: Geist Sans and Geist Mono (loaded via `next/font`)

### Shadcn Components

Currently installed:

- `button`
- `card`
- `input`

To add more, use:

```bash
npx shadcn@latest add <component>
```

---

## Testing & Quality

### ESLint

- Config: `eslint-config-next` (core web vitals + TypeScript)
- Extends Prettier for formatting compatibility
- Custom ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

### Prettier

- Print width: 100
- Single quotes
- Trailing commas: ES5
- Import sorting enabled

---

## When Adding Features

### New Components

1. Determine if it's feature-specific (→ `components/landing/`) or reusable (→ `components/` or `components/ui/`)
2. Use **type** for props, colocate unless shared
3. Mark client components with `'use client'`
4. Use `cn()` for conditional classes
5. Follow import order convention

### New API Routes

1. Place in `app/api/<route-name>/route.ts`
2. Use Next.js `NextRequest`/`NextResponse`
3. Define response types in `types/`
4. Reuse validation logic from `lib/validation.ts`
5. Return typed JSON responses

### New Types

1. Place in `types/` directory
2. Use **type** (not interface) for consistency
3. Export individual types, not namespaces
4. Document complex types with JSDoc comments

### New Utilities

1. Place in `lib/` directory
2. Export pure functions
3. Include JSDoc comments explaining purpose and usage
4. Reuse across server and client when possible

---

## Current State

**Landing Page:**

- Hero with username claim form
- Features section (6 features from `constants/landing.ts`)
- Examples gallery (4 example pages)
- Footer with navigation links

**Demo Page:**

- Located at `/demo`
- Showcases `LinkitItem` component with interactive resizing

**No Database Yet:**

- Username checks use mock data (`TAKEN_USERNAMES` array in API route)
- In production, replace with real DB queries

---

## Notes

- **No tests yet**: Consider adding Jest/React Testing Library when implementing new features
- **Mock data**: Example pages and reserved usernames are hardcoded; replace with dynamic data later
- **Fonts**: Uses Geist Sans and Geist Mono from Google Fonts via `next/font`
- **React 19**: Takes advantage of React Server Components and modern patterns
