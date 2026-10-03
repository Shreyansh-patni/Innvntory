# Innvntory — Sitemap (Planning)

**Status:** Phase 0 — **planning only. No page exists.**

Companion to `docs/ROUTES.md`. `ROUTES.md` organises by **route class and intent**.
This document organises by **hierarchy and depth**, for judging whether the
information architecture is sane before any of it is built.

> No URL path is stated anywhere in this document. Route path convention is
> `TBD — requires architectural decision` (`docs/ROUTES.md` §1).

---

## 1. Site map

```text
PUBLIC WEBSITE
│
├── Home
├── Features
├── Pricing ......................... content TBD — spec §47 defers pricing
├── About
├── Articles
│   ├── Listing ................... reference export defective (§5)
│   └── Article detail
├── Contact ....................... no contact details established
├── Legal
│   ├── Privacy policy ............ no content exists — spec §83
│   ├── Terms of service .......... no content exists — spec §83
│   └── Refund policy ............. no content exists — spec §83
└── Not found ..................... 404 pattern referenced
```

```text
AUTHENTICATION & ONBOARDING
│
├── Sign in ....................... Email + password · Google (spec §30)
├── Sign up ....................... Email + password · Google (spec §30)
├── Forgot password
├── Verify email
├── Team invitation acceptance .... implied by spec §68 · §32
└── Onboarding .................... spec §68 sequence
    ├── Organization
    ├── Business information
    ├── Industry
    ├── Location
    ├── Import products
    ├── Invite team
    └── Settings
```

```text
APPLICATION  (authenticated · tenant-scoped)
│
├── Dashboard ..................... spec §9
│
├── Business
│   ├── Products .................. spec §10 · §11
│   │   └── Product detail
│   ├── Categories
│   ├── Customers ................. spec §20
│   │   └── Customer detail
│   └── Suppliers ................. spec §18
│       └── Supplier detail
│
├── Inventory
│   ├── Stock ..................... spec §12
│   ├── Warehouses ................ spec §15
│   ├── Transfers ................. spec §16
│   ├── Adjustments
│   └── Movements ................. spec §13 · §14 ledger
│
├── Sales
│   ├── Orders .................... spec §19
│   ├── Invoices .................. spec §21
│   ├── Returns ................... spec §23
│   └── Payments .................. spec §22
│
├── Purchases
│   ├── Purchase orders ........... spec §17
│   ├── Receipts
│   ├── Returns ................... spec §23
│   └── Payments
│
├── Reports
│   ├── Sales ..................... spec §26
│   ├── Purchases
│   ├── Inventory
│   └── Financial
│
├── Settings
│   ├── Organization .............. spec §42
│   ├── Users ..................... spec §32
│   ├── Roles ..................... spec §32
│   ├── Integrations .............. spec §46
│   ├── Billing ................... spec §47 · §48
│   └── Security .................. spec §50
│
└── Cross-cutting surfaces
    ├── Command menu .............. ⌘ / Ctrl + K — spec §29 · §43
    ├── Notifications ............. spec §25
    ├── Import .................... spec §67
    └── Export .................... spec §67
```

---

## 2. Hierarchy notes

### Depth

Maximum depth is **three levels** below the application root (e.g. Business →
Products → Product detail). Specification §42 is a two-level structure; detail
views add a third. This is shallow enough to stay predictable, and matches the
specification's own navigation shape rather than inventing a deeper tree.

### Two independent hierarchies

```text
Content hierarchy ....... sections, articles, static pages
Application hierarchy ... modules, lists, detail views
```

They must not be merged. The public website is a marketing surface; the application
is an operating surface. They have different density, different components, and
different data access (`docs/DESIGN-SYSTEM.md` §11).

### Grouping rationale

- **Business** groups the *master data* that trading depends on — products,
  customers, suppliers, categories.
- **Inventory**, **Sales**, and **Purchases** group the three *transactional
  flows* of spec §2.
- **Reports** is read-only and cross-cutting, so it is separated from the flows it
  reports on.
- **Settings** is separated because it is administrative, not operational.

This mirrors specification §42 exactly. No reorganisation is proposed.

### Tenant context

The application hierarchy above is **relative to one organization**. Specification
§43 lists "Switch organization" as a command-menu action, which implies a user may
act within more than one organization — but spec §31 shows a user under a single
organization, and does not specify multi-organization membership.

```text
TBD — requires architectural decision: whether organization context appears in
the URL, and how switching organizations behaves
```

This affects the entire Class C hierarchy and must be settled before routes are
built. See `docs/KNOWN-ISSUES.md` §1.4.

---

## 3. Entry and exit points

**Into the application:**

```text
Public CTA → Sign up → Onboarding → Dashboard
Public CTA → Sign in → Dashboard
Team invitation email → Invitation acceptance → Onboarding (partial) → Dashboard
```

**Out of the application:** sign out. Destination `TBD`.

**Within the application:** the command menu (spec §43) is the primary fast path
between sections, in addition to persistent navigation.

---

## 4. States that are not pages but must be designed

Specification §39, §41, §70 require these. They are part of the information
architecture even though they are not routes:

```text
Loading state ........... spec §39
Empty state ............. spec §70 — must be USEFUL, not "No data."
Error state ............. spec §38 · §39
Permission denied ....... spec §32
Not found ............... resource-level, within a known section
```

The specification is explicit that every major screen needs a useful empty state
with a next action — for example, offering both *Add Product* and *Import Products*
(spec §70).

---

## 5. Reference coverage

| Surface | Design reference available |
|---|---|
| Home | ✅ `Home-page.html`, `Home page.jpg` |
| About | ✅ `About-us.html`, `About us.jpg` |
| Articles listing | ⚠️ **Defective** — `Articles.html` duplicates `About-us.html` (`docs/KNOWN-ISSUES.md` §4.1) |
| Article detail | ✅ `Articles Details.html`, `Articles Details.jpg` |
| Contact | ✅ `Contact.html`, `Contact.jpg` |
| Not found | ✅ `404.html`, `404.jpg` |
| Features / Pricing | ⚠️ Present as *sections* of `Home-page.html`, not as standalone pages |
| Legal pages | ❌ None |
| **Entire authenticated application** | ❌ **None** |

The last row is the significant gap: **every supplied design reference is a
marketing surface.** No reference exists for the dashboard, tables, forms, command
menu, or detail views — the majority of the product. See
`docs/DESIGN-REFERENCES.md` §4.

---

## 6. Sitemap artefacts not created

- No `sitemap.xml` and no robots file. Both require deployed URLs, and no website or
  domain exists (spec header: `Website: TBD`).
- No navigation config, menu definition, or route manifest.
- No breadcrumb definition.
- No URL redirect plan, because no URL structure has ever existed.

---

## 7. Open questions for maintainers

```text
TBD — requires architectural decision
  · Route path convention and framework
  · Whether organization context is in the URL
  · Whether a user may belong to multiple organizations (spec §31 vs §43)
  · Whether locale appears in the URL (spec §73)
  · Whether Features and Pricing are standalone pages or home sections
  · Post-signout destination
  · Whether a public product/location directory exists (not specified — not invented)
```

None of these may be resolved by an agent working from this document.
