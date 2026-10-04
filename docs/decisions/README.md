# Architectural Decision Records

This directory holds Innvntory's architectural decision records (ADRs).

---

## Status

**Five decisions accepted.**

| # | Decision | Status | Date |
|---|---|---|---|
| [0001](0001-backend-architecture.md) | Backend architecture - dedicated backend service (modular monolith) | **Accepted** | 2026-10-03 |
| [0002](0002-frontend-framework.md) | Frontend framework - **Next.js + React** | **Accepted** | 2026-10-03 |
| [0003](0003-database-isolation-access-layer.md) | Database isolation & access layer - **Option C, hybrid application + PostgreSQL RLS** | **Accepted** | 2026-10-04 |
| [0004](0004-orm-query-access-and-pooling.md) | ORM, query access, pooling, roles & platform access - **Drizzle + transaction-local context** | **Accepted** | 2026-10-04 |
| [0005](0005-authentication-and-session-architecture.md) | Authentication & session architecture - identity boundary, provider-neutral | **Accepted** | 2026-10-04 |

**No architecture blocker remains** for initial application scaffolding and the
identity/tenant/RBAC schema foundation. The decisions still needing records are listed
in `docs/ARCHITECTURE.md` §15.

### A note on ADR 0001

The backend architecture was the decision specification §61 explicitly declined to
make. It was resolved in favour of a dedicated backend service, structured as a
**modular monolith** — microservices were explicitly rejected under §60.

Two things about that record are worth reading rather than skimming:

- It separates **[Spec §NN]** facts from **[Inference]** from **[Recommendation]**,
  because most of what matters architecturally is not stated in the specification.
- It records **residual risk** honestly, including that the "team requirements" half of
  §61's criterion could not be evaluated, and that its analysis was agent-authored and
  not independently reviewed by a second engineer.

### A note on ADR 0002

It was proposed as a neutral comparison, recommending Option B (React + Vite) on the
documented evidence, and it stopped there — flagging that the specification never
mentions SEO, SSR, static generation or hydration, so the usual reason to adopt a
server-capable framework had no documented basis. It also named the one question that
would flip the answer.

The human owner answered it: the public marketing site **must be indexable** and **is
in the first production release**. That condition was met, so the decision became
**Next.js + React**, and public search-indexable marketing capability is now an
explicit product requirement that `Innvntory.md.txt` v1.0 does not contain.

Worth noting how that went: the analysis argued *against* the chosen option on the
evidence available, and the human supplied the missing product input. The agent did
not invent a requirement to justify a preferred framework, and the recommendation it
did make was resolved rather than overruled.

**A decision record that hides its assumptions is worse than no record.**

### A note on ADR 0003

The decision the specification declined to make in §35 — which layer enforces tenant
isolation — was resolved as **Option C, hybrid**: an explicit application filter plus
PostgreSQL RLS as a backstop, both driven by one `TenantContext`.

Its most useful finding is an asymmetry. Application-level isolation fails **open** — a
forgotten filter returns another tenant's rows with no error. Database-level isolation
fails **closed** — missing context returns nothing. For the one property the
specification elevates to a named critical test scenario (§58), failing closed is
worth real cost, and the backstop makes the guarantee provable by a test rather than
by convention.

The same record is explicit about the cost: RLS inherits connection-pooling hazards
and requires a non-owner runtime role, against a team operating model recorded as
*founder + product team + AI coding agents*. Option A remains a defensible fallback,
and choosing it should be a recorded decision rather than quiet drift.

---

## What belongs here

An ADR is warranted when a choice is:

- hard to reverse once code depends on it,
- not already fixed by `Innvntory.md.txt`,
- a genuine trade-off with more than one defensible option,
- needed by more than one part of the system.

Routine choices — naming, file placement, a component's internal structure — do not
need an ADR. They belong in `docs/CODE-STYLE.md`.

Where a decision is still open, the correct state is `TBD` in the relevant document,
**not** a speculative ADR.

---

## Format

One file per decision, named `NNNN-short-kebab-title.md`, numbered sequentially and
never reused.

```markdown
# NNNN — <Decision title>

- Status: Proposed | Accepted | Superseded by NNNN
- Date: YYYY-MM-DD
- Deciders: <names or roles>
- Specification references: Innvntory.md.txt §NN

## Context
What is being decided, and why now. The forces at play. Constraints inherited from
the product specification.

## Options considered
Each option, with its advantages, costs, and risks. Include the option of doing
nothing, and the cost of deferring.

## Decision
The option chosen, stated plainly. No hedging.

## Consequences
What becomes easier. What becomes harder. What is now prohibited. What must be
revisited if this proves wrong, and the signals that would indicate that.

## Validation
How the decision will be checked — ideally by something observable, not by
confidence. State honestly that it is currently unvalidated.
```

### Rules

- **One decision per record.** A record covering several decisions is not reviewable.
- **Record the decision, not the deliberation.** Context and rejected options are
  kept because they explain *why*, but the Decision section is unambiguous.
- **Never rewrite an accepted ADR.** Supersede it with a new record and link both.
  The history is the value.
- **Never invent a decider.** If no person or role decided it, say so.
- **No ADR may be written for work that has not been authorised.**
- **`Status: Proposed` is the honest default** until a maintainer accepts it.

---

## Index

Maintain this list as records are added.

| # | Title | Status | Date |
|---|---|---|---|
| [0001](0001-backend-architecture.md) | Backend architecture | **Accepted** | 2026-10-03 |
| [0002](0002-frontend-framework.md) | Frontend framework — Next.js + React | **Accepted** | 2026-10-03 |
| [0003](0003-database-isolation-access-layer.md) | Database isolation & access layer — Option C (hybrid) | **Accepted** | 2026-10-04 |
| [0004](0004-orm-query-access-and-pooling.md) | ORM, query access, pooling, roles & platform access — Drizzle | **Accepted** | 2026-10-04 |
| [0005](0005-authentication-and-session-architecture.md) | Authentication & session architecture | **Accepted** | 2026-10-04 |
