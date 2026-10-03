# Decision: Backend Architecture

- **Status:** **Accepted**
- **Proposed:** 2026-10-03
- **Accepted:** 2026-10-03
- **Deciders:** Repository owner, by explicit instruction to decide. The trade-off
  analysis and recommendation in this record were authored by an AI agent
  (`opencode`) acting under that instruction. See
  [Provenance and residual risk](#provenance-and-residual-risk).
- **Specification references:** `Innvntory.md.txt` §4.7, §4.8, §4.9, §4.10, §6, §12–§25, §28, §30–§33, §34–§38, §45–§49, §52–§63, §67, §74, §80, §82, §83, §88
- **Supersedes:** nothing
- **Superseded by:** nothing

---

## Status

**Accepted — 2026-10-03.**

The decision is **Option B**: a Next.js frontend plus a **dedicated backend service**,
structured as a **modular monolith** with a separate worker process started from the
same backend codebase and artifact. See `## Decision`.

This supersedes the earlier state of this record, which was `Proposed — awaiting
human approval`. The owner reviewed the requirement extraction, the three-option
analysis, and the trade-offs in this document, and instructed that the decision be
made. The recommendation this document reached is the one adopted, unchanged in
substance.

**Still nothing has been implemented.** No dependency, service, scaffold, database,
API, or configuration has been created. This record establishes an architecture; it
does not begin building one. See `## Consequences` and
[Provenance and residual risk](#provenance-and-residual-risk).

---

## Context

Specification §61 lists a possible technical architecture and explicitly declines to
choose the backend:

```text
Backend — Potential options:
  Next.js API
  or
  Dedicated backend service
Architecture should be selected based on workload and team requirements.
```

That decision is the highest-priority open item in the project
(`docs/KNOWN-ISSUES.md` §1.1, `docs/ARCHITECTURE.md` §15
row 1). It is not a cosmetic choice. It determines where business rules live, where
the transaction boundary sits, how the AI layer reaches business capabilities, and
how the system is deployed and operated.

Two things make this decision heavier than a normal framework pick.

**First, the specification already constrains it heavily.** It is not an open field.
§4.9 requires an API-first core, §4.8 requires multi-tenancy from day one, §54 and
§55 require transactional inventory integrity, §56 requires idempotency including for
webhooks, and §61 itself mandates a queue/worker architecture. Any candidate must
satisfy all of these.

**Second, Phase 0.1 already committed to a layering that this decision must
preserve.** `AGENTS.md` §6 and `docs/AI-DECISIONS.md` require that the AI layer sit
*above* authoritative business services, that it reach business data only through
those services, and that there be exactly **one** authoritative business-service
layer shared by the UI, the API, and the AI tools. Whichever backend option is
chosen must make that structure real rather than incidental.

### A note on evidence labelling

This document distinguishes three kinds of statement, and labels them:

| Label | Meaning |
|---|---|
| **[Spec §NN]** | A fact stated in `Innvntory.md.txt`. Verifiable in the source document. |
| **[Inference]** | Architectural reasoning by this analysis. Not specified. General engineering knowledge about the platforms, clearly separated from Innvntory requirements. |
| **[Recommendation]** | This analysis's judgement. Not a decision. |

Where general platform behaviour is relied upon — for example, how a serverless
request lifecycle differs from a long-lived process — it is marked **[Inference]**
and is explicitly *not* attributed to the Innvntory specification.

### What this analysis could not evaluate

Specification §61 says the choice should be based on *"workload and team
requirements."*

- **Workload** is evaluated below, from the specification.
- **Team requirements could not be evaluated.** The repository contains no
  information about team size, composition, experience, or operational capacity.
  There is no basis in the source material for this.

This is a material gap, not a formality. The trade-off between Options A and B is
substantially a trade-off in *team operating cost*, and this analysis is reasoning
about it without the input the specification says to base it on. See
`## Revisit Conditions`.

---

## Requirements from the Innvntory specification

Extracted from `Innvntory.md.txt`. **Only requirements the specification actually
states.** Nothing in this list is inferred.

### R1 — API-first core

> §4.9 "API First — Core functionality should be accessible through well-designed
> APIs."

§36 fixes the convention (`/api/v1/...`, plural resources, `:id` parameters, HTTP
verbs carrying semantics). §37 requires every API to support authentication,
authorization, validation, pagination, filtering, sorting, search, rate limiting,
idempotency, structured errors, and request IDs.

**Bearing on this decision:** the API is a *product surface*, not an implementation
detail of a user interface.

### R2 — Multi-tenancy from day one

> §4.8 "Multi-Tenant From Day One — The architecture must support multiple
> organizations safely."

§31: *"No organization should be able to access another organization's data."*
§35: every tenant-owned record carries `organization_id`; both application-level
authorization *and* database-level safeguards are to be considered. §58 names
tenant isolation as a critical test scenario: *"User A must never access
Organization B's data."*

**Bearing:** tenant isolation is a correctness and security property of the
authoritative data layer, and must be enforced on every query path.

### R3 — Transactional integrity for inventory

> §54 "Critical inventory operations should be transactional." Reliability targets:
> no silent failures, no lost transactions, no inconsistent inventory, no
> cross-tenant data access, no destructive action without safeguards.

§55 requires atomicity, giving the worked example: a sale creating an invoice, a
payment, and a stock deduction. *"If a critical operation fails, the system should not
leave partially completed state."* §58 requires that two users selling the last
available item must not cause negative inventory unless explicitly allowed.

**Bearing:** the transaction boundary is a first-class design concern, and it must
sit where business rules are enforced.

### R4 — Idempotency, including for webhooks

> §56 "Critical operations should support idempotency. Especially: Payments,
> Webhooks, Orders, Inventory movements, External integrations." — *"Sending the
> same request twice should not create two payments."*

§58 makes duplicate-webhook handling a named critical test scenario.

**Bearing:** inbound webhooks from external providers are a first-class, durable,
retry-tolerant entry point into the system.

### R5 — A queue/worker architecture is mandatory

> §61 "Background Jobs — Queue / Worker architecture."

This is stated as a component of the architecture, not as an option. Corroborating
requirements: §67 *"Large exports should run asynchronously"*; §24 *"The system
should automatically generate alerts"*; §25 notifications (in-app and email
prioritised); §49 subscription lifecycle with `billing_events`.

**Bearing — critical for this decision:** a separately-running, long-lived process
is required by the specification **regardless of which backend option is chosen.**
Neither option can eliminate the worker.

### R6 — External integrations

> §46 Payments (Razorpay, Stripe); Accounting (Tally, Zoho Books, QuickBooks);
> Communication (WhatsApp, Email, SMS); Commerce (Shopify, WooCommerce, Amazon);
> Tax (GST, E-Invoice, E-Way Bill).

No provider is selected. §74 requires tax functionality to be validated against
current official requirements before production use.

**Bearing:** multiple inbound webhooks and outbound calls to third parties, each
requiring R4 idempotency and R3 isolation from third-party failure.

### R7 — Observability, including workers and queues

> §53 Logs: application, security, audit, **worker**. Metrics: request latency, error
> rate, database latency, **queue depth**, CPU, memory, storage, active users.
> Monitoring: health checks for critical services.

**Bearing:** the specification operationally treats the worker and the queue as
distinct, separately-observable runtime components.

### R8 — AI layer above business services, sequenced last

> §28 "AI should be introduced after the core transactional system is reliable."
> *"AI recommendations must always be traceable to underlying business data."*

§84 places the AI layer above collected business data and below the operating layer.
§80 places AI at V3. §79 places the AI assistant and demand forecasting post-MVP.
Reinforced by Phase 0.1: `AGENTS.md` §6, `docs/AI-DECISIONS.md`.

**Bearing:** the business-service boundary must be a stable, typed, framework-neutral
interface, because the AI tool layer will consume it in a later phase and must not
require duplicating business logic.

### R9 — Environments and delivery

> §62 Separate environments: Local, Development, Staging, Production. Never use
> production credentials locally. Never test destructive migrations directly on
> production.
> §63 CI/CD: push → lint → type check → unit tests → integration tests → build →
> security checks → deploy staging → smoke tests → production.
> §64 Production deployments should be traceable to a commit.
> §65 Feature flags for beta features, experimental AI, new UI, gradual rollout.

**Bearing:** multiple deployable units must be promotable through four environments
without losing commit traceability.

### R10 — Testing

> §57 Unit tests (business logic, calculations, validation, permissions);
> Integration tests (database operations, API endpoints, authentication, inventory
> workflows); End-to-End tests.
> §58 Four scenarios that must always work: inventory arithmetic, concurrent sales,
> duplicate webhook, tenant isolation.
> §4.10 Production quality including testing.

**Bearing:** integration tests must exercise real database and API boundaries
separately from the UI — which implies the API is independently testable.

### R11 — Security

> §50 Secure authentication, password hashing, session management, MFA support, RBAC,
> tenant isolation, input validation, CSRF protection where applicable, rate limiting,
> secure cookies, encryption in transit and at rest, secret management, audit logging,
> dependency security.
> §51 Data minimisation.
> §33 Audit logs must be immutable. §66 auditability record.

**Bearing:** the backend is where essentially every control in §50 is enforced.

### R12 — Auditability

> §66 Every important operation records: who, what, when, where, before, after,
> reference.
> §33 Audit logs should be immutable.

**Bearing:** audit writes must be part of the same transaction as the business
operation they describe, to satisfy R3.

### R13 — Performance and scale

> §59 Fast page navigation, low API latency, efficient database queries, paginated
> large datasets, virtualized large tables where necessary. *"Never load thousands of
> records unnecessarily into the browser."*
> §60 1 → 100 → 10,000 → 100,000+ organizations without requiring a complete
> rewrite. *"Scale should be introduced based on actual bottlenecks rather than
> premature complexity."*
> §6 100–100,000 SKUs, 1–10 locations, 1–100 employees initially; architecture should
> eventually support significantly larger businesses.
> §12 Real-time stock.

**Bearing:** the specification states both a scale ambition and an explicit warning
against premature complexity. Both constraints must be honoured.

### R14 — Usage limits and entitlement enforcement

> §48 Configurable limits (users, products, locations, transactions, storage, API
> requests). *"The billing system should enforce entitlements centrally."*
> §49 Subscription entities include `entitlements` and `usage_records`.

**Bearing:** a cross-cutting, centrally-enforced check on every relevant request.

---

## Constraints

Binding on any option. C1–C4 are from the specification; C5–C8 follow from Phase 0.1
commitments or from §88.

| # | Constraint | Source |
|---|---|---|
| **C1** | A separately-running worker/queue process is **mandatory** | §61, §67, §24, §25, §49 |
| **C2** | There must be exactly **one** authoritative business-service layer, used by UI, API, and AI tools | `AGENTS.md` §6, `docs/AI-DECISIONS.md` |
| **C3** | AI receives **no** unrestricted database access; it calls authorized, typed business services | `AGENTS.md` §6, §28, §88 |
| **C4** | The transactional database remains authoritative; AI reasoning never becomes the source of truth for transactional records | §28, §55, `docs/AI-DECISIONS.md` §3.2 |
| **C5** | Tenant isolation and RBAC are enforced server-side on every query path, including aggregates, search, exports, and background jobs | §31, §35, §58, §4.10 |
| **C6** | Structured errors only; never expose stack traces, secrets, database details, or internal infrastructure | §38 |
| **C7** | Four separate environments, traceable to a commit | §62, §63, §64 |
| **C8** | Conflict order: user safety → security → data integrity → product requirements → UX → implementation convenience. **Implementation convenience must not decide this.** | §88 |

### Two consequences of C1 worth stating plainly

**[Inference]** Option A does not avoid a second long-running process. Because §61
mandates a queue/worker and §67 mandates asynchronous large exports, a Next.js-only
backend still requires a worker that runs outside the request/response lifecycle.
The frequently cited simplicity of Option A is therefore partly illusory: the
deployable-unit count is at least two either way.

**[Inference]** The real question is not "one deployable or two" but "**is the
business-service layer inside the user-interface framework's runtime, or outside
it?**" That is the axis on which the options genuinely differ, and it is the axis
this recommendation is argued on.

---

## Option A — Next.js API

### Architecture

**[Spec §61]** Next.js application whose server/API layer implements the
`/api/v1/...` surface directly, using the framework's server capabilities (route
handlers, server actions, or middleware-based request handling), with business logic
in shared modules imported by both the server handlers and the UI.

