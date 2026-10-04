# INNVNTORY ROUTING ARCHITECTURE

**Status:** EXPANDED WITH PRODUCTS & CATEGORIES (SETUP 11)
**Last Updated:** October 2026

---

## 1. Public Marketing Website & Authentication (`/`)

The public website provides product information, documentation, publications, and authentication entry points. It is powered by `app/(marketing)/...` and `app/auth/...`.

| Route | Purpose | Status | Layout / Experience |
| :--- | :--- | :--- | :--- |
| `/` | Product Landing Page | **Implemented** | `MarketingLayout` + Hero, Capabilities, Workflow, FAQ, CTA |
| `/features` | Platform Capabilities Breakdown | **Implemented** | `MarketingLayout` + Categorized Domain Feature Cards |
| `/pricing` | Tiered Pricing & Plan Matrix | **Implemented** | `MarketingLayout` + Free, Starter, Growth, Business, Enterprise Tiers |
| `/docs` | Public Documentation Hub | **Implemented** | `MarketingLayout` + Quickstart + Category Topic Guides |
| `/docs/[slug]` | Topic Detail Guides | **Implemented** | `MarketingLayout` + Reading Measure & Operational Instructions |
| `/articles` | Publication & Essays Archive | **Implemented** | `MarketingLayout` + Featured Article + Archive Grid |
| `/articles/[slug]` | Editorial Article Detail | **Implemented** | `MarketingLayout` + Long-form Reading Layout & Author Attribution |
| `/about` | Company Vision & Philosophy | **Implemented** | `MarketingLayout` + Sahaya Tech Overview & 4-Phase Roadmap |
| `/contact` | Solutions & Sales Inquiries | **Implemented** | `MarketingLayout` + Contact Info & Visual Form Structure |
| `/login` | Workspace Sign In Entry | **Implemented (Full Auth)** | `MarketingLayout` + Interactive `LoginForm` with `loginAction` |
| `/signup` | Workspace Registration & Onboarding | **Implemented (Full Auth)** | `MarketingLayout` + Interactive `SignupForm` with `signupAction` |
| `/forgot-password` | Password Recovery Request | **Implemented (Full Auth)** | `MarketingLayout` + Interactive `ForgotPasswordForm` |
| `/reset-password` | Set New Password | **Implemented (Full Auth)** | `MarketingLayout` + Interactive `ResetPasswordForm` |
| `/auth/callback` | Auth Token & Code Exchange Handler | **Implemented (Route Handler)** | Server-side code exchange with safe internal redirect sanitization |
| `/privacy` | Privacy Policy | **Implemented** | `MarketingLayout` + Legal Draft Guidelines |
| `/terms` | Terms & Conditions | **Implemented** | `MarketingLayout` + Legal Draft Guidelines |
| `/cookie-policy` | Cookie & Local Storage Policy | **Implemented** | `MarketingLayout` + Session Token Documentation |
| `/disclaimer` | Operational & Tax Disclaimer | **Implemented** | `MarketingLayout` + Legal & Computation Notice |
| `/404` | Global Not Found (Explicit & Fallback) | **Implemented** | Centered 404 Error State with Navigation Links |

---

## 2. Authenticated SaaS Application (`/app/*`)

The authenticated application is protected server-side via Next.js `middleware.ts` and wrapped with `AppShell`, persistent desktop sidebar (`AppSidebar`), mobile drawer (`MobileNavigation`), top header (`AppHeader`), and shared operational UI primitives.

