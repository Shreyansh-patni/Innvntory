# ADR 0002 — Frontend Framework

- **Status:** **Accepted**
- **Proposed:** 2026-10-03
- **Accepted:** 2026-10-03
- **Decision authority:** Human-approved architectural decision
- **Decision:** Next.js + React
- **Specification references:** `Innvntory.md.txt` §4.5, §4.6, §4.9, §4.10, §12, §26–§29, §31–§32, §37–§45, §57, §59, §61–§67, §70–§72, §83, §84, §88
- **Related:** [ADR 0001 — Backend Architecture](0001-backend-architecture.md) (`Accepted`)
- **Supersedes:** nothing
- **Superseded by:** nothing

---

## Status

**Accepted — 2026-10-03. Decision: Next.js + React.**

The human owner reviewed this record and approved **Option A (Next.js + React)**,
having first answered the three questions this analysis could not: **U1 = YES** (the
public marketing site must be indexable), **U4 = YES** (it is part of the first
production release), and **U7 = founder/product team + AI coding agents**.

Those product-level answers make **public search-indexable marketing capability an
explicit Innvntory product requirement** — a fact that was *not* in
`Innvntory.md.txt` v1.0 and is now established by decision rather than by
specification. See `## Decision`.

**The analysis below is preserved unaltered.** Options, comparison, recommendation,
consequences and reasoning are retained as the record of *why* this decision was
reasonable, including the conditional recommendation that pointed the other way. Do
not read the retained recommendation as current advice — it was resolved by the
product answers, not overruled on the merits.

**Still nothing has been implemented.** No dependency installed, no project
scaffolded, no component, route or configuration created. This record establishes an
architecture; it does not begin building one.

---

## Context

ADR 0001 settled the backend: a **Next.js frontend plus a dedicated backend
service**, structured as a modular monolith with a separate worker process from the
same backend codebase. That decision left one item explicitly open —

> ```text
> · Frontend framework and rendering strategy   (ARCHITECTURE.md §15 row 2)
> ```

— on the critical path, because ADR 0001 defines the backend boundary *relative to*
the frontend. Until it is settled, the repository shape (`apps/web`), the deployment
topology, and the UI-library installation are all undefined.

> **Resolved 2026-10-03.** This record was written as a proposal, reviewed, and then
> **accepted as Option A (Next.js + React)** after the human owner supplied U1, U4 and
> U7. The analysis below is retained as the reasoning of record. See `## Status` and
> `## Decision`.

Specification §61 names a *possible* frontend stack and does not commit to it:

```text
Frontend — A possible stack:
  Next.js
  React
  TypeScript
  Tailwind CSS
  shadcn/ui
```

The words are "a possible stack". That is a candidate list, not a decision, and this
ADR does not treat it as one.

### Three findings that shape this analysis

**Finding 1 — the specification never mentions SEO, SSR, static generation, or
hydration.** Verified by search across all 2,720 lines of `Innvntory.md.txt`: zero
matches for `SEO`, `search engine`, `server-side`, `static generation`, `SSR`,
`hydration`, `sitemap`, `robots`, or `meta description`.

This matters because the most commonly cited reason to adopt a full-stack React
framework is server rendering for search visibility. **For Innvntory, that reason has
no documented basis.** Any argument for a server-rendering frontend must therefore be
justified from project material other than the specification, and labelled as
inference.

**Finding 2 — ADR 0001 removed most of the usual justification for a server-capable
frontend.** Historically, co-locating API routes with the UI is attractive because it
keeps data access next to the UI. ADR 0001 deliberately separated them:

> | D1 | The frontend has **no** database credentials, driver, client, or migration tooling. |
> | D2 | Business rules exist **only** in `apps/api` business modules. |
> | D4 | The `/api/v1` surface (§36) is implemented in the backend, not the frontend. |

Under ADR 0001, server-side capability in the frontend is no longer a benefit — it is
a **hazard**, because route handlers and server actions sitting in `apps/web` create
an obvious second home for business logic, which D2 forbids.

**Finding 3 — the specification's actual frontend requirements are overwhelmingly
client-interaction requirements.** §39 asks for fast navigation, responsive layouts,
keyboard shortcuts, accessible controls, clear tables, powerful filtering, inline
editing, and loading/empty/error states. §43 requires a global `⌘ / Ctrl + K`
command menu. §44 sets mobile priorities. §59 requires virtualised large tables.

None of these require a rendering model. All of them are satisfied by the client
runtime, which both candidates share.

### Decision rules observed

This analysis deliberately did **not** treat any of the following as inputs:

- **Skill availability.** The `nextjs-saas` skill is in the registry. Per
  `skills/SKILLS-REGISTRY.md` and `docs/KNOWN-ISSUES.md` §1.2, it is conditional and
  must not drive this decision. A skill chosen before a decision is made must not
  become the reason for it. It was not used as evidence below.
- **Agent preference.** No prior leaning was applied.
- **Popularity.** Not a criterion.
- **Ease of scaffolding.** Not a criterion. §60 explicitly cautions against
  optimising for implementation convenience, and §88 ranks it last.
