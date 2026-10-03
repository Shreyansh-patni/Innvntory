# ADR 0004 — ORM, Query Access, Connection Pooling, Roles & Platform Access

- **Status:** **Accepted**
- **Proposed:** 2026-10-04
- **Accepted:** 2026-10-04
- **Decision authority:** Human-approved architectural decision
- **Accepted decisions:** Drizzle ORM as canonical data access · transaction-pooling compatibility · `SET LOCAL` tenant context · runtime vs migration role separation · explicit operator context
- **Specification references:** `Innvntory.md.txt` §4.9, §4.10, §31, §32, §34, §35, §37, §38, §54, §55, §58, §59, §60, §61, §66, §88
- **Related:** [ADR 0001](0001-backend-architecture.md) (`Accepted`), [ADR 0002](0002-frontend-framework.md) (`Accepted`), [ADR 0003](0003-database-isolation-access-layer.md) (`Accepted`)
- **Supersedes:** nothing
- **Superseded by:** nothing

---

## Status

**Accepted — 2026-10-04.**

This record closes the five questions ADR 0003 left open (**Q2, Q4, Q5, Q6, Q7**) and
fixes the data-access and connection-management contract that implementation must obey.

**Verification honesty.** The decisions below are human-approved and binding. The RLS
policies and migrations they require have been written and **structurally validated
but not executed against a live PostgreSQL instance** — no PostgreSQL server or
Docker runtime was available in the authoring environment. Integration tests that
require a database are written and **skip explicitly** when `DATABASE_URL` is absent.
Nothing in this record claims a database was provisioned or exercised.

---

## Context

ADR 0003 fixed the isolation *mechanism*: shared schema, `organization_id NOT NULL`,
application scoping plus PostgreSQL RLS as a backstop, both derived from one
`TenantContext`.

It deliberately left five implementation-facing questions open, because they were not
answerable from the product specification. The specification **never** mentions an
ORM, a query builder, a migration tool, row-level security, or connection pooling. All
choices below are therefore **engineering decisions**, not specification restatements.

Two of them are load-bearing for correctness rather than preference:

1. **How tenant context reaches PostgreSQL.** If it is session state, it is destroyed
   by connection pooling — the exact mechanism production deployments use.
2. **Which role owns the tables.** If the application owns them, RLS is silently inert.

Getting either wrong produces a system that *appears* to enforce isolation and does
not.

---

## Q2 — Platform and cross-tenant access

**Decision.**

- Normal tenant application requests **MUST always operate inside a `TenantContext`**.
- Cross-tenant / platform operations use a **separate, explicit operator context**. It
  is never the absence of a tenant.
- Operator context is **never inferred from a missing `organizationId`**. Absence is a
  fail-closed condition, not a privilege escalation.
- Platform operators hold **explicit platform-level permissions**.
- Operator access is **explicitly audited**.
- RLS policies **fail closed** for ordinary tenant context.
- Any intentional RLS bypass uses an **explicit, separately controlled database
  execution path and role**, and is auditable.
- **No "admin sees everything" behaviour inside ordinary tenant services.**

**Rejected:** a boolean such as `isPlatformAdmin` threaded through tenant code paths.
It makes an authorization decision ambient and makes every query site a potential
leak. The operator path is a **separate module with its own role**, not a flag.

---

## Q4 — ORM and query-access policy

**Decision.**

- **TypeScript + Drizzle ORM** is the application's data-access layer.
- Drizzle is the **standard query interface** for application data access.
- Drizzle schema definitions are the **canonical application schema representation**.
- Every tenant-scoped data-access operation that needs RLS context runs inside a
  **PostgreSQL transaction** that establishes tenant context first.
- Tenant context is **explicitly threaded** through the service and data-access layers.
- **No** direct PostgreSQL access from the Next.js frontend.
- **No** frontend database credentials.
- **No** arbitrary SQL strings from request input.
- **Prisma is not introduced.**
- **No second ORM or query builder.**
- Business rules live in **backend business services** — not in React components, and
  not in database query helpers.

### Layer responsibilities

| Layer | Owns |
|---|---|
| React components | Rendering and user interaction. **No** business rules, **no** data access |
| Business services | Business rules, authorization decisions, workflows, orchestration |
| Data-access / repositories | Retrieval and persistence, within an enforced tenant scope |
| Drizzle | The query interface and canonical schema definition |
| PostgreSQL | Row-level isolation enforcement (backstop), integrity, transactions |

AI tools **call business services**. They do not bypass them (ADR 0001 D3,
`AGENTS.md` §6).

### Raw SQL boundary

Raw SQL is permitted **only** for:

1. **PostgreSQL infrastructure** — RLS policies, roles, extensions, indexes,
   constraints, migrations, and transaction-local configuration.
