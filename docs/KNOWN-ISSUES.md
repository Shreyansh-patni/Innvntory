# Innvntory — Known Issues

**Status:** Phase 0.1 — open questions and unresolved decisions.

> ## These are not bugs
>
> Everything recorded here is an **unresolved decision, a gap in supplied material,
> or a deliberate deferral**. None is a defect in the product or in this
> repository. Nothing here has been "broken" and then left broken — the work simply
> has not been authorised yet.
>
> The purpose of this file is to make the open surface **explicit**, so that no one
> mistakes an undecided question for a settled one.

---

## 1. Blocking architectural decisions

### 1.1 Backend architecture — **RESOLVED**

**Status:** **Closed** — decided 2026-10-03. See
[`docs/decisions/0001-backend-architecture.md`](decisions/0001-backend-architecture.md)
(`Accepted`).

Specification §61 offered two options without choosing between them:

```text
Next.js API
or
Dedicated backend service
```

and required the choice to be made based on workload and team requirements.

**Outcome:** a **dedicated backend service**, structured as a **modular monolith**
with a separate worker process from the same backend codebase. The frontend has no
database access. Business rules exist only in the backend. Microservices were
explicitly rejected, because §60 requires scale to follow measured bottlenecks rather
than premature complexity.

**Retained as residual risk, not as an open decision:**

- The "team requirements" half of §61's criterion could not be evaluated — the
  repository holds no information about team size or operational capacity. The
  decision was taken on architectural merit, accepting that Option B's operational
  load is unquantified. If that proves unsustainable, **Option C** (single Next.js
  codebase with a first-party long-lived worker) is the documented fallback, not
  Option A.
- The trade-off analysis was authored by an AI agent and has not been independently
  reviewed by a second engineer. Phase 1 should include an architecture review of
  ADR 0001.

Both are recorded with revisit triggers in ADR 0001 under **Provenance and residual
risk**. Neither blocks further work.

**Knock-on effect:** §1.2 (frontend framework) is now the **blocking** decision for
all implementation work, because the backend boundary in ADR 0001 is defined
relative to it.

### 1.2 Frontend framework and rendering strategy

**Status:** Open — **proposal written, pending human approval.** See
[`docs/decisions/0002-frontend-framework.md`](decisions/0002-frontend-framework.md)
(`Proposed`).

Specification §61 names Next.js / React / TypeScript / Tailwind CSS as a *possible*
stack. That is not a decision. Rendering strategy (SSR / SSG / ISR / client, per
route class), the data-fetching layer, and the route structure are all undecided.

ADR 0002 evaluates Next.js + React against React + Vite, plus a split option, and
recommends **Option B (React + Vite)** on documented requirements — because the
specification never states an SEO, SSR or rendering requirement, and ADR 0001's D2
structurally prevents a client-only frontend from hosting business logic.

**It is not decided.** Three questions must be answered by a human before approval,
and ADR 0002 deliberately leaves them open:

- **U1** — must the public marketing site be indexed by search engines?
- **U4** — is the public marketing site in scope for the first production release?
- **U7** — team size, composition and React/framework experience.

U1 is decisive: it is the one question that would flip the recommendation to
Next.js. The specification is silent on it.

**Note:** `docs/UI-LIBRARIES.md` and `skills/SKILLS-REGISTRY.md` both flag that the
`nextjs-saas` skill is conditional on this decision, and must not drive it. ADR 0002
confirms it was not used as evidence.

Blocks: any UI work, and the shadcn/ui installation.

### 1.3 Database isolation mechanism

**Status:** Open.

Specification §35 requires both application-level authorization *and*
database-level safeguards, without choosing a mechanism. Shared schema with
`organization_id`, row-level security, or schema-per-tenant each have different
operational and performance consequences.

Also open: ORM/query layer, migration tooling, money representation, timezone and
fiscal-calendar handling, and fractional-quantity support (implied but not decided
— spec §10 lists "Unit" as a product attribute).

See `docs/DATABASE.md` §4.

### 1.4 Authentication provider and session strategy

**Status:** Open.

Spec §30 fixes the *launch methods* — Email + Password and Google only — but not the
implementation. Provider, session strategy and lifetime, password hashing algorithm,
MFA policy, and account recovery are undecided.

Also unresolved: whether a user may belong to multiple organizations. Spec §31 shows
a user under a single organization and does not address multi-organization
membership, which spec §43 implies via "Switch organization".

### 1.5 Test stack

**Status:** Open. Not installed.