- **Backend technology.** ADR 0001 deliberately did **not** fix a backend language or
  server framework — verified: no Node, Express, Fastify, Hono, or NestJS selection
  exists in that record. There is no backend technology to match.
- **Other projects.** Not considered.

---

## Decision Drivers

Ordered by how strongly the source material constrains them.

| # | Driver | Source of the constraint |
|---|---|---|
| 1 | Compliance with ADR 0001 — no business logic or data access in the frontend | ADR 0001 D1, D2, D4 |
| 2 | Dense, interactive, keyboard-driven application UI | spec §39, §43, §59 |
| 3 | Accessibility conformance — WCAG 2.1 AA | spec §72 |
| 4 | Compatibility with shadcn/ui + Tailwind as the design-system foundation | `AGENTS.md` §4, `docs/UI-LIBRARIES.md`, spec §61 |
| 5 | Four-environment delivery with commit traceability | spec §62, §63, §64 |
| 6 | Public marketing surface alongside the application | `docs/ROUTES.md` Class A, `docs/SITEMAP.md`, spec §83 |
| 7 | AI-native interaction surfaces (command centre, activity states, confirmations) | spec §28, `docs/AI-DECISIONS.md`, `docs/COMPONENTS.md` §9 |
| 8 | Testability — unit, integration, E2E | spec §57 |
| 9 | Not repeating the server/business-logic coupling ADR 0001 rejected | ADR 0001 RA2, RA5 |
| 10 | Avoiding a second frontend toolchain | `docs/DEPENDENCIES.md` |

---

## Requirements

Every item is labelled. **[Source]** = directly supported by project documentation.
**[Inference]** = derived by this analysis. **[Unknown]** = not established by any
current project document.

### 9.1 Functional and interaction — [Source]

| # | Requirement | Source |
|---|---|---|
| S1 | Fast navigation | §39 |
| S2 | Responsive layouts | §39, §4.6 |
| S3 | Keyboard shortcuts; accessible controls | §39 |
| S4 | Clear tables; powerful filtering; inline editing | §39 |
| S5 | Loading, empty and error states on every major surface | §39, §41, §70 |
| S6 | Global command menu on `⌘ / Ctrl + K` | §29, §43 |
| S7 | Command actions incl. switch warehouse and switch organization | §43 |
| S8 | Global search across products, customers, suppliers, orders, invoices, purchases, transactions | §29 |
| S9 | Defined navigation structure — Dashboard, Business, Inventory, Sales, Purchases, Reports, Settings | §42 |
| S10 | Mobile priority surfaces — dashboard, products, stock, sales, invoices, customers, notifications | §44 |
| S11 | Useful empty states with a next action; "No data." is explicitly unacceptable | §70 |
| S12 | Prefer inline actions, keyboard shortcuts, search and bulk actions; avoid popups and excessive confirmation dialogs | §71 |
| S13 | Structured API errors rendered as code + message + requestId; never expose internals | §38 |
| S14 | Tables handle pagination, filtering, sorting, search from the API | §37, §59 |
| S15 | Reports and charts — inventory, sales, purchase, financial | §26, §27, §41 |
| S16 | Import and export surfaces (CSV, XLSX, PDF) | §67 |
| S17 | Role-aware UI reflecting server-enforced permissions | §32 |
| S18 | Tenant-scoped UI; isolation enforced server-side, never by the frontend | §31, §35, §58 |
| S19 | AI interaction surfaces — natural-language input, activity visualisation, provenance, action confirmation | §28, `docs/AI-DECISIONS.md`, `docs/COMPONENTS.md` §9 |
| S20 | Cloud access from anywhere | §4.5 |
| S21 | Design system governs all visual decisions; every component needs its full state set | §41, `AGENTS.md` §4 |

### 9.2 Quality and delivery — [Source]

| # | Requirement | Source |
|---|---|---|
| S22 | WCAG 2.1 AA — keyboard navigation, focus states, screen readers, contrast, labels, error messaging, reduced motion | §72 |
| S23 | Virtualised large tables; never load thousands of records into the browser | §59 |
| S24 | Low API latency | §59 |
| S25 | Unit, integration and E2E tests | §57 |
| S26 | Four separate environments — local, development, staging, production | §62 |
| S27 | CI/CD pipeline with commit-traceable deployments | §63, §64 |
| S28 | TypeScript for all application code; strict typing | `docs/CODE-STYLE.md` §1 (from spec §61) |
| S29 | shadcn/ui as default UI foundation; Tailwind; one coherent design system | `AGENTS.md` §4, `docs/UI-LIBRARIES.md` |

### 9.3 Architectural constraints from ADR 0001 — [Source]

| # | Constraint | ADR 0001 |
|---|---|---|
| S30 | Frontend is not the authoritative business-data layer | D1 |
| S31 | Frontend must communicate with the dedicated backend service | §3.1 |
| S32 | Frontend must not access the production database | D1 |
| S33 | Business rules belong to the backend business-service layer | D2 |
| S34 | AI tools use controlled backend business services | D3 |
| S35 | Authentication and authorization remain enforced server-side | D1, D2 |
| S36 | Tenant isolation must not depend on frontend behaviour | C5 |
| S37 | The worker remains part of the backend, not the frontend | ADR 0001 §3.1 |
| S38 | Microservices must not be introduced merely because a frontend framework permits it | ADR 0001 `NOT ADOPTED` |

