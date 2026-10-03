# Innvntory — Architecture

**Status:** Phase 0 — structure, with **one** architectural decision now made.

This document establishes the architectural *shape* Innvntory will be documented
against, and records what the product specification already fixes versus what it
leaves open.

> ## Decision status
>
> **Backend architecture: DECIDED.** See **[ADR 0001 — Backend
> Architecture](decisions/0001-backend-architecture.md)** (`Accepted`, 2026-10-03).
>
> Innvntory adopts **a Next.js frontend plus a dedicated backend service**, where the
> backend is the only component with database access and the only place business
> rules exist, and background processing runs as a separate process from the same
> backend codebase. The backend is a **modular monolith**, not microservices.
>
> **Frontend framework: DECIDED.** **[ADR
> 0002](decisions/0002-frontend-framework.md)** (`Accepted`, 2026-10-03) —
> **Next.js + React**, with server capabilities restricted to presentation concerns and
> business logic confined to `apps/api` (ADR 0002 constraints 1–17).
>
> **Not yet decided:** the database isolation mechanism, the auth provider, the RBAC
> model, the queue technology, and several other items in §15. Those remain:
>
> ```text
> TBD — architectural decision required
> ```
>
> Resolve them by writing an ADR in `docs/decisions/`, not by editing code.

**Nothing in this document has been implemented, verified, or benchmarked.** There
is no running system to describe.

---

## 1. System overview

### 1.1 What the specification fixes

Innvntory is a multi-tenant, cloud-first SaaS (spec §4.5, §4.8, §31) with:

- a web frontend responsive and keyboard-friendly (spec §39, §42, §43, §44),
- an API-first core (spec §4.9, §36, §37),
- a relational database, named as PostgreSQL (spec §61, §34),
- tenant isolation on every tenant-owned record (spec §31, §35),
- granular RBAC (spec §32),
- immutable audit logs (spec §33, §66),
- an AI layer added **after** the core transactional system is reliable (spec §28),
- transactional integrity for critical inventory operations (spec §54, §55),
- idempotency for critical operations (spec §56).

### 1.2 Target scale

Specification §6 and §60 set the design target:

```text
1 → 100 → 10,000 → 100,000+ organizations
```

with the caveat that scale should be introduced based on **actual bottlenecks**
rather than premature complexity. ADR 0001 treats that caveat as binding: the
backend is a modular monolith, and decomposition is deferred until a bottleneck is
actually observed.

### 1.3 Layer model

The conceptual layering below is **derived from the specification's own
constraints**, and is the one architectural decision this document does make,
because it is forced by spec §28, §54, §55 and §88 rather than chosen.

```text
┌──────────────────────────────────────────────────────────┐
│  Presentation                                            │
│  Public website · Application UI · Mobile-first views    │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│  AI Layer            (added later — spec §28)            │
│  Sits ABOVE business services. Never authoritative.      │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│  Application / Business Services                         │
│  Products · Inventory · Purchasing · Sales · Billing     │
│  Payments · Reports · Audit · AuthZ                     │
│  ── the single authoritative implementation of the rules ─│
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│  Data                                                     │
│  PostgreSQL (transactional, authoritative) · Cache        │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│  Platform                                                │
│  Auth · Tenancy · Jobs · Storage · Integrations · Obs.   │
└──────────────────────────────────────────────────────────┘
```

**Why this is fixed, not chosen:** spec §88 ranks data integrity above product
requirements and UX, and spec §28/§55 require the transactional system to be
authoritative and atomic. An AI layer that can write inventory directly would
violate those. So the boundary between "AI" and "business services" is
architectural, not stylistic.

### 1.4 Open overview questions

```text
TBD — architectural decision required
  · Monolith vs services, and where the boundary sits
  · Whether the AI layer is in-process or a separate service
  · Deployment topology (see §12)
  · Whether read models / replicas are needed at launch
```

---

## 2. Frontend

### Fixed by the specification

- Responsive layouts, fast navigation, keyboard shortcuts, accessible controls,
  clear tables, powerful filtering, inline editing where appropriate, and explicit
  loading / empty / error states (spec §39).
