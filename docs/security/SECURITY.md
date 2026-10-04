# SECURITY & AUTHENTICATION POLICY

**Status:** IMPLEMENTED & ENFORCED (SETUP 10)
**Authentication Engine:** Supabase Auth (`auth.users`) + `@supabase/ssr`

---

## 1. Core Security Policies & Non-Negotiables
- **Zero Secrets in Source Control:** `.env.example` contains only non-sensitive templates. Real secrets are managed via local `.env.local` or secure platform variables.
- **Vercel Environment Isolation:** Production, Preview, and Development environment variables are strictly isolated in Vercel. Secret tokens (`SUPABASE_SERVICE_ROLE_KEY`, `POLAR_*`) are server-only and never exposed to the client.
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

## 3. Deferred Security Work (Subsequent Phases)
- Time-based One-Time Password (TOTP) Multi-Factor Authentication (MFA) enforcement.
- SAML 2.0 Single Sign-On (SSO) enterprise connectors.
- IP allowlisting and geo-fencing policies.
