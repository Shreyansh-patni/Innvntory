# Innvntory — Antigravity Vibe-Coding Setup Pack

Version: 0.1
Status: PRE-IMPLEMENTATION / SETUP ONLY
Product: Innvntory
Company: Sahaya Technologies Pvt. Ltd.
Primary market: India
Build environment: Google Antigravity
Product category: Inventory & Business Management SaaS

> This pack prepares the repository, agent context, documentation, skills, design authority, validation model, and working conventions.
> It does NOT authorize feature implementation. Do not begin product feature work until the project owner explicitly starts the first implementation slice.

---

# 1. SOURCE-OF-TRUTH HIERARCHY

Use this hierarchy whenever instructions conflict:

1. User safety
2. Security
3. Data integrity
4. Innvntory product requirements
5. Approved visual/design references
6. Explicit architecture and engineering decisions
7. Implementation convenience

Product source of truth:
- `docs/PRD.md`
- `docs/PRODUCT-DEFINITION.md` (if retained as the source copy)
- `docs/ROADMAP.md`

Visual source of truth:
- `docs/design-references/`
- `docs/DESIGN-SYSTEM.md`

Reference hierarchy for visual work:
1. Approved Aoutive AI reference screenshots + supplied HTML exports — primary/exact visual reference
2. Cursor design analysis — secondary reference for design principles, refinement, and product-tool aesthetic
3. Innvntory-specific brand requirements — adaptation layer
4. UI library defaults — implementation primitives only

Important:
- Do not copy Aoutive's brand, logo, name, copy, proprietary identity, or product content.
- Reproduce the approved structural/aesthetic characteristics for Innvntory.
- Do not introduce a different visual direction without explicit product-owner approval.

---

# 2. INNVNTORY PRODUCT CONTEXT

## 2.1 Product definition

Innvntory is a modern, cloud-first inventory and business management SaaS for businesses that need a reliable system to manage products, inventory, purchasing, sales, customers, suppliers, orders, payments, billing, reports, and business operations.

Core objective:
> Make inventory and everyday business operations simple, reliable, and accessible from anywhere.

Long-term direction:
> Inventory Management -> Business Operations -> Business Intelligence -> AI-powered Business OS.

Product philosophy:
- Fast
- Simple
- Reliable
- Beautiful
- Predictable
- Extensible
- Secure
- Intelligent

Core product principle:
> Make complex business operations feel simple.

## 2.2 Initial ICP

- 1–10 locations
- 1–100 employees
- 100–100,000 SKUs

Target businesses:
- Retail
- Wholesale
- Distributors
- Electronics
- Mobile
- Hardware
- Apparel
- Footwear
- Grocery
- Pharmacies
- Spare parts
- Small manufacturers
- Multi-location retailers
- E-commerce sellers

## 2.3 Core personas

- Owner
- Inventory manager
- Sales operator
- Purchase manager
- Accountant
- Administrator

## 2.4 MVP

Authentication:
- Signup
- Login
- Organization creation
- User management

Products:
- Product CRUD
- Categories
- SKU
- Barcode
- Pricing

Inventory:
- Stock
- Stock adjustments
- Stock movements
- Warehouses

Purchasing:
- Suppliers
- Purchase orders
- Stock receiving

Sales:
- Customers
- Sales
- Invoices
- Stock deduction

Dashboard:
- Revenue
- Inventory
- Low stock
- Recent activity

Reports:
- Stock report
- Sales report
- Purchase report

Security:
- RBAC
- Tenant isolation
- Audit logs

## 2.5 Post-MVP

- POS
- Advanced GST
- Payments
- Multi-location
- Advanced reports
- Import/export
- Mobile app
- Notifications
- Integrations
- AI assistant
- Demand forecasting
- Automation

## 2.6 Navigation

Dashboard

Business
- Products
- Customers
- Suppliers
- Categories

Inventory
- Stock
- Warehouses
- Transfers
- Adjustments
- Movements

Sales
- Orders
- Invoices
- Returns
- Payments

Purchases
- Purchase Orders
- Receipts
- Returns
- Payments

Reports
- Sales
- Purchases
- Inventory
- Financial

Settings
- Organization
- Users
- Roles
- Integrations
- Billing
- Security

## 2.7 Command center

Global Ctrl/Cmd+K should eventually support:
- Search products
- Create product
- Create invoice
- Create customer
- Create supplier
- Open reports
- Navigate pages
- Switch warehouse
- Switch organization

Do not implement this during setup.

---

# 3. APPROVED UI LIBRARY STRATEGY

## Default order

1. shadcn/ui — primary foundation
2. Watermelon UI — only for a justified specific component/pattern
3. Aceternity UI — only for a justified visual/interaction need
4. Magic UI — only for a justified visual/interaction need
5. Motion Primitives — only for a justified motion need
6. HeroUI — only for a justified component need

Rules:
- shadcn/ui first.
- Never add a second library merely because it looks attractive.
- Before adding a library, record why existing primitives cannot solve the need.
- Avoid duplicate versions of the same primitive.
- Prefer owning and customizing shadcn source components inside the repo.
- Keep the final visual language consistent even when a secondary library is used.
- Motion must never be required for comprehension.
- Accessibility and performance outrank visual novelty.

Dependency gate:
Before installing anything, ask:
- Do we need it?
- Can existing project tools solve it?
- Is it maintained?
- What bundle size, complexity, and security risk does it add?

---

# 4. DESIGN REFERENCE SYSTEM

## 4.1 Aoutive AI — primary exact reference

Reference files:
- Home page screenshot
- About Us screenshot
- Articles screenshot
- Article Details screenshot
- Contact screenshot
- 404 screenshot
- Corresponding HTML exports