```
apps/innvntory            single Next.js application
├── app/                  UI routes (public website + application)
├── server/
│   ├── api/              /api/v1 handlers
│   ├── services/         business rules  ← authoritative layer
│   ├── db/               data access
│   └── auth/             authn + authz + tenant resolution
└── worker/               separate long-lived process (required by §61)
```

Repository structure: **single application repository**, with the worker either in
the same repository or as a thin sibling entry point.

Request/data flow: browser → Next.js server → business service → PostgreSQL. The
public API and the UI traverse the **same** server runtime and can share the same
service modules directly.

### Advantages

| # | Advantage | Basis |
|---|---|---|
| A1 | **One deployable application surface for the UI and the API.** A single Next.js deployment serves the marketing site, the application, and the `/api/v1` endpoints. | [Inference] |
| A2 | **Fastest path to a working end-to-end slice.** Fewest moving parts to stand up locally; no second service to run before a feature can be demonstrated. | [Inference] |
| A3 | **Shared types without a contract-generation step.** Business types, permission strings, and validation schemas can be imported directly by UI and server, with no published-contract machinery. | [Inference] |
| A4 | **No network hop for UI-driven business calls.** UI → service is in-process, removing a serialization and network step on the primary user path. | [Inference] |
| A5 | **One environment promotion path** for UI and API together, which trivially satisfies §64 commit traceability. | [Inference] |
| A6 | **Single CI pipeline** for UI and API, matching §63's single sequence. | [Inference] |
| A7 | **Aligns with the one stack the specification names.** §61 lists Next.js, React, TypeScript, and Tailwind together, so Option A uses the specification's own vocabulary. | [Spec §61] |
| A8 | **Lower baseline operational surface.** Fewer services to monitor, patch, and secure — relevant given §4.10's maintainability requirement. | [Inference] |

