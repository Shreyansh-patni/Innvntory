# ADR 0003 — Database Isolation & Access Layer

- **Status:** **Accepted**
- **Proposed:** 2026-10-03
- **Accepted:** 2026-10-04
- **Decision authority:** Human-approved architectural decision
- **Accepted decision:** Option C — Hybrid application + PostgreSQL enforcement
- **Follow-on:** Q2, Q4, Q5, Q6 and Q7 resolved in [ADR 0004](0004-orm-query-access-and-pooling.md) (`Accepted`, 2026-10-04)
- **Specification references:** `Innvntory.md.txt` §4.8, §4.9, §4.10, §31, §32, §33, §34, §35, §43, §50, §54, §55, §56, §58, §59, §60, §61, §66, §83, §88
- **Related:** [ADR 0001 — Backend Architecture](0001-backend-architecture.md) (`Accepted`), [ADR 0002 — Frontend Framework](0002-frontend-framework.md) (`Accepted`)
- **Supersedes:** nothing
- **Superseded by:** nothing

---

## Status

**Accepted — 2026-10-04. Decision: Option C — Hybrid application + PostgreSQL
enforcement.**

The human owner reviewed this record, resolved the two data-model questions that
blocked it (**Q1** multi-organization membership, **Q3** ownership of roles and
permissions), and approved Option C.

**Nothing has been implemented.** No schema, migration, SQL, RLS policy, ORM,
dependency, or configuration exists. This record establishes an architecture; it does
not begin building one. `## Required architecture` states what acceptance obliges;
`## Open questions` records what remains genuinely unresolved.

**Five questions remain open and are recorded as such** — Q2, Q4, Q5, Q6, Q7. None is
treated as decided.

---

## Required architecture

Adopted. Binding on all implementation.

| # | Requirement |
|---|---|
| 1 | Shared PostgreSQL schema and tables. |
| 2 | Every tenant-owned record has `organization_id NOT NULL`. |
| 3 | The application data-access layer requires explicit tenant scope. |
| 4 | Business services own authorization and RBAC. |
| 5 | PostgreSQL RLS provides the database-level backstop. |
| 6 | RLS is keyed on `SET LOCAL app.organization_id`. |
| 7 | Tenant context is established **inside the authenticated backend boundary**. |
| 8 | `organizationId` must never come from model output or an untrusted request parameter. |
| 9 | The runtime application DB role must not own tenant tables. |
| 10 | Migration privileges are separate from runtime privileges. |
| 11 | Tenant-scoped operations use explicit transaction boundaries. |
| 12 | AI tools use the **invoking user's** `TenantContext`. |
| 13 | Workers reconstruct tenant context from durable job context and **fail closed** if `organizationId` is missing. |
| 14 | System-level tables such as `plans` are explicitly distinguished from tenant-owned data. |
| 15 | Isolation tests are **release-gate** requirements. |

### One authoritative tenant context — clarification

There is **ONE authoritative `TenantContext`**, established inside the authenticated
backend boundary (requirement 7).

The application filter and the PostgreSQL RLS context are **both derived from that
same trusted context.** They are not two independent sources of tenant identity, and
neither is an authority for *selecting* a tenant.

The second layer is an **enforcement backstop against omitted or widened query
scope** — not a second authority for deciding which tenant is in play. Its purpose is
to convert an application-layer omission from a silent cross-tenant read into a
visible empty result (I6). If both layers receive the same context, a *wrong* context
is **not** caught by the backstop; that risk is K5, addressed by provenance
(requirement 7 plus audit per §66), not by the layers themselves.

---

## Context

Innvntory is multi-tenant from day one (§4.8) on PostgreSQL (§61), with a
**dedicated backend service** that is the only component permitted to touch the
database (ADR 0001 D1, D5; ADR 0002 constraints 5, 6).

That leaves one consequential question unanswered: **at which layer is tenant
isolation enforced, and how does data reach PostgreSQL?**

The specification prescribes the *data* but not the *mechanism*:

> ```text
> §35 — Every tenant-owned record should contain: organization_id
> §35 — Application-level authorization and database-level safeguards should
>        both be considered.
> ```

Note the wording: **"considered"**, not "required". §35 does not mandate any
particular mechanism. This ADR therefore chooses between options the
specification leaves open.

Verified absences — the specification **never** mentions row-level security,
connection pooling, any ORM, query builder, or migration tool. Every such choice
below is **[Inference]**, not **[Spec]**.

### Why this decision ranks high

| Pressure | Source |
|---|---|
| "No organization should be able to access another organization's data." | §31 |
| "User A must never access Organization B's data." — a named **critical test scenario** | §58 |
| "No cross-tenant data access" — a named reliability target | §54 |
| "Tenant isolation" — a named database principle | §34 |
| RBAC and tenant isolation — named security requirements | §50, §83 |
| Production deployments must not leak one tenant's data to another | §58, §83 |

§88 ranks **security** and **data integrity** above product requirements, UX, and
implementation convenience. There is no product pressure that justifies a weaker
isolation posture.

---

## Source-derived requirements

Everything in this section is traceable to project documentation. Nothing is
inferred.

