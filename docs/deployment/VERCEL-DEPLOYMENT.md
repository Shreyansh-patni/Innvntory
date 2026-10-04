# VERCEL DEPLOYMENT & PRODUCTION READINESS SPECIFICATION

**Project:** Innvntory  
**Company:** Sahaya Technologies Pvt. Ltd.  
**Platform:** Vercel (Next.js App Router Native Integration)  
**Status:** ACTIVE & CONFIGURED  

---

## 1. Vercel Project & Git Integration Architecture

Innvntory uses Vercel's native GitHub integration with the official repository `Shreyansh-patni/Innvntory`.

```
                    ┌─────────────────────────┐
                    │ GitHub Canonical Repo   │
                    │ Shreyansh-patni/Innvntory │
                    └────────────┬────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
   ┌───────────────┐                           ┌───────────────┐
   │ branch: main  │                           │branch: develop│
   └───────┬───────┘                           └───────┬───────┘
           │ (Vercel Git Integration)                  │ (Vercel Git Integration)
           ▼                                           ▼
┌─────────────────────┐                     ┌─────────────────────┐
│ Production Deploy   │                     │ Preview Deploy      │
│ Target: Production  │                     │ Target: Preview     │
│ Domain: innvntory.* │                     │ URL: *.vercel.app   │
└─────────────────────┘                     └─────────────────────┘
```

### Git Branch Mapping & Environments
- **Production Branch:** `main`  
  - Deploys automatically to the production domain upon PR merge / publication from `develop`.
  - Requires clean CI checks (`lint`, `typecheck`, `test`, `build`) before promotion.
- **Preview Branch:** `develop`  
  - Deploys automatically to a distinct Vercel Preview URL upon every push to `origin/develop`.
  - Used for integration validation, multi-device QA, and team sign-offs.
- **Feature Branches:** `feature/*`  
  - Automatically generate isolated ephemeral Preview deployments on pull requests.

---

## 2. Environment Variables Configuration Matrix

Vercel environments are strictly isolated between **Production**, **Preview**, and **Development**.

| Variable Name | Scope | Environment(s) | Description | Target Value / Reference |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Public / Client | Production | Canonical production domain URL | `https://innvntory.sahaya.tech` (or `https://innvntory.vercel.app`) |
| `NEXT_PUBLIC_APP_URL` | Public / Client | Preview | Automatically supplied or configured for preview | `https://<preview-branch-url>.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | Production & Preview | Supabase Project REST API URL | `https://qwsdusjpidhwdxoztepu.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Client | Production & Preview | Supabase public anonymous API key | Public JWT anon key |
| `NEXT_PUBLIC_DEMO_MODE` | Public / Client | Production & Preview | Controlled simulated dashboard toggle | `false` |
| `NEXT_PUBLIC_DEMO_EMAIL` | Public / Client | Production & Preview | Public demo account username | `demo@innvntory.sahaya.tech` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | Production & Preview | Elevated service role key for migrations / admin tasks | Server-only key (NEVER prefix with `NEXT_PUBLIC_`) |
| `POLAR_ACCESS_TOKEN` | Server-Only | Production & Preview | Polar SaaS billing API access token | `polar_at_...` (Planned) |
| `POLAR_ORGANIZATION_ID` | Server-Only | Production & Preview | Polar organization ID | UUID (Planned) |
| `POLAR_WEBHOOK_SECRET` | Server-Only | Production & Preview | Webhook signature verification secret | Secret token (Planned) |

> [!IMPORTANT]
> **Secret Protection Rule:** Never prefix backend secrets (`SUPABASE_SERVICE_ROLE_KEY`, `POLAR_*`) with `NEXT_PUBLIC_`. Vercel automatically excludes non-public variables from browser bundles.

---

## 3. Supabase Auth & Redirect URL Configuration

For Supabase Authentication (login, signup confirmation, password resets, auth callback) to work across both Vercel Preview and Production environments, configure the **URL Configuration** in the Supabase Dashboard:

### 1. Site URL (Production)
- Set to the canonical production URL: `https://<production-domain>`

### 2. Redirect URLs (Wildcards for Vercel Previews)
Add the following URL patterns under **Authentication → URL Configuration → Redirect URLs**:
- `http://localhost:3000/**` (Local development)
- `https://innvntory.vercel.app/**` (Production Vercel URL)
- `https://*-<team-slug>.vercel.app/**` (Preview wildcards for Git branches)
- `https://*-shreyansh-patnis-projects.vercel.app/**` (Preview wildcard for personal/team projects)
- `https://<preview-domain>/auth/callback`

---

## 4. Build Configuration & Specifications

The project relies on Vercel's zero-config Next.js framework detection:

- **Framework:** Next.js (App Router)
- **Node.js Engine:** Node.js 20+ (Build verified with Next.js 16.3.8 & React 19)
- **Build Command:** `npm run build` (invokes `next build`)
- **Install Command:** `npm install`
- **Output Directory:** `.next` (Native Next.js default)
- **Vercel Analytics:** Enabled in root layout via `@vercel/analytics/next`

---

## 5. Live Preview QA & Verification Procedure

When testing a Vercel Preview deployment:

### Step 1: Public Marketing & Static Routes
- Inspect `/`, `/features`, `/pricing`, `/docs`, `/articles`, `/about`, `/contact`.
- Check that brand typography (`NewBlack`, `LT-amber`) and assets load without 404s.
- Verify light mode and dark mode theme switching.

### Step 2: Authentication Boundary & Middleware
- Access `/login`, `/signup`, `/forgot-password`, `/reset-password`.
- Attempt unauthenticated access to `/app/dashboard` → confirm redirect to `/login?next=%2Fapp%2Fdashboard`.
- Verify absence of technical database errors or exposed secrets in browser developer tools.

### Step 3: Catalog & Operational Modules
- Navigate to `/app/products`, `/app/products/new`, `/app/categories`.
- When connected to Supabase: verify product list, category list, drawer creation forms, and Zod validation error states.
- If Supabase environment variables are missing/unconnected in Preview: verify fallback UI and graceful error handling without uncaught runtime exceptions.

### Step 4: Multi-Viewport & Responsive Checks
- Desktop (1440px+): Verify dense table data, top header command bar, and breadcrumbs.
- Tablet (810px–1439px): Verify responsive table scroll containers and grid wrapping.
- Mobile (<810px): Verify mobile navigation drawer, single-column forms, and zero horizontal page overflow.

---

## 6. Production Release Boundary

```
[develop branch] ──(PR & QA)──> [Vercel Preview Verified] ──(Approved Merge)──> [main branch] ──> [Vercel Production]
```

- **Rule 1:** Direct pushes to `main` are restricted.
- **Rule 2:** `develop` is never deployed directly to the production domain.
- **Rule 3:** A release to production occurs solely by merging the verified `develop` branch into `main` after all validation gates pass.
