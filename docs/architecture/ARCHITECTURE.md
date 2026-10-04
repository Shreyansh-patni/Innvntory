# ARCHITECTURE

## Direction
- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4
- **UI Libraries:** shadcn/ui (Primary).
- **Backend / Platform:** Supabase (PostgreSQL 15+, Supabase Auth, Storage, Realtime)
- **Billing:** Polar

## Next.js Architecture & Route Groups
- **App Router Structure:**
  - `app/(marketing)/...`: Public website owning `/`, `/features`, `/pricing`, `/docs`, `/articles`, `/about`, `/contact`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/privacy`, `/terms`, `/cookie-policy`, `/disclaimer`.
  - `app/auth/...`: Auth callback route handlers (`/auth/callback`).
  - `app/(application)/app/...`: Authenticated operational SaaS owning `/app/dashboard`, `/app/products`, `/app/inventory/*`, `/app/sales/*`, `/app/purchases/*`, `/app/reports/*`, `/app/settings/*`.
  - `middleware.ts`: Next.js request interceptor continuously refreshing Supabase JWT sessions and enforcing `/app/*` protected route boundaries.
  - `app/layout.tsx`: Root shell defining HTML, typography fonts (`NewBlack` and `LT-amber`), and global CSS tokens.
- **Default:** Server Components for zero-bundle overhead and maximum rendering performance.
- **Client Components:** Used strictly where required for interactive state (e.g. interactive auth forms, mobile drawer sheet, search toolbar filter interaction, platform shortcut detection).
- **Data vs Rendering:** Structured static content in `content/` (e.g. `content/marketing/`, `content/navigation.ts`).
- **Loading & Errors:** Handled via dedicated `app/(application)/app/loading.tsx`, `error.tsx`, and `not-found.tsx`.

## Project Structure
- `app/(marketing)/`: Marketing and public authentication routes.
- `app/auth/`: Server route handlers for auth callback and token exchange.
- `app/(application)/app/`: Application routes wrapped with `AppShell`, `AppSidebar`, and `AppHeader`.
- `components/marketing/`: High-level marketing composition components.
- `components/auth/`: Interactive authentication client form primitives (`LoginForm`, `SignupForm`, `ForgotPasswordForm`, `ResetPasswordForm`).
- `components/layout/`: Application shell and persistent navigation layout primitives (`AppShell`, `AppSidebar`, `AppHeader`, `UserAccountMenu`, `MobileNavigation`).
- `components/shared/`: High-density operational primitives (`PageHeader`, `MetricCard`, `EmptyState`, `StatusBadge`, `PageToolbar`, `DataPlaceholderTable`).
- `components/ui/`: Foundational UI primitives (shadcn/ui & base-ui).
- `content/marketing/`: Structured copy and data for marketing pages.
- `lib/auth/`: Server actions (`actions.ts`) and authenticated context resolvers (`session.ts`).
- `lib/catalog/`: Catalog domain queries, server actions, and Zod validation schemas.
- `lib/demo/`: In-memory typed fixtures for controlled Dashboard Demo Mode (`dashboard-data.ts`).
- `lib/supabase/`: Client and server `@supabase/ssr` factories (`client.ts`, `server.ts`, `middleware.ts`).
- `proxy.ts`: Next.js 16 request interceptor for JWT session management and route protection.
- `types/`: Strongly-typed PostgreSQL contract (`database.types.ts`).
- `public/`: Static font files and assets.

## Core Rules
- **Simplicity:** Complexity belongs in architecture, simplicity in the interface.
- **Multi-tenant:** Organization-level isolation from day one via Supabase RLS.
- **Security by Design:** Validate everything, never trust the client. Server-side session verification on all protected endpoints.
- **Data Integrity:** Consistent inventory state is paramount. Atomic operations; zero partial inventory state.
- **API Convention:** `/api/v1/...` for developer endpoints.