### 9.4 Inferences — [Inference]

| # | Inference | Basis |
|---|---|---|
| I1 | A **public marketing website** is planned. | `docs/ROUTES.md` and `docs/SITEMAP.md` define a Class A public site; `docs/DESIGN-REFERENCES.md` documents supplied marketing references; spec §83 lists privacy policy and terms as outstanding business pages. **Not stated as a requirement by the specification.** |
| I2 | The application surface is **predominantly client-side interactive**, so the rendering model matters less for Class C than for Class A. | S1–S14 are client concerns; data arrives from an authenticated API under ADR 0001 |
| I3 | A server-rendering or pre-rendered frontend materially benefits Class A — indexability and first paint — while benefiting Class C little. | General framework behaviour; ADR 0001 moved data access server-side |
| I4 | A pure client-side build **cannot** host business logic, so it satisfies ADR 0001 structurally rather than by convention. | Absence of a server runtime |
| I5 | A server-capable frontend **can** host business logic in route handlers or server actions, creating a direct D2 risk that must be explicitly prohibited and enforced. | ADR 0001 RA2, RA5 |
| I6 | Both candidates support shadcn/ui and Tailwind; this is **not** a differentiator. | General ecosystem knowledge — shadcn/ui documents both Next.js and Vite. Not from the specification. |
| I7 | Accessibility (S22) is a component and practice concern, not a framework differentiator. Both candidates can meet WCAG 2.1 AA. | `docs/CODE-STYLE.md` §3, `docs/DESIGN-SYSTEM.md` §10 |
| I8 | Command menu, inline editing, virtualised tables and optimistic UI are client-runtime concerns shared by both. | S4, S6, S23 |
| I9 | The AI surfaces in `docs/COMPONENTS.md` §9 are presentational and client-side; the AI orchestration and tools are backend concerns under ADR 0001 D3. | `docs/AI-DECISIONS.md` §4 |
| I10 | Splitting marketing and application into two frontend builds would duplicate tooling, which `docs/DEPENDENCIES.md` discourages. | `docs/DEPENDENCIES.md` §2 |
| I11 | Given S24 and I2, a rendering model optimised for SEO would add runtime cost to the application surface without a documented application benefit. | S24, I2, Finding 1 |

### 9.5 Unknowns — [Unknown]

These are **not** invented or assumed anywhere below.

| # | Unknown | Why it matters |
|---|---|---|
| **U1** | ~~**Whether the public marketing site must be indexed by search engines.** The specification is silent.~~ **RESOLVED — YES.** Indexability is now a product requirement. | **Was decisive.** Decided the framework. See `## Decision`. |
| **U2** | Rendering strategy per route class — SSR, static, or client. | **Now required**, because a server-capable framework is chosen. |
| **U3** | The real-time mechanism for §12 "real-time stock" — polling, SSE, or WebSocket. The spec states the capability but not the transport. | Affects whether a persistent server connection is needed, which Vite-only does not provide itself. |
| **U4** | ~~Whether the public marketing site is in scope for the first production release.~~ **RESOLVED — YES.** | Confirms U1 is a first-release obligation, not deferred. |
| **U5** | Specific framework versions. | Must be resolved at install time against current releases. Not pinned here. |
| **U6** | Whether offline/PWA capability is wanted, despite §45's explicit warning. | §45 says it "should not be implemented casually" and that inventory correctness outranks offline convenience. |
| **U7** | ~~Team JavaScript/React experience, size and staffing.~~ **RESOLVED for the initial model — founder/product team + AI coding agents.** | Bears on capacity for Option A's learning load. See Risks R2. |
| **U8** | Barcode-scanning implementation approach for web (§44). | Explicitly a future capability. |
| **U9** | Design token values — blocked on the brand identity decision. | Blocks all visual work regardless of framework. |
| **U10** | Hosting and deployment platform. | Affects the viability and cost of any server-rendering option. **Now required**, since the chosen framework has a server runtime. |

---

## Options Considered

### Option A — Next.js + React

A full-stack React framework providing server rendering, routing, server actions and
route handlers, plus React.

**Shape under ADR 0001:** `apps/web` contains the public site (Class A), the
auth/onboarding funnel (Class B), and the application (Class C). It communicates with
`apps/api` over HTTPS for all business data.

**Fit with the drivers:**

- Satisfies S1–S29 — all client-interaction, accessibility, testing and delivery
  requirements — and S30–S38, **provided the server-side features below are
  prohibited.**
- S6/S7 command menu, S4 inline editing, S23 virtualised tables: native to the
  client runtime (I8).
- S29 shadcn/ui + Tailwind: supported; this is the most widely documented shadcn/ui
  host, though not exclusive (I6).
- I3: server rendering materially benefits Class A. This is Option A's principal
  argument, and its strength depends entirely on **U1** and **U4** — both unknown.

**The central tension.** Option A supplies server capabilities that ADR 0001 does not
want in the frontend. Specifically:

- Route handlers in `apps/web` would duplicate `/api/v1`, which D4 assigns to the
  backend.
- Server actions performing business mutations would place business logic outside
  `apps/api`, violating D2.