Observed characteristics to preserve when adapting to Innvntory:
- Minimal premium SaaS presentation
- Light/off-white page canvas
- Very restrained monochrome palette
- Strong black typography
- Thin, visible 1px structural borders
- Grid/cross guide visual language around page boundaries
- Generous whitespace
- Wide centered content container
- Minimal top navigation
- Compact dark primary CTA
- Secondary light/outlined actions
- Editorial-style section layouts
- Two-column and three-column compositions
- Image-led feature blocks
- Cards using borders instead of heavy shadows
- FAQ rows with clear separators and +/− affordances
- Strong CTA band before footer
- Multi-column footer with restrained typography
- Article pages with strong centered titles, metadata, author treatment, wide hero imagery and readable article measure
- Contact page with asymmetric text/form split and FAQ support area
- 404 page with large central illustration and simple return action
- Responsive variants for desktop/tablet/mobile

HTML evidence shows:
- Root background around `rgb(252,252,252)`
- Primary text around `rgb(26,26,26)`
- Structural borders around `rgb(239,239,239)`
- A content max width around 1224px in the exported layout calculations
- Desktop/tablet/mobile breakpoint families around 1440px, 810px, and below 810px
- Aoutive uses a restrained component system with 1px borders and small radii in multiple places

Treat those values as reference observations, not automatic Innvntory tokens. Build Innvntory tokens from them rather than hardcoding visual values throughout the app.

## 4.2 Cursor — secondary principle reference

The Cursor analysis contributes:
- warm, calm editorial restraint
- near-black ink
- hairline-based depth
- generous section rhythm
- restrained accent usage
- display typography with lighter weights and negative tracking
- JetBrains Mono for code/data-oriented surfaces
- strong container/grid discipline
- explicit responsive and component state thinking

Do not copy Cursor's exact colors, wordmark, typography, or product identity.

## 4.3 Innvntory adaptation

Innvntory is a business operations product, not an AI automation landing page.

Therefore:
- preserve the visual discipline of Aoutive
- adapt information density to operational software
- use clear tables, filters, status indicators and forms
- use restrained accent color(s) only where they improve hierarchy
- preserve whitespace without sacrificing business-data density
- favor clarity over decorative effects

---

# 5. DIRECTORY STRUCTURE

Target structure after setup:

```text
innvntory/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── (app)/
│   └── api/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── data-display/
│   └── [feature]/
├── content/
│   ├── marketing/
│   ├── help/
│   └── seed/
├── lib/
│   ├── auth/
│   ├── db/
│   ├── services/
│   ├── integrations/
│   ├── permissions/
│   ├── validation/
│   ├── observability/
│   └── utils/
├── public/
│   ├── images/
│   ├── icons/
│   └── brand/
├── docs/
│   ├── design-references/
│   ├── decisions/
│   ├── agents/
│   ├── skill-manifest/
│   ├── PRD.md
│   ├── PRODUCT-DEFINITION.md
│   ├── DESIGN-SYSTEM.md
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── CODE-STYLE.md
│   ├── DATABASE.md
│   ├── API-GUIDE.md
│   ├── TESTING.md
│   ├── DEVOPS.md
│   ├── ANALYTICS.md
│   ├── BILLING.md
│   ├── AI.md
│   ├── LAUNCH.md
│   ├── ROADMAP.md
│   ├── KNOWN-ISSUES.md
│   ├── COMPONENTS.md
│   ├── ROUTES.md
│   ├── AI-DECISIONS.md
│   ├── REFERENCE-INDEX.md
│   └── SKILLS.md
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .agents/
│   └── skills/
├── .github/
│   └── workflows/
├── AGENTS.md
├── README.md
├── .env.example
├── .gitignore
├── package.json
└── [framework config files]
```

Do not force this exact structure if the framework generator requires a safer equivalent. Preserve the architectural intent.

---

# 6. DOCUMENTATION INDEX

Required operating documents:

