# INNVNTORY ROUTING ARCHITECTURE

**Status:** IMPLEMENTED (SETUP 06)
**Last Updated:** October 2026

---

## 1. Public Marketing Website (`/`)

The public website provides product information, documentation, publications, and authentication entry points. It is powered by `app/(marketing)/...`.

| Route | Purpose | Status | Layout / Experience |
| :--- | :--- | :--- | :--- |
| `/` | Product Landing Page | **Implemented** | `MarketingLayout` + Hero, Capabilities, Workflow, FAQ, CTA |
| `/features` | Platform Capabilities Breakdown | **Implemented** | `MarketingLayout` + Categorized Domain Feature Cards |
| `/pricing` | Tiered Pricing & Plan Matrix | **Implemented** | `MarketingLayout` + Free, Starter, Growth, Business, Enterprise Tiers (TBD prices) |
| `/docs` | Public Documentation Hub | **Implemented** | `MarketingLayout` + Quickstart + Category Topic Guides |
| `/docs/[slug]` | Topic Detail Guides | **Implemented** | `MarketingLayout` + Reading Measure & Operational Instructions |
| `/articles` | Publication & Essays Archive | **Implemented** | `MarketingLayout` + Featured Article + Archive Grid |
| `/articles/[slug]` | Editorial Article Detail | **Implemented** | `MarketingLayout` + Long-form Reading Layout & Author Attribution |
| `/about` | Company Vision & Philosophy | **Implemented** | `MarketingLayout` + Sahaya Tech Overview & 4-Phase Roadmap |
| `/contact` | Solutions & Sales Inquiries | **Implemented** | `MarketingLayout` + Contact Info & Visual Form Structure |
| `/login` | Workspace Sign In Entry | **Implemented** | `MarketingLayout` + Minimalist Auth Form |
| `/signup` | Workspace Registration Entry | **Implemented** | `MarketingLayout` + Onboarding Registration Form |
| `/privacy` | Privacy Policy | **Implemented** | `MarketingLayout` + Legal Draft Guidelines |
| `/terms` | Terms & Conditions | **Implemented** | `MarketingLayout` + Legal Draft Guidelines |
| `/cookie-policy` | Cookie & Local Storage Policy | **Implemented** | `MarketingLayout` + Session Token Documentation |
| `/disclaimer` | Operational & Tax Disclaimer | **Implemented** | `MarketingLayout` + Legal & Computation Notice |
| `/404` | Global Not Found | **Implemented** | Centered 404 Error State with Navigation Links |

---

## 2. Authenticated SaaS Application (`/app/*`)

The authenticated application is wrapped with `AppShell`, persistent desktop sidebar (`AppSidebar`), mobile drawer (`MobileNavigation`), and top header (`AppHeader`).

| Route | Purpose | Status | Notes |
| :--- | :--- | :--- | :--- |
| `/app` | Application Root | **Implemented** | Redirects to `/app/dashboard` |
| `/app/dashboard` | Operational Dashboard Shell | **Implemented (Structural)** | Neutral preview state with getting-started cards |
| `/app/products` | Product Master Catalog | Planned | Navigation entry active in sidebar |
| `/app/customers` | Customer Directory & Ledger | Planned | Navigation entry active in sidebar |
| `/app/suppliers` | Supplier Directory & Ratings | Planned | Navigation entry active in sidebar |
| `/app/categories` | Product Tax & Category Codes | Planned | Navigation entry active in sidebar |
| `/app/inventory/stock` | Multi-Warehouse Stock Ledger | Planned | Navigation entry active in sidebar |
| `/app/inventory/warehouses`| Warehouse Facilities & Bins | Planned | Navigation entry active in sidebar |
| `/app/inventory/transfers` | Inter-Facility Transfers | Planned | Navigation entry active in sidebar |
| `/app/inventory/adjustments`| Stock Audits & Adjustments | Planned | Navigation entry active in sidebar |
| `/app/inventory/movements` | Immutable Stock Movements | Planned | Navigation entry active in sidebar |
| `/app/sales/orders` | Sales Orders Intake | Planned | Navigation entry active in sidebar |
| `/app/sales/invoices` | GST Tax Invoices | Planned | Navigation entry active in sidebar |
| `/app/sales/returns` | Sales Returns & Credit Notes | Planned | Navigation entry active in sidebar |
| `/app/sales/payments` | Payment Receipts & Aging | Planned | Navigation entry active in sidebar |
| `/app/purchases/orders` | Purchase Orders (PO) | Planned | Navigation entry active in sidebar |
| `/app/purchases/receipts` | Goods Received Notes (GRN) | Planned | Navigation entry active in sidebar |
| `/app/purchases/returns` | Vendor Returns & Debit Notes | Planned | Navigation entry active in sidebar |
| `/app/purchases/payments` | Vendor Bills & Outflows | Planned | Navigation entry active in sidebar |
| `/app/reports/sales` | Sales Velocity Analytics | Planned | Navigation entry active in sidebar |
| `/app/reports/purchases` | Procurement Analytics | Planned | Navigation entry active in sidebar |
| `/app/reports/inventory` | Stock Valuation (FIFO/WAC) | Planned | Navigation entry active in sidebar |
| `/app/reports/financial` | Gross Margin & Profitability | Planned | Navigation entry active in sidebar |
| `/app/settings/organization`| Organization Profile & GSTN | Planned | Navigation entry active in sidebar |
| `/app/settings/users` | Team Member Provisioning | Planned | Navigation entry active in sidebar |
| `/app/settings/roles` | Role-Based Access Control | Planned | Navigation entry active in sidebar |
| `/app/settings/integrations`| Webhooks & REST API Keys | Planned | Navigation entry active in sidebar |
| `/app/settings/billing` | Subscription & Invoices | Planned | Navigation entry active in sidebar |
| `/app/settings/security` | Audit Logs & 2FA Governance | Planned | Navigation entry active in sidebar |
