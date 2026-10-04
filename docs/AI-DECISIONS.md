# Innvntory — AI Architecture Decisions

**Status:** Phase 0 — direction and constraints only. **No AI system exists.**

> ## Do not implement AI functionality as part of a foundation task
>
> This is binding (`AGENTS.md` §6, §10). Nothing in this document authorises code.
> AI capability arrives at **Phase 7 — AI intelligence** (`docs/ROADMAP.md`),
> and only after the transactional system is reliable — which specification §28
> states as a precondition, not a preference.

---

## 1. Agreed direction

**Innvntory is intended to become an AI-native Business OS.**

The trajectory stated in specification §2 and §84:

```text
Inventory Software → Business Operating System → Business Intelligence → AI Layer
```

The specification's own framing (spec §84): the goal is to help a business not only
**record what happened**, but understand **what is happening and what should happen
next**.

### Why this is architectural, not a feature

The specification's module architecture (spec §8) already separates **Operations**,
**Commerce**, and **Analytics**. AI enters as a layer *above* those, not inside
them. The diagram in spec §84 places the AI layer above collected business data,
below the operating layer.

This is why AI is documented separately from features: it changes the shape of the
system rather than adding a screen.

---

## 2. Intended capabilities

Grouped from specification §28 and §84. These are **targets**, not commitments.

### 2.1 Natural-language business interaction

The specification's example questions (spec §28):

```text
"Which products are likely to run out this month?"
"What should I reorder?"
"Which products haven't sold in 90 days?"
"How much did we sell last month?"
"Which location generated the most revenue?"
"Show me products with declining sales."
```

### 2.2 Contextual intelligence

Grounding an answer in the invoking user's organization, role, permissions, and
current scope — so "my low stock" means the user's accessible warehouses, not the
whole platform.

### 2.3 Business search

Specification §29 specifies global search across products, customers, suppliers,
orders, invoices, purchases, and transactions, on `⌘ / Ctrl + K`. AI extends
search from structured filtering to natural-language retrieval over the same scope.

### 2.4 Insights and forecasting

Specification §28 names the prediction targets:

```text
Demand Forecast · Stockout Prediction · Reorder Recommendation
Sales Forecast · Inventory Optimization
```

Version roadmap V3 (spec §80) adds: business insights, anomaly detection.

### 2.5 Controlled actions

The AI may propose a business action. It may not silently perform one. See §4.

### 2.6 Workflow automation

Specification §2, §84, and roadmap V2/V3 place automation alongside AI. Automation
of *deterministic* business processes is a separate concern from AI reasoning and
must not be conflated with it.

---

## 3. Non-negotiable constraints

These follow from specification §28, §54, §55, §66, §88 and from `AGENTS.md` §6.

### 3.1 AI sits above authoritative business systems

```text
Authoritative:  transactional business services + database
AI:             a consumer of those services, and a proposer of actions
```

**AI must never become the transactional source of truth.** If a number that
matters came from a model rather than from the system of record, the product is
broken. Specification §85: the complexity belongs in the architecture — the AI layer
is part of that architecture, and it does not get to own the data.

### 3.2 Deterministic business data

Inventory quantities, stock levels, money, totals, tax, and balances come from the
transactional system. Never from model output, never inferred, never estimated in
place of a real figure.

A model may *predict*. A prediction is labelled as a prediction and is never
rendered as a current balance.

### 3.3 Tenant boundaries

AI must never observe or act across organization boundaries. Tenant isolation
(spec §31, §35, §58) applies identically to AI reads and AI writes. There is no
"platform-wide AI view".

### 3.3a Identity of an AI-initiated operation

Per [ADR 0005](decisions/0005-authentication-and-session-architecture.md) §10: an
AI tool **inherits the invoking user's authenticated `TenantContext`**. It does not
construct its own and cannot select an organization. A session claiming an
organization the user is not an active member of is rejected server-side before any
tool runs, so a model cannot widen scope by naming another tenant.

Enforced by test: an `ai_tool` context carries only the invoking actor's
organization, and a claimed-but-unverified organization fails closed.

### 3.4 RBAC parity — no elevated privilege

The model has **no** permissions of its own. Every AI-initiated read and write is
evaluated against the **invoking user's** real permissions. If a user cannot open an
invoice, the AI cannot read that invoice for them, regardless of prompt.

### 3.5 Business-service access only

