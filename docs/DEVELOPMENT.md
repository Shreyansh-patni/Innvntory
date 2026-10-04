# Innvntory — Development Workflow

**Status:** Phase 0 — intended workflow. **No step below has been executed**, because
no application stack exists.

---

## 1. The model

Work follows the Vibe Coding A-Z playbook supplied for this project (`AGENTS.md` §8):

```text
Context → Plan → Implement → Validate → Review → Commit
```

The goal is **small, controlled, verifiable slices**. A slice is done when it is
correct, validated, and understood — not when it is large.

---

## 2. The workflow

### Step 1 — Inspect

- Read `AGENTS.md` first. It is the instruction contract.
- Read the relevant source-of-truth material for the area being changed:
  `Innvntory.md.txt` for product behaviour, `docs/DESIGN-SYSTEM.md` for visual
  decisions, `docs/ARCHITECTURE.md` and `docs/decisions/` for technical constraints.
- Read the files you are about to change, and their surrounding context.
- Search the codebase before assuming something does not exist.
- **Never edit a file you have not read.**

### Step 2 — Plan

- State the smallest coherent change that delivers real value.
- Identify what it does **not** cover, and say so.
- Check for a blocking decision. If the work depends on an unresolved `TBD` —
  especially the backend architecture — stop and report rather than choosing.
- Identify the validation the change will require.

### Step 3 — Implement a small slice

- One coherent change. Resist adjacent improvements.
- Follow `docs/CODE-STYLE.md` and `docs/DESIGN-SYSTEM.md`.
- Reuse existing components; add no unnecessary dependency
  (`docs/DEPENDENCIES.md`).
- No dead code. No unused dependencies. No commented-out blocks.
- Update the documentation the change invalidates, in the same change.

### Step 4 — Lint

Run the project's lint command. Report the actual result.

### Step 5 — Typecheck

Run the project's type checker. Report the actual result.

### Step 6 — Test

Run tests covering the change. Add tests for new behaviour
(`docs/CODE-STYLE.md` §10).

Specification §58 names four scenarios that must always be correct — stock
arithmetic, concurrent sale of the last unit, duplicate webhook, tenant isolation.
A change touching inventory, stock, payments, or tenancy must keep these passing.

### Step 7 — Build

Run the production build. A change that builds in development but not in
production is not done.

### Steps 4–7 — Current status

```text
lint ............ command does not exist — NOT RUN
typecheck ....... command does not exist — NOT RUN
tests ........... command does not exist — NOT RUN
build ........... command does not exist — NOT RUN
```

No dependency stack is installed (`docs/DEPENDENCIES.md` §4). These commands will
be defined when the stack is selected. Until then, **nothing may be claimed to have
passed.**

### Step 8 — Visual QA (UI changes only)

### Authentication and tenant boundaries

Per [ADR 0005](decisions/0005-authentication-and-session-architecture.md):

- `pnpm lint` runs **ESLint**. It is no longer an alias for `tsc`.
- `pnpm --filter @innvntory/api test` includes the authentication security-boundary
  suite. These assert what must never happen: a request body cannot become an
  identity, and membership is always verified server-side.
- **No provider is configured.** Do not add one casually: a vendor needs an account,
  credentials and a cost basis, none of which this repository has. Record the choice
  as an ADR first.
- The database-dependent suite **skips visibly** without `DATABASE_URL`. That is a
  real gap, not a pass.


Required whenever a change affects the interface. Specification §39 and §41 apply.

Check, at minimum:

- All required component states are present and correct — default, hover, focus,
  active, disabled, loading, error, success, plus empty and permission-denied
  (`docs/DESIGN-SYSTEM.md` §13).
- **Keyboard-only operation** of the changed flow, with visible focus throughout.
- **Responsive behaviour** at each breakpoint.
- **Contrast** meets WCAG 2.1 AA (spec §72).
- **Reduced motion** is honoured.
- Empty states are genuinely useful, not "No data." (spec §70).
- The result looks like Innvntory, and contains no third-party branding, copy,
  pricing, or metrics from the reference material (`docs/DESIGN-REFERENCES.md` §2.3).

### Step 9 — Review the diff

- Read your own diff before committing. Every line.
- Confirm no unrelated file changed.
- Confirm no reference file was touched — `Innvntory.md.txt`, `DESIGN-cursor.md`,
  `Design Refrence/` (`AGENTS.md` §5).
- Confirm no secret, credential, or real environment value is present.
- Confirm no dead code and no unused dependency was introduced.
- Confirm the documentation matches what the code now does.

### Step 10 — Commit

- One coherent change per commit, with a message describing what changed and why.
- Stage only intended files.
- Branch on `develop` (or a `feature/*` branch cut from it), never on `main`
  (`AGENTS.md` Git and GitHub Workflow; spec §64).
- Never commit directly to `main` without an explicit instruction.
- Never force-push, rewrite published history, or commit secrets.

---

## 3. Git state at Phase 0.1

```text
Branch ....... main
Remote ....... none configured
Commits ...... none (repository initialised, nothing committed)
Status ....... untracked foundation documents
```

Git was initialised as part of this task. **No remote was created and nothing was
pushed.** See `docs/KNOWN-ISSUES.md` — the absence of an initial commit and a remote
is an open item for the maintainer to resolve.

---

## 4. Validation honesty rules

These are not stylistic preferences. They are the difference between a trustworthy
report and a fabricated one.

- **Report pass / fail / not-run.** All three are acceptable. A fabricated "pass" is
  not.
- **Never report a check that was not run.** Not as "pass", not as "should pass",
  not as "verified".
- **Never substitute a different check** and present it as the requested one. A
  successful `git status` is not a passing typecheck.
- **Never weaken or skip a failing validation** to make a change look green.
  Fix the cause, or report the failure.
- **"Not run" is the correct answer** whenever a command is unavailable — which, at
  Phase 0, is all of them.
- If validation cannot run, say so plainly and state what remains unverified.

---

## 5. Definition of done

Per specification §82, a feature is not complete when the UI works:

```text
Requirements defined → UX designed → Frontend implemented → Backend implemented
→ Database implemented → Authorization implemented → Validation implemented
→ Error handling implemented → Tests written → Observability added
→ Documentation updated → Security reviewed → Production tested
```

Use that as the target, and be explicit about which parts a given slice does and
does not cover. A slice that delivers three of fourteen steps is a legitimate
slice — provided it is described accurately.

---

## 6. Continuous integration

Specification §63 defines the target pipeline:

```text
Push → Lint → Type Check → Unit Tests → Integration Tests → Build
     → Security Checks → Deploy Staging → Smoke Tests → Production
```

**No CI pipeline exists.** There is no remote, no CI configuration, and no runner.

The specification also requires four separate environments — local, development,
staging, production (spec §62) — kept distinct, with production credentials never
used locally and destructive migrations never tested directly on production.

---

## 7. Working rhythm

- Prefer many small commits over few large ones.
- Prefer a slice that ships over a large slice that stalls.
- Prefer an explicit `TBD` over a plausible guess.
- Prefer reporting "I could not complete this, here is why" over improvising a
  product decision that was not requested.
- When blocked on an open decision, write the ADR request rather than choosing.
