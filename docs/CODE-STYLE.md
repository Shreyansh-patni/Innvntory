# Innvntory — Code Style

**Status:** Phase 0 — conventions agreed in advance. **No code exists to style.**

These conventions apply to all Innvntory code once implementation begins. They are
deliberately short: conventions exist to reduce inconsistency, not to replace
judgement.

---

## 1. Language and typing

- **TypeScript** for all application code (spec §61).
- **Strict mode.** No implicit `any`, no unchecked index access, no silent null
  coercion. Strictness is not negotiable down for convenience.
- Type safety is a named production-readiness requirement (spec §83).
- Validate at system boundaries. An `as` cast is not validation.
- Prefer discriminated unions over optional-field soup for stateful data
  (e.g. a stock movement, or an async request).
- No `any` in committed code. If a type is genuinely unknowable at the boundary,
  narrow it at the boundary and keep the interior strict.
- Money, quantities, and tax values are never represented as bare `number` in
  business logic. Representation is `TBD — requires architectural decision`
  (`docs/DATABASE.md` §4); pick one and use it consistently.

**Framework-level code style rules** (formatter, linter config, import ordering,
naming conventions for files and components) are `TBD — requires architectural
decision`. They cannot be fixed before the frontend framework and tooling are
chosen.

---

## 2. Component boundaries

- **One clear responsibility per component.** If a component's name needs "and" in
  it, it is probably two components.
- **Readability over cleverness.** A component a new contributor can follow
  without a diagram is the standard.
- **Props describe intent, not implementation.** Prefer a small, meaningful prop
  surface over a wide configurable one.
- **Business logic does not live in components.** Components render and dispatch;
  business rules belong in services (`docs/API-GUIDE.md`).
- **Server and client concerns are separated explicitly** — the AI layer and the UI
  must call the same business services, not duplicate their logic.

### Reuse and abstraction

- Search the codebase before creating anything (`AGENTS.md` §3).
- Extract a component when there is real repetition or a genuine shared concept —
  not on first sighting of a second use.
- **No premature abstraction.** Three similar-but-different implementations are
  often better than one over-parameterised one.
- Prefer adapting an existing component over adding a near-duplicate.

### No giant components

- A component that requires scrolling to understand is too large. Split it.
- Split on responsibility — rendering, state, data access, and business rules are
  separable concerns.
- Line count is a symptom, not the rule. A long, linear, single-responsibility
  component is acceptable; a short one that hides tangled logic is not.

---

## 3. Semantic HTML and accessibility

Target **WCAG 2.1 AA** (spec §72). This is a constraint on how code is written, not
a review step.

- **Semantic HTML first.** A `<button>` is not a styled `<div>`. A `<table>` is not
  a grid of `<div>`s. Correct elements are free accessibility.
- One `<h1>` per page; heading levels must not skip.
- Landmarks (`header`, `nav`, `main`, `aside`, `footer`) present and correctly nested.
- Every input has an associated `<label>`. Placeholder text is not a label.
- Icon-only controls require an accessible name.
- **Every interactive element is reachable and operable by keyboard**, with a
  visible focus state. Never `outline: none` without a visible replacement.
- **Do not remove focus styles** for aesthetic reasons (`docs/DESIGN-SYSTEM.md` §10).
- Images require meaningful `alt` text, or `alt=""` when decorative.
- Status is never conveyed by colour alone.
- ARIA is used to supply what semantics cannot — not to override correct HTML.
  Prefer native elements over ARIA roles.
- Errors are associated with their field and are perceivable to assistive
  technology.
- `prefers-reduced-motion` is honoured (`docs/DESIGN-SYSTEM.md` §8).

---

## 4. Component states

Every component defines, where applicable (spec §41):

```text
Default · Hover · Focus · Active · Disabled · Loading · Error · Success
```

Plus, per `docs/DESIGN-SYSTEM.md` §13: **empty**, **error**, **loading**, and
**permission-denied** states. A component shipped without a real empty state is
incomplete — specification §70 requires every major screen to have a *useful* one.

---

## 5. Comments and naming

- Comment **why**, not **what**. Code states what it does.
- No commented-out code left in the repository. Delete it or commit it behind a
  feature flag.