Specification §57 requires unit, integration, and end-to-end tests, and §58 names
four critical scenarios. The `playwright` and `playwright-best-practices` skills are
recorded as selected but **not installed** (`skills/SKILLS-REGISTRY.md`).

**Consequence:** `tests` cannot be run. No automated verification of any kind
currently exists in this project.

### 1.6 Infrastructure, CI, and observability

**Status:** Open.

No hosting target, no IaC, no CI pipeline (spec §63 target only), no observability
vendor (spec §53), no backup and disaster-recovery procedure (spec §52), no
transactional email provider (spec §25). No separate local / development / staging /
production environments exist (spec §62).

---

## 2. Repository and process

### 2.1 Git repository has no initial commit and no remote

**Status:** Open. Requires a maintainer decision.

Phase 0.1 initialised Git on `main` with **no remote configured**, as instructed. No
remote was created and nothing was pushed. There is also **no commit** — the
foundation documents are untracked working-tree files.

Open questions for the maintainer:

- Should the foundation documents be committed, and with what message?
- Where should the remote live, and under which account?
- Is `develop` actually used (spec §64 lists it), or is a trunk-based variant
  preferred?

**No commit was made** because committing was not requested.

### 2.2 Exact repository conventions pending

**Status:** Open.

Deliberately undecided until the stack is chosen: directory layout, file naming,
component naming, import ordering, formatter and linter configuration, test
placement, branch protection, commit message format.

`docs/CODE-STYLE.md` §1 records this explicitly rather than guessing. A convention
fixed before the framework is known tends to be a convention that has to be undone.

### 2.3 Reference file organisation deferred

**Status:** Open. Deliberate.

`Innvntory.md.txt`, `DESIGN-cursor.md`, and `Design Refrence/` remain at the
repository root exactly as supplied. They were **not** moved into `docs/`, renamed,
or reformatted during Phase 0.1, per the preservation rule in `AGENTS.md` §5.

Open: whether to organise them into a `docs/reference/` structure later, and what
naming convention to use. `Design Refrence/` also contains a filename typo
(`Refrence`) that must **not** be silently corrected — renaming is a separate,
deliberate task.

### 2.4 Branch protection and required checks

**Status:** Open. Cannot be configured — no remote and no CI exist.

---

## 3. Product and brand

### 3.1 Final Innvntory brand identity

**Status:** Open. **Blocking for all visual work.**

The specification sets `Tagline: TBD` and `Website: TBD` in its header. It contains
**no** logo, wordmark, colour palette, type family, or brand voice.

Consequently, in `docs/DESIGN-SYSTEM.md`:

```text
TBD — requires brand decision
  · Colour values (canvas, surface, border, text, accent, semantic set)
  · Type family, scale values, weights, tracking
  · Spacing and radius scale values
  · Motion duration and easing tokens
  · Breakpoint names and values
  · Dark mode strategy
  · Icon set
  · Illustration, photography, empty-state art direction
  · Brand voice and messaging
```

The design *direction* is documented and approved; the design *tokens* cannot be
until the identity exists.

### 3.2 Pricing and plan contents

**Status:** Open. Not a bug — a deliberate deferral.

Spec §47 lists plan names (Free, Starter, Growth, Business, Enterprise) but states
that exact pricing should be determined after validating willingness to pay. Plan
contents, limits, and entitlements are undefined.

**No pricing may be displayed or invented.** Note that the Aoutive AI reference
material contains its own pricing figures and metrics — these must never appear in
Innvntory (`docs/DESIGN-REFERENCES.md` §2.3).

### 3.3 No production URL

**Status:** Open.

Spec header: `Website: TBD`. No domain, hosting target, or deployment exists. No URL
may be committed, printed, or referenced as live.

---

## 4. Gaps in the supplied reference material

Found during Phase 0.1 inspection. **Defects in the supplied files, not in this
repository. Do not fix them — request a correct export.**

### 4.1 `Articles.html` is a duplicate of `About-us.html`

**Status:** Open. Awaiting a correct export.

`About-us.html` and `Articles.html` are **byte-identical** (verified by checksum:
SHA-256 prefix `32F81DCEBBC3D0BB` for both). Both render the About page content —
"Our story", "Meet the team", "What our customers say".

**Consequence:** the article-listing reference is effectively missing, so
`docs/DESIGN-REFERENCES.md` §2.1 documents the article-card pattern from the
screenshot `Articles.jpg` and from the structural convention shared across the other
exports, rather than from a working HTML export.

