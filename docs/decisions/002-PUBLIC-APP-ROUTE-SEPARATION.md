# ADR 002: Public Marketing Website and Authenticated Application Route Separation

**Status:** APPROVED
**Date:** 2026-10-04
**Context:** SETUP 06

## Context

During initial prototyping of SETUP 06, the authenticated application shell (`AppShell`) was directly attached to the root route (`/`). This conflated the public marketing and customer acquisition experience with the operational SaaS product dashboard.

## Decision

We establish an explicit architectural boundary separating:
1. **Public Marketing Website** (`/`, `/features`, `/pricing`, `/docs`, `/articles`, `/articles/[slug]`, `/about`, `/contact`, `/login`, `/signup`, `/privacy`, `/terms`, `/cookie-policy`, `/disclaimer`, `/404`)
2. **Authenticated SaaS Application** (`/app`, `/app/dashboard`, `/app/products`, `/app/inventory/*`, `/app/sales/*`, `/app/purchases/*`, `/app/reports/*`, `/app/settings/*`)

## Architecture Structure

- Route groups in Next.js App Router:
  - `app/(marketing)/...` — owns root `/` and all public marketing pages with `MarketingLayout`, `MarketingHeader`, and `MarketingFooter`.
  - `app/(application)/app/...` — owns `/app/*` with `AppShell`, `AppSidebar`, and `AppHeader`.
  - `app/layout.tsx` — root layout providing HTML structure, typography tokens, and global CSS.

## Consequences

- Clear separation between public SEO/marketing content and operational SaaS state.
- Distinct navigation models (Marketing top navbar vs Application persistent sidebar & command center).
- Root `/` renders the high-fidelity Aoutive-adapted landing page.
- Application dashboard is located at `/app/dashboard` (with `/app` redirecting to `/app/dashboard`).
- No fake business data rendered on either public marketing or shell preview states.
