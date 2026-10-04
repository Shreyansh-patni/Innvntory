# Innvntory — Routes (Planning)
## Status note — authentication routes now exist

Added with [ADR 0005](decisions/0005-authentication-and-session-architecture.md)
(`Accepted`, 2026-10-04). This section updates the "no concrete paths" intent below:
paths are still not fixed by specification, but two real routes now exist in code.

| Route | Class | Status |
|---|---|---|
| `/login` | B | Real UI. **Cannot authenticate** — no provider configured |
| `/signup` | B | Real UI. **Cannot authenticate** — no provider configured |

Both use the marketing surface's calmer density (DESIGN-SYSTEM.md §11), shadcn/ui
`Input`/`Button`, real `<label>` elements, and an explicit deferred-submit state.
They do not store passwords, implement cryptography, or fake success.

**Organization switching** has a UI foundation (`OrganizationSwitcher`) in the
application sidebar, permanently disabled until a real session exists. Membership is
verified server-side in any case (ADR 0005 §4).

The rest of this document remains accurate: specification §36 fixes the API
convention, and the application paths listed below are still planning intent.



**Status:** Phase 0 — **planning only. No route exists. No router is installed. No
page is created.**

> This document is an **information-architecture sketch**, not an implementation
> plan and not a route manifest. No file path below corresponds to a real file.
> Creating any of these routes requires an explicit instruction and the framework
> decision (`docs/KNOWN-ISSUES.md` §1.2).

---

## 1. Why no concrete paths are given

Specification §36 fixes the **API** convention:

```text
/api/v1/...
```

It does **not** fix frontend route paths. A URL structure is a product decision that
depends on:

- the frontend framework and its routing conventions (undecided),
- the public-site / application split and how it is expressed in URLs,
- the authentication entry points and post-signup onboarding sequence (spec §68),
- whether organization context appears in the URL.

Inventing paths now would mean either guessing the framework or committing to a URL
scheme that later has to be migrated. Both are worse than an explicit gap.

```text
TBD — requires architectural decision: frontend route path convention
```

What follows is therefore organised by **section and purpose** rather than by path.

---

## 2. Three distinct route classes

Keeping these separate is the most important structural decision in this document.

| Class | Audience | Auth | Notes |
|---|---|---|---|
| **A — Public website** | Prospects, search engines | None | Marketing surfaces. Design references exist (`Design Refrence/`) |
| **B — Authentication and onboarding** | Prospective and new users | Partial | Entry into the product. Spec §30, §68 |
| **C — Authenticated application** | Signed-in users | Required | The operating product. Spec §42 |

**Rules.**

- Class A must never require authentication, and must never leak tenant data.
- Class C must never be reachable without a valid session, and must never render
  without tenant context.
- Class B is a strict funnel: unauthenticated → authenticated → organization created
  → configured (spec §68).
- Classes A and C must not share authenticated state, layouts, or data paths.

---

## 3. Class A — Public website

Source: the supplied public-page references in `Design Refrence/`
(`docs/DESIGN-REFERENCES.md`). The page *inventory* below is what the reference
material demonstrates; it is **not** a decision that Innvntory will have exactly
these pages.

| Section | Purpose | Reference available |
|---|---|---|
| Home / landing | Positioning, primary conversion | `Home-page.html`, `Home page.jpg` |
| About | Company and story | `About-us.html`, `About us.jpg` |
| Features / product | Capability explanation | `Home-page.html` feature sections |
| Pricing | Plan presentation | `Home-page.html` pricing tiers |
| Articles / resources | Editorial content, list and detail | `Articles.html` *(defective — see §6)*, `Articles Details.html`, `Articles.jpg`, `Articles Details.jpg` |
| Contact | Enquiry and support | `Contact.html`, `Contact.jpg` |
| Not found | 404 handling | `404.html`, `404.jpg` |

Supporting sections observed in the reference exports: navigation, hero, trust/logo
strip, feature clusters, workflow/pipeline visualisation, use-case grid, metrics
band, FAQ accordion, pre-footer CTA band, multi-column footer with newsletter.

### Class A constraints

- **No invented claims.** No customer logos, testimonials, metrics, user counts,
  ratings, or uptime figures. Innvntory has none
  (`docs/DESIGN-REFERENCES.md` §2.3).
- **No invented pricing.** Spec §47 defers pricing deliberately.
- **No invented brand.** No logo, tagline, or wordmark exists yet
  (`docs/KNOWN-ISSUES.md` §3.1). Spec header: `Tagline: TBD`, `Website: TBD`.
- **No third-party content.** Nothing from the Aoutive AI references may be
  reproduced.
- No contact details are established. The references contain a third party's email
  and phone number, which must not be copied.
- Legal pages (privacy, terms) are referenced by the supplied footer but **no
  content exists**. Spec §83 lists terms, privacy policy, and refund policy as
  outstanding business items. `TBD`.