- A defined navigation structure (spec §42) — see `docs/SITEMAP.md`.
- A global command menu on `⌘ / Ctrl + K` (spec §29, §43).
- Mobile priority surfaces (spec §44).
- A design system (spec §41) — see `docs/DESIGN-SYSTEM.md`.
- shadcn/ui on Tailwind CSS (spec §61, `AGENTS.md` §4).

### Open

```text
TBD — architectural decision required
  · Next.js vs alternative framework (spec §61 lists Next.js as "a possible stack")
  · Rendering strategy: SSR / SSG / ISR / client, per route class
  · Data fetching and caching layer, and where the boundary with the API sits
  · Route structure and route-group layout (see docs/ROUTES.md — planning only)
  · Offline/PWA strategy (spec §45 explicitly warns this "should not be
    implemented casually" and that inventory correctness outranks offline convenience)
```

Offline support is a real architectural commitment (sync protocol, conflict
resolution, local persistence). It must not be started opportunistically.

---

## 3. Backend

> **DECIDED.** See **[ADR 0001 — Backend Architecture](decisions/0001-backend-architecture.md)**,
> `Accepted` 2026-10-03.

Specification §61 offered two options and declined to choose:

```text
Backend — Potential options:
  Next.js API
  or
  Dedicated backend service
Architecture should be selected based on workload and team requirements.
```

**Resolved in favour of a dedicated backend service**, structured as a modular
monolith. The full requirement extraction, three-option analysis, and adopted decision
are in ADR 0001. Summary of what was decided:

### 3.1 Decided shape

```text
Monorepo
├── apps/web        Next.js frontend — presentation only, no database access
└── apps/api        backend service — the authoritative business layer
    ├── modules/    business rules; the only place domain logic exists
    ├── platform/   authn · authz · tenancy · db · audit · errors
    ├── http/       /api/v1 transport layer
    └── jobs/       queue workers
      └── entry points: api process, worker process
```

Explicitly **not** adopted: microservices, per-domain services, multiple backend
codebases, multiple backend databases, or an internal event bus. Specification §60
requires scale to follow measured bottlenecks rather than premature complexity, so
that prohibition is part of the decision.

### 3.2 Consequences for this document

| # | Consequence |
|---|---|
| 1 | The frontend has no database credentials, driver, or migration tooling. Enforceable in CI. |
| 2 | Business rules exist only in backend business modules. The C2 single-layer commitment becomes structural. |
| 3 | Transaction boundaries (§54, §55) and audit writes (§33, §66) sit in backend business modules, never in transport handlers or the frontend. |
| 4 | Worker jobs and HTTP handlers call the same business modules. Stock and pricing logic is never reimplemented for jobs. |
| 5 | The AI tool layer (Phase 7) is implemented inside the backend over the same modules, with the invoking user's permissions applied per call — satisfying `AGENTS.md` §6 by construction. |
| 6 | §1.3's layer model is realised as two deployable units plus the worker, rather than as layers within one runtime. |
| 7 | The frontend framework decision (§15 row 2) is now a **prerequisite**, because the backend boundary is defined relative to it. |

### 3.3 What any backend must satisfy

Unchanged by the decision, and inherited from the specification:

| Constraint | Source |
|---|---|
| Atomic inventory operations; no partial state on failure | spec §54, §55 |
| Idempotency for payments, webhooks, orders, stock movements | spec §56 |
| Tenant isolation on every query path | spec §31, §35, §58 |
| Granular RBAC enforced server-side, not only in UI | spec §32 |
| Immutable audit trail: who/what/when/where/before/after/reference | spec §33, §66 |
| Versioned, predictable API conventions | spec §36, §37 |
| Structured errors that never leak internals | spec §38 |
| Request IDs, rate limiting, pagination, filtering, sorting, search | spec §37 |
| Correct handling of two users selling the last unit | spec §58 |

### 3.4 Still open under this section

The decision fixed the deployment shape. It did not settle the implementation
details, which remain open and are listed in §15:

```text
TBD — architectural decision required
  · Frontend framework and rendering strategy (§15 row 2)
  · ORM / query builder and migration tooling (ADR 0003 Q4)
  · Connection pooling mode (ADR 0003 Q5)
  · Auth provider and session strategy (row 4)
  · RBAC storage and enforcement model (row 5)
  · Queue technology and worker hosting (row 6)
  · Contracts sync mechanism (ADR 0001 D7)
  · Cross-unit environment promotion order for §62's four environments (D8)
  · Migration path if the choice later proves wrong (ADR 0001, Revisit Conditions)
```

Residual risk accepted with the decision — chiefly that the "team requirements" half
of specification §61's criterion could not be evaluated — is recorded in ADR 0001
under **Provenance and residual risk**, with revisit triggers.

---

## 4. Database

**Fixed:** PostgreSQL (spec §61). Priorities: data integrity, referential
integrity, transactions, indexing, auditability, tenant isolation, migration safety
(spec §34).

**Core entity groups** are enumerated in spec §34 and repeated in
`docs/DATABASE.md`.

**Isolation mechanism: DECIDED.** [ADR
0003](decisions/0003-database-isolation-access-layer.md) (`Accepted`, 2026-10-04) —
**Option C, hybrid**:

```text
Shared PostgreSQL schema and tables
Every tenant-owned record: organization_id NOT NULL
Application data-access layer: explicit tenant scope required
Business services: own authorization and RBAC
PostgreSQL RLS: database-level backstop via SET LOCAL app.organization_id
One authoritative TenantContext, established inside the authenticated backend
  boundary — the filter and the RLS context both derive from it
Runtime DB role must not own tenant tables; migration privileges separate
System-level tables (e.g. plans) explicitly distinguished from tenant data
Isolation tests are release-gate requirements
```

Schema-per-tenant was **excluded** on specification grounds: §35 puts
`organization_id` on every tenant-owned record, which makes per-tenant schemas
redundant, and §60's 100,000-organization target rules out per-tenant migration
fan-out.

```text
TBD — architectural decision required
  · ORM / query builder and migration tooling (ADR 0003 Q4)
  · Connection pooling mode (ADR 0003 Q5) — required before schema work
  · Support/platform cross-tenant access model (ADR 0003 Q2)
  · Numeric and money representation (INR is required; multi-currency "possible
    later" per spec §73 — representation is a schema decision, not a UI one)
  · Timezone and fiscal-calendar handling for an India-first market
  · Soft delete vs hard delete per entity, and how audit interacts with deletion
  · Indexing and partitioning strategy for 100,000+ organizations (spec §60)
  · Read replica / caching strategy
```

No tables, migrations, schema, or RLS policies have been created.

---

## 5. Authentication

**Fixed by the specification.**

- Options: Email + Password, Google, OTP, Passkeys (spec §30).
- **Initial launch: Email + Password and Google only** (spec §30).
- Also required: secure session management, password hashing, MFA support
  (spec §50).
- New organization flow begins with account creation, then organization creation
  (spec §68).

```text
TBD — architectural decision required
  · Auth provider: build vs adopt a service
  · Session strategy and lifetime
  · MFA required, or optional per plan (plan contents are TBD per spec §47)
  · Password reset, email verification, and account recovery flows
  · Whether a user may belong to multiple organizations (spec §31 shows a user
    under one organization; multi-org membership is not specified)
```

`AGENTS.md` §10: authentication is not implemented and must not be implemented as
part of a foundation task.

---

## 6. Authorization

**Fixed by the specification.**

- Default roles: Owner, Admin, Manager, Inventory Manager, Sales Staff, Purchase
  Staff, Accountant, Viewer (spec §32).
- Permissions are **granular** and string-identified, e.g. `products.read`,
  `products.create`, `inventory.adjust`, `sales.cancel`, `purchases.approve`
  (spec §32).
- Authorization is enforced server-side on every operation (spec §4.10, §54).

```text
TBD — architectural decision required
  · RBAC storage and evaluation model
  · Whether permissions are strictly fixed to the eight default roles or
    customisable per organization
  · Enforcement point: service layer, data layer, or both
  · Field-level and record-level scoping rules
  · Permission model exposed to the AI layer (must mirror the user's, never exceed it)
```

---

## 7. Multi-tenancy

**Fixed by the specification.**