2. **Queries that genuinely cannot be expressed safely or cleanly in Drizzle.**
3. **Controlled reporting or performance cases**, explicitly documented.

Conditions on all three:

- Values are **always parameterized**. No string interpolation of untrusted input.
- Exceptions are **localized** to a documented, reviewed location.
- Every exception carries a comment stating **why** Drizzle could not be used.

**Why Drizzle.** It keeps the schema as typed TypeScript rather than a separate DSL,
which matters because ADR 0002 already commits the project to TypeScript end-to-end;
it composes naturally with transactions and with the raw-SQL escape hatch this
decision requires; and it does not hide the SQL it generates, which is essential when
RLS correctness must be reasoned about. It is also compatible with the
runtime-vs-migration role separation in Q7, since migrations are plain SQL by design.

**Why not Prisma.** It introduces a second, non-TypeScript schema representation and
a client-generation step, both of which conflict with "Drizzle schema definitions are
canonical" and with typed contracts shared across `apps/api` and `packages/shared`.
It also obscures generated SQL, which is the opposite of what RLS verification
requires. **[Agent analysis]** — no benchmark was run; this is a fit argument against
the constraints above, not a measured performance claim.

---

## Q5 — PostgreSQL connection pooling

**Decision.**

- The application **must be compatible with PostgreSQL transaction pooling**.
- Production is designed around a transaction-pooling-compatible pooler, such as
  **PgBouncer in transaction mode**.
- Local development may use direct connections through the application pool.
- **Never** depend on session-persistent settings for tenant isolation.
- **Never** use session-level `SET` to establish tenant context.
- Tenant RLS context **MUST** be established inside the same transaction as the
  protected query, using transaction-local configuration (`SET LOCAL` or an equivalent
  parameterized mechanism).
- The transaction must: **begin → establish trusted tenant/actor context → execute
  protected operations → commit or rollback.**
- A connection returned to the pool **must not retain tenant-specific state.**
- **Never** rely on connection affinity between requests.
- **Never** use PostgreSQL session state as application state.

### Why this is correctness, not configuration

Under session pooling or a naive implementation, `SET app.organization_id = 'org_a'`
persists on a pooled connection. The next request — belonging to **org_b** — reuses
that connection and silently queries as **org_a**. This is a cross-tenant breach that
passes ordinary testing, because tests rarely reuse a connection across tenants.

`SET LOCAL` scopes the value to the transaction and resets it on commit or rollback,
which is what makes the design pool-safe. **This is the single most important
implementation rule in this record.**

### Consequence

Tenant-scoped access is **always transactional**, even for a read. This aligns with
spec §54 and §55 rather than conflicting with them, but it is a real cost: no
autocommit reads, and one extra round trip per transaction scope unless batched.

---

## Q6 — `users` table ownership

**Decision.**

- `users` represents **platform-level user identity**.
- **No permanent single `organization_id` on `users`.**
- Organization membership is represented by **`organization_memberships`**.
- A user may belong to **multiple organizations**.
- The **active organization is session/`TenantContext` state**.
- Membership contains at minimum `user_id`, `organization_id`, `role_id`, plus
  membership status / lifecycle fields as appropriate.
- **No parallel membership or role model** may be invented.

### Consequence for the identity layer

`TenantContext` resolution is therefore a **join**, not a column read: resolve the
authenticated user, then resolve their membership for the **active organization**,
then resolve that membership's role permissions. A user with no membership in the
active organization has **no tenant context** — and must fail closed.

---

## Q7 — Operator / migration bypass and auditing

**Decision.**

- The **runtime application role MUST NOT own** application tables.
- A **separate migration role/process** owns schema changes.
- The runtime uses a **restricted** database role.
- The **normal tenant runtime cannot bypass RLS**.
- Migration operations may bypass normal tenant RLS, because migrations operate on
  schema and system state — but migrations are **not exposed as application runtime
  functionality**.
- Any intentionally privileged operator data-access path is **explicit**, separately
  permissioned, and **audited**.
- **Never implement a hidden "god mode".**
- Audit records capture: **actor/operator identity, organization context where
  applicable, action, target/resource where applicable, timestamp, and
  correlation/request identifier.**
- **Secrets must never be written to audit logs.**
- Scope here is the **architectural contract and foundational interfaces only**. A
  complete enterprise operator console is explicitly out of scope.

### Why owner-bypass matters

In PostgreSQL, a table's **owner bypasses its own row-level security policies** unless
`FORCE ROW LEVEL SECURITY` is set. If the application connects as the owner,
enforcement is **silently inert** while appearing correctly configured. Hence both
requirements: a non-owner runtime role, **and** `FORCE ROW LEVEL SECURITY` as
defence in depth.

