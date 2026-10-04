# Innvntory

**Company:** Sahaya Technologies Pvt. Ltd.  
**Description:** A modern business operating system for inventory-driven businesses. Making inventory and everyday business operations simple, reliable, and accessible from anywhere.

## Current Status
**SETUP 06 Completed:** Public marketing website architecture and authenticated application shell established.

## Architecture
- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4
- **UI Primitives:** shadcn/ui & base-ui
- **Typography:** `NewBlack` (Primary / Display) and `LT-amber` (Secondary / UI)
- **Backend / DB:** Supabase (PostgreSQL, Auth, Storage) — *To be connected in future setup phases*
- **SaaS Billing:** Polar — *To be connected in future setup phases*

## Routing Structure
- **Public Marketing Website (`/`):**
  - `/` — Product Landing Page (Aoutive-adapted layout)
  - `/features` — Categorized Platform Capabilities
  - `/pricing` — Multi-tier Plan Matrix (Free, Starter, Growth, Business, Enterprise)
  - `/docs` & `/docs/[slug]` — User-facing Documentation Hub
  - `/articles` & `/articles/[slug]` — Editorial Publications & Notes
  - `/about` — Company Vision & Long-Term Roadmap
  - `/contact` — Enterprise Solutions & Inquiries
  - `/login` & `/signup` — Authentication Entry Points
  - `/privacy`, `/terms`, `/cookie-policy`, `/disclaimer` — Legal & Governance Guidelines
- **Authenticated Application (`/app/*`):**
  - `/app/dashboard` — Application Shell Preview
  - Collapsible persistent navigation, command-center trigger (`⌘K`), and mobile drawer.

## What is NOT Implemented Yet
- Live database queries and mutations
- Real authentication flows (Supabase Auth)
- Products CRUD, Inventory Movements, Sales, Purchases, Reports
- SaaS billing integrations (Polar)
- Business logic / real transaction records