---

## 4. Class B — Authentication and onboarding

Sources: spec §30 (auth methods), §68 (onboarding flow), §69 (demo data).

```text
Sign in                     Email + password · Google   (spec §30 launch scope)
Sign up                     Email + password · Google
Forgot password
Verify email
Authentication error / rate-limited state
```

The specification's onboarding sequence (§68), in order:

```text
Create Account
  → Create Organization
  → Business Information
  → Choose Industry
  → Add Location
  → Import Products
  → Invite Team
  → Configure Settings
  → Start Using Innvntory
```

Optional in that flow: **demo data activation** (spec §69) — 20 products, 5
customers, 3 suppliers, 2 warehouses, sample sales, sample purchases.

**Not in launch scope** (spec §30): OTP and passkey authentication.

### Class B open questions

```text
TBD — requires architectural decision
  · Path convention for the auth funnel
  · Whether onboarding is a wizard route sequence or a single resumable flow
  · Invitation acceptance route for invited team members (spec §68, §32)
  · Post-signup redirect target
```

---

## 5. Class C — Authenticated application

### 5.1 Navigation structure

Reproduced from **spec §42**, which is presented there as a *suggested* structure.
The grouping is reproduced faithfully; the paths are not invented.

```text
Dashboard

Business
├── Products
├── Customers
├── Suppliers
└── Categories

Inventory
├── Stock
├── Warehouses
├── Transfers
├── Adjustments
└── Movements

Sales
├── Orders
├── Invoices
├── Returns
└── Payments

Purchases
├── Purchase Orders
├── Receipts
├── Returns
└── Payments

Reports
├── Sales
├── Purchases
├── Inventory
└── Financial

Settings
├── Organization
├── Users
├── Roles
├── Integrations
├── Billing
└── Security
```

### 5.2 Section requirements

**Dashboard** (spec §9) — the business command center. Metrics: today's sales,
today's orders, monthly sales, gross profit, inventory value, low-stock products,
out-of-stock products, receivables, payables, purchase value, sales trend. Widgets:
revenue, orders, inventory, low stock, receivables, payables, top products, recent
transactions.

**Business** (spec §10, §11, §20, §18) — product list, product detail, variant
management, categories, brands, units; customer and supplier records with credit
limits, payment terms, and balances.

**Inventory** (spec §12–§16, §24) — current stock, movements ledger, warehouses,
transfers, adjustments, low-stock and reorder management, inventory valuation.

**Sales** (spec §19, §21–§23) — orders, invoices, returns, payments, POS (post-MVP
per spec §79), discounts, taxes, refunds.

**Purchases** (spec §17, §23) — purchase orders, receipts, returns, supplier
payments.

**Reports** (spec §26, §27) — sales, purchases, inventory, financial. Charts and
data-visualisation specification is not yet defined (spec §41).

**Settings** (spec §32, §42, §48, §50) — organization, users, roles, integrations,
billing, security.

### 5.3 Cross-cutting application surfaces

Not navigation entries, but required application routes or surfaces.

| Surface | Source |
|---|---|
| Global search / command menu — `⌘ / Ctrl + K` | spec §29, §43 |
| Notifications centre | spec §25 |
| Import (products, customers, suppliers, opening stock) | spec §67 |
| Export (CSV, XLSX, PDF) | spec §67 |
| Onboarding wizard | spec §68 |
| Permission-denied state | spec §32 |
| Not-found state (application) | general |

### 5.4 Mobile priority surfaces

Spec §44 prioritises: dashboard, products, stock, sales, invoices, customers,
notifications. Barcode scanning via mobile camera is a **future** capability
(spec §44) and has no route or design yet.

---

## 6. Gaps in route planning

- **The `Articles` listing reference is defective.** `Articles.html` is
  byte-identical to `About-us.html` and renders About content
  (`docs/KNOWN-ISSUES.md` §4.1). The Class A article-listing entry in §3 is
  therefore inferred from the screenshot and the shared export structure, not from a
  working export.
- **No application-surface reference exists.** All supplied design references are
  marketing surfaces (`docs/DESIGN-REFERENCES.md` §4). Class C layout direction is
  reasoned from the specification, not from a reference.
- **No path convention.** See §1.
- **No localisation structure.** Spec §73 lists English initially, with Hindi,
  Gujarati, Kannada and other Indian languages as future intent. Whether routes are
  locale-prefixed is `TBD` and must not be assumed.
- **No API routes defined.** See `docs/API-GUIDE.md`; the specification fixes the
  `/api/v1/...` convention only.

---

## 7. What has not been done

- No route file, page, layout, or route group created.
- No router, framework, or navigation library installed.
- No route constant, manifest, or path table generated.
- No sitemap, robots file, or metadata file created.
- No navigation, breadcrumb, or link implemented.
- No URL has been designed, and no route has been implemented or tested.