| Route | Purpose | Status | Notes |
| :--- | :--- | :--- | :--- |
| `/app` | Application Root | **Implemented** | Redirects to `/app/dashboard` |
| `/app/dashboard` | Operational Dashboard Shell | **Implemented** | High-density operational KPI cards, ledger state, reorder alerts, quick actions |
| `/app/products` | Product Master Catalog | **Implemented (Full CRUD)** | Server-side pagination, search, category filter, operational table, and status pills |
| `/app/products/new` | Create Product Record | **Implemented (Full CRUD)** | Form for item name, SKU, barcode, category, UOM, and price points |
| `/app/products/[id]` | Edit & Inspect Product Details | **Implemented (Full CRUD)** | Edit master item details, price adjustments, and archive lifecycle management |
| `/app/categories` | Product Tax & Category Codes | **Implemented (Full CRUD)** | Category management with HSN/SAC codes and default GST percentage rates |
| `/app/customers` | Customer Directory & Ledger | **Implemented (UI Foundation)** | Customer type filters, credit ledger headers, search toolbar |
| `/app/suppliers` | Supplier Directory & Ratings | **Implemented (UI Foundation)** | Vendor search, lead-time/rating column headers, placeholder table |
| `/app/inventory/stock` | Multi-Warehouse Stock Ledger | **Implemented (UI Foundation)** | Multi-warehouse balance ledger, reorder levels, reserved inventory slots |
| `/app/inventory/warehouses`| Warehouse Facilities & Bins | **Implemented (UI Foundation)** | Warehouse facility cards, bin management, capacity indicators |
| `/app/inventory/transfers` | Inter-Facility Transfers | **Implemented (UI Foundation)** | Inter-warehouse dispatch/receipt tracking, status filters |
| `/app/inventory/adjustments`| Stock Audits & Adjustments | **Implemented (UI Foundation)** | Physical count cycle reconciliation, audit variances, reason codes |
| `/app/inventory/movements` | Immutable Stock Movements | **Implemented (UI Foundation)** | Double-entry stock ledger, timestamped movement journal |
| `/app/sales/orders` | Sales Orders Intake | **Implemented (UI Foundation)** | SO intake, allocation statuses, fulfillment tracking |
| `/app/sales/invoices` | GST Tax Invoices | **Implemented (UI Foundation)** | GST-compliant invoice registry, payment statuses, due date tracking |
| `/app/sales/returns` | Sales Returns & Credit Notes | **Implemented (UI Foundation)** | RMA intake, disposition inspection, credit note issuance |
| `/app/sales/payments` | Payment Receipts & Aging | **Implemented (UI Foundation)** | Inward payment allocation, bank transfer reconciliation |
| `/app/purchases/orders` | Purchase Orders (PO) | **Implemented (UI Foundation)** | Procurement PO creation, supplier receipt tracking |
| `/app/purchases/receipts` | Goods Received Notes (GRN) | **Implemented (UI Foundation)** | Inbound goods verification, put-away inspection workflows |
| `/app/purchases/returns` | Vendor Returns & Debit Notes | **Implemented (UI Foundation)** | Debit note management, non-conforming goods dispatch |
| `/app/purchases/payments` | Vendor Bills & Outflows | **Implemented (UI Foundation)** | Accounts payable disbursements, voucher tracking |
| `/app/reports/sales` | Sales Velocity Analytics | **Implemented (UI Foundation)** | Revenue trends, category velocity, empty analytics state |
| `/app/reports/purchases` | Procurement Analytics | **Implemented (UI Foundation)** | Spend analysis, supplier performance, empty state |
| `/app/reports/inventory` | Stock Valuation (FIFO/WAC) | **Implemented (UI Foundation)** | Valuation reports, dead-stock analysis, turnover metrics |
| `/app/reports/financial` | Gross Margin & Profitability | **Implemented (UI Foundation)** | GST summary prep, COGS computation, trial balance status |
| `/app/settings/organization`| Organization Profile & GSTN | **Implemented (UI Foundation)** | Legal entity configuration, GSTIN registrations, fiscal year rules |
| `/app/settings/users` | Team Member Provisioning | **Implemented (UI Foundation)** | RBAC user directory, warehouse location assignments |
| `/app/settings/roles` | Role-Based Access Control | **Implemented (UI Foundation)** | Role policy overview, system permission matrices |
| `/app/settings/integrations`| Webhooks & REST API Keys | **Implemented (UI Foundation)** | Storefront, ERP connectors, webhook endpoints |
| `/app/settings/billing` | Subscription & Invoices | **Implemented (UI Foundation)** | Tier information, seat limits, warehouse quotas, tax invoicing |
| `/app/settings/security` | Audit Logs & 2FA Governance | **Implemented (UI Foundation)** | MFA policy, session termination, cryptographic audit logging |