| # | Requirement | Source |
|---|---|---|
| S1 | Multi-tenant from day one; the architecture must support multiple organizations safely | §4.8 |
| S2 | "No organization should be able to access another organization's data." | §31 |
| S3 | Platform → Organization → users, locations, products, transactions | §31 |
| S4 | **Every tenant-owned record contains `organization_id`** | §35 |
| S5 | Application-level authorization **and** database-level safeguards should both be **considered** | §35 |
| S6 | Tenant isolation is a database principle, alongside integrity, transactions, indexing, auditability, migration safety | §34 |
| S7 | Granular RBAC; eight default roles | §32, §50 |
| S8 | Audit logs immutable; record who/what/when/where/before/after/reference | §33, §66 |
| S9 | "No cross-tenant data access"; critical inventory operations transactional | §54 |
| S10 | Atomic updates; "database transactions should be used where appropriate"; no partial state | §55 |
| S11 | Idempotency for payments, webhooks, orders, stock movements, integrations | §56 |
| S12 | "User A must never access Organization B's data" — critical test scenario | §58 |
| S13 | Efficient database queries; never load thousands of records into the browser | §59 |
| S14 | Scale path 1 → 100 → 10,000 → **100,000+ organizations** without a rewrite | §60 |
| S15 | PostgreSQL; Redis named as cache | §61 |
| S16 | Production readiness requires RBAC and tenant isolation | §83 |
| S17 | Backend-only database access; no DB credentials, drivers, or migration tooling in `apps/web` | ADR 0001 D1/D5/D6; ADR 0002 constraints 5–6 |
| S18 | Business rules exist only in the backend business-service layer | ADR 0001 D2/D8 |
| S19 | The worker is part of the backend and runs as a separate process from the same codebase | ADR 0001 §3.1, D13 |
| S20 | AI tools call controlled backend business services; the model holds no privilege of its own | ADR 0001 D3, D11; `AGENTS.md` §6 |
| S21 | Command menu offers "Switch organization" — a user may act for more than one organization | §43 |
| S22 | `plans` is a **system-level** catalogue; `subscriptions`, `entitlements`, `usage_records` are tenant-owned | §49, §34 |

---

## Architectural implications

**[Inference]** unless marked. These follow from S1–S22; they are not stated.

### I1 — The application layer is the only realistic place a filter can be forgotten

Because of S17, only the backend holds database credentials. A forgotten tenant
filter cannot originate in the browser or the frontend. The realistic failure mode
is a **backend developer or AI coding agent omitting `organization_id` from a
query** — a normal, silent, easy-to-miss defect. The specification's own §58
scenario exists precisely because this is the failure being guarded against.

### I2 — Two different things get conflated as "tenant isolation"

- **Row-level isolation** — a query must not return another tenant's rows.
- **Record-level authorization** — this user may not perform this action *within*
  their own tenant (§32 RBAC).

RLS addresses the first. It cannot express the second: `products.delete` is a
business rule, not a predicate. **Business authorization must remain in the
application layer under every option considered here.**

### I3 — §35's prescribed data model already rules out schema-per-tenant

If every tenant-owned table carries `organization_id` (§35), the tables are shared
by design. Per-tenant schemas would make that column redundant. Option D is
therefore in tension with the specification's own data model, and with S14's
100,000-organization target.

### I4 — Connection pooling is the main hazard of database-level enforcement**

RLS policies read the tenant from a session variable. A pooled connection is
reused across tenants. **Session-level `SET` on a pooled connection leaks one
tenant's context into another tenant's request.** This is the single most likely
way a hybrid or RLS design produces a cross-tenant breach while appearing correct
in testing.

The safe construction is **`SET LOCAL` inside an explicit transaction**, which
resets at commit or rollback. That makes "every operation runs in a transaction" a
mandatory discipline — which S10 and S55 independently require anyway.

### I5 — The application database role must not be the table owner**

Table owners and superusers bypass RLS. If the backend connects as the owner,
database-level enforcement is silently inert while appearing configured. Migrations
must run as a separate, more privileged role. **[Inference]** — a property of
PostgreSQL, not of the Innvntory specification.

### I6 — RLS fails closed; application filters fail open**

A query missing an application filter returns **the wrong tenant's rows**. A query
missing RLS context returns **no rows**. The second failure is a visible bug; the
first is a silent breach. This asymmetry is the strongest argument for a
database-level backstop.

### I7 — Workers and AI tools are separate processes, so they are separate risk**

Neither shares a web request's context. Both must reconstruct tenant context from
something durable. Per S19–S20 they run the same business services, so if the
enforcement point is inside those services, both inherit the guarantee.

---

## Tenant context propagation

Where tenant identity originates, and how it reaches PostgreSQL. **Proposed
design** — this is the concrete shape Option C implies.

### The `TenantContext` object

One object, built once at the edge, threaded explicitly as a required argument.
**Never ambient global state**, because ambient state is what a worker or an AI tool
can leak between tenants.

```text
TenantContext
├── organizationId   ← from the authenticated session, never from a request parameter
├── actorId          ← the human or system principal
├── permissions[]    ← resolved per §32; authorization result, not a raw role name
├── actorType         ← user | worker | ai_tool | system
└── correlationId    ← ties audit entries to this operation (§66)
```

`organizationId` originates from the **session**, never from a URL parameter, form
field, or tool argument. A client-supplied organization identifier is untrusted input
(S37 validation, ADR 0002 constraint 10).

### Flow 1 — Authenticated user request