- Any database access from `apps/web` would violate D1.

Left unconstrained, this is exactly the coupling ADR 0001's risk RA2 identified. Under
Option A the constraints must be enforced by convention, lint rules, architectural
tests, and CI — a real and permanent discipline cost.

**Complexity:** a server runtime, a build pipeline for client and server output, a
rendering-mode decision per route class (U2), and framework-level concepts (server
components, caching semantics, hydration boundaries) that add conceptual surface for
a team that must also learn the backend.

### Option B — React + Vite

A client-side single-page application built with React on the Vite build tool, with
no application server runtime.

**Shape under ADR 0001:** `apps/web` is a pure client. It holds no server logic, so it
**cannot** hold business rules or data access — ADR 0001 compliance is structural
(I4), not conventional.

**Fit with the drivers:**

- Satisfies S1–S29 on the client runtime, identically to Option A for the
  application surface (I2).
- S29 shadcn/ui + Tailwind: supported (I6).
- **Strongest ADR 0001 alignment** of the three options: D1, D2 and D4 are satisfied
  by construction, eliminating the RA2 risk class entirely.
- Lower conceptual and runtime complexity; Vite is a build tool, not a framework with
  its own server semantics.

**Costs, stated plainly:**

- **Class A cannot be server-rendered or pre-rendered from this application.** If U1
  resolves to "yes, the marketing site must be indexed", Option B **cannot satisfy it
  alone** and a separate public-site build becomes necessary later.
- No server-side rendering for the application surface. Per I2 and I11 this costs
  little for Class C, and the cost is real but small.
- U3, if real-time requires a persistent server connection, is unaddressed by a
  client-only build; it would be served by `apps/api` or a worker regardless.

### Option C — Split: server-capable public site + client-only application

A separate server-rendering frontend for Class A, plus a client-only React
application for Classes B and C. Considers whether the two density modes described in
`docs/DESIGN-SYSTEM.md` §11 warrant separate builds.

**Fit with the drivers:**

- Satisfies S1–S29, and gives Class A the rendering benefit (I3) independently of
  whether the application needs it.
- Preserves ADR 0001 alignment for the application surface, since Classes B and C
  remain client-only (I4).

**Costs, stated plainly:**

- **Two frontend toolchains**, two build pipelines, two component instantiation
  paths, and two places to keep design tokens consistent. `docs/DESIGN-SYSTEM.md` §11
  requires the marketing and application modes to **share tokens**; two build
  systems make that materially harder to guarantee, and `docs/DESIGN-SYSTEM.md` §13
  requires a full state set per component, which must then be maintained twice.
- Contradicts I10 and the `docs/DEPENDENCIES.md` §2 preference against duplicate
  tooling.
- Highest operational and cognitive cost of the three.
- Premature unless U1 **and** U4 both resolve in a specific way — see Revisit
  Conditions.

**Why it is included.** `docs/ROUTES.md` and `docs/SITEMAP.md` genuinely define two
distinct surfaces with different density, and `docs/DESIGN-SYSTEM.md` §11 treats them
as separate design modes. That is a real structural fact about the project, not an
invented one. It is included so the option is visibly considered and rejected on
stated grounds, not overlooked.

---

## Comparison

Neutral architectural comparison. No scores, no rankings, no tiers, no winner
labels.

| # | Dimension | Option A — Next.js + React | Option B — React + Vite | Option C — Split |
|---|---|---|---|---|
| 1 | Fit with documented requirements | Meets S1–S29, S30–S38 only if server features are prohibited | Meets S1–S29; meets S30–S38 structurally | Meets S1–S29; application surface meets S30–S38 structurally |
| 2 | Public / marketing site | Server rendering available; strength depends on U1, U4 | Not achievable from this application | Server rendering available, dedicated |
| 3 | Application UI | Full client capability | Full client capability | Full client capability |
| 4 | SEO | Capability present; no documented requirement to satisfy (Finding 1) | Capability absent; no documented requirement to satisfy | Capability present for Class A |
| 5 | Server / client rendering model | Server-capable; per-route choice, U2 open | Client-only; no rendering decision required | Two separate rendering decisions |
| 6 | Interaction-heavy UI | Native client runtime | Native client runtime | Native client runtime |
| 7 | AI-native UI surfaces | Client-side surfaces; orchestration stays in `apps/api` per D3 | Identical | Identical |
| 8 | Dedicated backend integration | HTTPS to `apps/api`; risk of bypassing it via local handlers | HTTPS to `apps/api`; no bypass path exists | HTTPS to `apps/api` from the app |
| 9 | Authentication / session UX | Session UX in client; enforcement server-side; risk of local session logic | Session UX in client; enforcement server-side; no local server logic | Identical to Option B |
| 10 | Performance | Client performance equivalent; adds server rendering cost not justified by S24 (I11) | Client performance equivalent; no server rendering overhead | Two runtimes to tune |
| 11 | Accessibility | Achievable — not a framework differentiator (I7) | Achievable — not a framework differentiator (I7) | Achievable in both builds |
| 12 | Testing | Component and E2E testing; server-boundary tests add surface | Component and E2E testing; fewer boundaries to test | Two suites |
| 13 | Deployment | One frontend unit; needs a Node-capable host (U10) | Static asset hosting; simplest deployment | Two frontend deployments |
| 14 | UI-library compatibility | shadcn/ui supported (I6) | shadcn/ui supported (I6) | shadcn/ui in both builds |
| 15 | Tailwind / shadcn compatibility | Compatible | Compatible | Compatible in both |
| 16 | Repository architecture | `apps/web` + `apps/api`; `apps/web` must be constrained | `apps/web` + `apps/api`; no constraint needed | Three frontend/application units |
| 17 | Developer experience | More framework concepts; caching and server semantics to learn | Smaller conceptual surface; fewer abstractions | Highest cognitive cost |
| 18 | Long-term maintainability | Depends on sustained discipline to keep business logic out of `apps/web` | Depends on not bolting a server onto the client app later | Two token pipelines to keep aligned |
| 19 | Complexity | Highest single-option complexity | Lowest | Highest overall |
| 20 | Relationship to ADR 0001 | Compliant **if constrained**; D2 violation possible by default | Compliant structurally | Compliant for the application surface |
| 21 | Relationship to the worker | Worker unaffected; stays in `apps/api` | Worker unaffected; stays in `apps/api` | Worker unaffected; stays in `apps/api` |