---

## TenantContext propagation

Unchanged in intent from ADR 0003, now with a fixed mechanics contract.

```text
TenantContext
├── organizationId   ← from authenticated session; NEVER a request parameter,
│                      NEVER model output (Q4, ADR 0002 constraint 8)
├── actorId          ← the human or system principal
├── permissions[]    ← resolved via active-org membership (Q6)
├── actorType        ← user | worker | ai_tool | operator
└── correlationId    ← ties audit entries to the operation (§66)
```

`actorType: 'operator'` is the **explicit** platform path from Q2. It is never
derived from a missing `organizationId`.

**No ambient tenant state.** No module-level "current organization", no mutable
global. Tenant context is an explicit parameter through services and data access.

**Fail closed.** A tenant-scoped operation with no tenant context throws. It does not
run unscoped and it does not fall back to operator mode.

---

## Worker implications

- Jobs carry **durable** organization context, written at enqueue time.
- The worker reconstructs `TenantContext` from that durable context.
- A job **missing `organizationId` fails closed** — it is refused, not processed
  unscoped and not silently repaired.
- Worker permissions are **not a superset**. A job acts for a recorded actor.
- Workers run the **same business services** as HTTP requests, so the same tenant
  contract applies without special-casing.

## AI tool implications

- AI tools **call business services**, which enforce tenant scope.
- `organizationId` is **never a model-selected or model-supplied value**.
- Tools receive the **invoking user's** `TenantContext` (ADR 0002 constraint 12,
  ADR 0001 D3).
- A tool cannot widen scope; the data-access layer and RLS both derive from the same
  trusted context.
- AI surface is Phase 7. **No AI runtime is implemented** by this record.

---

## Testing implications

| # | Test | Proves |
|---|---|---|
| P1 | Tenant A reads its own rows | Happy path |
| P2 | Tenant A requests Tenant B's record → denied/not found | Cross-tenant read blocked |
| P3 | Query with **no** `organization_id` filter returns **zero** rows | RLS backstop is live |
| P4 | Tenant A's transaction completes; Tenant B reuses **the same pooled connection** and sees only B | `SET LOCAL` is pool-safe |
| P5 | Runtime role cannot read a tenant table with context unset | Role separation is real |
| P6 | Every table carrying `organization_id` has an active policy | No unprotected table |
| P7 | Runtime role is **not** the table owner, and is subject to `FORCE RLS` | Owner-bypass is closed |
| P8 | Tenant-scoped read with no `TenantContext` **throws** | Fail-closed, not fail-open |
| P9 | `operator` context is required for any cross-tenant path; absence never implies it | Q2 separation |
| P10 | Job without `organizationId` is refused | Worker fail-closed |
| P11 | Schema-migration SQL parses and expected objects exist | Structural migration check |

**P3, P4, P5, P7 and P8 are the ones this decision enables.** They are the direct
payoff of choosing hybrid enforcement plus transaction-local context.

**Honest status:** P1–P11 require a live PostgreSQL instance. **None has been
executed.** They are written to skip, explicitly and visibly, when `DATABASE_URL` is
absent. Structural checks that need no database (migration SQL shape, raw-SQL
parameterisation, layer-boundary rules) are runnable now.

---

## Migration implications

1. **Coupled migration.** Table + RLS policy + `FORCE ROW LEVEL SECURITY` + index must
   land **atomically**. A tenant table without a policy is a permanent hole (P6).
2. **Role separation is part of the migration set.** Creating the non-owner runtime
   role and the migration role belongs with the first migration that creates tables,
   not as a later manual step.
3. **Index discipline.** Indexes on tenant-owned tables lead with `organization_id`,
   serving both the application filter and the RLS predicate.
4. **No backfill.** Nothing exists yet — an advantage of not having built earlier.
5. **Rollback.** Dropping a policy restores the unprotected state; ordering matters and
   is untested.

---

## Rejected alternatives

| Alternative | Why rejected |
|---|---|
| **Prisma** | Second schema representation + client generation step; conflicts with TypeScript-canonical schema and obscures generated SQL (Q4) |
| **TypeORM** | Same category of objection; decorator/metadata indirection obscures SQL further |
| **Knex / raw SQL as the primary interface** | Loses compile-time schema typing; makes the "one canonical schema" guarantee unenforceable |
| **Session-level `SET` for tenant context** | **Unsafe under pooling** — silent cross-tenant breach (Q5) |
| **Connection-per-tenant affinity** | Unscalable, and still unsafe if any path leaks a connection |
| **Application owns its tables** | Owner bypasses RLS; enforcement becomes silently inert (Q7) |
| **`isPlatformAdmin` flag in tenant services** | Ambient authorization; every query site becomes a potential leak (Q2) |
| **Disabling RLS for "reports"** | Turns an isolation mechanism off for a whole class of query. Reports go through the same services (ADR 0003 K8) |
| **Second ORM / query builder** | Duplicates responsibility; explicitly excluded |