AI reaches business data exclusively through the same authorized business
services and APIs the user interface uses. It does not get a private data path, a
read replica with weaker controls, or direct database access.

**Prefer controlled, typed business tools over unrestricted database access.**
Tools are narrow, typed, auditable, and reviewable. A model that can run arbitrary
SQL against the transactional database cannot be constrained, audited, or reasoned
about.

### 3.6 Auditability

Every AI-initiated read and write is attributable, using the specification §66
record:

```text
Who · What · When · Where · Before · After · Reference
```

An AI action must be distinguishable from a direct user action in the audit trail —
the acting party and the initiating user are both recorded.

### 3.7 Explicit action confirmation

Consequential operations require explicit human confirmation. Named examples:

```text
Payments · Stock adjustments · Invoices · Deletes
```

The specification's reliability principle (spec §54) — "no destructive action
without safeguards" — applies with full force to AI-proposed actions.

### 3.8 Traceability of recommendations

**"AI recommendations must always be traceable to underlying business data"**
(spec §28). A recommendation without a visible basis is out of specification. This
is also a design requirement — see `docs/DESIGN-SYSTEM.md` §12.

### 3.9 Ordering after reliability

AI is introduced **after** the core transactional system is reliable (spec §28). This
is a hard sequencing constraint, not a preference. A model reasoning over incorrect
inventory data produces confidently wrong business advice, which is worse than no
advice.

---

## 4. AI action safety model

The intended shape. Not implemented; the mechanism is `TBD`.

```text
User asks
    │
    ▼
AI resolves intent
    │
    ▼
AI selects typed business tools
    │
    ▼
Authorization evaluated against the INVOKING USER's permissions
    │
    ▼
┌────────────────────────┬──────────────────────────┐
│ READ                   │ WRITE                    │
│ proceeds if permitted  │ ALWAYS requires explicit │
│                        │ human confirmation       │
│ logged as an audit     │ logged before + after    │
│ read                   │                          │
└────────────────────────┴──────────────────────────┘
    │
    ▼
Result rendered with provenance — figures traceable to source records
```

Non-negotiable properties of this model:

- The model cannot bypass, widen, or reinterpret a permission check.
- A write the user cannot perform is refused, with a clear reason.
- A consequential write requires a confirmation step that names the operation, the
  affected records, and the magnitude of the effect.
- Every step is attributable in the audit log.
- Model output that contradicts authoritative data is a **bug**, not a fallback.

---

## 5. AI and the product principles

The specification's principles constrain AI behaviour directly (spec §4):

| Principle | Consequence for AI |
|---|---|
| §4.1 Simple by default | AI must not be the only way to do a task. Every AI action has a normal UI path. |
| §4.2 Powerful when needed | AI is progressive disclosure, not a mandatory interface. |
| §4.3 Data first | AI may not be used to fill a data gap in a record of truth. |
| §4.4 Automation first | Justifies automation; does not license unconfirmed writes. |
| §4.7 Secure by design | Tenant isolation and RBAC apply to model context and tool calls. |
| §4.8 Multi-tenant from day one | No cross-tenant context, ever. |
| §4.9 API first | The tool interface *is* the API. One implementation, two callers. |
| §4.10 Production quality | AI is observability-, test-, and security-reviewed like any other component. |

---

## 6. Open decisions

```text
TBD — architectural decision required (Phase 7)
  · Model provider, hosting, and data-residency implications
  · The typed business-tool interface and its authorisation contract
  · Retrieval architecture over business data, and its tenant enforcement
  · Session/context model and its retention
  · Evaluation strategy: correctness against business data, not just output quality
  · Cost and latency budgets, and how they bound the feature
  · Guardrails, refusal behaviour, and how a refusal is surfaced honestly
  · Which of §2's capabilities are user-facing in the first release
  · Record schema for AI activity (see docs/DATABASE.md §2.10)
  · Whether user data may be used for model improvement, and how consent works
```

None of these may be decided during a foundation task.

---

## 7. Not decided, and not to be assumed

- No AI provider has been selected. `.env.example` carries commented, empty
  placeholders only.
- No AI capability is user-visible in any planned MVP. Specification §79 places the
  AI assistant and demand forecasting in **post-MVP**; §80 places them in V3.
- No AI work appears in Phases 0–2 of `docs/ROADMAP.md`.
- No prompt, no system message, no tool definition, and no model configuration
  exists in this repository.
- Nothing in this document has been validated, benchmarked, or evaluated for cost.