**Where the candidates genuinely differ.** Three axes, not twenty-one:

1. **Can the frontend host business logic?** A: yes, therefore must be prohibited.
   B: no. C: not for the application surface.
2. **Can Class A be server-rendered or pre-rendered?** A: yes. B: no. C: yes.
3. **What does that cost?** A: framework concepts, a server runtime, and CI
   enforcement. B: no server runtime; no SEO capability. C: two toolchains.

Axes 1 and 2 pull in **opposite directions**. That is the whole decision.

---

## Recommendation

> ### Superseded by decision — retained as historical reasoning
>
> **This section was written before a decision existed, when it was agent analysis and
> explicitly not approved advice.** It is preserved because the basis for an accepted
> decision matters as much as the decision itself.
>
> **It is no longer current advice.** The conditional recommendation below was
> **resolved by the human-approved product decisions**, exactly as this analysis
> predicted it would be:
>
> | | Conditional recommendation at the time | Resolution |
> |---|---|---|
> | U1 | If indexability **not** required → Option B | **U1 = YES** |
> | U4 | If public site **not** in first release → Option B | **U4 = YES** |
> | Outcome | "Recommend Option A if U1 is *indexability required*" | **That condition is met. Option A adopted.** |
>
> The reasoning that argued for Option B was sound **on the evidence then
> available** — the specification never states an SEO, SSR or rendering requirement
> (Finding 1). It was wrong only because it assumed the absence of such a requirement
> meant the absence of the need. U1 = YES establishes that the need exists at the
> product level even though the specification never says so.
>
> This is the correct outcome for this process: an agent flagged the deciding
> question, a human answered it, and the answer determined the result. No requirement
> was invented by the agent, and none was quietly dropped.

### Original recommendation (superseded)

**On documented requirements alone, Option B (React + Vite) is the better fit. On the
unknown that would overturn it, Option A is the better choice.**

That is not fence-sitting — it is the honest result of the evidence, and it reduces to
one question the project has never answered: **U1, must the public marketing site be
indexed by search engines?**

### Why Option B fits the documented requirements

The application — which is the overwhelming majority of the product and all of the
hard requirements — is **client-interactive**. S1–S14 and S21–S24 are client-runtime
concerns that both candidates satisfy identically (I8).

Where they differ, ADR 0001 is decisive:

- Option A **can** host business logic in `apps/web`, which D2 forbids, and which ADR
  0001's risk RA2 explicitly identified as the failure mode to avoid. Avoiding it
  requires permanent, enforced discipline.
- Option B **cannot** host business logic. D1, D2 and D4 hold by construction (I4).

Since the specification never asks for server rendering, SEO or SSR (Finding 1), and
since ADR 0001 actively removes the usual justification for a server-capable frontend
(Finding 2), **the documented evidence points to Option B.** Adopting Option A on the
strength of an SEO requirement that does not appear anywhere in the specification
would be inventing a requirement — precisely what `AGENTS.md` §2 forbids.

### Why U1 would flip this to Option A

The asymmetry is real and worth stating precisely:

- If U1 resolves to **"indexability required"** and Option B was chosen, the public
  site needs a server-rendering or pre-rendering build that does not exist. That is
  new work on the **acquisition surface**, later, touching the brand identity that is
  itself still undecided (U9).
- If U1 resolves to **"not required"** and Option A was chosen, the unused
  capability is a maintained framework surface and a discipline cost — recoverable, and
  visible.

Additionally, §76 lists acquisition metrics — signups, activated organizations, trial
starts — as business metrics Innvntory intends to track. Acquisition implies an
audience beyond existing customers. **[Agent analysis]** That is circumstantial
support for indexability, but the specification never states an SEO requirement, so it
is not treated as one.

### The recommendation, stated plainly

**Recommend Option B (React + Vite) if U4 is "no public site in the first release", or
if U1 is "indexability not required". Recommend Option A (Next.js + React) if U1 is
"indexability required".**

