# Innvntory — Roadmap

**Status:** Phase 0.1 — high-level stage sequence.

---

## 1. Source of truth for detail

> The **detailed** roadmap is `Innvntory.md.txt`. See specifically:
>
> - **§80 — Version Roadmap:** V0 Foundation, V1 Core Inventory, V1.5 Business
>   Operations, V2 Growth, V3 Intelligence
> - **§81 — Development Phases:** Phase 1 Product Definition through Phase 8 Launch
> - **§79 — Post-MVP** and **§78 — MVP**
>
> This file records only the **high-level stage sequence**. It does not restate or
> reinterpret those sections, and it does not add scope. Where the two differ, the
> specification is correct.

Note that the specification expresses its roadmap on two axes — version milestones
(§80) and delivery phases (§81). The sequence below is a single consolidated view.
Mapping between the two is `TBD` and is not invented here.

---

## 2. Stage sequence

```text
Phase 0   Foundation
Phase 1   Core platform foundation
Phase 2   Inventory
Phase 3   Purchasing
Phase 4   Sales / invoicing
Phase 5   Customers / suppliers
Phase 6   Analytics
Phase 7   AI intelligence
Phase 8   Automation / integrations
Phase 9   Production hardening
```

---

## 3. Stage detail

Each entry states only what is directly supported by the specification. Anything not
traceable to a spec section is marked `TBD`.

### Phase 0 — Foundation ✅ in progress

```text
Repository ...................... this repository
Agent contract ................. AGENTS.md
Documentation set .............. docs/
Skills registry ................ skills/SKILLS-REGISTRY.md
Reference preservation ......... Innvntory.md.txt · DESIGN-cursor.md · Design Refrence/
```

**Status:** Phase 0.1 complete — repository contract established. No application
stack, deliberately.

Specification §80 lists V0 Foundation as architecture, database, authentication,
organizations, RBAC, design system, CI/CD, observability. Those items are **not**
Phase 0 as scoped here — they require a stack and architectural decisions, and belong
to Phases 1 and below. The boundary between "documentation foundation" and "technical
foundation" is `TBD` and should be settled when the backend decision is made.

### Phase 1 — Core platform foundation

Prerequisites: backend architecture decision; frontend framework decision;
authentication approach; database isolation mechanism.

Expected content, per spec §80 (V0) and §81 (Phase 4):

```text
System architecture · Database schema · API contract
Authentication · Organizations · RBAC · Tenant isolation
Core UI foundation · CI/CD · Observability · Threat model
```

Specification §4.8 and §4.9 make multi-tenancy and API-first design requirements
from the start, not later additions.

### Phase 2 — Inventory

Per spec §80 (V1) and §81 (Phase 5): products, product variants, categories,
inventory, stock movements, warehouses, transfers, adjustments.

The core of the product. Spec §13 and §58 make the stock ledger and the four
critical scenarios the acceptance bar.

### Phase 3 — Purchasing

Per spec §17, §80, §81: suppliers, purchase orders, purchase receipts / goods
receipt, stock receiving, purchase returns, supplier payments.

### Phase 4 — Sales / invoicing

Per spec §19, §21, §80 (V1.5), §81 (Phase 6): sales orders, POS sales, invoices,
payments, returns, refunds, tax and discount handling, stock deduction.

The specification is explicit that tax functionality must be validated against
current official requirements before production use (§74) — this is a Phase 4
obligation with a real external dependency, not a UI concern.

### Phase 5 — Customers / suppliers

Per spec §18, §20, §42: customer and supplier records, credit limits, payment
terms, outstanding balances.

> **Note on ordering.** The specification's own V1 milestone (§80) groups customers
> and suppliers with products and inventory, since a sale needs a customer and a
> purchase needs a supplier. Placing them in a later phase than sales and purchasing
> means earlier phases have no trading party to transact with. **This ordering is
> `TBD` and requires a maintainer decision.** It is recorded here rather than
> silently resolved.