- Multi-tenant from day one (spec §4.8).
- Hierarchy: Platform → Organization → users, locations, products, transactions
  (spec §31).
- **"No organization should be able to access another organization's data"**
  (spec §31), and this is a named critical test scenario (spec §58).
- Every tenant-owned record carries `organization_id` (spec §35).
- Both application-level authorization **and** database-level safeguards are to be
  considered (spec §35).

```text
TBD — architectural decision required
  · Isolation mechanism (see §4)
  · Tenant resolution: subdomain, path prefix, header, or session claim
  · How tenant context is established and propagated to background jobs
  · Cross-organization operations (platform staff, support access) and their audit
  · Per-tenant configuration, feature flags, and entitlements
```

Tenant isolation is a correctness and security property, not a performance
optimisation. It is never traded away.

---

## 8. AI layer

**Fixed by the specification.**

- Introduced **after** the core transactional system is reliable (spec §28).
- Specified capabilities: AI Inventory Assistant, AI Business Assistant, AI
  Forecasting (spec §28).
- Long-term: AI sits above business data, below the operating layer (spec §84).
- **"AI recommendations must always be traceable to underlying business data"**
  (spec §28).

Full direction and constraints: `docs/AI-DECISIONS.md`.

```text
TBD — architectural decision required
  · Model provider and hosting
  · Tool/function interface to business services
  · Retrieval and semantic-search strategy
  · Context and memory model per session
  · Evaluation, guardrail, and cost-control strategy
  · Which capabilities are user-facing vs internal
```

`AGENTS.md` §6: no AI functionality is to be implemented as part of a foundation
task.

---

## 9. Background jobs

**Fixed by the specification.**

- Queue / worker architecture (spec §61).
- Required asynchronous work: large import/export (spec §67), large exports
  "should run asynchronously".
- Also implied: notifications (spec §25), forecasting, sync with external
  integrations (spec §46), subscription/entitlement enforcement (spec §48).

```text
TBD — architectural decision required
  · Queue technology and hosting
  · Concurrency, retry, and dead-letter policy
  · Idempotency of job handlers (payments and webhooks are named in spec §56)
  · Tenant context propagation into workers
  · Scheduling model for recurring work
  · Observability: queue depth is a named metric (spec §53)
```

---

## 10. Storage

**Fixed by the specification.** Object storage is required for (spec §61):

```text
Product images · Invoices · Documents · Exports
```

Also implied: invoice PDFs (spec §21, §67).

```text
TBD — architectural decision required
  · Provider and region (data residency is unaddressed by the specification)
  · Bucket layout, naming, and tenant prefixing strategy
  · Signed URL lifetime and authorization model
  · Upload validation: type, size, malware scanning
  · Retention and deletion policy
  · Whether storage is a metered, billable entitlement (spec §48 lists "Storage"
    as a possible pricing dimension — TBD)
```

---

## 11. Integrations

**Candidates named in the specification (§46). None selected. None implemented.**

| Domain | Candidates |
|---|---|
| Payments | Razorpay, Stripe |
| Accounting | Tally, Zoho Books, QuickBooks |
| Communication | WhatsApp, Email, SMS |
| Commerce | Shopify, WooCommerce, Amazon |
| Tax | GST, E-Invoice, E-Way Bill |

Required properties for every integration:

- **Idempotent webhook handling** — receiving the same payment webhook twice must
  not duplicate the payment (spec §56, §58).
- **Rate limiting and retry** with backoff.
- **Audit logging** of inbound and outbound operations.
- **Failure isolation** — a failing third party must not corrupt Innvntory's
  transactional state (spec §54).
- **No invented compliance claims.** Specification §74 requires tax functionality
  to be validated against current official requirements before production use.

---

## 12. Observability

**Fixed by the specification** (§53):

```text
Logs     Application · Security · Audit · Worker
Metrics  Request latency · Error rate · Database latency · Queue depth
         CPU · Memory · Storage · Active users
Monitor  Health checks for critical services
```

Plus: request IDs on API responses (spec §37, §38), structured errors (spec §38),
no silent failures (spec §54), and product analytics events (spec §75).