Do not choose Option C. It is the highest-complexity option, it duplicates the
token pipeline that `docs/DESIGN-SYSTEM.md` §11 and §13 require to stay coherent, and
it is justified only when **both** U1 and U4 resolve against Options A and B.

**Option B carries one hard prerequisite regardless:** if Class A is in scope and must
be indexable, a separate public-site build is required. That is a decision, not an
improvisation, and it should be taken deliberately rather than discovered.

### What this recommendation deliberately does not claim

- It does not claim Option B is faster, more modern, or more popular.
- It does not claim server rendering is unnecessary — only that **no documented
  Innvntory requirement currently asks for it.**
- It does not treat the presence of the `nextjs-saas` skill as support for Option A.
- It does not assume a backend language, because ADR 0001 fixed none.
- It does not treat specification §61's candidate list as a decision.

---

## Consequences

> **Option A is adopted.** The A-table below is therefore now in force, not
> hypothetical. The B-table is retained to record what was given up, which is part of
> the decision's honesty.

### If Option A is selected — **IN FORCE**

| # | Consequence |
|---|---|
| A1 | `apps/web` contains a server runtime. Hosting must support it (U10). |
| A2 | **A rendering-mode decision is required per route class** (U2), and becomes permanent complexity. |
| A3 | **ADR 0001 D2 must be actively enforced** — no route handlers serving `/api/v1`, no server actions performing business mutations, no database driver in `apps/web`. Requires lint rules, architectural tests, and CI checks. See `## Adopted Architectural Constraints`. |
| A4 | A server-capable frontend makes an ADR 0001 violation *possible*; it does not make one likely, but the guardrail is mandatory rather than incidental. |
| A5 | Class A indexability is available, and **is required** — U1 = YES. This is now a product requirement, not a contingency. |
| A6 | Framework-level concepts (server/client component boundaries, caching, revalidation) must be learned and maintained. |
| A7 | Phase 1 gains a framework-learning cost alongside the backend work. |
| A8 | I11 applied to the application surface: server-rendering cost is incurred there without a documented application requirement. **For the public marketing site it is now justified**, because U1 = YES makes indexability a requirement. |

### If Option B is selected — **NOT selected; retained for the record**

| # | Consequence |
|---|---|
| B1 | ADR 0001 D1, D2 and D4 hold **structurally**. The RA2 risk class is eliminated rather than mitigated. |
| B2 | Lowest runtime and conceptual complexity of the options. |
| B3 | **If Class A is in scope and requires indexability, a separate public-site build is required.** This is the principal cost and must be decided, not deferred. |
| B4 | No server-rendering decision is required for the application surface (U2 narrows to client rendering). |
| B5 | Static asset hosting is sufficient for `apps/web`; no Node-compatible host needed for it (U10 still governs `apps/api`). |
| B6 | U3, if real-time requires a persistent connection, is served from `apps/api` — which is where it belongs under ADR 0001 regardless. |
| B7 | If a server capability is later required in the frontend, that would reopen this decision rather than being patched in ad hoc (see Revisit Conditions). |
| B8 | Phase 1 focus is entirely on the client runtime and the backend, with no third rendering model to learn. |

---

## Risks

Risks now **in force** under the accepted decision, plus risks of the decision process.
R1, R2 and R5 were the caveats attached to the earlier proposal; their status is
stated rather than deleted.

| # | Risk | Note |
|---|---|---|
| R1 | ~~**The recommendation rests on an unresolved unknown.**~~ **RESOLVED.** U1 = YES, U4 = YES. | The deciding caveat no longer applies. |
| R2 | **U7 resolved to a small operating model — founder/product team + AI coding agents.** Option A carries the *higher* learning and maintenance load of the two candidates, and was chosen partly against that. | **This is now the most significant residual risk in this record.** A single-founder team absorbing Next.js server semantics, rendering modes, caching, and the A3 enforcement burden is a real capacity risk. ADR 0001 P1 has the same shape. |
| R3 | **This analysis is agent-authored** and has not been reviewed by a second engineer. The decision was made by the human owner on this analysis. | Consistent with ADR 0001 P2. Compensating control: the human supplied the three decisive product inputs an agent could not. |
| R4 | **All performance and complexity statements are [Inference].** Nothing is built, so nothing is measured. | Consistent with ADR 0001 P3. |
| R5 | ~~**Choosing Option B while U1 is unknown risks deferring public-site work.**~~ **RESOLVED.** U1 and U4 are both YES, so indexability is served directly by the chosen framework rather than deferred to a second build. | The risk Option A was recommended to avoid has been avoided. |
| R6 | **Option A carries a permanent D2 enforcement burden.** If unenforced, business logic migrates into `apps/web` and ADR 0001's central guarantee weakens. | **Elevated by R2** — a small team is less likely to sustain CI-enforced guardrails by discipline. Must be CI-enforced, not review-enforced. See `## Adopted Architectural Constraints`. |
| R7 | **Framework version selection (U5) is unresolved** and could surface incompatibilities with React, Tailwind, or shadcn/ui at install time. | Resolve at install; do not pre-commit to versions here. |
| R8 | **U9 blocks visual work regardless of framework.** No framework choice unblocks design tokens. | Prevents a false sense of progress. **Still true.** |
| R9 | A future offline requirement (U6) would interact with the rendering model, and §45 warns specifically against casual offline implementation. | Revisit trigger defined below. |
| R10 | **Indexability is now a product requirement with no specified target.** U1 establishes *that* the public site must be indexable, but no success metric, target, or verification method is recorded anywhere. | New. Requirements without verification criteria cannot be shown to be met. Recommend a measurable target as a follow-up. |

