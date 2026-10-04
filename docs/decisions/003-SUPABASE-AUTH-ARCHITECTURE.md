# ADR 003: Supabase Authentication & SSR Session Architecture

## Status
Accepted (SETUP 10)

## Context
Innvntory is an enterprise multi-tenant inventory & business operations SaaS. The application requires secure authentication, atomic organization onboarding, cookie-based SSR session refresh, server-side route protection, and role-based tenant authorization without exposing database credentials or security keys to the client browser.

## Decision
1. **Identity Source:** Utilize Supabase Auth (`auth.users`) as the single source of user identity.
2. **SSR Cookie Handling:** Standardize on `@supabase/ssr` with `createServerClient` in Next.js Server Components / Route Handlers, and `createBrowserClient` in Client Components.
3. **Session Refresh & Route Protection:** Implement Next.js `middleware.ts` intercepting `/app/*` and public auth routes (`/login`, `/signup`, `/forgot-password`), automatically refreshing JWT sessions and redirecting unauthenticated actors to `/login?next=...` while preventing open-redirect attacks.
4. **Onboarding & Tenancy:** Signup performs atomic/idempotent tenant provisioning (`auth.users` → `organizations` → `memberships` with status `active` → `membership_roles` with `owner` system role).
5. **Normalized Error Handling:** Map all technical or database errors into safe, actionable customer-facing notices without leaking SQL metadata, table structures, or internal tokens.
6. **Password Recovery:** Provide dedicated `/forgot-password` and `/reset-password` routes with token exchange handled by `/auth/callback`.

## Consequences
- Clean separation between identity (`auth.users`) and domain data (`public.*`).
- Zero service-role keys bundled into client code.
- Reliable Server Component data fetching bound to PostgreSQL Row Level Security (RLS).