**Reliability targets** (spec §54):

```text
No silent failures · No lost transactions · No inconsistent inventory
No cross-tenant data access · No destructive action without safeguards
```

```text
TBD — architectural decision required
  · Logging, metrics, and error-reporting vendors
  · Log retention and redaction policy (logs must not leak tenant data or secrets)
  · Alerting rules and on-call model
  · Backup and disaster-recovery procedure (spec §52 requires automated backups
    and recovery testing — "a backup that has never been restored is not verified")
```

---

## 13. Environments and delivery

**Fixed by the specification** (§62): Local, Development, Staging, Production, kept
separate. Never use production credentials locally. Never test destructive
migrations directly on production.

**CI/CD** (spec §63):

```text
Push → Lint → Type Check → Unit Tests → Integration Tests → Build
     → Security Checks → Deploy Staging → Smoke Tests → Production
```

**Git strategy** (spec §64): a `main` / `develop` model — `main` is a protected
release branch receiving only reviewed merges, `develop` is the integration branch,
and `feature/*` branches are cut from and merged back into `develop`. Defined in
`AGENTS.md` §Git and GitHub Workflow. Production deployments must be traceable to a
commit.

**Feature flags** (spec §65) for beta features, experimental AI, new UI, gradual
rollout, internal testing.

```text
TBD — architectural decision required
  · CI provider and pipeline implementation
  · Hosting/deployment platform and infrastructure-as-code approach
  · Release and rollback procedure
  · Database migration deployment strategy (expand/contract, zero-downtime rules)
  · Branch protection and required checks on `main` / `develop` (needs a remote and
    CI; see docs/KNOWN-ISSUES.md §2.4)
```

Git is now initialised on `main` with **no remote configured**. No CI exists.

---

## 14. Security architecture

Baseline: `docs/SECURITY.md`. The architectural requirements that constrain design
are: tenant isolation (spec §31, §35, §58), RBAC (spec §32), audit logging
(spec §33, §66), input validation (spec §37, §50), rate limiting (spec §37, §50),
secure cookies (spec §50), encryption in transit and at rest (spec §50), secret
management (spec §50), and data minimisation (spec §51).

---

## 15. Decision register

All architectural decisions, in one place. Each requires an ADR in `docs/decisions/`.

| # | Decision | Status |
|---|---|---|
| 1 | **Backend architecture** — Next.js API vs dedicated service | **DECIDED** — dedicated backend service, modular monolith. [ADR 0001](decisions/0001-backend-architecture.md), Accepted 2026-10-03 |
| 2 | Frontend framework and rendering strategy | **DECIDED** — Next.js + React. [ADR 0002](decisions/0002-frontend-framework.md), Accepted 2026-10-03. Per-route rendering strategy (U2) still open |
| 3 | Database isolation mechanism and access layer | **DECIDED** — Option C, hybrid: application data-access scoping + PostgreSQL RLS backstop. [ADR 0003](decisions/0003-database-isolation-access-layer.md), Accepted 2026-10-04. ORM/query policy (Q4) and pooling mode (Q5) still open |
| 4 | Auth provider and session strategy | Open |
| 5 | RBAC storage and enforcement model | Open |
| 6 | Queue / worker implementation | Open — worker process shape fixed by ADR 0001; technology is not |
| 7 | Object storage provider and residency | Open |
| 8 | Hosting, CI, and IaC | Open — now spans two deployable units |
| 9 | Test stack | Open |
| 10 | Observability vendors | Open |
| 11 | AI provider and tool interface | Open (Phase 7) — must be built inside the backend per ADR 0001 D3 |
| 12 | Payment provider (Razorpay vs Stripe) | Open |

Specification §61 also lists Redis as the cache direction. Whether a separate cache
service is required, and for what, is open.

ADR 0001 additionally leaves two of its own sub-decisions open: the contracts sync
mechanism, and the cross-unit environment promotion order for §62's four
environments.

---

## 16. What this document is not

- Not a decision record. Open items stay open.
- Not an implementation guide. There is no code.
- Not verified. No component described here has been built, run, or measured.
- Not complete. It reflects the specification at v1.0 as of Phase 0.1.