### 4.2 Inconsistent page title in `Home-page.html`

**Status:** Open. Informational.

`Home-page.html` has `<title>Autonexa — Workflow Automation SaaS</title>`, while the
other five exports use `AI Workflow Automation Framer Template - Aoutive`.

A reference-export artefact. Recorded because it is a further sign the export set is
not fully trustworthy, and because the correct title must never be copied into
Innvntory.

### 4.3 Reference exports are single-breakpoint

**Status:** Open. Informational.

The Framer exports contain exactly one media query (`min-width: 810px`). They are not
a usable responsive reference for a data-dense application. See
`docs/DESIGN-SYSTEM.md` §9.

### 4.4 No application-surface design reference

**Status:** Open. Significant gap.

All supplied references are **marketing** surfaces. Nothing references the
application — dashboard, tables, forms, command menu, detail panels.

Application density direction in `docs/DESIGN-SYSTEM.md` §11 is therefore reasoned
from specification §39, §42, §59 and `DESIGN-cursor.md`, **not** from a supplied
application reference. This is a weaker evidence base and is flagged as such.

Also unreferenced: dark mode, mobile-specific screens, charts and data visualisation
(spec §41 requires charts), print/invoice document styling (spec §67 PDF export),
and empty/loading/error state visuals.

---

## 5. Deferred by design

Recorded so their absence is not mistaken for an oversight.

| Item | Why deferred |
|---|---|
| AI implementation | Prohibited at this stage (`AGENTS.md` §6, §10). Spec §28 requires it to follow a reliable transactional system. Phase 7. |
| ADRs in `docs/decisions/` | No architectural decision has been made. `docs/ARCHITECTURE.md` §15 lists what needs one. |
| Threat model | Required before implementation starts. Should be the first security artefact of Phase 1. |
| `USER-FLOWS.md` | Named in spec §87. Needs UX work to be non-speculative. |
| `TESTING.md` | Named in spec §87. Test stack undecided. |
| `DEVOPS.md` | Named in spec §87. Infrastructure undecided. |
| `ANALYTICS.md` | Named in spec §87. Event list exists in spec §75 but no tooling decision. |
| `BILLING.md` | Named in spec §87. Pricing explicitly deferred by spec §47. |
| Project-specific agent skills | Six proposed in `skills/SKILLS-REGISTRY.md` §4, none written. Writing skill definitions is its own task. |
| Skill installation | All 8 selected skills are **not installed**, by explicit instruction. |
| Demo data seeding | Spec §69 describes it as a product feature for a later phase. |
| Dark mode | Not mentioned in the specification at all. Requires a decision, not an assumption. |

---

## 6. Current honest status summary

```text
Application code ................. none
Dependencies installed ........... 0
Database / schema / migrations ... none
API .............................. none
Authentication ................... none
UI components or pages ........... none
AI system ........................ none

lint ............................. NOT RUN — command does not exist
typecheck ........................ NOT RUN — command does not exist
tests ............................ NOT RUN — command does not exist
build ............................ NOT RUN — command does not exist
visual QA ......................... NOT APPLICABLE — no UI exists

Git branch ....................... main
Git remote ....................... none
Git commits ...................... none
Reference files .................. 3 groups preserved, byte-identical
```

---

## 7. Recommended next smallest step

**Answer the three blocking questions in ADR 0002, then approve or reject it.**

This replaces the previous recommendation, which was to write ADR 0002. That is now
done — the record exists at
[`docs/decisions/0002-frontend-framework.md`](decisions/0002-frontend-framework.md)
as **`Proposed`**. Writing it was the previous step; reviewing it is this one.

No further analysis is needed before a decision can be made. What is needed is
**human input** on questions no agent can answer from the project documents:

```text
U1  Must the public marketing site be indexed by search engines?
U4  Is the public marketing site in scope for the first production release?
U7  Team size, composition and React/framework experience
```

U1 is decisive — it is the only question that would change the recommendation.
U7 is the same class of gap already recorded as ADR 0001 P1.

**The frontend framework decision remains pending human approval.** It must not be
resolved by default, and it must not be resolved by whichever framework is easiest to
scaffold, or by the presence of the `nextjs-saas` skill.

Second, and independent of that: finalise the brand identity (§3.1), which blocks all
visual work. Note that resolving the framework does **not** unblock visual work — the
design tokens are gated on brand identity, not on this decision.

Third: ADR 0001 recommends an architecture review of its own reasoning, since that
analysis was agent-authored and not independently reviewed.
