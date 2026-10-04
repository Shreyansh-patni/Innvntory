# ADR 005: Vercel Middleware / Proxy Architecture & Error Isolation

**Status:** APPROVED & IMPLEMENTED  
**Date:** 2026-10-04  
**Context:** Incident Resolution — 500 MIDDLEWARE_INVOCATION_FAILED (`bom1::z7j86-1791093547877-fe9fe116339e`)  

---

## 1. Context & Incident Description

When visiting the production domain (`https://innvntory.sahaya.tech/`), Vercel edge/server proxy execution returned:
`500 MIDDLEWARE_INVOCATION_FAILED`

### Root Cause
1. **Uncaught Runtime Exceptions in Auth Middleware:**  
   `updateSession` executed `createServerClient` and `supabase.auth.getUser()` unconditionally without top-level exception isolation. When Supabase environment variables were malformed, unreachable, or threw network/fetch errors, the unhandled promise rejection crashed the Next.js middleware execution.
2. **Overly Broad Matcher on Public Routes:**  
   The previous middleware regex matcher intercepted every single route, including public marketing pages (`/`, `/features`, `/pricing`, `/docs`, etc.). A failure in session resolution thus took down the public marketing homepage.
3. **Next.js 16 File Convention Migration:**  
   Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`.

---

## 2. Decision & Architecture

1. **Next.js 16 Proxy Convention (`proxy.ts`):**  
   Standardize on `proxy.ts` exporting `export async function proxy(request: NextRequest)`.
2. **Targeted Matcher:**  
   Restrict proxy invocation to routes requiring session handling:
   - Protected application routes: `/app/:path*`
   - Public auth pages: `/login`, `/signup`, `/forgot-password`, `/reset-password`
   - Auth callback: `/auth/callback`
   Public static/marketing routes (`/`, `/features`, `/docs`, etc.) are served cleanly without proxy overhead.
3. **Robust URL Validation & Error Isolation:**  
   - Validate `process.env.NEXT_PUBLIC_SUPABASE_URL` with standard URL protocol validation.
   - Wrap client initialization and `supabase.auth.getUser()` in strict `try ... catch` blocks.
   - If an exception occurs:
     - For `/app/*` routes: safely redirect to `/login?next=...` (preserving zero-trust security).
     - For non-protected routes: return `NextResponse.next({ request })` without failing.

---

## 3. Verification & Consequences

- **Security Preserved:** Unauthenticated requests to `/app/*` reliably redirect to `/login?next=%2Fapp%2Fdashboard` (HTTP 307).
- **Zero 500s on Public Pages:** Public marketing routes render independently of Supabase network availability.
- **Performance:** Reduced middleware invocation overhead on static and marketing traffic.