### Disadvantages

| # | Disadvantage | Basis |
|---|---|---|
| A1 | **The API is coupled to a user-interface framework's runtime.** The `/api/v1` surface — a first-class product surface under §4.9 — shares a deployment unit, a release cadence, and a scaling profile with the frontend. An API-breaking change requires a frontend release. | [Spec §4.9] + [Inference] |
| A2 | **Scaling the API scales the UI, and vice versa.** A traffic spike on the read-heavy public site and a long inventory report compete for the same runtime. §59 requires "low API latency" and §59 also requires never loading large datasets. | [Spec §59] + [Inference] |
| A3 | **Request-scoped execution is a poor fit for R3/R4/R5.** Atomic multi-write inventory operations, durable webhook processing, and queue workers are all long-lived or retry-driven concerns. | [Spec §54, §55, §56, §61] + [Inference] |
| A4 | **The worker splits out anyway**, so the deployment is already multi-unit — but *without* the isolation that motivated the split, and with the worker either in the same repository/runtime family or a second codebase. | [Spec §61] + [Inference] |
| A5 | **Framework-runtime constraints apply to background work.** Long-running jobs, exports (§67), and webhook retries inherit the runtime's execution model. | [Inference] |
| A6 | **Weaker isolation of business logic from presentation concerns.** When server handlers and UI render code live in one application, it is harder to enforce the C2 boundary — one authoritative service layer — because nothing structurally prevents UI code from reaching the database directly. | `AGENTS.md` §6` + [Inference] |
| A7 | **The AI tool boundary is weaker.** C3 requires AI to reach data only through authorized business services. With the API and UI in one runtime, "the API" is not a clean trust boundary. | `AGENTS.md` §6, C3` + [Inference] |
| A8 | **Does not answer the "team requirements" half of §61's criterion.** | [Spec §61] |

### Risks

| # | Risk | Trigger / consequence |
|---|---|---|
| RA1 | **Framework-runtime coupling becomes a hard constraint.** | A required API behaviour — long transactions, sustained background work, specific concurrency handling — is awkward or unsupported in the UI framework's request model, and the business layer must be contorted to fit. |
| RA2 | **Accidental privilege escalation of business logic.** | Because UI and server share a runtime, a UI component bypasses the service layer and queries the database directly. This is the exact failure C2 and C5 exist to prevent, and it is *not* caught by tenant-isolation tests that only exercise the API. |
| RA3 | **Coupled release pressure.** | A public-website copy change and a transactional correctness fix become one release unit, so urgent fixes wait on unrelated frontend work — or vice versa. |
| RA4 | **Contention between read-heavy public traffic and transactional work.** | Inventory consistency work is delayed behind marketing traffic, or vice versa. Spec §54 requires no inconsistent inventory. |
| RA5 | **A second runtime is created ad hoc, duplicating business logic.** | The worker cannot reuse the service layer cleanly, so rules get reimplemented — producing two sources of truth for stock arithmetic. This is a direct threat to R3 and R12. |
| RA6 | **TypeScript/framework skills become a single point of failure for the whole product.** | No alternative runtime exists for the team to work in. |

### Consequences

- Business rules live in `server/services/` inside a Next.js application. The
  C2 boundary is maintained by **convention and code review**, not by a structural or
  deployment boundary.
- The worker is a separate process, in the same repository or a sibling one. Whether
  it shares the service layer is an open sub-decision.
- The public API's availability, scaling, and versioning are tied to the frontend's.
- `docs/AI-DECISIONS.md`'s tool interface would be built on top of an API that is
  itself part of the UI application.