- No commented-out blocks "for reference" — that is what Git is for.
- Names describe domain meaning: `stockMovement`, `purchaseOrder`,
  `outstandingReceivable`. Not `data`, `info`, `helper`, `util2`, `handleStuff`.
- Booleans read as assertions: `isActive`, `hasPermission`, `canEdit`.
- Functions are verbs: `createPurchaseOrder`, `recalculateStockLevel`.

---

## 6. Constants and magic values

- No magic constants where avoidable. Named constants, or a token.
- Design values come from the design system — never a raw hex, pixel, or duration
  inline (`DESIGN-cursor.md` makes the same point: use token references, never
  inline values).
- Business constants — tax rates, movement types, role names, permission strings —
  are named and centralised, not repeated inline. Several are already fixed by the
  specification and must match it exactly: stock movement types (spec §14), payment
  methods (spec §22), roles and permission strings (spec §32).
- Absolute dates and times are not constants. A hardcoded "2026-10-03" from a
  specification example is sample data, not a value.

---

## 7. Dead code and dependencies

- **No dead code.** Unused exports, unreachable branches, commented-out blocks, and
  abandoned scaffolding are removed in the same change that made them unnecessary.
- **No unused dependencies.** Every installed package is imported. If nothing
  imports it, remove it.
- **No unused files.** A file added "for later" does not belong yet.
- Prefer deleting speculative code over leaving it for someone else to clean up
  (`AGENTS.md` §3).
- Do not weaken or skip a validation to make a change look green.

---

## 8. Data fetching and errors

- Loading, empty, error, and success states are all implemented — not only success
  (spec §39, §70).
- Errors are handled at the point of use and surfaced with a clear message. Never
  swallow an error silently (spec §54: "no silent failures").
- Server errors shown to users never expose stack traces, secrets, database details,
  or internal infrastructure (spec §38).
- Every list query is paginated (spec §59). Never load thousands of records into the
  browser.
- Optimistic updates are permitted only where rollback is correct and complete. For
  stock and money, prefer confirmed server state.

---

## 9. Security in code

### Authentication code

Per [ADR 0005](decisions/0005-authentication-and-session-architecture.md):

- Authentication lives in `apps/api/src/auth/`. Vendor SDKs, if ever added, are
  confined to one adapter file and imported by nothing else.
- Never read `actorId`, `organizationId`, `role`, or `permissions` from a request
  body, query string, or client-supplied header. Use `rejectIdentityFromRequest()`
  where the temptation exists.
- Always fail closed. No anonymous tenant, no default organization, no fallback
  identity, and no development bypass outside tests.
- Test doubles belong in `test/` behind a guard that refuses to load in production.
- Permissions are derived server-side from Innvntory's own tables, never from a
  provider claim.


- Tenant context is established server-side and never trusted from the client.
- Authorization is enforced in the business service layer, not in the UI
  (`docs/SECURITY.md` §3).
- Validate all input at the boundary (`docs/SECURITY.md` §5).
- Never log secrets, tokens, or sensitive customer data.
- Parameterise every query. No string-built SQL.
- Dangerous operations — deletes, stock adjustments, payments, invoices — require
  explicit safeguards (`AGENTS.md` §6, spec §54).

---

## 10. Tests

- Test stack is `TBD — requires architectural decision`. No test framework is
  installed.
- Specification §57 requires unit, integration, and end-to-end tests, and §58 names
  four scenarios that must always work: the stock arithmetic test, concurrent sale
  of the last unit, duplicate webhook handling, and tenant isolation. Those four
  are the minimum bar, not the target.
- A test that does not run is not a passing test. Never report an unexecuted test
  as passing.
- Tests are written for the change, not retrofitted to make it look verified.

---

## 11. Change discipline

- One coherent change per commit. Small, verifiable vertical slices
  (`AGENTS.md` §3).
- Match the surrounding code's conventions. Do not reformat untouched code.
- Do not modify files outside the task's blast radius.
- Update the documentation your change invalidates, in the same change.
- Review your own diff before committing.

---

## 12. Reference to the product specification

Where code encodes a product rule, the specification section is the authority —
product fields (§10), stock movement types (§14), payment methods (§22), roles and
permissions (§32), invoice lifecycle (§21), transfer lifecycle (§16), and the
inventory arithmetic of §58.

If code and specification disagree, **the specification is correct and the code is
wrong.**