---

## Revisit Conditions

Concrete circumstances that would justify reopening this decision.

**Reconsider toward Option B if:**

| Condition | Source of the signal |
|---|---|
| R2 materialises — the operating model cannot sustain Option A's learning and maintenance load | Team reality |
| R6 materialises — the D2/CI guardrail cannot be sustained, and business logic migrates into `apps/web` | Observed enforcement difficulty |
| U3 requires no server rendering, and the public site is deferred | Technical planning |

**Standing triggers — reconsider if:**

- `Innvntory.md.txt` is revised in a way that contradicts the now-decided public-site
  requirement. This record is valid only against v1.0.
- ADR 0001 is superseded and the frontend is permitted direct data access — which
  would change the D1/D2 calculus entirely and weaken the case for a server-capable
  frontend.
- An offline/PWA requirement (U6) is adopted, despite §45's caution.
- Brand identity (U9) introduces a visual direction incompatible with the chosen
  component ecosystem.
- Hosting constraints (U10) make the required server rendering unviable or
  uneconomic at the required indexability.

---

## Open Questions

### Resolved by human product decision — 2026-10-03

These three blocked the decision and were **not** answerable from project documents.
They are now answered by the human owner, and U1/U4 together establish a product
requirement that `Innvntory.md.txt` v1.0 does not contain.

| # | Question | Resolution |
|---|---|---|
| **U1** | Must the public marketing site be indexed by search engines? | **RESOLVED — YES. Public marketing pages must be indexable.** |
| **U4** | Is the public marketing site part of the first production release? | **RESOLVED — YES. It is part of the first production release.** |
| **U7** | Team size, composition and framework experience | **RESOLVED for the initial operating model — founder/product team + AI coding agents.** |

**Consequence of U1 + U4:** public search-indexable marketing capability is an
**explicit Innvntory product requirement**. `docs/DESIGN-SYSTEM.md` §11's split
between marketing-site and application density now has a hard constraint behind it,
and ADR 0002's Option C is **rejected** — constraint 15 below forbids splitting into
two frontend applications without a future documented requirement and decision.

### Still open — required before implementation, not before this decision

| # | Question | Note |
|---|---|---|
| **U2** | Rendering strategy per route class — SSR, static, or client | Now required, since a server-capable framework is chosen. Constraint 3 restricts server use to presentation concerns. |
| **U5** | Framework versions | Resolve at install time; do not pre-commit here. |
| **U10** | Hosting platform | Must support the server runtime (consequence A1). |
| **U3** | Real-time transport for §12 "real-time stock" | Specification states the capability, not the transport. |
| **U6** | Whether offline capability is wanted | §45 warns against casual offline implementation. |
| **U8** | Web barcode-scanning approach | §44 — future capability. |
| **R10** | **A measurable indexability target** | New gap created by U1 = YES. See Risks. A requirement with no verification criterion cannot be shown to be met. |
| **U9** | Design token values | Blocked on the brand decision, not on this one. **Still blocks all visual work.** |

**Explicitly not questions for this ADR:**

- The database, auth, RBAC, or queue technologies — separate ADRs, per
  `docs/ARCHITECTURE.md` §15.
- The design token values — blocked on brand identity (U9), not on the framework.

---

## Decision

**ACCEPTED — 2026-10-03.**

Innvntory adopts **Option A: Next.js + React** as the frontend framework.

### Decision

```text
Frontend framework:  Next.js + React
Status:              Accepted
Date:                2026-10-03
Decision authority:  Human-approved architectural decision
```

**Human approval:** Approved as the frontend framework decision for Innvntory.

**Grounds:** the human owner answered the three questions this analysis could not —
U1 = YES, U4 = YES, U7 = founder/product team + AI coding agents — and approved
Option A on that basis. U1 = YES makes public search-indexable marketing capability
an explicit product requirement, which Option B could not have satisfied without a
second frontend build.

**Nature of the change to this record.** The conditional recommendation in
`## Recommendation` was **resolved** by those product answers, not overruled on the
merits. It had predicted Option A would be correct if indexability were required.
That condition is now met.

### Adopted Architectural Constraints

These are binding on all future work. They exist because ADR 0001 made the frontend
**non-authoritative**, and Next.js supplies server capabilities that could erode that.
Constraints 3–13 restate and enforce ADR 0001 from the frontend side.