- **Carried forward:** if a future requirement needs a runtime the Next.js request
  model cannot provide, this decision must be revisited — see `## Revisit Conditions`.

---

## Option B — Dedicated Backend Service

### Architecture

**[Spec §61]** Next.js frontend plus a separate backend service that owns all
business logic, data access, the `/api/v1` surface, and background processing. The
backend is deployed and scaled independently of the frontend.

**Recommended shape [Recommendation]:** a **modular monolith** — a single backend
codebase containing the API and the worker as separately-started processes from one
deployable artifact — **not** microservices. This honours §60's *"scale should be
introduced based on actual bottlenecks rather than premature complexity"* while
satisfying §61's mandatory queue/worker requirement.

```
repo
├── apps/
│   ├── web/                Next.js frontend (public website + application UI)
│   └── api/                backend service
│       ├── src/
│       │   ├── modules/    business modules (products, inventory, sales, …)
│       │   │   └── <module>/service.ts   ← authoritative business rules
│       │   ├── platform/   authn · authz · tenancy · db · audit · errors
│       │   ├── http/       /api/v1 transport layer
│       │   └── jobs/       queue workers
│       └── ...             entry points: api process, worker process
└── packages/
    └── contracts/          shared types, permission strings, enums, schemas
```

Request/data flow: browser → Next.js frontend → HTTPS → backend service → business
module → PostgreSQL. Worker processes consume the same queue and call the same
business modules.

### Advantages

| # | Advantage | Basis |
|---|---|---|
| B1 | **The business-service layer is structurally isolated from the UI.** C2 is enforced by a deployment and module boundary, not only by convention. This directly serves R8 and the AI tool boundary (C3). | `AGENTS.md` §6` + [Inference] |
| B2 | **The API is an independent product surface**, as §4.9 requires. It versions, scales, and deploys independently of the frontend, and can serve non-browser clients without dragging a UI framework along. | [Spec §4.9] + [Inference] |
| B3 | **One authoritative service layer is genuinely shared.** The HTTP layer and the job workers both call the same business modules, so R3's atomic inventory logic and R12's audit writes exist once. | [Spec §54, §55, §66, §61] + [Inference] |
| B4 | **Background processing is a first-class citizen,** matching §61's queue/worker mandate, §67's asynchronous exports, and §53's worker logs and queue-depth metrics. | [Spec §53, §61, §67] + [Inference] |
| B5 | **Independent scaling.** Read-heavy public traffic, transactional writes, and export jobs scale on separate axes, addressing R13 without premature optimisation. | [Spec §59, §60` + [Inference] |
| B6 | **Failure isolation.** A third-party webhook handler (§46) or a long export (§67) cannot take down the marketing site or the login path. Serves R3's "no silent failures" and §54's reliability targets. | [Spec §46, §54, §67] + [Inference] |
| B7 | **Framework-neutral business layer.** The service layer has no UI framework dependency, so the AI tool layer (R8) and any future client depend on business capability rather than on a web framework. | `AGENTS.md` §6` + [Inference] |
| B8 | **Explicit contracts.** A `packages/contracts` boundary makes typed contracts (R1, §37) the default rather than an accident of import paths. | [Spec §4.9, §37] + [Inference] |
| B9 | **Cleaner fit for R10 integration testing.** Integration tests exercise the API and database directly, independent of UI rendering. | [Spec §57] + [Inference] |
| B10 | **C4 is easier to guarantee.** Keeping AI out of the database is materially simpler when the only path to data is a service with a tool interface. | `AGENTS.md` §6` + [Inference] |

### Disadvantages

