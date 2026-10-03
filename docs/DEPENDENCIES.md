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

## 4. Dependency decision record

Adopted during Phase 0.5 (application foundation). Only what the implementation
actually requires is installed.

| Dependency | Version | Package | Requirement | Why not existing capability | Decision |
|---|---|---|---|---|---|
| `next` | 15.1.6 | web | ADR 0002 | Mandated by the accepted frontend decision | Accepted |
| `react` / `react-dom` | 19.0.0 | web | ADR 0002 | Mandated | Accepted |
| `typescript` | 5.9.3 | root | spec §61, `docs/CODE-STYLE.md` §1 | Mandated | Accepted |
| `tailwindcss` + `@tailwindcss/postcss` | 4.1.14 | web | ADR 0002, `AGENTS.md` §4 | Mandated | Accepted - version corrected from 4.0.0, which is incompatible with Next 15.1.6's scanner |
| `clsx` + `tailwind-merge` | 2.1.1 / 2.6.0 | web | class composition | Small, stable, framework-agnostic | Accepted |
| `drizzle-orm` | 0.38.4 | api | ADR 0004 Q4 | Human decision; Prisma rejected on fit, not on benchmark | Accepted |
| `postgres` (postgres.js) | 3.4.5 | api | ADR 0004 | PostgreSQL driver; chosen for transaction-pooling behaviour | Accepted |

### Deliberately NOT installed

| Not installed | Why |
|---|---|
| **Prisma** | Rejected in ADR 0004 Q4: second schema representation, and it obscures generated SQL |
| **Any second ORM / query builder** | Rejected in ADR 0004 Q4 |
| **Watermelon UI, Aceternity UI, Magic UI, Motion Primitives, HeroUI** | Level 2 per `docs/UI-LIBRARIES.md`. No first-shell requirement justified one |
| **A component library beyond shadcn/ui** | `docs/UI-LIBRARIES.md` §3. The shell is built from project primitives; the shadcn/ui installation is a later deliberate step |
| **A test framework (Vitest/Jest)** | Node's built-in runner covers the current suites. Not added without need |
| **`drizzle-kit`** | Migrations are hand-authored SQL because row-level security cannot be generated by any ORM. Dropping it also removed `esbuild` |
| **`tsx`** | Node 26 runs TypeScript natively. Dropping it removed the remaining `esbuild` dependency |
| **A charting library** | Charts are not built yet; specification §41 requires a chart specification that does not exist |
| **An ORM-adjacent query builder** | Would duplicate Drizzle (ADR 0004 Q4) |

### Build-script allowlist

`pnpm-workspace.yaml` sets `onlyBuiltDependencies` for exactly two packages:

- `sharp` - places the native image-optimisation binaries Next.js uses.
- `@tailwindcss/oxide` - Tailwind's native scanner.

Everything else stays blocked by pnpm's supply-chain policy. Removing `tsx` and
`drizzle-kit` eliminated a third blocked package (`esbuild`) rather than widening
the allowlist.

---

## 5. Current dependency state

```text
Application dependencies installed ... 9 (see the decision record above)
Lockfiles present ................... pnpm-lock.yaml (committed)
node_modules present ................. yes (gitignored)
UI libraries installed .............. 0
ORM ................................. drizzle-orm (ADR 0004)
Database client ..................... postgres.js (ADR 0004)
```


## 6. Not done in this phase

Superseded in part by Phase 0.5. What remains genuinely not done:

- **No `shadcn/ui` components installed yet.** The shell is built from project
  primitives on Tailwind. shadcn/ui remains the default foundation
  (`AGENTS.md` §4) and is a deliberate next step, not an omission.
- No icon set, web font, or charting library.
- No observability or error-reporting SDK.
- No AI SDK (and none is permitted — `AGENTS.md` §6; Phase 7).
- No CI pipeline.
- No E2E/browser test tooling (Playwright). The `playwright` and
  `playwright-best-practices` skills remain selected but uninstalled
  (`skills/SKILLS-REGISTRY.md`).
- No queue technology, cache client, or object-storage client.
- No authentication library — the provider decision is still open.

**Now done in this phase:** package manager (pnpm), Next.js, React, TypeScript,
Tailwind CSS, Drizzle ORM, PostgreSQL driver, `typecheck`, `tests`, and `build`.

### Validation status

| Check | Command | Result |
|---|---|---|
| Typecheck | `pnpm typecheck` | Passes across all four packages |
| Tests | `pnpm test` | Passes; the database-dependent suite **skips** without `DATABASE_URL` |
| Build | `pnpm build` | Passes; 12 routes generated |
| Lint | `pnpm lint` | Currently aliased to `tsc --noEmit`. A dedicated ESLint configuration is not yet in place |

**No database has been provisioned or verified.** RLS behaviour is asserted
structurally by `apps/api/src/db/check-migrations.ts` and its test; the runtime
isolation tests in `apps/api/test/tenant-isolation.integration.test.ts` require a
live PostgreSQL instance and have **not** been executed.