| File | Purpose |
|---|---|
| AGENTS.md | Permanent agent operating rules |
| README.md | Human setup/run/deploy overview |
| docs/PRD.md | Product requirements |
| docs/PRODUCT-DEFINITION.md | High-level product source of truth |
| docs/DESIGN-SYSTEM.md | Visual system and responsive rules |
| docs/ARCHITECTURE.md | System boundaries and data flow |
| docs/SECURITY.md | Security baseline and threat model |
| docs/CODE-STYLE.md | Coding conventions |
| docs/DATABASE.md | Database schema principles and migrations |
| docs/API-GUIDE.md | API/integration rules |
| docs/TESTING.md | Test strategy and quality gates |
| docs/DEVOPS.md | CI/CD, environments, deployment |
| docs/ANALYTICS.md | Product/business analytics |
| docs/BILLING.md | SaaS billing/entitlements |
| docs/AI.md | Future AI architecture and safety |
| docs/LAUNCH.md | Production/launch readiness |
| docs/ROADMAP.md | Current/next/later/not-now |
| docs/KNOWN-ISSUES.md | Known limitations |
| docs/COMPONENTS.md | Component inventory |
| docs/ROUTES.md | Route map |
| docs/AI-DECISIONS.md | Durable AI-specific choices |
| docs/SKILLS.md | Installed/allowed skills |
| docs/REFERENCE-INDEX.md | Design/reference inventory |
| docs/decisions/* | Architecture decision records |

---

# 7. AGENTS.md — MASTER OPERATING RULES

```md
# Innvntory Agent Rules

## Mission
Build Innvntory as a production-quality, multi-tenant inventory and business management SaaS for Sahaya Technologies Pvt. Ltd.

## Current phase
Pre-implementation setup. Unless the product owner explicitly requests implementation, do not build feature functionality.

## Source of truth
Follow:
1. User safety
2. Security
3. Data integrity
4. Innvntory product requirements
5. Approved design references
6. Architecture decisions
7. Implementation convenience

## Design authority
The approved Aoutive AI screenshots and HTML exports are the primary exact visual reference.
Cursor analysis is a secondary principle reference.
Do not copy external branding or proprietary identity.

## Product principles
Simple by default.
Powerful when needed.
Data first.
Automation first.
Cloud first.
Mobile friendly.
Secure by design.
Multi-tenant from day one.
API first.
Production quality.

## Engineering rules
- Plan before meaningful changes.
- One prompt should normally produce one small, testable outcome.
- Inspect before editing when root cause is uncertain.
- Reuse existing code before introducing abstraction.
- Keep content/data separate from rendering.
- Keep reusable UI in components/ui.
- Keep domain feature composition in feature folders.
- Keep integrations behind lib/service boundaries.
- Prefer Server Components by default in Next.js.
- Use Client Components only for interaction, browser APIs, or local state.
- Do not hardcode repeated business data into JSX.
- Validate all untrusted input.
- Keep credentials server-side.
- Keep tenant ownership explicit.
- Inventory mutations must be transactional and auditable.
- Sensitive operations should be idempotent where appropriate.

## UI library rules
Use shadcn/ui first.
Use Watermelon UI, Aceternity UI, Magic UI, Motion Primitives, or HeroUI only when a specific need is documented.
Never mix styles casually.

## Design rules
- Light/off-white refined canvas.
- Thin structural borders.
- restrained shadows; prefer hairlines.
- generous whitespace.
- strong typography hierarchy.
- minimal motion.
- no generic template aesthetics.
- responsive from the start.
- every interactive component considers default, hover, focus, active, disabled, loading, error, success, empty as applicable.
- use screenshot comparison for visual changes.

## Security rules
- Never commit secrets.
- Use environment variables / secret managers.
- Server-side authz is mandatory.
- Enforce tenant isolation.
- Runtime-validate external and user input.
- Sanitize user-generated content.
- Verify webhooks.
- Make replay-sensitive handlers idempotent.
- Avoid sensitive information in logs.
- Use least privilege.

## Quality gates
For meaningful batches:
- lint
- typecheck
- relevant unit/integration tests
- E2E when relevant
- production build
- visual QA
- accessibility review
- Git diff review

## Git safety
- Work on focused branches.
- Do not mix unrelated refactors.
- Use focused commits.
- Never rewrite unrelated areas.
- Commit only after validation passes unless the owner instructs otherwise.

## Prompt boundary
Implement the requested outcome.
Verify it.
Stop.
Do not expand scope or redesign unrelated areas.

## Explicit do-not list
- Do not build the whole product in one prompt.
- Do not invent product/customer/company facts.
- Do not overwrite the approved design reference.
- Do not install every UI library.
- Do not add APIs before they are needed.
- Do not make everything a Client Component.
- Do not ignore loading/empty/error/permission/offline states.
- Do not ship without production-like QA.
- Do not over-abstract early.
```

---

# 8. docs/PRD.md — INITIAL CONTENT

```md
# Innvntory PRD

## Product
Innvntory

## Company
Sahaya Technologies Pvt. Ltd.

## Problem
Businesses managing physical inventory often rely on disconnected, overly complex, or unreliable tools for products, stock, purchasing, sales, customers, suppliers, billing, and reporting.

## User
Small and medium businesses managing physical inventory.

## Desired outcome
A business owner or operator can understand and control inventory and everyday operations from one reliable system without enterprise-software complexity.

## MVP
Authentication, organizations, RBAC, products, categories, SKU/barcode/pricing, warehouses, stock, stock movements, adjustments, suppliers, purchase orders, receiving, customers, sales, invoices, stock deduction, dashboard, reports, tenant isolation, audit logs.

## Non-goals
- Full POS before the core inventory loop is stable
- Broad AI features before operational data is trustworthy
- Large integration catalogue before core workflows are validated
- Premature offline transactions when synchronization/conflict safety is not proven

## Core success checks
- Organization can be created securely.
- Authorized users can access only their organization data.
- Product can be created and managed.
- Purchase can be received into inventory.
- Sale can deduct inventory atomically.
- Invoice reflects the sale.
- Reports reflect persisted business data.
- Critical operations are auditable.
- Critical flows pass automated and visual QA.
```

---

# 9. docs/DESIGN-SYSTEM.md — INITIAL CONTENT

```md
# Innvntory Design System

## Design authority
Primary: supplied Aoutive AI screenshots + HTML exports.
Secondary: Cursor design analysis.
Adaptation: Innvntory product and brand.

## Direction
Refined, minimal, editorial, operational SaaS.
The interface should feel calm and deliberate while still supporting high information density.

## Canvas
Start from an off-white / near-white canvas inspired by the Aoutive reference.
Avoid stark visual noise.

## Text
Near-black primary text.
Neutral secondary text.
Muted text only where hierarchy requires it.

## Borders
1px structural hairlines are preferred.
Use borders to define sections, tables, cards, inputs and layout boundaries.
Avoid heavy borders.

## Shadows
Do not use large drop shadows by default.
Use subtle elevation only where interaction requires it.

## Radius
Prefer small to medium radii.
Avoid excessive pill-shaped UI except for compact tags/statuses where it improves scanning.

## Layout
- Wide centered container.
- Reference desktop container is approximately 1224px.
- Use consistent horizontal rails.
- Preserve strong vertical rhythm.
- Use two-column and three-column compositions where content merits them.

## Breakpoints
Reference Aoutive:
- desktop: >= 1440px
- tablet: 810px–1439px
- mobile: < 810px

Implementation may use framework-standard breakpoint values if the visual result remains faithful.

## Typography
Use a modern sans-serif system with the same calm geometry as the supplied reference.
Prefer the closest open and maintainable font available to the project.
Do not copy licensed third-party brand fonts merely for similarity.
Data/code surfaces may use a monospace face where readability benefits.

## Buttons
Primary:
- dark, high-contrast
- compact
- small radius
- clear hover/focus states

Secondary:
- light/white background
- 1px border
- subtle interaction state

## Tables
Tables are first-class components for Innvntory.
- clear header hierarchy
- readable row height
- sticky behavior only where useful
- visible sort/filter state
- horizontal scrolling on narrow screens when necessary
- do not sacrifice data integrity for visual compactness

## Forms
- labels visible
- clear required state
- inline validation
- error text near the field
- keyboard accessible
- consistent input height
- clear submit/loading/success states

## Cards
- border-first
- minimal or no shadow
- clear internal padding
- consistent title/body/meta hierarchy

## Status
Use semantic status tokens consistently.
Do not turn the interface into a rainbow dashboard.

## Motion
Motion is subtle.
No animation should be required to understand or operate a workflow.
Respect reduced-motion preferences.

## Accessibility
- semantic headings
- semantic landmarks
- keyboard navigation
- visible focus
- accessible names
- alt text where meaningful
- sufficient contrast
- usable mobile touch targets

## Visual QA
Every visual change should be checked at desktop, tablet, and mobile, with before/after screenshots when practical.
```

---

# 10. docs/ARCHITECTURE.md — INITIAL CONTENT

```md
# Innvntory Architecture

## Proposed baseline
Frontend:
- Next.js / React
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:
- Next.js server/API capabilities or a dedicated service if complexity later requires separation

Data:
- PostgreSQL via Supabase (selected platform)
- Supabase provides the primary managed backend foundation: Postgres, Auth, Storage, Realtime, and other capabilities where required

Supporting infrastructure:
- Redis and job/worker system only when justified by actual workloads

## Architectural principles
- Multi-tenant from day one
- API first
- Secure by design
- Explicit domain boundaries
- Typed contracts
- Transactional inventory mutations
- Idempotent sensitive operations
- Observable production behavior

## Domain boundaries
- Identity
- Organizations
- Products
- Inventory
- Warehouses
- Purchasing
- Sales
- Billing
- Reporting
- Notifications
- Integrations
- AI

## Server/client boundary
Default to Server Components.
Use Client Components only for:
- local interaction state
- browser APIs
- drag/drop or complex interaction
- live interaction
- client-only UI behavior

## Service boundary
External APIs should be isolated in `lib/integrations` or equivalent.
UI should consume normalized application types.

## Data flow
UI -> typed action/API boundary -> domain/service -> database/integration -> normalized result -> UI

## Future scaling
Do not introduce microservices prematurely.
Split only when ownership, scaling, reliability, or deployment boundaries justify it.
```

---

# 11. docs/SECURITY.md — INITIAL CONTENT

```md
# Innvntory Security Baseline

## Core rules
- Never store secrets in source control.
- Use environment variables and secret management.
- Hash passwords with an approved password hashing approach if custom credentials are ever implemented.
- Enforce authorization server-side.
- Tenant isolation is mandatory.
- Validate input at runtime.
- Sanitize/escape user-generated content.
- Protect against XSS and CSRF where applicable.
- Use secure session/cookie configuration.
- Rate-limit sensitive endpoints.
- Verify webhook signatures.
- Make replay-sensitive operations idempotent.
- Use least-privilege database/service access.
- Keep API errors user-safe.
- Do not log secrets or sensitive payloads.
- Define data retention and deletion behavior.

## Threat-model prompts
For every sensitive feature ask:
1. What can the user/attacker control?
2. What data could be accessed if authorization fails?
3. What happens with malicious input?
4. What happens if a secret leaks?
5. Can the request be replayed?
6. What happens if a dependency lies, fails, or times out?

## Inventory-specific security
- Every tenant-owned record must be scoped to organization ownership.
- Inventory writes must be atomic.
- Audit history must not be casually editable.
- Financial/payment operations require stronger authorization and idempotency.
```

---

# 12. docs/CODE-STYLE.md

```md
# Code Style

- TypeScript-first.
- Prefer explicit types for domain boundaries.
- Avoid `any`.
- Prefer named, descriptive variables.
- Keep components focused.
- Keep business logic out of presentational JSX.
- Keep API/integration code out of components.
- Keep repeated content in typed data files.
- Prefer composition over inheritance.
- Do not abstract until a real reuse pattern appears.
- Use conventional file and folder names.
- Add comments only where they explain why, not what.
- Preserve existing project conventions when they are already established.
```

---

# 13. docs/DATABASE.md

```md
# Innvntory Database

## Database
PostgreSQL

## Tenant rule
Every tenant-owned record should contain `organization_id` or an equivalent explicit ownership path.

## Core entities
organizations
users
memberships
roles
permissions
products
product_variants
categories
brands
units
warehouses
warehouse_stock
stock_movements
stock_transfers
customers
suppliers
sales_orders
sales_order_items
invoices
invoice_items
purchase_orders
purchase_order_items
purchase_receipts
payments
refunds
notifications
audit_logs
subscriptions
plans
usage_records

## Principles
- normalization where it improves integrity
- explicit foreign keys
- referential integrity
- appropriate unique constraints
- intentional indexes
- transactional inventory updates
- safe migrations
- auditable history
- least-privilege access

## Inventory consistency
A stock-changing workflow must never leave partial state.
Use a database transaction where multiple records must change together.

## Migration rules
- every schema change is migration-backed
- never edit production manually as a normal workflow
- test migrations against realistic data
- have a rollback/recovery strategy
```

---

# 14. docs/API-GUIDE.md

```md
# API Guide

## Convention
Use `/api/v1/...` for versioned application APIs where applicable.

## Required concerns
- authentication
- authorization
- validation
- pagination
- filtering
- sorting
- search
- rate limiting
- idempotency for sensitive operations
- request IDs
- structured errors

## External integrations
Create small integration modules.
Never scatter direct fetch calls through UI components.

## External data
Validate external responses at runtime.
Normalize external data to internal types.
Handle:
- timeouts
- retries
- rate limits
- unavailable services
- empty responses
- malformed responses

## Webhooks
- verify signatures
- validate payloads
- make handlers idempotent
- protect replay-sensitive operations
- log safe diagnostics only
```

---

# 15. docs/TESTING.md

```md
# Testing Strategy

## Levels
1. Unit
2. Integration
3. End-to-end
4. Visual QA
5. Accessibility
6. Production build validation

## Critical workflow
Product -> Purchase -> Receive -> Sell -> Deduct -> Invoice -> Payment

## High-risk scenarios
- concurrent sales
- duplicate webhook
- tenant isolation
- permission denial
- invalid input
- empty dataset
- integration timeout
- retry
- partial failure
- duplicate submission

## Visual regression
Check:
- desktop
- tablet
- mobile
- no overflow
- no clipping
- no overlap
- image/logo correctness
- focus states
- reduced motion
```

---

# 16. docs/DEVOPS.md

```md
# DevOps

## Environments
- Local
- Development
- Staging
- Production

## CI
Minimum sequence:
lint
typecheck
unit tests
integration tests
build
security checks

## Preview
Local -> checks -> Git diff -> preview -> smoke test -> approve -> production

## Production
- health checks
- logs
- error monitoring
- uptime monitoring
- backup verification
- rollback path

## Git
Branches:
- main
- develop
- feature/*
- fix/*
- hotfix/*

Commit style:
feat:
fix:
style:
perf:
chore:
docs:
```

---

# 17. docs/ANALYTICS.md

```md
# Analytics

Track useful product events without collecting unnecessary personal data.

Core events:
organization_created
product_created
product_imported
warehouse_created
purchase_created
sale_created
invoice_created
payment_recorded
stock_adjusted
report_viewed
subscription_started
subscription_upgraded

Business metrics:
- signups
- activated organizations
- trial starts
- first product
- first purchase
- first sale
- first invoice
- WAO/MAO
- transactions
- retention
- MRR
- ARR
- ARPU
- expansion
- churn

Activation:
organization created
+ products added
+ first inventory received
+ first sale/invoice completed
```

---

# 18. docs/BILLING.md

```md
# Billing

Billing platform: Polar (selected)
- Use Polar as the SaaS subscription billing / Merchant of Record layer.
- Integrate through the official Polar TypeScript SDK and/or official Next.js adapter as appropriate.
- Keep subscription and entitlement state synchronized through verified Polar webhooks.
- Treat Polar as the billing authority for subscription lifecycle events.

Plans:
- Free
- Starter
- Growth
- Business
- Enterprise

Entitlement dimensions may include:
- users
- locations
- products/SKUs
- transactions
- features
- storage
- integrations
- API requests

Rules:
- centralize entitlement checks
- do not duplicate limits throughout UI code
- billing state is server-authoritative
- UI should present current entitlement status
- exact pricing remains a product/business decision
- Never trust client-submitted subscription status.
- Webhook handlers must verify signatures, validate payloads, and be idempotent.
- Checkout/payment secrets remain server-side.
- Keep Polar-specific integration code behind a billing/integration boundary so the domain model is not coupled to vendor payloads.
```

---

# 19. docs/AI.md

```md
# AI Direction

AI is a future intelligence layer over trusted operational data.

Long-term capabilities:
- AI assistant
- demand forecasting
- smart reordering
- business insights
- anomaly detection
- automation

Principles:
- do not let AI become the source of truth for financial/inventory facts
- AI recommendations must be traceable to available data
- sensitive actions require explicit authorization
- AI must not silently mutate inventory or financial state
- prompts and durable AI decisions belong in `docs/AI-DECISIONS.md`
```

---

# 20. docs/LAUNCH.md

```md
# Launch Readiness

## Product
- critical workflows validated
- onboarding complete
- empty states complete
- error states complete
- help/support path exists

## Engineering
- type safety
- unit tests
- integration tests
- E2E tests
- migrations
- CI/CD
- monitoring

## Security
- RBAC
- tenant isolation
- secure auth
- rate limiting
- validation
- audit logs
- dependency scanning
- secrets management

## Infrastructure
- production environment
- backups
- recovery procedure
- logging
- alerts
- health checks

## Business
- pricing
- terms
- privacy
- billing
- support
```

---

# 21. docs/ROADMAP.md

```md
# Roadmap

## NOW
Current milestone selected by the product owner.

## NEXT
Highest-value validated follow-up.

## LATER
Valuable but not urgent.

## NOT NOW
Explicitly deferred.

## Product versions
V0 Foundation
- architecture
- database
- authentication
- organizations
- RBAC
- design system
- CI/CD
- observability

V1 Core Inventory
- products
- warehouses
- stock
- purchases
- sales
- customers
- suppliers
- reports

V1.5 Business Operations
- billing
- payments
- returns
- GST
- notifications
- imports
- exports

V2 Growth
- multi-location
- POS
- advanced analytics
- integrations
- mobile
- automation

V3 Intelligence
- AI assistant
- demand forecasting
- smart reordering
- business insights
- anomaly detection
```

---

# 22. docs/KNOWN-ISSUES.md

```md
# Known Issues

No known implementation issues yet.

When an issue is added:
- issue
- impact
- workaround
- priority
- status
- owner
```

---

# 23. docs/COMPONENTS.md

```md
# Component Inventory

## Foundations
- Button
- Input
- Textarea
- Label
- Badge
- Separator
- Tooltip

## Navigation
- App shell
- Sidebar
- Top navigation
- Breadcrumbs
- Command menu

## Data
- Data table
- Pagination
- Filter bar
- Sort controls
- Empty state
- Loading state
- Error state

## Business
- Product card
- Product form
- Warehouse selector
- Stock status
- Price display
- Customer summary
- Supplier summary
- Invoice summary
- Purchase order summary

## Feedback
- Toast
- Dialog
- Alert
- Confirmation
- Progress

Every component should list:
- purpose
- props
- variants
- states
- accessibility notes
- dependency/source
```

---

# 24. docs/ROUTES.md

```md
# Route Map

## Public
/
 /about
 /pricing
 /articles
 /articles/[slug]
 /contact
 /404

## Auth
/login
/signup
/forgot-password

## App
/dashboard
/products
/products/[id]
/inventory
/inventory/stock
/inventory/warehouses
/inventory/transfers
/inventory/adjustments
/inventory/movements
/purchases
/purchases/orders
/purchases/receipts
/purchases/returns
/purchases/payments
/sales
/sales/orders
/sales/invoices
/sales/returns
/sales/payments
/customers
/suppliers
/reports
/settings

The final route structure may change during the architecture/UX phase, but route decisions must be recorded here.
```

---

# 25. docs/SKILLS.md

```md
# Skill Manifest

## Required / always useful
Agent workflow:
- find-skills
- brainstorming
- writing-plans
- executing-plans
- systematic-debugging
- test-driven-development
- verification-before-completion
- requesting-code-review
- subagent-driven-development
- dispatching-parallel-agents
- using-git-worktrees
- finishing-a-development-branch

Frontend:
- shadcn
- vercel-react-best-practices
- vercel-composition-patterns
- next-best-practices
- frontend-design
- web-design-guidelines

Database/backend:
- supabase-postgres-best-practices
- supabase
- zod-schema-validation

Testing:
- webapp-testing
- playwright-best-practices
- verification-before-completion

Security/quality:
- security-best-practices
- improve-codebase-architecture
- frontend-architecture
- domain-modeling

Documentation:
- technical-writing
- readme-best-practices
- writing-plans

Optional / phase-specific:
- agent-browser
- browser-use
- extract-design-system
- critique
- polish
- distill
- quieter
- delight
- ui-ux-pro-max
- design-taste-frontend
- high-end-visual-design
- tailwind-design-system
- ai-sdk
- ai-elements
- i18n/l10n skills
- PWA/mobile skills
- CI/CD/deployment skills
- analytics/SEO skills

## Policy
Install only what materially helps the current phase.
Inspect skill source before installation.
Record installed skills and source repositories.
Read relevant skill instructions before implementation.
```

---

# 26. docs/REFERENCE-INDEX.md

```md
# Reference Index

## Aoutive AI — primary
- Home-page(1).html
- About-us(1).html
- Articles(1).html
- Articles Details(1).html
- Contact(1).html
- 404(1).html
- Home page screenshot
- About us screenshot
- Articles screenshot
- Articles Details screenshot
- Contact screenshot
- 404 screenshot
- Additional Aoutive imagery supplied with the reference set

## Cursor — secondary
- DESIGN-cursor(1).md

## Product
- Innvntory product definition
- Future product-specific documents

## Rule
Never delete/replace a reference without explicit approval.
Add new references with date, source, purpose, and authority level.
```

---

# 27. docs/AI-DECISIONS.md

```md
# AI Decisions

Record durable decisions related to:
- AI architecture
- prompt patterns
- agent behavior
- tool permissions
- AI safety
- model/provider choices
- data access
- human approval requirements

Each decision should reference:
- context
- prompt/spec that established it
- chosen approach
- rationale
- tradeoffs
- status
```

---

# 28. ARCHITECTURE DECISION RECORD TEMPLATE

Create:
`docs/decisions/000-template.md`

```md
# Decision: [title]

Date:
Status: active | superseded

## Context
Why was this decision needed?

## Options
1.
2.
3.

## Chosen
[decision]

## Why
[rationale]

## Tradeoffs
[costs / risks / benefits]

## Consequences
[what changes now]

## References
[docs / prompts / external references]
```

---

# 29. AGENT ROLE MODEL

Create role references in `docs/agents/`.

## 29.1 Product/Planning Agent

Responsibilities:
- clarify outcome
- convert ideas to scoped slices
- maintain PRD/roadmap
- define acceptance criteria
- prevent scope creep

Never:
- silently approve architecture changes
- rewrite requirements while coding

## 29.2 Design Agent

Responsibilities:
- enforce Aoutive-first visual authority
- maintain design tokens
- compare screenshots
- review responsive behavior
- maintain component states
- protect visual consistency

Never:
- invent a new visual language without approval
- overwrite reference-driven decisions

## 29.3 Frontend Agent

Responsibilities:
- implement React/Next UI
- use shadcn first
- preserve server/client boundaries
- create accessible, responsive UI
- keep data/content separate

## 29.4 Backend/Data Agent

Responsibilities:
- schema
- migrations
- server actions/API
- transaction boundaries
- tenant isolation
- idempotency
- validation

## 29.5 QA/Security Agent

Responsibilities:
- test critical flows
- threat-model risky changes
- inspect permission boundaries
- run visual/accessibility checks
- validate production build

## 29.6 Release/DevOps Agent

Responsibilities:
- CI
- preview
- production readiness
- monitoring
- rollback
- release notes

For small tasks, one agent may perform several roles. Role separation is a reasoning/tooling model, not permission to build multiple unrelated areas in one prompt.

---

# 30. SKILL INSTALLATION POLICY

Antigravity uses workspace skills under:

```text
.agents/skills/<skill-folder>/SKILL.md
```

Global skills can live under the user's Antigravity/Gemini configuration.

For external skills.sh skills:
- inspect source
- prefer authoritative upstream repositories
- install only skills needed for the active phase
- record source and purpose in `docs/SKILLS.md`

Do not install the entire skills.sh catalogue.

Suggested starting installation set:

### Workflow
```bash
npx skills add obra/superpowers --skill brainstorming
npx skills add obra/superpowers --skill writing-plans
npx skills add obra/superpowers --skill executing-plans
npx skills add obra/superpowers --skill systematic-debugging
npx skills add obra/superpowers --skill test-driven-development
npx skills add obra/superpowers --skill verification-before-completion
npx skills add obra/superpowers --skill requesting-code-review
npx skills add obra/superpowers --skill subagent-driven-development
npx skills add obra/superpowers --skill dispatching-parallel-agents
npx skills add obra/superpowers --skill using-git-worktrees
npx skills add obra/superpowers --skill finishing-a-development-branch
```

### Vercel / React
```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-composition-patterns
npx skills add https://github.com/vercel-labs/next-skills --skill next-best-practices
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines
```

### shadcn
```bash
npx skills add https://github.com/shadcn-ui/ui --skill shadcn
```

### Supabase/Postgres
```bash
npx skills add https://github.com/supabase/agent-skills --skill supabase-postgres-best-practices
npx skills add https://github.com/supabase/agent-skills --skill supabase
```

### AI — later
```bash
npx skills add https://github.com/vercel/ai --skill ai-sdk
```

Some skills may be better installed later, when the relevant phase begins.

---

# 31. SETUP PROMPT 00 — SAFE WORKSPACE INITIALIZATION

Use this as the first Antigravity setup prompt:

```text
You are preparing the Innvntory repository for a professional, production-grade Vibe Coding workflow.

IMPORTANT:
This is SETUP ONLY.
Do not implement any product feature.
Do not build dashboard pages.
Do not build authentication.
Do not create business logic.
Do not create database tables beyond what is needed for repository initialization.
Do not redesign or reinterpret the supplied visual references.

SOURCE OF TRUTH:
- Innvntory product definition
- Vibe Coding A-Z Playbook
- supplied Aoutive AI HTML/screenshots
- supplied Cursor design analysis
- approved UI library strategy
- approved skill strategy

GOAL:
Create the repository/workspace foundation for future implementation.

TASK:
1. Inspect the workspace before making changes.
2. Determine whether a project already exists.
3. Preserve any existing valid project work.
4. If the repository is empty, initialize the agreed framework baseline using TypeScript and the project's standard package manager.
5. Create the target documentation directories:
   - docs/
   - docs/decisions/
   - docs/agents/
   - docs/design-references/
   - docs/skill-manifest/
   - tests/
   - .agents/skills/
6. Create the project documentation files listed in the setup pack.
7. Create:
   - AGENTS.md
   - README.md
   - .env.example
   - .gitignore
8. Add only the minimum configuration required for a clean baseline.
9. Do not install secondary UI libraries yet.
10. Do not implement features.

ACCEPTANCE:
- Repository has a clean, navigable structure.
- Documentation files exist.
- AGENTS.md is the controlling operating manual.
- No feature functionality was implemented.
- No unrelated files were changed.
- No secrets were added.

VALIDATION:
Run the project's basic install/check commands appropriate to its current state.
Report:
- detected stack
- package manager
- files created
- files intentionally not created
- validation results

STOP:
After setup and validation, stop. Do not proceed to feature implementation.
```

---

# 32. SETUP PROMPT 01 — INSTALL AND REGISTER SKILLS

```text
Read AGENTS.md first.

TASK:
Prepare the Innvntory workspace skill layer according to docs/SKILLS.md.

1. Inspect current Antigravity skill support.
2. Review the source/repository of every skill before installation.
3. Install only the approved foundation skills for the current setup phase:
   - brainstorming
   - writing-plans
   - executing-plans
   - systematic-debugging
   - test-driven-development
   - verification-before-completion
   - requesting-code-review
   - subagent-driven-development
   - dispatching-parallel-agents
   - using-git-worktrees
   - finishing-a-development-branch
   - vercel-react-best-practices
   - vercel-composition-patterns
   - next-best-practices
   - web-design-guidelines
   - shadcn
   - supabase-postgres-best-practices
   - supabase
4. Do not install optional design/AI/browser skills yet unless clearly needed for setup.
5. Record:
   - skill name
   - source
   - why Innvntory uses it
   - phase
   - status
6. Ensure workspace-specific skills are stored in the Antigravity workspace skill location.
7. Do not modify application feature code.

ACCEPTANCE:
- Required skills are discoverable.
- docs/SKILLS.md matches reality.
- No duplicate/conflicting skill sets were installed.
- No application features were implemented.

STOP after verification.
```

---

# 33. SETUP PROMPT 02 — BUILD THE PROJECT KNOWLEDGE BASE

```text
Read:
- AGENTS.md
- docs/PRD.md
- docs/PRODUCT-DEFINITION.md
- docs/DESIGN-SYSTEM.md
- docs/ARCHITECTURE.md
- docs/SECURITY.md
- docs/CODE-STYLE.md
- docs/DATABASE.md
- docs/API-GUIDE.md
- docs/TESTING.md
- docs/DEVOPS.md
- docs/ROADMAP.md
- docs/SKILLS.md
- docs/REFERENCE-INDEX.md

TASK:
Audit the setup documentation for contradictions, missing information, duplicate rules, or accidental scope expansion.

Do not implement features.

Make only documentation-level corrections required to make the knowledge base internally consistent.

Ensure:
- product source of truth is clear
- visual source of truth is clear
- Aoutive is primary visual reference
- Cursor is secondary design-principle reference
- shadcn is the UI default
- secondary UI libraries require justification
- PostgreSQL/multi-tenancy/data integrity are explicit
- Vibe Coding loop is explicit
- quality gates are explicit
- protected areas are explicit
- no invented product facts appear

Validation:
Report each documentation conflict found and the exact resolution.

STOP.
```

---

# 34. SETUP PROMPT 03 — REGISTER THE DESIGN REFERENCES

```text
Read AGENTS.md and docs/REFERENCE-INDEX.md.

TASK:
Prepare the visual-reference workspace only.

1. Locate the supplied Aoutive AI screenshots and HTML exports.
2. Locate the Cursor design analysis.
3. Store/copy them into docs/design-references/ only when the files are available in the current workspace.
4. Do not modify the source reference files.
5. Create a reference manifest with:
   - file name
   - page/reference type
   - visual purpose
   - authority level
   - notes
6. Create a concise visual inventory covering:
   - layout
   - spacing
   - typography
   - borders
   - radii
   - imagery
   - navigation
   - buttons
   - forms
   - tables/cards
   - FAQ
   - CTA
   - footer
   - article pages
   - 404
   - responsive states
7. Do not implement Innvntory UI.

STOP after the reference system is prepared.
```

---

# 35. SETUP PROMPT 04 — DESIGN SYSTEM EXTRACTION ONLY

```text
Read AGENTS.md and docs/DESIGN-SYSTEM.md.

Use the supplied Aoutive screenshots and HTML exports as the primary exact visual reference.
Use Cursor design analysis only as supporting principles.

TASK:
Extract an Innvntory design-system specification without writing application UI.

Produce:
1. token categories
2. typography scale
3. spacing scale
4. container/layout rules
5. border rules
6. radius rules
7. surface rules
8. button variants
9. form conventions
10. card conventions
11. table conventions
12. navigation conventions
13. FAQ conventions
14. responsive rules
15. accessibility rules
16. motion rules
17. empty/loading/error/success/disabled states

IMPORTANT:
- do not simply copy external brand tokens
- do not copy external logos/identity
- do not choose a different aesthetic
- do not add a giant UI library
- do not build screens

Output should update docs/DESIGN-SYSTEM.md and docs/COMPONENTS.md only.

STOP.
```

---

# 36. SETUP PROMPT 05 — ARCHITECTURE BASELINE

```text
Read AGENTS.md and the relevant architecture/database/security docs.

TASK:
Create a written architecture baseline for Innvntory.

Scope:
- application boundaries
- server/client boundaries
- domain boundaries
- tenant model
- PostgreSQL data model strategy
- API strategy
- integration boundaries
- background jobs only where justified
- observability
- environments
- CI/CD

Do not implement application features.
Do not create speculative infrastructure.
Do not create services that the current product scope does not justify.

For every major decision:
- record options
- choose one
- state rationale
- state tradeoffs
- create an ADR only when the decision is durable

STOP after documentation and validation.
```

---

# 37. SETUP PROMPT 06 — BASELINE QUALITY GATE

```text
Read AGENTS.md.

TASK:
Validate the repository setup as if preparing a clean baseline before the first feature.

Check:
- install
- lint
- typecheck
- tests configuration
- production build
- environment configuration
- Git status
- Git diff
- documentation completeness
- skill registration

If a check fails:
- identify the smallest root cause
- make only the smallest setup correction
- rerun the failed check

Do not add features.
Do not refactor unrelated files.
Do not change product scope.

FINAL OUTPUT:
PASS/FAIL for every check.
List exact files changed.
List any remaining blockers.

STOP.
```

---

# 38. FIRST IMPLEMENTATION PROMPT TEMPLATE — DO NOT USE YET

When implementation officially begins, use this pattern:

```text
CONTEXT:
Read AGENTS.md and only the docs/files relevant to this task.

GOAL:
Implement exactly one small, testable outcome: [single outcome].

SOURCE OF TRUTH:
[exact product requirement]
[exact design reference]
[relevant component/docs]

REQUIREMENTS:
[specific observable behavior]

DESIGN:
Match the supplied visual reference.
Use shadcn/ui first.
Use another UI library only if a documented need exists.

CONSTRAINTS:
- do not change protected areas
- do not widen scope
- preserve existing architecture
- preserve unrelated behavior

ACCEPTANCE:
1. [behavior]
2. [responsive behavior]
3. [accessibility behavior]
4. [error/loading/empty behavior where relevant]

VALIDATION:
- lint
- typecheck
- relevant tests
- build
- visual QA
- Git diff review

STOP:
Implement, verify, review, and stop.
Do not refactor unrelated code.
```

---

# 39. PROFESSIONAL VIBE-CODING LOOP

Every meaningful feature follows:

```text
Context
  ↓
Plan
  ↓
Approve slice
  ↓
Implement
  ↓
Lint
  ↓
Typecheck
  ↓
Test
  ↓
Visual QA
  ↓
Diff Review
  ↓
Commit
  ↓
Preview
  ↓
Learn / update docs
```

Definition of Done:
- exact requirement implemented
- responsive behavior verified
- states covered
- accessibility checked
- security/data handling checked
- lint/typecheck/tests/build pass
- diff contains only intended changes
- docs/decisions updated when needed

---

# 40. VIBE-CODING NON-NEGOTIABLES

Never:
- issue a giant "build everything" prompt
- code before scope
- overwrite the design reference
- hardcode repeated content in JSX
- make everything a Client Component
- install every UI/animation library
- add APIs before UI/requirements need them
- use global CSS hacks for one feature
- ignore empty/error/loading states
- ship without production-like QA
- over-abstract early
- let an agent rewrite unrelated areas

Always:
- keep scope small
- keep context explicit
- inspect before editing when uncertain
- compare screenshots for visual work
- validate every meaningful batch
- review the diff
- update durable documentation
- stop at the requested boundary

---

# 41. FUTURE PHASE ORDER

1. Setup repository
2. Skills + agent context
3. Reference system
4. Product brief / PRD
5. User flows
6. Information architecture
7. Design system
8. Architecture
9. Database
10. API contract
11. Foundation
12. Authentication / organizations / RBAC
13. Products
14. Inventory
15. Warehouses
16. Purchasing
17. Sales
18. Customers / suppliers
19. Billing / reports
20. Production hardening
21. Launch
22. Post-launch iteration
23. Intelligence/AI

Never skip directly from setup to "build the entire app".

---

# 42. FINAL SETUP EXIT CONDITION

The setup phase is complete only when:

- repository is clean
- AGENTS.md is authoritative
- product docs exist
- design docs exist
- architecture docs exist
- security docs exist
- testing docs exist
- skills are recorded
- references are indexed
- baseline checks pass
- Git diff contains only intended setup work
- no application features have been implemented

At that point, stop and wait for the project owner's first implementation prompt.
