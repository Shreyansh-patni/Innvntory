# Innvntory — PRD (Project Summary)

**Status:** Phase 0.1 — project-level summary only.

---

## 1. Authoritative source

> The authoritative, detailed product specification for Innvntory is
> **`Innvntory.md.txt`** at the repository root (88 sections, v1.0, "Production-Ready
> SaaS Product Specification", owner Sahaya Technologies).

This file does **not** restate, summarise-by-paraphrase, or replace that document.
It exists to orient a reader to the project and to point at the source. Where this
document and `Innvntory.md.txt` differ, `Innvntory.md.txt` wins, without exception.

Do not edit `Innvntory.md.txt`. If the product definition needs to change, that is a
separate, deliberate task with its own authorisation.

### Specification structure at a glance

| § | Topic | § | Topic |
|---|---|---|---|
| 1–4 | Summary, vision, mission, principles | 45–49 | Offline, integrations, billing, usage limits, subscriptions |
| 5–7 | Customers, ICP, personas | 50–56 | Security, data protection, backups, observability, reliability, idempotency |
| 8–9 | Product architecture, dashboard | 57–60 | Testing, critical scenarios, performance, scalability |
| 10–16 | Products, variants, inventory, ledger, movements, warehouses, transfers | 61–65 | Recommended stack, environments, CI/CD, git strategy, feature flags |
| 17–25 | Purchasing, suppliers, sales, customers, billing, payments, returns, low stock, notifications | 66–69 | Auditability, import/export, onboarding, demo data |
| 26–34 | Reports, analytics, AI layer, search, auth, organizations, RBAC, audit logs, database principles | 70–77 | Empty states, UX rules, accessibility, localisation, India requirements, analytics, metrics, activation |
| 35–44 | Multi-tenant model, API architecture and requirements, errors, frontend, design direction, design system, navigation, command center, mobile | 78–84 | MVP, post-MVP, version roadmap, development phases, definition of done, production readiness, vision, philosophy |
| | | 85–88 | Product philosophy, final product definition, document status, source of truth |

---

## 2. Project-level summary

**Product.** Innvntory is a modern, cloud-first inventory and business management
SaaS for businesses that manage physical inventory (spec §1.1, §86).

**Company.** Sahaya Technologies Pvt. Ltd. (spec header).

**Category.** Inventory & Business Management SaaS.

**Primary market.** India (spec header, §74).

**Core principle.**

> Make complex business operations feel simple. (spec §86)

**Long-term direction.**

```text
Inventory Management → Business Operations → Business Intelligence → AI-powered Business OS
```

(spec §2, §86)

**Innventory should become** the operational layer connecting products → inventory →
purchasing → sales → customers → suppliers → payments → analytics → business
decisions (spec §2).

**Target customer.** SMBs managing physical inventory: 1–10 locations, 1–100
employees, 100–100,000 SKUs (spec §6). Retail, wholesale, distribution, electronics,
mobile, hardware, apparel, footwear, grocery, pharmacy, spare parts, small
manufacturing, multi-location retail, and e-commerce sellers (spec §5).

**Product principles** (spec §4): simple by default · powerful when needed · data
first · automation first · cloud first · mobile friendly · secure by design ·
multi-tenant from day one · API first · production quality.

**Problem being solved** (spec §3): let a business know what it has, where it is,
what it bought, what it sold, what to reorder, who owes it money, who it owes, and
how it is performing — without enterprise-complexity software.

### Not yet determined

Fields the specification itself leaves open, recorded here so they are never
guessed:

| Item | Specification status |
|---|---|
| Tagline | `TBD` (spec header) |
| Website | `TBD` (spec header) |
| Exact pricing | To be determined after validating willingness to pay (spec §47) |
| Subscription plan contents | Plan *names* listed (Free/Starter/Growth/Business/Enterprise); contents `TBD` (spec §47) |
| Backend architecture | **Decided** — dedicated backend service, modular monolith. [ADR 0001](decisions/0001-backend-architecture.md), Accepted 2026-10-03 |
| Languages beyond English | Future intent only: Hindi, Gujarati, Kannada, other Indian languages (spec §73) |
| Currencies beyond INR | Must be *possible*, not specified (spec §73) |
| Logo, palette, type family, brand voice | Not present anywhere in the specification |

---

## 3. Module map

From specification §8. Three top-level domains.

```text
                        INNVNTORY
                            │
        ┌───────────────────┼───────────────────┐
     Operations         Commerce           Analytics
        │                   │                   │
        ├─ Inventory        ├─ Sales            ├─ Dashboard
        ├─ Products         ├─ Orders           ├─ Reports
        ├─ Warehouses       ├─ Customers        ├─ Insights
        ├─ Purchasing       └─ Payments         └─ Forecasting
        └─ Suppliers
```

Detailed per-module requirements live in `Innvntory.md.txt` §9–§27. This repository
does not duplicate them.

---

## 4. Personas

Six personas are defined in spec §7, each with a stated need set and, for the
Business Owner, a named dashboard metric set:

| Persona | Primary need area |
|---|---|
| Business Owner | Revenue, inventory value, profitability, outstanding payments, reports, multi-location overview |
| Inventory Manager | Stock levels and movements, warehouses, transfers, adjustments, low-stock alerts |
| Sales Operator | Fast product search, barcode scanning, customer selection, invoicing, payments, returns |
| Purchase Manager | Suppliers, purchase orders, purchase invoices, receiving, purchase returns, supplier payments |
| Accountant | Transactions, payments, receivables, payables, tax information, financial reports |
| Administrator | Users, roles, permissions, organization settings, billing, integrations, audit logs |

**Note on the specification's example name.** Spec §33 uses "Shreyansh" in an
audit-log example. That is illustrative sample content in the source document, not
a real user, customer, or claim about any person. It must not be carried into
Innvntory content.

---

## 5. Scope boundaries

### In the first production MVP (spec §78)

Authentication and organization creation · user management · product CRUD with
categories, SKU, barcode, pricing · stock, adjustments, movements, warehouses ·
suppliers, purchase orders, stock receiving · customers, sales, invoices, stock
deduction · dashboard (revenue, inventory, low stock, recent activity) · stock,
sales and purchase reports · RBAC, tenant isolation, audit logs.

### After MVP (spec §79)

POS · advanced GST · payments · multi-location · advanced reports · import/export ·
mobile app · notifications · integrations · AI assistant · demand forecasting ·
automation.

### Explicitly out of the first MVP

Per spec §79, and reinforced by spec §28 ("AI should be introduced after the core
transactional system is reliable").

---

## 6. Current implementation stage

```text
Stage: Phase 0 — Foundation
State: documentation and contracts only
```

There is **no** application code, dependency stack, database, API, authentication,
or UI in this repository.

Completed to date: the Phase 0.1 repository contract — `AGENTS.md`, `README.md`,
`.gitignore`, `.env.example`, this `docs/` set, and the skills registry.

**Not started:** every implementation phase. See `docs/ROADMAP.md`.

---

## 7. Related documents

| Document | Purpose |
|---|---|
| `Innvntory.md.txt` | Authoritative product specification — the source of truth |
| `docs/ROADMAP.md` | High-level development stage sequence |
| `docs/ARCHITECTURE.md` | System architecture structure and open decisions |
| `docs/DESIGN-SYSTEM.md` | Approved design direction |
| `docs/UI-LIBRARIES.md` | UI dependency hierarchy and policy |
| `docs/DESIGN-REFERENCES.md` | Catalogue of supplied reference material |
| `docs/DATABASE.md` | Database planning |
| `docs/API-GUIDE.md` | API principles and planning |
| `docs/SECURITY.md` | Security baseline |
| `docs/AI-DECISIONS.md` | AI architecture direction and constraints |
| `docs/KNOWN-ISSUES.md` | Open questions and unresolved decisions |

Specification §87 lists fifteen intended future documents. This repository covers
several of them under different names (`ARCHITECTURE.md`, `API-GUIDE.md`,
`DATABASE.md`, `SECURITY.md`, `CODE-STYLE.md`, `AI-DECISIONS.md`, `ROADMAP.md`).
Still absent and **not created**, because there is nothing to put in them yet:
`USER-FLOWS.md`, `TESTING.md`, `DEVOPS.md`, `ANALYTICS.md`, `BILLING.md`. Creating
empty shells now would be speculative structure. See `docs/KNOWN-ISSUES.md`.
