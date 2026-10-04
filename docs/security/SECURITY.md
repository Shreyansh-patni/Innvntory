# SECURITY & AUTHENTICATION POLICY

**Status:** IMPLEMENTED & ENFORCED (SETUP 10 / SETUP 09.2)
**Authentication Engine:** Supabase Auth (`auth.users`) + `@supabase/ssr`
**Hosted Project Reference:** `qwsdusjpidhwdxoztepu` (ap-south-1)

---

## 1. Core Security Policies & Non-Negotiables
- **Zero Secrets in Source Control:** `.env.example` contains only non-sensitive templates. Real secrets are managed via local `.env.local` or secure platform variables.
- **Vercel Environment Isolation:** Production, Preview, and Development environment variables are strictly isolated in Vercel. Secret tokens (`SUPABASE_SERVICE_ROLE_KEY`, `POLAR_*`) are server-only and never exposed to the client.
- **Publishable / Anon vs Secret Key Boundary:** The browser client uses strictly the public anonymous key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`). Server-only administrative tasks use the elevated `SUPABASE_SERVICE_ROLE_KEY` exclusively inside trusted backend scripts or edge functions.
- **Server-Side Authentication & Authorization:** Next.js `middleware.ts` interceptor continuously verifies JWT sessions on `/app/*`. Server Components resolve `getUserContext()` before executing database transactions.
- **Strict Tenant Isolation:** PostgreSQL Row Level Security (RLS) is active on every table. Users cannot select, mutate, or traverse records across tenant boundaries.
- **Safe Redirection & Open Redirect Prevention:** Auth callbacks and login redirects validate destination paths (must start with `/` and not `//` or external schemas). Supabase Redirect URLs are restricted to authorized preview and production patterns.
- **Service-Role Isolation:** `SUPABASE_SERVICE_ROLE_KEY` is strictly server-only. It is never imported into client components or exposed in browser network payloads.
- **Error Normalization:** Technical SQL, Supabase error messages, or stack traces are never exposed in user-facing UI. Errors are sanitized into friendly, non-leaking messages.
- **Password Policies:** Minimum 8 characters enforced on both client forms and server actions.
- **Audit Logging:** Administrative actions (organization creation, membership changes, role assignments) are recorded in the immutable `public.audit_logs` ledger.

---

## 2. Authentication Architecture & Routes

| Component | Path | Function |
| :--- | :--- | :--- |
| Next.js Proxy / Interceptor | `proxy.ts` | Intercepts requests, refreshes JWT tokens, enforces `/app/*` protection, redirects authenticated users from `/login`. |
| Auth Callback | `app/auth/callback/route.ts` | Exchanges auth codes for sessions (email verification, magic links, password resets). |
| User Context Helper | `lib/auth/session.ts` | Server-side resolver for `user`, `organization`, `membership`, and assigned roles. |
| Server Actions | `lib/auth/actions.ts` | Safe mutations for `loginAction`, `signupAction`, `logoutAction`, `forgotPasswordAction`, and `resetPasswordAction`. |

---

## 3. Public Demo Account Security Model (SETUP 11.4)
- **Public Sandbox Principle:** The demo account (`demo@innvntory.sahaya.tech`) credentials are intentionally public and displayed on `/login`.
- **Tenant Isolation Enforcement:** The demo identity is bound strictly to `Innvntory Demo Workspace` (`innvntory-demo`). RLS strictly prevents any cross-tenant visibility or mutation.
- **Least-Privilege Role:** Assigned the `viewer` system role (`00000000-0000-0000-0000-000000000007`), ensuring read-only catalog access with zero administrative, billing, or member management permissions.
- **Service Role Protection:** The demo provisioning script (`scripts/provision-demo-account.mjs`) is an offline manual tool requiring `SUPABASE_SERVICE_ROLE_KEY`. It is never executed in browser contexts or automated build/deploy steps.

---

## 4. Deferred Security Work (Subsequent Phases)
- Time-based One-Time Password (TOTP) Multi-Factor Authentication (MFA) enforcement.
- SAML 2.0 Single Sign-On (SSO) enterprise connectors.
- IP allowlisting and geo-fencing policies.