| # | Disadvantage | Basis |
|---|---|---|
| B1 | **Two deployable units instead of one** — more pipeline, environments, and monitoring to maintain against R9's four-environment requirement. | [Spec §62, §63` + [Inference] |
| B2 | **A network hop on every UI-driven operation,** adding latency that §59 requires to stay low. | [Spec §59` + [Inference] |
| B3 | **Higher baseline complexity,** which sits in tension with §60's warning against premature complexity. | [Spec §60` + [Inference] |
| B4 | **Two dependency trees,** so version skew between frontend and backend is possible and must be managed. | [Inference] |
| B5 | **Shared types need an explicit mechanism** — a contracts package, code generation, or a versioned schema — rather than a direct import. | [Inference] |
| B6 | **Local development needs two running processes** (plus the worker and, eventually, PostgreSQL and Redis), which is more setup than Option A. | [Spec §61` + [Inference] |
| B7 | **Requires explicit effort to avoid over-splitting.** Without discipline it drifts toward microservices, which §60 warns against. Mitigated by choosing a modular monolith. | [Spec §60` + [Recommendation] |
| B8 | **Does not answer the "team requirements" half of §61's criterion either** — and arguably raises the operational skill bar. | [Spec §61] + [Inference] |

### Risks

| # | Risk | Trigger / consequence |
|---|---|---|
| RB1 | **Team operating cost exceeds capacity.** A small team may not sustain two services, two pipelines, and cross-service contract management. **This risk cannot be assessed from the source material — see `## Revisit Conditions`.** | [Spec §61] + [Inference] |
| RB2 | **Premature service decomposition.** The backend fragments into services before any bottleneck exists, contradicting §60. | [Spec §60] + [Inference] |
| RB3 | **Network-hop latency affects the primary user path.** A slow API is a slow UI, and §59 requires low API latency. Mitigable by keeping calls coarse-grained and avoiding chatty patterns. | [Spec §59` + [Inference] |
| RB4 | **Contract drift between frontend and backend.** Version skew produces runtime type errors the compiler cannot catch across the boundary. | [Inference] |
| RB5 | **Deployment sequencing errors.** Frontend and backend must be promoted compatibly through four environments (R9); a mis-ordered promotion breaks the product even though each unit is individually healthy. | [Spec §62, §64` + [Inference] |
| RB6 | **Over-engineering by association.** A separate backend invites patterns — service meshes, multiple databases, per-module services — that §60 explicitly cautions against. | [Spec §60` + [Inference] |

### Consequences

- Business rules live in backend business modules and are the **only** place domain
  rules exist. The frontend holds presentation state only.
- The frontend becomes an API consumer. R1's typed contracts become an explicit
  `packages/contracts` discipline.
- The worker shares the backend codebase and the same business modules, so R3 and R12
  hold for both synchronous and asynchronous paths.
- The AI tool layer (R8) is implemented inside the backend as an interface over the
  same business modules, with the invoking user's permissions applied — satisfying
  C2, C3, and C4 by construction rather than by discipline.
- Local development and CI run two units. R9's environment promotion becomes a
  coordinated operation and needs an ordering policy.
- Operational capability (running two services) becomes a prerequisite. This is the
  main reason the recommendation below is explicitly conditional.

---

## Option C — Next.js application with a first-party long-lived worker

**[Inference]** This option is **not** stated in `Innvntory.md.txt`. It is recorded
separately because the specification's own requirements make it materially distinct,
and omitting it would misrepresent the real choice space.

The specification mandates a queue/worker architecture (§61) but frames the backend
as a binary (§61). In practice there is a third shape: keep the backend inside the
Next.js codebase, but run it as a **long-lived Node process with its own entry
point**, rather than only as request-scoped handlers. This decouples the worker's
execution model from the request lifecycle while staying in one repository and one
language.

### Architecture

```
apps/innvntory            single Next.js application
├── app/                  UI routes
├── src/
│   ├── server/
│   │   ├── services/     business rules  ← authoritative layer
│   │   ├── db/
│   │   └── auth/
│   └── worker/
│       └── index.ts      long-lived entry point (own process)
└── package.json          scripts: dev:web, dev:worker
```

Repository structure: one application, two entry points, two processes.

### Advantages

| # | Advantage | Basis |
|---|---|---|
| C1 | **Addresses R5's execution-model problem directly.** The worker runs long-lived, so atomic multi-write jobs, durable webhook consumption, and long exports are not bound to a request lifecycle. | [Spec §54, §55, §61, §67] + [Inference] |
| C2 | **Retains A2–A4**: fastest local setup, shared types without a contracts package, no network hop on the UI path. | [Inference] |
| C3 | **One repository, one dependency tree, one language.** Lower baseline operational surface than Option B. | [Inference] |

### Disadvantages

| # | Disadvantage | Basis |
|---|---|---|
| C1 | **Inherits Option A's structural weakness.** The business-service layer still sits inside a UI framework's codebase, so C2 and C3 are enforced by convention, not structure. B1, B2, B6, B7 do not apply. | `AGENTS.md` §6` + [Inference] |
| C2 | **The API still cannot scale or deploy independently** of the frontend. | [Spec §4.9` + [Inference] |
| C3 | **Self-hosted long-lived processes need their own supervision, health checks, and deployment strategy** — which §53's health-check and worker-log requirements apply to. A serverless platform and a long-lived process usually imply different hosting, which can cost more than it saves. | [Spec §53` + [Inference] |
| C4 | **Mixed runtime model in one codebase** — request-scoped for HTTP, long-lived for jobs — is a subtle source of bugs when shared modules assume a request context (e.g. tenant resolution, request IDs, auth). | [Spec §35, §37, §38` + [Inference] |

### Risks

| # | Risk | Trigger / consequence |
|---|---|---|
| RC1 | **Same as RA2** — business logic reachable from UI code without passing the service layer. | `AGENTS.md` §6` |
| RC2 | **Same as RA5** — a worker in the same codebase may reimplement logic instead of importing the service layer. | [Spec §54` |
| RC3 | **Request-context leakage.** Tenant or auth context assumed to be request-scoped is missing in the worker, producing either failures or a fallback that silently drops tenant scoping — a direct threat to R2/C5. | [Spec §31, §35` + [Inference] |
| RC4 | **Hosting mismatch** between the serverless frontend and the long-lived worker adds infrastructure complexity that Option A's simplicity claim does not anticipate. | [Spec §53, §62` + [Inference] |

### Consequences

- One codebase, two processes, one language.
- The C2/C3 boundary remains a code-review convention rather than a structural one.
- Hosting must support both a request-scoped and a long-lived process.
- The API remains coupled to the frontend's release cycle and scaling.

---

## Comparison

Factual comparison across the dimensions specified for this decision. **No scores,
no ratings, and no numeric ranking.** Cells state what each option *is*, not how
good it is; the weighing is in `## Recommendation`.

| Dimension | Option A — Next.js API | Option B — Dedicated backend service | Option C — Next.js + long-lived worker |
|---|---|---|---|
| **1. Repository structure** | Single Next.js app; worker in same or sibling repo | `apps/web` + `apps/api` + `packages/contracts` | Single Next.js app, two entry points |
| **2. Request / data flow** | Browser → Next.js server → service → DB; in-process for UI | Browser → Next.js → HTTPS → backend → module → DB; network hop | Same as A, plus worker over queue |
| **3. Authentication** | Enforced in server runtime; shares session with UI | Enforced at backend boundary; backend is the session authority | Same as A |
| **4. Authorization / RBAC** | Server-side, but in the same runtime as UI code | Server-side at a service boundary unreachable from UI | Server-side, same runtime as UI code |
| **5. Multi-tenancy** | Enforced in shared server modules; convention-enforced across UI/server | Enforced in backend platform layer; UI cannot bypass | Enforced in shared modules; convention-enforced |
| **6. Database access** | `server/db` in the app; reachable from UI code paths | Backend-only; no DB credentials or driver in the frontend | `server/db` in the app; reachable from UI code paths |
| **7. Business-service boundaries** | One layer, inside the app; boundary by convention | One layer, structural — UI has no DB path | One layer, inside the app; boundary by convention |
| **8. API boundaries** | `/api/v1` served by the UI framework; coupled release and scaling | `/api/v1` as an independent surface; independent release, scaling, versioning | `/api/v1` served by the UI framework; coupled release and scaling |
| **9. AI-tool boundaries** | Tools would wrap in-app services; no structural isolation | Tools are an interface over backend modules; authorization applied per call | Tools would wrap in-app services; no structural isolation |
| **10. Background jobs** | Separate worker required by §61; split-out boundary not clean | First-class in the backend; same modules as HTTP | First-class long-lived process in the same codebase |
| **11. Webhooks** | Handled in the UI framework runtime or a sibling worker | Handled at the backend boundary; isolated from UI availability | Handled by the long-lived worker |
| **12. Integrations** | Outbound calls from app code; failure can affect UI availability | Outbound calls from backend; isolated from UI | Outbound calls from worker/app |
| **13. Testing** | Integration tests hit in-app handlers; shared runtime with UI | Integration tests hit the API directly, independent of UI | Integration tests hit app handlers and worker |
| **14. Deployment** | One unit (+ worker) through four environments | Two units (+ worker), coordinated promotion | One unit, two processes, mixed runtime hosting |
| **15. Local development** | Fewest processes to start | Two units + worker (+ PostgreSQL, Redis per §61) | Two processes, one install |
| **16. Observability** | App and worker logs in one project; queue depth needs separate instrumentation | Maps directly onto §53's app / security / audit / worker split and queue-depth metric | App and worker logs in one project; mixed runtime |
| **17. Security** | Smaller attack surface, one unit; UI code is in the same trust boundary as data access | Smaller frontend trust boundary; all data access confined to one service | Same as A |
| **18. Operational complexity** | Lowest baseline | Highest baseline of the three | Low-to-moderate; mixed runtime adds hosting complexity |
| **19. Future scalability** | Frontend and API scale together; §59 latency and §60 scale ambitions share a unit | Independent scaling per axis; better fit for §60's "without requiring a complete rewrite" | Same as A |
| **20. Development velocity** | Fastest to first slice; shared types with no contract step | Slower initial setup; contract management overhead per change | Fast, close to A |
| **21. Failure isolation** | Weakest — public traffic, API, and transactional work share a unit | Strongest — webhook/export failure cannot take down UI or login | Moderate — worker isolated, API not |
| **22. Cost / complexity** | Lowest build and operating cost | Highest build cost; operating cost depends on hosting choices | Low build cost; hosting may cost more than a pure serverless model |

### Summary of the decisive differences

**[Inference]** Three dimensions separate the options, and the rest follow from them:

1. **Is the authoritative business-service layer inside the UI framework's runtime,
   or outside it?** (Options A and C: inside. Option B: outside.)
2. **Can the API scale, deploy, and fail independently of the frontend?** (A, C: no.
   B: yes.)
3. **Does §61's mandatory worker get a first-class home?** (A: not cleanly. B and C:
   yes.)

---

## Recommendation

> ### This section was written as a recommendation, and was subsequently adopted.
>
> At the time of writing this was an **architectural recommendation**, not an
> approved decision, and it said so. It was labelled **[Recommendation]** throughout
> so that inference was not mistaken for specification.
>
> **It has now been accepted as the decision** — see `## Decision`. The reasoning
> below is preserved unaltered, because the basis for an accepted decision matters
> as much as the decision itself. Two consequences follow:
>
> - The recommendation is now binding architecture, not advice.
> - The **team-requirements assumption** identified in the final subsection below is
>   **accepted risk**, not a resolved question. It was decided upon without that
>   input being available. See
>   [Provenance and residual risk](#provenance-and-residual-risk).

### Recommendation

**Option B — a Next.js frontend plus a dedicated backend service, structured as a
modular monolith with a separate worker process from the same backend codebase.**

This is a recommendation to *adopt Option B's shape*, not to fragment the backend
into multiple services. §60's *"scale should be introduced based on actual
bottlenecks rather than premature complexity"* is treated as binding, and a
modular monolith is the structure that satisfies §61's worker mandate without
inviting premature decomposition.

### Why, in terms of the documented requirements

**1. §61 already mandates a second long-running process, so Option A's simplicity is
partly illusory.** R5/C1: a queue/worker architecture (§61) plus asynchronous large
exports (§67) plus automatic low-stock alerts (§24) plus notifications (§25) require a
process outside the request lifecycle. Option A therefore also ships a worker. The
real choice is not "one deployable or two" but whether the business-service layer
lives inside the UI framework — and on that question, Option A is the weaker
structure for the same cost.

**2. §4.9 makes the API a product surface, and Option B is the only option that
treats it as one.** The specification requires well-designed APIs as core
functionality, and enumerates eleven mandatory API capabilities in §37. Under Option A
those capabilities are served by, versioned with, and scaled with a user-interface
framework. Under Option B they are served by a service whose only job is that
surface.

**3. The AI architecture committed to in Phase 0.1 is structurally safer under
Option B.** `AGENTS.md` §6, `docs/AI-DECISIONS.md`, and C2–C4 require one
authoritative business-service layer, no unrestricted database access for AI, and
business data that never originates from model output. In Phase 0.1 those were
recorded as *constraints*. Under Option B they become *structural properties* — the
frontend has no database driver, the AI tool interface is an interface over the same
business modules, and authorization is applied per call as the invoking user. Under
Options A and C they remain conventions that depend on code review holding. Given
that R8 puts the AI layer on the critical path for a later phase, and §88 ranks
security and data integrity above implementation convenience, buying this
structurally is the higher-order choice.

**4. §54's reliability targets are served by failure isolation.** A retrying payment
webhook (§46, §56), a large export (§67), or a misbehaving integration must not be
able to take down the login path or produce silent failures. Option B isolates the
third-party and batch surface from the user-facing surface by deployment boundary.

**5. §60's scale ambition and its anti-premature-complexity caution are both
honoured — but only by the modular-monolith form.** §60 requires reaching
100,000+ organizations *"without requiring a complete rewrite"*. Option A couples
public-site traffic, API traffic, and transactional work to one unit. Option B as a
modular monolith permits independent scaling of those axes while keeping one
codebase, one database, and one deployable backend artifact. Splitting into separate
*services* would violate §60 and is explicitly not recommended.

### Why the counter-argument was not dismissed

Option A is genuinely stronger on the axes §61 named alongside workload: fewer moving
parts, faster first slice, one dependency tree, one pipeline, lowest baseline
operating cost, and no network hop. §60's warning against premature complexity is a
real argument in its favour, and for a very small team it may well be decisive.

That argument was not overridden. It was **scoped**: the complexity Option B adds is
not speculative, because §61 requires a worker anyway. The additional cost is
specifically *one more deployable unit and a contracts boundary* — the price of
making R2, R8, and C2–C4 structural rather than conventional.

### The condition this recommendation depends on

**§61 says to decide based on "workload and team requirements." Workload is
evaluable from the specification. Team requirements are not — the repository holds no
information about team size, composition, or operational capacity.**

This recommendation implicitly assumes the team can operate two deployable units
through four environments (§62) with contract management between them. **If that
assumption is wrong, Option C becomes the better answer**: it keeps a single codebase
and language, gives §61's worker a proper long-lived home, and avoids Option B's
operational load — while accepting Option A's weaker structural boundary, to be
compensated by discipline and tests.

**This is the single most important input the maintainer must supply, and it is the
reason this document is `Proposed` rather than `Accepted`.**

---

## Consequences

Recorded for the maintainer to accept, modify, or reject. **None of these is in
effect.**

### If accepted as recommended (Option B, modular monolith)

| # | Consequence |
|---|---|
| 1 | The backend is a separate deployable unit with two process types — API and worker — from one codebase and one artifact. |
| 2 | Business rules exist **only** in backend business modules. The frontend holds presentation state and consumes the API. |
| 3 | Shared types move into an explicit `packages/contracts` boundary, with a chosen sync mechanism (workspace package or generation). **Sub-decision required.** |
| 4 | The `/api/v1` surface (§36) is implemented in the backend, not the frontend. |
| 5 | The frontend holds **no** database credentials, driver, or migration tooling. This becomes a CI-enforced rule. |
| 6 | Tenant resolution and RBAC enforcement live in the backend platform layer and are applied identically to HTTP requests, AI tool calls, and worker jobs. |
| 7 | §61's queue/worker becomes a first-class component, with §53's worker logs and queue-depth metric attached to it. |
| 8 | §62's four environments require a coordinated promotion order for web and API, documented before Phase 1. **Sub-decision required.** |
| 9 | The AI tool layer, when built in Phase 7, is implemented inside the backend over the same business modules — satisfying C2, C3, C4 by construction. |
| 10 | `docs/API-GUIDE.md`'s single-implementation rule becomes structural rather than documentary. |
| 11 | The frontend framework decision (`docs/ARCHITECTURE.md` §15 row 2) becomes a **prerequisite**, since Option B's boundary is defined relative to it. |
| 12 | A migration path must be documented: this decision is cheap to reverse before any schema exists, and expensive afterwards. |

### If rejected in favour of Option A

- C2–C4 become enforced by lint rules, architectural tests, and code review rather
  than by structure. That is a weaker guarantee and should be recorded as accepted
  risk in `docs/KNOWN-ISSUES.md`.
- The AI tool boundary in Phase 7 will need explicit guarding, since UI and service
  code share a runtime.
- The worker/service split should be decided now rather than later, because R5 makes
  it unavoidable.

### If rejected in favour of Option C

- The worker becomes a long-lived process, and its hosting must be decided alongside
  the frontend's.
- Request-context assumptions in shared modules (tenant, auth, request ID) become a
  named correctness risk, and need explicit tests per §57.
- C2–C4 remain conventional, as for Option A.

### Regardless of outcome

- **This section was written while the record was `Proposed`.** It is preserved to
  show what was considered, since Option A and Option C were live alternatives at the
  time. Option B was adopted — see `## Decision`.
- Nothing is implemented by this record. No dependency, service, or configuration
  has been created.
- `docs/KNOWN-ISSUES.md` §1.1 is now **closed**, reflecting this decision.
- Two further decisions stay open and are **not** resolved here: the frontend
  framework (row 2, now the prerequisite for implementation work) and the database
  isolation mechanism and access layer (row 3).

---

## Revisit Conditions

This decision should be reconsidered if any of the following becomes true.

### Reconsider toward Option B if staying with Option A or C becomes insufficient

| Condition | Source of the signal |
|---|---|
| A required API behaviour cannot be implemented cleanly in the Next.js request model — long transactions, sustained background work, or specific concurrency handling | Observed during §57 integration tests or §58 critical scenarios |
| A hotfix to inventory correctness is blocked by an unrelated frontend release | §54's reliability targets |
| Public-site traffic is measurably degrading transactional API latency | §59's low-API-latency requirement, observed in §53's latency metrics |
| Business logic is found reachable from UI code outside the service layer | C2/C5, detected by architectural tests or audit |
| The worker ends up reimplementing stock or pricing logic instead of importing the service layer | R3/R12, RA5/RC2 |
| A second non-browser client (POS device, partner integration, mobile app) needs the API | §44 mobile, §46 commerce integrations |
| Multi-region or per-component scaling becomes an actual measured bottleneck | §60, at which point scale decisions are earned rather than premature |

### Reconsider toward Option A or C if Option B exceeds team capacity

| Condition | Source of the signal |
|---|---|
| The team cannot operate two deployable units through four environments | §62, §63 |
| Cross-service contract management is repeatedly the source of defects | RB4, RB5 materialising |
| The engineering budget cannot absorb a second pipeline and a second dependency tree | §4.10 maintainability |
| Time-to-first-working-slice is materially harming validation throughput | §82's definition of done, delivered iteratively |

**→ Option C is the more likely fallback than Option A**, because it preserves §61's
worker requirement without Option B's operational load. Option A remains the fallback
if worker execution-model constraints prove manageable in practice.

### Reconsider toward microservices only on measured evidence

Per §60, decomposition should follow **observed** bottlenecks. Candidate signals,
none currently present: a database or CPU bottleneck isolated to one business module;
independent scaling requirements for one module; a team or ownership boundary that
makes a single codebase genuinely blocking. **None of these has been observed,
because nothing has been built.**

### Standing revisit trigger

Revisit if the specification is revised, or if `Innvntory.md.txt` v1.1+ changes §61,
§60, or the AI sequencing in §28. This record is valid only against v1.0.

---

## Decision

**ACCEPTED — 2026-10-03.**

Innvntory adopts **Option B: a Next.js frontend plus a dedicated backend service.**

### The decision

Innvntory will be built as a repository containing a Next.js frontend and a
**separate backend service**, where the backend:

- is the **only** place business rules exist,
- is the **only** component with database access,
- serves the `/api/v1/...` surface fixed by specification §36,
- resolves tenancy and enforces RBAC for every caller, and
- runs background processing as a **separate process from the same codebase and the
  same artifact**.

The backend is a **modular monolith**. This is a firm boundary, not a starting
suggestion:

```text
ADOPTED
  Monorepo
    ├── apps/web        Next.js frontend — presentation only
    └── apps/api        backend service
                         ├── modules/       business rules (authoritative)
                         ├── platform/      authn · authz · tenancy · db · audit
                         ├── http/          /api/v1 transport
                         └── jobs/          queue workers
                           └── two entry points: api process, worker process

NOT ADOPTED
  ✗ Microservices
  ✗ Separate services per business domain
  ✗ More than one backend codebase
  ✗ More than one backend database
  ✗ An event bus between internal modules
```

The last point is deliberate. Specification §60 warns that scale should follow
*actual bottlenecks rather than premature complexity*, and the prohibition on
premature decomposition is part of the decision, not a caveat on it.

### What this makes non-negotiable

These follow from the decision and are binding on all future work:

| # | Rule | Why |
|---|---|---|
| D1 | The frontend has **no** database credentials, driver, client, or migration tooling. | Makes C2/C5 structural. Enforceable in CI. |
| D2 | Business rules exist **only** in `apps/api` business modules. | C2 — one authoritative service layer. |
| D3 | The AI tool layer is implemented **inside the backend**, over the same business modules, with the invoking user's permissions applied per call. | C3, C4; `AGENTS.md` §6, `docs/AI-DECISIONS.md`. |
| D4 | Transaction boundaries for inventory operations (§54, §55) sit in backend business modules, not in transport handlers and not in the frontend. | R3. |
| D5 | Audit writes (§33, §66) are part of the same transaction as the operation they describe. | R12. |
| D6 | Worker jobs and HTTP handlers call the **same** business modules. Stock and pricing logic must never be reimplemented for jobs. | R3/R12; prevents RA5/RC2. |
| D7 | Shared types live in an explicit contracts boundary. The sync mechanism is a **sub-decision** and is still open. | R1, §37. |
| D8 | The backend and frontend are promoted through the four environments (§62) in a documented order. That order is a **sub-decision** and is still open. | R9, §63, §64. |

### Sub-decisions this does not settle

Recorded so the boundary of this decision is not overread. Each remains open:

```text
TBD — requires architectural decision
  · Frontend framework and rendering strategy   (ARCHITECTURE.md §15 row 2)
  · Database isolation mechanism and access layer (row 3)
  · Auth provider and session strategy            (row 4)
  · RBAC storage and enforcement model            (row 5)
  · Queue technology and worker hosting           (row 6)
  · Contracts sync mechanism                      (D7 above)
  · Cross-unit environment promotion order        (D8 above)
```

Note the dependency: **row 2 is now a prerequisite**, because this decision defines
the backend boundary relative to the frontend. No implementation work should begin
until the frontend framework is decided.

### Provenance and residual risk

**Stated plainly, because honesty about this matters more than the tidiness of the
decision.**

Specification §61 requires this choice to be made *"based on workload and team
requirements."* The workload half was evaluated from the specification. **The team
requirements half was not available and was not evaluated.**

The decision was therefore taken on architectural merit, under the explicit
assumption that the team can operate two deployable units through four environments
(§62). Recorded residual risks:

| # | Residual risk | Status |
|---|---|---|
| P1 | The team cannot operate two deployable units. The operational load of Option B exceeds capacity. | **Accepted, unquantified.** Revisit trigger defined — `## Revisit Conditions`. |
| P2 | The trade-off analysis was authored by an AI agent, not independently reviewed by a human engineer. The owner accepted the recommendation, but no second engineer has checked the reasoning. | **Accepted.** Phase 1 should include an architecture review of this record. |
| P3 | The analysis was performed with no measurements, because nothing has been built. Claims about latency, throughput, and cost in `## Comparison` are **[Inference]**, not benchmarks. | **Accepted.** Revisit if measured behaviour contradicts them. |
| P4 | If P1 materialises, Option C — not Option A — is the fallback, since it preserves §61's worker requirement without Option B's operational load. | Contingency documented. |

None of these is a reason to reverse the decision now. All of them are reasons to
revisit it under the stated triggers, and P1 in particular should be revisited as
soon as team composition is known.

### Scope of this decision

Adopting this architecture authorises **no implementation work**. It does not permit
scaffolding, dependency installation, schema creation, API implementation,
authentication, or UI. Those remain separately gated, and the frontend framework
decision is a prerequisite for all of them.

### Records updated with this decision

```text
docs/decisions/0001-backend-architecture.md   Status → Accepted; decision recorded
docs/decisions/README.md                      index updated
docs/ARCHITECTURE.md                          header, §1.2, §3, §15 updated
docs/KNOWN-ISSUES.md                          §1.1 closed, §7 superseded
docs/DEPENDENCIES.md                          backend row updated
docs/PRD.md                                   §"Not yet determined" row updated
README.md                                     setup blocker removed
```

```text
Backend architecture:  DECIDED — Option B, modular monolith (ADR 0001, Accepted 2026-10-03)
```