### Phase 6 — Analytics

Per spec §26, §27, §84: reports (inventory, sales, purchase, financial), trends,
profitability, cash flow, dashboard.

Specification §41 requires charts to be defined as part of the design system; the
chart visual specification is not yet written.

### Phase 7 — AI intelligence

Per spec §28, §80 (V3), §84: AI inventory assistant, AI business assistant,
forecasting (demand, stockout, reorder, sales, inventory optimisation), business
insights, anomaly detection.

**Sequencing is a hard constraint.** Specification §28: AI is introduced *after* the
core transactional system is reliable. See `docs/AI-DECISIONS.md`. Architecture
constraints: tenant boundaries, RBAC parity, business-service access only,
auditability, deterministic business data, explicit confirmation for consequential
operations.

### Phase 8 — Automation / integrations

Per spec §46, §65, §79, §80 (V2): payments (Razorpay, Stripe), accounting (Tally,
Zoho Books, QuickBooks), commerce (Shopify, WooCommerce, Amazon), communication
(WhatsApp, email, SMS), tax (e-invoicing, e-way bills), POS, multi-location,
notifications, import/export, feature flags, offline evaluation.

Specification §45 warns that offline support "should not be implemented casually" and
that inventory correctness takes priority over offline convenience.

### Phase 9 — Production hardening

Per spec §52, §57, §58, §63, §72, §81 (Phase 7), §82, §83:

```text
Security testing · Performance testing · Load testing
Backup and recovery testing · Failure testing · E2E testing
Accessibility conformance (WCAG 2.1 AA) · Security review
CI/CD enforcement · Monitoring and alerting · Production readiness checklist
```

Specification §52: a backup that has never been restored is not verified.

---

## 4. Cross-cutting requirements

These apply to **every** phase, not to one:

| Requirement | Source |
|---|---|
| Multi-tenant from day one | spec §4.8, §31, §35 |
| API first | spec §4.9, §36, §37 |
| Secure by design | spec §4.7, §50 |
| Data integrity and atomicity | spec §4.3, §54, §55 |
| Idempotency on critical operations | spec §56 |
| Auditability | spec §33, §66 |
| RBAC | spec §32 |
| Accessibility — WCAG 2.1 AA | spec §72 |
| Mobile-friendly | spec §4.6, §44 |
| Automation-first thinking | spec §4.4 |
| Production quality — reliability, security, scalability, observability, maintainability, testing | spec §4.10 |
| Useful empty states on every major screen | spec §70 |
| Observability | spec §53 |
| Feature flags for beta / experimental work | spec §65 |
| Definition of done | spec §82 |
| Production readiness checklist | spec §83 |

---

## 5. Progress

| Phase | Status |
|---|---|
| 0 — Foundation | ✅ Phase 0.1 complete (documentation and contracts only) |
| 1 — Core platform foundation | ⬜ Not started. **Blocked** on the backend architecture decision |
| 2 — Inventory | ⬜ Not started |
| 3 — Purchasing | ⬜ Not started |
| 4 — Sales / invoicing | ⬜ Not started |
| 5 — Customers / suppliers | ⬜ Not started. Ordering `TBD` (§3) |
| 6 — Analytics | ⬜ Not started |
| 7 — AI intelligence | ⬜ Not started. Blocked on a reliable transactional system (spec §28) |
| 8 — Automation / integrations | ⬜ Not started |
| 9 — Production hardening | ⬜ Not started |

---

## 6. What this roadmap does not commit to

- No dates. No estimates. No velocity assumptions. None were requested and none can
  be honest without team and scope information that does not exist yet.
- No team or resourcing plan.
- No dependency ordering between phases beyond the hard constraints stated above.
  Most phases can overlap; which ones is a planning decision, not a foundation
  decision.
- No pricing or commercial milestones — spec §47 defers pricing deliberately.
- No launch date.

**No phase beyond Phase 0.1 has been authorised.** Do not begin implementation work
without an explicit instruction to do so.
