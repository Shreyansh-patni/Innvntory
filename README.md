# Innvntory

**Company:** Sahaya Technologies Pvt. Ltd.  
**Description:** A modern business operating system for inventory-driven businesses. Making inventory and everyday business operations simple, reliable, and accessible from anywhere.  
**Primary Market:** India (GST Active, INR Currency)

---

## MVP Baseline Overview

The Innvntory MVP is a complete, production-quality, multi-tenant SaaS foundation featuring:

- **Authentication & Workspace:** Supabase Auth (email/password, password recovery, session refresh, tenant organization provisioning, membership management, and Role-Based Access Control).
- **Public Demo Experience:** Accessible at `/login` with credentials `demo@innvntory.com` / `demo@1234`, loaded with a canonical 50-SKU dataset, and scheduled for automated reset every 2 hours via Vercel Cron (`0 */2 * * *`).
- **Interactive Onboarding:** 4-step business setup wizard for new tenants, and an interactive 3-step feature tour for demo guests.
- **Persistent Light / Dark Theme:** Light mode default with full dark mode support, persistent in PostgreSQL for authenticated users, and browser-scoped for public demo sessions.
- **Command Center (`⌘K` / `Ctrl+K`):** Global keyboard shortcut modal providing instant search and jump navigation across all 20+ application modules.
- **Business & Catalog:** Products (50 SKUs across 8 categories), B2B Customers (20 accounts with GSTINs and credit limits), Suppliers (10 vendors with payment terms), Categories (HSN codes & GST tax slabs).
- **Multi-Warehouse Inventory:** 3 operational locations (Bhiwandi Central, Pune Fulfillment, Bangalore Regional Depot), real-time stock balances, inter-warehouse transfers, cycle count adjustments, and an immutable inventory movements ledger.
- **Purchasing Operations:** Purchase Orders (POs), Inward Goods Receipts (GRNs), Vendor Returns (Debit Notes), and Supplier Payment records.
- **Sales Operations:** Sales Orders (SOs), GST Tax Invoices, Sales Returns (Credit Notes & Stock Restoration), and Customer Payment settlements.
- **Real-Time Analytics & Reporting:** Executive Dashboard KPIs, Sales Analytics Report, Purchases Report, Inventory Valuation Report, and Financial P&L Cash Flow Report.

---

## Architecture & Technology Stack

- **Framework:** Next.js (App Router, Turbopack, React 19, TypeScript)
- **Styling:** Tailwind CSS v4, shadcn/ui, base-ui
- **Typography:** `NewBlack` (Primary / Display) & `LT-amber` (Secondary / UI)
- **Database & Platform:** Hosted Supabase (PostgreSQL 15+, Auth, RLS, Storage)
- **Deployment:** Vercel (develop → Preview | main → Production)

---

## Quality Gates & Verification

```bash
# Run linting
npm run lint

# Run type checking
npm run typecheck

# Run test suite (Unit, Integration, Security, E2E)
npm test

# Run production build
npm run build

# Provision or manually reset demo workspace
npm run demo:provision
npm run demo:reset
```

---

## Deferred Roadmap (Post-MVP)

The following capabilities are deliberately planned for subsequent phases:
- Point of Sale (POS) & offline cash register
- Polar subscription billing engine & automated customer tiers
- Advanced e-way bill & direct NIC e-invoicing portal integration
- Automated payment gateway webhooks (Razorpay / Stripe)
- Third-party accounting sync (Tally, Zoho Books, QuickBooks)
- Ecommerce marketplace connectors (Shopify, Amazon, WooCommerce)
- AI demand forecasting and autonomous inventory replenishment
