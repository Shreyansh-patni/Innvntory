# INNVNTORY KNOWLEDGE BASE

## Project Identity & Purpose
**Innvntory** by Sahaya Technologies Pvt. Ltd. is a modern business operating system for inventory-driven businesses in India. The goal is to make complex business operations feel simple, reliable, and accessible.

## Source-of-Truth Hierarchy
1. User instructions
2. User Safety
3. Security
4. Data Integrity
5. Innvntory Product Requirements (PRD)
6. Approved UX / Design decisions
7. Approved Architecture
8. Project documentation
9. External reference material
10. Skill guidance
11. Framework defaults
12. Implementation convenience

## Major Product Areas (MVP)
- Authentication (Signup, Login, Org, Users)
- Products (CRUD, SKU, Pricing)
- Inventory (Stock, Adjustments, Movements, Warehouses)
- Purchasing (Suppliers, POs, Receiving)
- Sales (Customers, Sales, Invoices, Deduction)
- Dashboard & Reports (Revenue, Low Stock, Basic Reports)
- Security (RBAC, Tenant Isolation)

## Roadmap & Current Phase
**Current Phase:** Phase 4 — Foundation (Repository setup, CI/CD, Auth, Org, RBAC, Database, Core UI).
**V0 Foundation -> V1 Core Inventory -> V1.5 Biz Ops -> V2 Growth -> V3 Intelligence**

## Design Authority
- **Primary Visual Reference:** Aoutive AI (Layout, spacing, rhythm, forms, cards. Do NOT copy branding/identity).
- **Secondary Reference:** Cursor Design Analysis (Restrained language, typography, minimalism).
- **UI Library:** `shadcn/ui` (Primary). Others conditional.

## Architecture Direction
- **Frontend:** Next.js (App Router, Server Components by default), React, TypeScript, Tailwind CSS.
- **Backend / DB:** **Supabase** (PostgreSQL, Auth, Storage, Realtime, RLS).
- **SaaS Billing:** **Polar** (Products, subscriptions, checkouts, webhooks - boundary in `lib/polar/`).
- **Data/Tenancy:** Multi-tenant from day one. Tenant isolation via organization boundaries. Strict referential integrity.

## Security & Testing Principles
- **Security:** No secrets in source control. Env vars. Server-side Auth & Authz. RLS Tenant isolation. Idempotent mutations. Webhook verification.
- **Testing Gates:** Lint → Typecheck → Unit → Integration → E2E → Visual QA → Accessibility → Prod Build → Security → Diff Review.

## Documentation Map
- `docs/source-of-truth/` (Core definitions)
- `docs/product/` (PRD, Flows, Feature Map)
- `docs/design/` (Design System, Responsive, Access, References)
- `docs/architecture/` (System limits & boundaries)
- `docs/database/` (Supabase, Postgres)
- `docs/security/` (Security baseline)
- `docs/testing/` & `docs/engineering/` (Quality & Code Style)
- `docs/decisions/` (Decision records & TBDs)
- `docs/REFERENCE-INDEX.md` (Index of all external info)

## Current Blockers / Known TBD Decisions
Check `docs/decisions/000-TBD-DECISIONS.md`.