---

## Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | Pooling misconfiguration reintroduces a cross-tenant breach | `SET LOCAL` mandatory; P4 asserts it; documented in `docs/DEVELOPMENT.md` |
| R2 | Runtime connects as owner → RLS inert | Non-owner role + `FORCE RLS`; P5, P7 |
| R3 | A tenant table ships without a policy | Atomic migrations; P6 |
| R4 | Raw SQL reintroduces injection or unfiltered access | Raw SQL confined to documented locations; always parameterized; reviewed |
| R5 | Operator path becomes a hidden god mode | Separate module and role, never a flag; Q2; audited |
| R6 | Every read becomes transactional — overhead unquantified | Accepted deliberately; aligns with §54/§55. Unmeasured. |
| R7 | ORM choice made without benchmark | Recorded as a fit argument, not a measured claim |
| R8 | This record is unimplemented and unverified against a live database | Stated plainly; integration tests skip visibly |

---

## Revisit conditions

| Condition | Action |
|---|---|
| P3 or P4 fails against a real database | Re-evaluate the RLS mechanism in ADR 0003 before shipping |
| Reporting/performance requirements cannot be met through Drizzle | Documented raw-SQL exception, or revisit Q4 |
| Transaction-per-read overhead proves unacceptable | Revisit read-path transaction scoping — **not** the `SET LOCAL` rule |
| A second ORM or a different migration tool is proposed | Require an ADR; do not adopt ad hoc |
| Operator requirements grow beyond foundational interfaces | Separate ADR for the operator console |

---

## Consequences

1. `apps/api` depends on **Drizzle** and a PostgreSQL driver. It is the only package
   permitted to hold database credentials.
2. `apps/web` depends on **no** database package.
3. Tenant-scoped data access is **transactional by construction**.
4. **Runtime and migration roles are distinct**, created by migration artifacts.
5. **Operator access is a separate module and role**, not a flag.
6. Raw SQL exists in **documented, parameterized, reviewed** locations only.
7. Worker and AI paths inherit the tenant contract through business services.

---

## Provenance

**Human decisions (2026-10-04)** — supplied by the repository owner and recorded
verbatim as Q2, Q4, Q5, Q6 and Q7 above, plus the Accepted status of this record.

**Specification** — `Innvntory.md.txt` v1.0: §4.9, §4.10, §32, §34, §35, §37, §38,
§54, §55, §58, §59, §60, §61, §66, §88. **Verified absences:** the specification
contains no mention of any ORM, query builder, migration tool, row-level security, or
connection pooling. Every such choice here is an engineering decision.

**Decision records** — [ADR 0001](0001-backend-architecture.md) (D3, D5, D6, D8, D13);
[ADR 0002](0002-frontend-framework.md) (constraints 5, 6, 9, 10, 11, 12);
[ADR 0003](0003-database-isolation-access-layer.md) (I4, I5, I6, K1, K2, K3, K5, and
Q1/Q3 as resolved there).

**Project documentation** — `docs/DATABASE.md`, `docs/SECURITY.md`,
`docs/API-GUIDE.md`, `docs/AI-DECISIONS.md`, `docs/CODE-STYLE.md`,
`docs/DEVELOPMENT.md`, `docs/DEPENDENCIES.md`.

**Not used as inputs** — any sibling project's database or ORM setup; vendor
benchmark claims; general industry prevalence.

---

## Decision

**ACCEPTED — 2026-10-04.**

```text
Q2  Platform / cross-tenant access ....... explicit operator context; never inferred
Q4  ORM / query access ................... TypeScript + Drizzle; no Prisma; no 2nd ORM
Q5  Connection pooling ................... transaction-pooling compatible; SET LOCAL
Q6  users ownership ...................... platform identity; organization_memberships
Q7  Operator / migration bypass .......... non-owner runtime role; audited operator path
```

**No architecture blocker remains** for initial application scaffolding and the
identity/tenant/RBAC schema foundation.

**Still open, unrelated to this record:** authentication provider and session
strategy (`docs/ARCHITECTURE.md` §15 row 4), RBAC storage beyond the ADR 0003 Q3 model
(row 5), queue technology (row 6), hosting (row 8), test stack (row 9), observability
(row 10).

**Implementation note.** These decisions are binding. Implementation is verified
against lint, typecheck, unit tests and a production build; database-dependent
behaviour is **not** claimed as verified, because no PostgreSQL instance was
available.