```text
HTTP request
  → authenticate ................ session → actorId                    [§30, §50]
  → resolve organization ........ membership lookup for this actor
                                  ⇒ TenantContext.organizationId
  → build TenantContext ......... permissions resolved per §32
  → business service ............ authorize the operation (RBAC)   [I2 — never in DB]
  → data-access layer ........... apply organization_id filter explicitly
  → BEGIN
  → SET LOCAL app.organization_id = TenantContext.organizationId  [I4 — LOCAL, not SET]
  → PostgreSQL .................. RLS policy applies the same context  [backstop]
  → COMMIT ...................... SET LOCAL resets here
  → audit ....................... record per §66 with correlationId
```

`SET LOCAL` resets at COMMIT or ROLLBACK. A session-level `SET` would survive on a
pooled connection and leak into the next tenant's request — that is risk **K1**, and
it is why the transaction boundary is mandatory.

### Flow 2 — AI business tool

```text
AI request (natural language)
  → AI orchestration ............ model produces intent + arguments
  → tool selection .............. typed business tool chosen
  → ***TenantContext is taken from the invoking user's session ***
                                  NEVER from model output or tool arguments   [S20]
  → business tool ............... same business service the UI calls      [§28]
  → authorization ................ as Flow 1, against the INVOKING USER
  → data-access layer ........... identical to Flow 1 from here down
```

**The AI path is identical to Flow 1 from the business service onward.** That is the
point of ADR 0001 D3: the model is a caller, not a privilege. Two properties follow:

- The model **cannot** select a tenant. `organizationId` is not a tool argument.
- A tool that tried to widen scope would be filtered by **both** layers.

This is the flow Option A protects least well: an AI tool calling a data-access
function and omitting the filter has no backstop.

### Flow 3 — Background worker

```text
Queue message
  → worker claims job
  → read organizationId from the JOB PAYLOAD (durable, written at enqueue time)
  → build TenantContext ......... actorType = worker; permissions resolved for
                                  the stored actor, NOT the full role set
  → business service ............ same services as Flows 1 and 2        [S19]
  → data-access layer ........... explicit filter
  → BEGIN; SET LOCAL; query; COMMIT
```

Two rules make workers safe:

1. **A job without `organizationId` must fail closed** — refuse to process. Never
   run unscoped "just this once". Under Option C a missing context yields zero rows,
   which is safe but silently wrong; refusing loudly is better (§54 "no silent
   failures").
2. **Worker permissions are not a superset.** A background job acts for a recorded
   actor, not as an all-powerful system identity, so a compromised or buggy job
   cannot exceed what that actor could do interactively.

### Where enforcement must **not** live

| Location | Why not |
|---|---|
| In the frontend | No DB access at all (S17). Cannot enforce anything here |
| In an ORM global scope alone | Framework-dependent, and silently absent from raw SQL — see Q4 |
| In a shared connection variable set once at login | Fails across pooled connections (I4) |
| In business logic only, with no backstop | The omission path of I1 |
| In the AI tool layer | The model is not a trust boundary (§28, `AGENTS.md` §6) |

---

## Decision drivers

| # | Driver | Weight | Why |
|---|---|---|---|
| D1 | A forgotten filter must not leak data | Highest | S2, S12, §88 |
| D2 | One authoritative enforcement point | High | S18; a single layer avoids divergence |
| D3 | Coverage must be provable, not remembered | High | §58 requires a test; a convention cannot be tested |
| D4 | Correctness under concurrency and pooling | High | I4, S10, S55 |
| D5 | Support for AI tools and workers without special-casing | High | S19, S20 |
| D6 | Operational cost sustainable by a small team | High | U7 (§ see Open questions) |
| D7 | Query performance for large inventory tables | Medium | S13, S14 |
| D8 | Migration safety | Medium | S6 |
| D9 | Auditability of cross-tenant attempts | Medium | S8 |

---

## Options considered

### Option A — Application-enforced isolation

The data-access layer requires an explicit tenant scope on every query. No
database-level enforcement. Shared schema, `organization_id` on every tenant-owned
table (S4).

**Shape**

```text
request / worker / AI tool
   → TenantContext built once at the edge
   → business service (authorizes per §32)
   → data-access layer (applies organization_id filter — mandatory argument)
   → PostgreSQL
```

**Evaluation**

| Dimension | Assessment |
|---|---|
| Isolation strength | **Depends entirely on developer discipline.** One omission leaks silently (I1, I6) |
| Defense in depth | Single layer. No backstop |
| Authorization interaction | Natural — RBAC and tenant scoping live together (I2) |
| Developer ergonomics | Good. Explicit filter is readable and greppable |
| AI/tool interaction | Tool must be passed a tenant scope and use it correctly — same risk as any backend code |
| Transaction behaviour | Unconstrained; transactions used only where §55 requires |
| Worker behaviour | Job payload carries `organization_id`; a malformed job could run unscoped |
| Migrations | Simple. No policies to keep in step with tables |
| Testing | Must test **every** data-access path individually; a forgotten path is invisible to the suite |
| Debugging | Leaks present as wrong data with no error — **hardest failure mode to diagnose** |
| Operational complexity | **Lowest** |
| Performance | Best. One predicate, no per-row policy evaluation |
| Compatibility with ADR 0001 | Full |
| Compatibility with AI tools | Adequate, but unenforced |

**Advantages**

- Lowest operational cost, which matters to a small team (D6).
- Query plans stay simple and predictable.
- No interaction with connection pooling (I4) — a meaningful operational saving.
- Business authorization and tenant scoping remain in one readable place.

**Disadvantages**

- Coverage is **unenforceable**. Nothing fails when a filter is omitted.
- Directly exposed to I1, which is the exact defect §58 names.
- §35's "database-level safeguards **considered**" would have been considered and
  declined — defensible only if recorded as accepted risk.

### Option B — PostgreSQL Row-Level Security

Isolation enforced by database policies keyed on a tenant session variable. The
application establishes context; the database refuses rows.

**Shape**

```text
request / worker / AI tool
   → TenantContext built at the edge
   → BEGIN
   → SET LOCAL app.organization_id = <tenant>
   → business service
   → data-access layer (queries need NO explicit filter)
   → PostgreSQL RLS policy filters rows — deny by default
   → COMMIT (resets context)
```

**Evaluation**

| Dimension | Assessment |
|---|---|
| Isolation strength | **Strong**, subject to I4, I5, and correct policy coverage |
| Defense in depth | Database refuses independently of application code |
| Authorization interaction | **Cannot express RBAC** (§32). Application layer must still do it (I2) |
| Developer ergonomics | Mixed. Queries look unscoped; isolation is invisible in the code being read |
| AI/tool interaction | **Strong.** A tool cannot bypass the database |
| Transaction behaviour | **Every operation must be transactional** — `SET LOCAL` requires it (I4). Aligns with S10/S55 |
| Worker behaviour | Context must be set per job; a job without context sees **no rows**, not all rows (I6) |
| Migrations | Every table needs policy + `FORCE ROW LEVEL SECURITY` + correct grants, atomically |
| Testing | A negative test — query without filter returns zero rows — **proves the guarantee** |
| Debugging | Empty results are confusing; a wrongly-set context looks like missing data |
| Operational complexity | **High.** Pooling discipline, role separation, policy coverage |
| Performance | Extra predicate per query; index must lead with `organization_id` |
| Compatibility with ADR 0001 | Full, if the frontend stays DB-less (S17) |
| Compatibility with AI tools | **Strongest** |

**Advantages**

- The guarantee is **provable by a test**, not a convention (D3, S12).
- Fails **closed** (I6) — missing context yields no rows.
- The only option that structurally protects against I1, because the AI/agent and
  developer paths are the realistic source of omissions.
- Makes §35's "database-level safeguards" genuinely satisfied.

**Disadvantages**

- **Connection pooling is a live cross-tenant hazard** unless `SET LOCAL` is used
  exclusively (I4). Getting this wrong is silent and catastrophic.
- Requires a non-owner application role, or enforcement is inert (I5).
- Policy coverage becomes a schema-wide invariant that must itself be tested.
- Cannot express RBAC, so application authorization is still mandatory (I2) —
  the option does not remove application work.
- Every query becomes a transaction; overhead is small but non-zero.
- Highest operational burden of the three, against a team model recorded as
  **founder + product team + AI coding agents** (U7).

### Option C — Hybrid application + database enforcement *(ACCEPTED)*

Explicit `organization_id` scoping in the data-access layer **and** RLS as an
enforcement backstop. The application filter serves clarity, correctness, and query
plans; the policy is the guarantee that an omission cannot leak.

Both layers are driven by **one** `TenantContext`; the second is a backstop against
omitted or widened query scope, **not** a second authority for selecting a tenant.

**Shape**

```text
request / worker / AI tool
   → TenantContext built at the edge (organizationId, userId, permissions)
   → business service authorizes per §32 (RBAC — never delegated to the database)
   → data-access layer applies organization_id filter explicitly
   → BEGIN; SET LOCAL app.organization_id = <tenant>
   → PostgreSQL: RLS policy applies the same context as a backstop (deny by default)
   → COMMIT
```

Both layers key off **the same `TenantContext` object**, so there is one source of
truth for tenant identity and no opportunity for the two to disagree about *which*
tenant is in play — only for one to be missing.

**Evaluation**

| Dimension | Assessment |
|---|---|
| Isolation strength | **Highest of the shared-schema options.** Explicit filter plus an enforcement backstop |
| Defense in depth | Two layers deriving from **one** `TenantContext`, as §35 contemplates |
| Authorization interaction | RBAC in the application; row isolation in both layers |
| Developer ergonomics | Good. The filter is visible, greppable, and reviewable |
| AI/tool interaction | Strong. A missing filter still cannot leak |
| Transaction behaviour | Transactional by construction (I4) |
| Worker behaviour | Context set per job; unscoped job sees no rows |
| Migrations | Table + policy + `FORCE` + index must land atomically |
| Testing | Layered: service-level tests **and** a negative RLS test proving the backstop |
| Debugging | Better than B alone — the explicit filter makes most bugs visible in code |
| Operational complexity | **Moderate** — inherits B's pooling and role requirements |
| Performance | Two predicates per query; one index serves both |
| Compatibility with ADR 0001 | Full (S17, S18) |
| Compatibility with AI tools | **Strongest**, which matters for an AI-native product |

**Advantages**

- Satisfies both halves of §35 rather than choosing one.
- The database backstop covers I1 — the realistic omission path — without removing
  the visible, reviewable filter.
- A negative test can prove the backstop, so the guarantee is verifiable (D3).
- Fails closed at the database layer while remaining debuggable in code (I6).
- RBAC stays where it belongs: in the business service (I2, S18).

**Disadvantages**

- Two layers to maintain; a policy can drift from application intent.
- **Inherits every operational hazard of Option B** — pooling (I4), role
  separation (I5), policy coverage. The hybrid does not make these optional.
- Redundant predicates; a wrong tenant *value* would not be caught by the
  backstop if the filter and the policy both key off the same context. This is
  covered by D1's provenance requirement, not by the layers themselves.
- Highest initial build cost of the three.

### Option D — Schema-per-tenant — *excluded, and why*

Considered because `docs/DATABASE.md` §4 lists it. **Excluded on specification
grounds, not on preference:**

1. **It contradicts §35's prescribed data model.** S4 puts `organization_id` on
   *every tenant-owned record*; in a per-tenant schema that column is redundant
   (I3).
2. **S14 sets a 100,000+ organization target.** Per-tenant schema means per-tenant
   migrations, per-tenant connection routing, and cross-tenant queries become
   application-level fan-out. §60 explicitly warns against scale introduced ahead
   of measured need.
3. It maximizes isolation strength, but at a cost the specification does not ask
   anyone to pay.

---

## Comparison

Factual comparison. **No scores, no ranking, no winner labels.**

| Dimension | A — Application | B — RLS | C — Hybrid *(proposed)* | D — Schema-per-tenant |
|---|---|---|---|---|
| Isolation strength | Developer-dependent | Strong | Highest of the shared-schema options | Maximum (physical) |
| Survives a forgotten filter | **No** | Yes | Yes | Yes |
| Failure mode when context is missing | **Leaks other tenants' rows** | Returns no rows | Returns no rows | Connection fails / schema absent |
| Defense in depth | 1 layer | 1 layer (database) | 2 layers | Physical separation |
| Expresses RBAC (§32) | Yes | **No** | Yes (application) | Yes (application) |
| Provable by a test | Only per-path | Yes | Yes | Yes |
| Connection-pooling hazard | None | **High** (I4) | **High** (I4) | Moderate |
| Requires non-owner DB role | No | **Yes** (I5) | **Yes** (I5) | Partially |
| Every operation transactional | No | Yes | Yes | No |
| Operational burden | **Lowest** | High | Moderate–high | Highest at scale |
| Query plan simplicity | **Simplest** | Policy predicate | Two predicates | Schema routing |
| Migration coupling | None | Table + policy + index | Table + policy + index | Per-tenant fan-out |
| Fits §35 data model | Yes | Yes | Yes | **Contradicts it** |
| Fits §60 scale target | Yes | Yes | Yes | **Poorly** |
| Worker isolation | Convention | Enforced | Enforced | Enforced |
| AI-tool isolation | Convention | Enforced | Enforced | Enforced |

**The decisive difference.** A and B are not symmetric in how they fail. A fails
**open** — a forgotten filter returns another tenant's data with no error. B and C
fail **closed** — missing context returns nothing (I6). For the one property the
specification elevates to a named critical test scenario (S12), failing closed is
worth real cost.

---

## Proposed decision

> **Accepted — 2026-10-04.** What follows was proposed on 2026-10-03 and accepted
> without change on review. The reasoning is retained as the basis of the decision.

### Decision: Option C — Hybrid *(accepted)*

**1. Data model.** Shared schema, shared tables. Every tenant-owned table carries
`organization_id NOT NULL` (S4). Composite indexes lead with `organization_id`
(S13). System-level tables — `plans` (S22) — are excluded and documented as such.

**2. Application layer is authoritative for authorization.** The data-access layer
requires an explicit tenant scope; it is a required argument, not an ambient
global. Business rules and RBAC live in the backend business-service layer only
(S18, I2).

**3. RLS is a backstop, not the mechanism.** Policies on every tenant-owned table,
keyed on `SET LOCAL app.organization_id`, with `FORCE ROW LEVEL SECURITY`, and a
non-owner application role (I5). A query missing its application filter returns
**no rows** rather than another tenant's rows (I6).

**4. Every data-access operation runs inside a transaction** that sets tenant
context first (I4). This is mandatory, not optional — and it aligns with S10/S55.

**5. One `TenantContext` object** is constructed at the edge and threaded explicitly
through service → data-access. Both the application filter and the RLS context read
that same object, so they cannot disagree about which tenant is in play.

### Reasoning

- **It is the only option that satisfies both halves of §35** rather than choosing
  between them, and it is the only one that addresses I1 — the realistic omission
  path — without giving up the reviewable, greppable filter.
- **It answers §58 with a test rather than a convention.** S12 requires "User A
  must never access Organization B's data". Option C allows a negative test that
  proves the backstop separately from application code (D3).
- **It keeps RBAC where it belongs.** I2 establishes that RLS cannot express
  §32's permissions, so business authorization stays in the service layer regardless
  — Option C does not pretend the database can do that job.
- **It is forward-compatible with the product's stated direction.** For an
  AI-native platform where AI tools (S20) and workers (S19) will multiply the number
  of code paths reaching the database, a **structural** backstop is worth more than
  a human convention. This is the decisive argument given `AGENTS.md` §6.

### Honest cost of this proposal

Option C is **not** the cheapest option, and it inherits every hazard of Option B:

- Connection-pooling discipline is **mandatory**. `SET LOCAL` or equivalent, always
  (I4). Using session-level `SET` would reintroduce a cross-tenant leak while
  appearing correct in testing.
- A non-owner application role is required, or enforcement is silently inert (I5).
- Policy coverage becomes a schema-wide invariant that must itself be tested.
- **This is a real burden against a team model recorded as founder + product team +
  AI coding agents (U7).** If operational capacity proves insufficient, Option A
  with a mandatory isolation test suite is the defensible fallback — and that
  trade-off should be an explicit, recorded decision, not a drift.

**This ADR does not claim the proposal has been validated.** No query has been run,
no policy written, no benchmark performed. See `## Risks`.

---

## Consequences

### If Option C is adopted

| # | Consequence |
|---|---|
| 1 | Tenant isolation is enforced at two layers, both reading one `TenantContext`. |
| 2 | Every data-access operation is transactional. Aligns with S10/S55. |
| 3 | A non-owner application role and a separate migration role become mandatory. |
| 4 | RLS policy coverage becomes a schema-wide invariant requiring its own test. |
| 5 | The application data-access layer gains a required parameter — visible in review. |
| 6 | AI tools and workers inherit isolation without special-casing, because enforcement is in services both already call (S19, S20). |
| 7 | Migrations become coupled: table + policy + `FORCE` + index must land atomically. |
| 8 | Query plans must lead indexes with `organization_id` (S13). |
| 9 | A tenant-scoped bug that omits the filter returns empty results — visible, debuggable, not a silent leak. |
| 10 | Two redundant predicates per query; overhead unquantified until measured. |

### If Option A is adopted instead

- Lowest operational burden — attractive against U7.
- **Isolation becomes a convention with no enforcement mechanism.**
- Every future data-access path is a potential §12 breach, and no single test can
  prove coverage across paths written later.
- Acceptable only with a mandatory, comprehensive isolation test suite and recorded
  acceptance of the residual risk.

### If Option B is adopted instead

- Single enforcement mechanism; no redundant predicates.
- Queries read as unscoped, so isolation is invisible during code review.
- RBAC still required in the application layer, so application work is not reduced.

---

## Risks

| # | Risk | Severity | Note |
|---|---|---|---|
| K1 | **Pooling misconfiguration reintroduces a cross-tenant leak** (I4). Session `SET` on a pooled connection is the specific mechanism. | **Critical** | Mitigated by mandatory `SET LOCAL` + a test that asserts context resets between tenants |
| K2 | **Application connects as table owner, making RLS silently inert** (I5). | **Critical** | Looks configured; enforces nothing. Must be asserted by a test, not by convention |
| K3 | A table is added without a policy — a permanent hole. | High | Coupled migrations + a coverage test asserting every tenant table has an active policy |
| K4 | Operational burden exceeds team capacity (U7). | High | The reason Option A remains a defensible fallback |
| K5 | Wrong-but-consistent tenant context: filter and policy both use the same wrong value, so the backstop does not catch it. | High | Only provenance (who set the context, from where) catches this |
| K6 | Empty-result failure mode misdiagnosed as missing data. | Medium | Documented behaviour; needs developer-facing notes |
| K7 | Performance regression from two predicates and mandatory transactions. | Medium | Unquantified. Nothing benchmarked |
| K8 | Report queries bypass or duplicate tenant scoping (S13 reports span inventory, sales, purchase, financial). | Medium | Reports must go through the same services, not a parallel path |
| K9 | System-level operations (plans, support access) not cleanly separated from tenant operations. | Medium | See below; partly unresolved |
| K10 | This analysis is agent-authored and unreviewed. | Medium | Consistent with ADR 0001 P2 and ADR 0002 R3 |
| K11 | All performance claims are inference; nothing built, nothing measured. | Medium | Consistent with ADR 0001 P3 |

---

## Testing implications

Isolation testing is a **release gate**, not a nicety — S12 and S16 name it.

### Required tests

| # | Test | Proves |
|---|---|---|
| T1 | Tenant A reads its own data successfully | Happy path works |
| T2 | Tenant A requests Tenant B's record by ID → not found or denied | No cross-tenant read (S12) |
| T3 | **Direct query with no `organization_id` filter returns zero rows** | The RLS backstop actually works — this is the test that proves Option C's premise |
| T4 | Connection reuse: Tenant A's transaction completes, Tenant B's runs on the same pooled connection, sees only B | K1 — pooling is safe |
| T5 | Application role cannot read a tenant table with RLS context unset | K2 — role separation is real |
| T6 | Every table carrying `organization_id` has an active policy | K3 — no unprotected table |
| T7 | Worker job for Tenant A cannot read Tenant B | Worker isolation (S19) |
| T8 | AI business tool invoked with Tenant B's identifier under Tenant A's context returns nothing | AI-tool isolation (S20) |
| T9 | Report and export queries are tenant-scoped | S13, K8 |
| T10 | Transaction rollback leaves no partial state | S10, S55 |

**T3, T4, T5 and T6 are the ones that distinguish Option C from Option A.** Without
them the backstop is an assumption.

**Test data.** Tests need at least two organizations with overlapping identifiers, so
a missing filter produces a plausible-looking wrong result rather than an obvious
empty one.

---

## Operational implications

- **Roles.** At least: a non-owner runtime role, a migration role, and — if support
  access needs it — a separate audited role. All are **[Inference]**; none is
  specified.
- **Pooling.** Runtime configuration must guarantee context isolation between
  tenants (K1). To be verified, not assumed.
- **Observability.** Cross-tenant access attempts should be logged (S8). Note that
  RLS denies silently, so a denial may be invisible without deliberate logging.
- **Backups and restore.** §52 applies unchanged; a restore must preserve tenant
  scoping. Not yet designed.
- **Incidents.** A cross-tenant leak is a security incident, not a bug — it must be
  detectable and alertable.
- **Runbooks.** None exist. No deployment or database exists yet.

---

## Migration implications

1. **Coupling.** Creating a tenant-owned table and its RLS policy must be **one
   atomic migration**. A table without a policy is a hole that persists until
   noticed (K3).
2. **`FORCE ROW LEVEL SECURITY`** is required, or the table owner bypasses policies
   (I5).
3. **Indexes must lead with `organization_id`** on every tenant-owned table, for
   both the application filter and the policy predicate to be efficient (S13).
4. **Migrations run as a different role** from the application, or RLS is inert in
   both environments (I5).
5. **Backfill.** Every existing table must be audited for `organization_id`
   presence. No tables exist yet, so there is no backfill — an advantage of having
   not built anything.
6. **Rollback.** Dropping a policy restores the unprotected state; rollback
   ordering matters. Untested — nothing exists to test.

---

## Revisit conditions

Reconsider this decision if any of the following becomes true.

| Condition | Source of the signal |
|---|---|
| U7 proves unable to sustain Option C's operational burden | Team reality → fall back to Option A **with** a mandatory isolation suite |
| K1 or K2 occurs in practice | A pooling or role defect is an incident, not a learning opportunity |
| A tenant-owned table is found without an active policy | K3 realised |
| Cross-tenant analytics or support access becomes a real requirement | K9 → may justify a distinct system-level path |
| §60's 100,000-organization target becomes imminent and measured | S14 → revisit indexing, partitioning, and possibly isolation strategy |
| The specification is revised and states a mechanism for §35 | Standing trigger; supersedes this record |
| ADR 0001 or ADR 0002 is superseded in a way that changes who holds DB credentials | S17 assumption breaks |

**Standing trigger.** §35's "considered" means no specification change is *expected*
here. If v1.1+ addresses §35 or §58 mechanistically, this record must be revisited.

---

## Open questions

**Resolved by the specification:**

- **Is `organization_id` required on tenant-owned records?** Yes — §35 (S4).
- **Must both application and database safeguards be considered?** Yes — §35 (S5).
  Note "considered", not "required".
- **Does RLS express RBAC?** No — §32 permissions are business rules (I2).
- **Is schema-per-tenant compatible with the prescribed data model?** No — §35's
  column conflicts with it (I3).

**Resolved by the human owner — 2026-10-04:**

### ~~Q1 — Can a user belong to more than one organization?~~ **RESOLVED — YES**

A user **may belong to multiple organizations.**

Consequences, now settled:

- **Do NOT** model a user's active organization as a permanent single
  `organization_id` on the `users` table.
- **Organization membership is the relationship** between users and organizations.
- The **active organization is established in the authenticated session /
  `TenantContext`** — never persisted as the user's single owning organization.
- This is consistent with §43's "Switch organization" command, and resolves the
  tension between §31's tree (users nested under an organization) and §43.

### ~~Q3 — How are roles and permissions owned?~~ **RESOLVED — platform-owned definitions, organization-scoped assignments**

Two distinct concerns, not one:

```text
roles · permissions · role_permissions
    = PLATFORM-LEVEL DEFINITIONS (system-level; not tenant-owned; no RLS)

organization_memberships
    = user + organization + assigned role   (organization-scoped)
```

- Role and permission **definitions** are system-level concepts, seeded by the
  platform. Per §32 there are eight default roles and granular permission strings.
- The **assignment** of a user to a role is **organization-scoped**, carried by the
  membership relationship.
- Therefore `TenantContext.permissions` resolves through the membership for the
  **active** organization — a user may hold different roles in different
  organizations.
- **No additional role model beyond this is to be introduced.** Custom per-tenant
  role definitions are not required and must not be invented.

**Still unresolved — these require a human or a further decision:**

| # | Question | Why it matters |
|---|---|---|
| Q2 | **What cross-tenant access, if any, may support or platform staff have?** | Decides whether a separate audited system-level role exists. Not addressed anywhere in the specification. |
| Q4 | **What is the ORM, query builder, or raw-SQL policy?** | Decides how the required tenant scope is expressed in code, and how enforcement attaches to it. Never mentioned in the specification. |
| Q5 | **Which connection pooling mode will be used?** | I4 is unimplementable safely without knowing this. Interacts with hosting, which ADR 0002 U10 also leaves open. |
| Q6 | **What are the `users` table ownership details, now that multi-organization membership is confirmed?** Q1 is resolved, but whether `users` carries any organization reference at all — versus depending entirely on `organization_memberships` — is not. | Affects the isolation model at the identity layer, and the foreign-key shape. |
| Q7 | **Does an operator connection for migrations/support bypass RLS, and how is that audited?** | Directly bears on K2 and Q2. |

**None of these five may be resolved by an agent, and none is treated as decided.**
Q4 and Q5 should be settled before any schema or connection work begins, since both
determine how requirement 3 and I4 are implemented in practice.

> ### Later resolution — 2026-10-04, [ADR 0004](0004-orm-query-access-and-pooling.md) (`Accepted`)
>
> All five questions above were resolved by the human owner in ADR 0004. **The accepted
> ADR 0003 architecture is unchanged.** This section is retained verbatim as the
> historical record of what was open at the time.
>
> | # | Resolution (ADR 0004) |
> |---|---|
> | Q2 | **Explicit operator context.** Tenant requests always operate inside a `TenantContext`. Cross-tenant/platform operations use a separate operator context, **never inferred from a missing `organizationId`**. Explicit platform permissions, explicitly audited. RLS fails closed for tenant context. No "admin sees everything" inside tenant services. |
> | Q4 | **TypeScript + Drizzle ORM** as the canonical data-access layer. No Prisma, no second ORM. Raw SQL only for PostgreSQL infrastructure, genuinely inexpressible queries, or documented reporting cases — always parameterized. |
> | Q5 | **Transaction-pooling compatible** (PgBouncer transaction mode in production). Tenant context via **`SET LOCAL`** inside the same transaction. **Never** session-level `SET`; never connection affinity; a pooled connection must not retain tenant state. |
> | Q6 | **`users` is platform-level identity** with no permanent `organization_id`. Membership lives in `organization_memberships` (user_id, organization_id, role_id, status). Active organization is session state. No parallel membership model. |
> | Q7 | **Runtime role must not own tables**; a separate migration role owns schema. Tenant runtime cannot bypass RLS. Privileged operator paths are explicit, separately permissioned, and audited. No hidden god mode. Audit captures actor, org context, action, target, timestamp, correlation id — never secrets. |
>
> I4 and I5 — the pooling and role-bypass hazards identified in this record — are
> directly answered by ADR 0004's Q5 and Q7 respectively.

---

## Provenance

**Authoritative specification** — `Innvntory.md.txt` v1.0, verified by direct read:
§4.8, §4.9, §4.10, §31 (multi-tenancy, verbatim), §32 (roles and permissions,
verbatim), §33, §34 (core entity list, verbatim), §35 (multi-tenant data model,
verbatim — the only mechanism statement), §43 (command center, verbatim), §50
(security list, verbatim), §54 (reliability targets, verbatim), §55 (inventory
consistency, verbatim), §56, §58 (critical test scenarios, verbatim), §59
(performance, verbatim), §60, §61, §66, §83, §88.

**Governance** — `AGENTS.md` §2 (source hierarchy; never invent requirements), §3
(engineering rules), §6 (AI-native rules; AI holds no privilege of its own).

**Decision records** — [ADR 0001](0001-backend-architecture.md) (`Accepted`):
D1/D2/D5/D6/D8/D11/D13, C2–C5. [ADR 0002](0002-frontend-framework.md)
(`Accepted`): constraints 5, 6, 9, 10, 11.

**Project documentation** — `README.md`; `docs/PRD.md`; `docs/ARCHITECTURE.md` §4,
§15 row 3; `docs/DATABASE.md` §1–§4 (including the open decision this ADR
addresses); `docs/SECURITY.md` §3, §4, §13; `docs/API-GUIDE.md` §6 (tenant
context), §10 (idempotency); `docs/AI-DECISIONS.md` §3.3, §3.4; `docs/CODE-STYLE.md`
§9; `docs/KNOWN-ISSUES.md` §1.3.

**Verified absences.** The specification was searched and contains **no** mention of
row-level security, connection pooling, any ORM, query builder, or migration tool.
All such statements in this ADR are labelled **[Inference]**.

**Human input relied upon** — the initial operating model recorded in ADR 0002 as
**founder/product team + AI coding agents** (U7), which is the basis for weighing
operational cost against isolation strength in D6 and K4.

**Not used as inputs** — general industry prevalence of any pattern; any ORM's
marketing; any prior project's database design.

---

## Decision

**ACCEPTED — 2026-10-04.**

Innvntory adopts **Option C — Hybrid application + PostgreSQL enforcement**.

```text
Database isolation & access layer:  Option C — Hybrid (accepted 2026-10-04)
Decision authority:                 Human-approved
Blocking questions:                 Q1 RESOLVED · Q3 RESOLVED
```

The full binding architecture is stated in `## Required architecture` (15
requirements). **Still nothing is implemented** — no schema, migration, SQL, RLS
policy, ORM, dependency, or configuration exists. Acceptance fixes the architecture;
it does not authorise building it.

**Follow-on decisions required before schema work:** Q4 (ORM / query policy) and Q5
(connection pooling mode). Both determine how requirements 3 and 11 are satisfied in
practice, and neither can be deferred past the point of writing a migration.

**Documentation synchronised with this decision:**

```text
docs/decisions/0003-database-isolation-access-layer.md   Accepted; Q1/Q3 resolved
docs/decisions/README.md                                index → Accepted
docs/ARCHITECTURE.md                                    §4, §15 row 3
docs/DATABASE.md                                        §1, §4
docs/SECURITY.md                                        §4
docs/KNOWN-ISSUES.md                                    §1.3
```

**Note.** ADR 0002 leaves the team-operating-model gap (U7) recorded. The same gap
applies here with more force: Option C's operational burden is the direct cost of
D6's "coverage must be provable". If that burden proves unsustainable, Option A
with a mandatory isolation test suite is the fallback — and choosing it should be a
recorded decision rather than a quiet drift.