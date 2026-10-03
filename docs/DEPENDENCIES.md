# Innvntory — Dependency Policy

**Status:** Phase 0 — policy only.

> ## Nothing is installed
>
> **No application dependency stack exists in this repository.** No package
> manager manifest, lockfile, `node_modules`, or installed package is present.
> This document records the rules that will govern installation when it is
> authorised — not a description of what is present.

---

## 1. Policy

```text
Install only when justified. Record the justification. Re-evaluate periodically.
```

A dependency is a permanent cost — maintenance, security surface, bundle size,
upgrade friction, and cognitive load. It is added to solve a **stated** problem,
never "in case it is needed later".

### The bar for adding a dependency

Every dependency must satisfy **all** of the following:

1. **A concrete project requirement** exists, traceable to a section of
   `Innvntory.md.txt` or to an explicit task instruction. "It is commonly used" is
   not a requirement.
2. **No existing capability covers it** — including the standard library, the
   framework, or a component already in the project.
3. **It is recorded** in this document, and — if it is an architectural or a
   significant trade-off — as an ADR in `docs/decisions/`.
4. **It has been evaluated** for bundle size, maintenance health, licence,
   security history, and framework compatibility.
5. **The cost is understood**: what it pulls in transitively, and what it makes
   harder later.

If any of the five cannot be answered, the dependency is not ready.

---

## 2. Rules

- **Do not install the full stack speculatively.** Frameworks, styling tools, and
  UI libraries are installed as part of an authorised implementation slice, not in
  advance.
- **Prefer existing capabilities.** The standard library and the platform are free
  and carry no maintenance cost.
- **Avoid duplicate libraries.** Two packages solving the same problem is a
  permanent inconsistency, not a choice.
- **Evaluate bundle size** for anything reaching the client. A heavy dependency
  used on one screen is a poor trade for users on the networks the specification
  targets (§4.6, §74).
- **Evaluate maintenance.** Activity, issue responsiveness, release cadence, and
  bus factor. An unmaintained dependency is a future outage.
- **Verify framework compatibility** before adoption, not after. Version
  requirements are part of the evaluation, and a peer dependency conflict is a
  design failure, not a nuisance.
- **Check the licence.** In particular for fonts, icons, and any asset library.
- **No dead dependencies.** If nothing imports it, remove it
  (`docs/CODE-STYLE.md` §7).
- **No abandoned experiments.** A dependency added for an evaluation that did not
  ship is removed, not left installed.

### Security

- Specification §50 requires dependency security; §83 lists dependency scanning in
  the production checklist.
- Automated dependency scanning is **not yet configured**, because no CI exists and
  no dependencies are installed. This is a Phase 1 obligation, not a satisfied
  control (`docs/SECURITY.md` §13).
- Never add a dependency with a known unpatched critical advisory.
- Never add an unmaintained package to reach a transitive requirement. Fix the
  version, or reconsider the dependency.

---

## 3. UI dependencies

UI dependencies have an additional, stricter policy. The full hierarchy and
prohibition list are in `docs/UI-LIBRARIES.md`. Summary:

```text
Level 1  shadcn/ui ......... default foundation
Level 2  Watermelon UI · Aceternity UI · Magic UI · Motion Primitives · HeroUI
                             specialized only, with a stated advantage
```

- **Do not install all of them.** A Level 2 library is adopted per concrete need,
  per the checklist in `docs/UI-LIBRARIES.md` §5.
- **Do not duplicate shadcn/ui functionality.**
- **Do not mix incompatible visual systems.** One Innvntory design system
  (`AGENTS.md` §4).

---

## 4. Current dependency state

```text
Application dependencies installed ........ 0
Lockfiles present .......................... none
node_modules present ....................... no
UI libraries installed ..................... 0
Fonts installed ............................. 0
```

### Candidate stack — one layer now decided

Specification §61 offers this as a *possible* stack. **The backend layer is now
decided; the rest of the stack is not.**

| Layer | Named in spec §61 | Status |
|---|---|---|
| Frontend framework | Next.js | Candidate. Not decided. Not installed. **Now blocking** — `docs/KNOWN-ISSUES.md` §1.2 |
| UI runtime | React | Candidate. Not decided. Not installed |
| Language | TypeScript | Candidate. Not decided. Not installed |
| Styling | Tailwind CSS | Candidate. Not decided. Not installed |
| Components | shadcn/ui | Default **direction** (`AGENTS.md` §4). Not installed |
| Backend | Next.js frontend + dedicated backend service (modular monolith) | **DECIDED** — [ADR 0001](decisions/0001-backend-architecture.md), Accepted 2026-10-03. Tooling undecided |
| Database | PostgreSQL | Stated direction. Not provisioned |
| Cache | Redis | Stated direction. Not provisioned; whether required is open |
| Jobs | Queue / worker | Process shape **decided** by ADR 0001 (separate worker from the backend codebase); technology open |
| Storage | Object storage | Open — provider `TBD` |

> **The backend shape is settled; the tooling is not.** ADR 0001 fixes that a
> dedicated backend service exists as a modular monolith with its own worker process.
> It deliberately does **not** name a server framework, ORM, queue technology, or
> hosting provider — those remain open, and nothing is installed.
>
> Next.js remains merely *named* in the specification as one option among a possible
> frontend stack. It is not settled, and the backend decision does not settle it —
> though it does make it the next blocking decision. Installing anything now would
> still be a decision made by accident.

### Environment tooling

`.gitignore` already anticipates Node-based tooling (`node_modules/`, `.next/`,
`coverage/`, `playwright-report/`, and similar). Those entries are **forward-looking
placeholders**, not evidence that the tools are in use. They will be reviewed and
corrected once the stack is chosen.

---

## 5. Dependency decision record

To be completed as dependencies are adopted. Rows are added, never removed —
removal is recorded too.

| Dependency | Version | Requirement (spec §) | Why not existing capability | Bundle | Maintenance | Licence | Decision |
|---|---|---|---|---|---|---|---|
| _(none yet)_ | — | — | — | — | — | — | — |

---

## 6. Not done in this phase

- No package manager initialised. No `package.json`, no lockfile.
- No framework, styling tool, or component library installed.
- No ORM, query builder, or migration tool installed.
- No test framework installed.
- No linter, formatter, or type-checker installed.
- No icon set, font, or chart library installed.
- No observability or error-reporting SDK installed.
- No AI SDK installed (and none is permitted at this stage — `AGENTS.md` §6).
- No CI pipeline created.

Because nothing is installed, `lint`, `typecheck`, `tests`, and `build` **do not
exist** and were **not run**. They must not be reported as passing.
