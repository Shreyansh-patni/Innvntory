# Innvntory

**Company:** Sahaya Technologies Pvt. Ltd.  
**Description:** A modern business operating system for inventory-driven businesses. Making inventory and everyday business operations simple, reliable, and accessible from anywhere.

## Current Status
- **Public Website & Auth:** Public landing page, documentation, publications, legal pages, and Supabase Authentication workflows established.
- **Application Shell:** High-density authenticated application layout (`/app/*`) with persistent navigation, breadcrumbs, search/filter toolbars, and truthful empty states.
- **Database & Multitenancy:** Supabase PostgreSQL migrations, Row Level Security (RLS), RBAC permissions catalog, and immutable audit logs established.
- **Observability:** Vercel Web Analytics integrated at the application root layout (`app/layout.tsx`). No custom event tracking is currently enabled. Production metrics are available through the Vercel project dashboard after deployment.

## Architecture
- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4
- **UI Primitives:** shadcn/ui & base-ui
- **Typography:** `NewBlack` (Primary / Display) and `LT-amber` (Secondary / UI)
- **Backend / Platform:** Supabase (PostgreSQL 15+, Auth, Storage, Realtime)
- **Analytics / Observability:** Vercel Web Analytics (`@vercel/analytics`)
- **SaaS Billing:** Polar (Planned)