| # | Constraint |
|---|---|
| 1 | **Next.js is the frontend/web framework.** |
| 2 | **React + TypeScript are the application foundation.** |
| 3 | **Next.js server capabilities are restricted to presentation and web concerns** — rendering, routing, asset and SEO concerns. They are not a business-logic surface. |
| 4 | **No business logic in `apps/web`.** Business rules live in `apps/api` (ADR 0001 D2). |
| 5 | **No direct database access from `apps/web`.** |
| 6 | **No database credentials, database drivers, or migration tooling in `apps/web`.** |
| 7 | **`/api/v1` business endpoints belong to the dedicated backend**, not to `apps/web` route handlers (ADR 0001 D4). |
| 8 | **Business rules remain in the backend business-service layer.** |
| 9 | **Authentication and authorization remain server-enforced.** The frontend reflects permission state; it never enforces it. |
| 10 | **Tenant isolation remains server-enforced** and must not depend on frontend behaviour (ADR 0001 C5). |
| 11 | **AI business tools use controlled backend business services**, never direct data access (ADR 0001 D3, `AGENTS.md` §6). |
| 12 | **The backend remains the authoritative business-service layer.** |
| 13 | **The worker remains part of the backend architecture**, not the frontend (ADR 0001). |
| 14 | **Marketing and application surfaces use one coherent design system**, sharing tokens per `docs/DESIGN-SYSTEM.md` §11. |
| 15 | **Do not create a separate frontend application merely to separate marketing and application density.** Option C is rejected. One Next.js application serves Class A, B and C. |
| 16 | **A second frontend application requires a future documented requirement and an architectural decision**, recorded as an ADR. |
| 17 | **Do not introduce microservices merely because Next.js permits server capabilities.** ADR 0001's `NOT ADOPTED` list stands. |

### Enforcement

Constraint 4 is the one that fails silently if unguarded. Consequence A3 applies: it
**must be enforced in CI** — lint rules, architectural tests, and an import/dependency
bar on database packages in `apps/web` — not by code review alone. Risk R6 records
that this is harder to sustain under the resolved operating model (R2).

### Sub-decisions this does not settle

```text
TBD — requires architectural decision
  · U2  rendering strategy per route class (now required, not optional)
  · U5  framework versions, at install time
  · U10 hosting platform, must support the server runtime
  · Repository and workspace layout, and the ADR 0001 D7 contracts sync mechanism
```

The frontend framework decision being settled **does not unblock implementation**.
The design tokens remain blocked on the brand identity decision (U9).

### Records updated with this decision

```text
docs/decisions/0002-frontend-framework.md   Status → Accepted; constraints recorded
docs/decisions/README.md                    index → Accepted
docs/ARCHITECTURE.md                        §15 row 2 → DECIDED
docs/KNOWN-ISSUES.md                        §1.2 closed; §7 next step updated
docs/DEPENDENCIES.md                        frontend row updated
README.md                                   open item removed
```

### Scope of this decision

Approving this architecture authorises **no implementation work**. It does not permit
scaffolding, dependency installation, configuration, components, or routes. Those
remain separately gated.

---

## Provenance

Project documents that materially informed this ADR.

**Authoritative specification** — `Innvntory.md.txt` v1.0: §4.5, §4.6, §4.9, §4.10,
§12, §26–§29, §31–§32, §37–§45, §57, §59, §61–§67, §70–§72, §76, §83, §84, §88.

**Governance** — `AGENTS.md` §2 (source hierarchy; never invent requirements), §4 (UI
rules), §6 (AI-native rules).

**Project documentation** — `README.md`; `docs/PRD.md`; `docs/ARCHITECTURE.md`;
`docs/DESIGN-SYSTEM.md` (§10 accessibility, §11 marketing vs application density, §13
state sets); `docs/DESIGN-REFERENCES.md`; `docs/DEPENDENCIES.md`; `docs/DEVELOPMENT.md`;
`docs/KNOWN-ISSUES.md` (§1.2, §3.1); `docs/ROADMAP.md`; `docs/ROUTES.md` (Class A/B/C);
`docs/SITEMAP.md`; `docs/COMPONENTS.md` (§4 forms, §7 tables, §8 command interface, §9
AI interface, §11 business components, §13 marketing components); `docs/API-GUIDE.md`
(§2 single-implementation rule); `docs/SECURITY.md`; `docs/AI-DECISIONS.md` (§4 action
safety model); `docs/CODE-STYLE.md` §1, §3.

**Decision records** — `docs/decisions/0001-backend-architecture.md` (`Accepted`);
constraints D1–D8, C2–C5, and residual risk P1–P4.

**Human product decisions — 2026-10-03** — supplied by the repository owner and
decisive for this record: **U1** public marketing pages must be indexable (**YES**);
**U4** the public marketing site is part of the first production release (**YES**);
**U7** initial operating model is **founder/product team + AI coding agents**. These
established a product requirement absent from `Innvntory.md.txt` v1.0 and resolved the
framework to Option A.

**Skills registry** — `skills/SKILLS-REGISTRY.md`, consulted **only** to confirm that
`nextjs-saas` is conditional and must not drive this decision. Its content was not used
as evidence for any option.

**Reference material inspected, not used as authority** — `DESIGN-cursor.md` (marketing
design direction); `Design Refrence/` (supplied public-site visual and code
references, which informed I1 only).

**Explicitly not used as inputs** — framework popularity; scaffolding ease; agent
preference; the existence of the `nextjs-saas` skill; any other project in the
Downloads directory; any presumed backend technology, ADR 0001 having fixed none.