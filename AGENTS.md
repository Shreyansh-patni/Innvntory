# AGENTS.md

**Primary instruction contract for coding agents working on Innvntory.**

This file is authoritative for how automated agents (and humans) must work in this
repository. Read it fully before making any change.

If any instruction here conflicts with an explicit instruction in the current task,
the current task wins — but say so explicitly in your report rather than silently
deviating.

---

## 1. Project

**Innvntory** — an AI-native inventory and business operations platform by
**Sahaya Technologies**.

Innvntory is a cloud-first SaaS for businesses that manage physical inventory:
products, stock, warehouses, purchasing, sales, customers, suppliers, orders,
payments, billing, reports and business operations.

The long-term direction stated in the product specification is:

```text
Inventory Management → Business Operations → Business Intelligence → AI-powered Business OS
```

Core product principle (from the specification):

> Make complex business operations feel simple.

The specification also defines a conflict-resolution order that agents must respect.
It is reproduced in §3 below because it overrides ordinary engineering convenience.

---

## 2. Source hierarchy

When sources conflict, resolve in this order. Higher entries win.

1. **Explicit current task requirements** — what the user asked for right now.
2. **Innvntory product specification** — `Innvntory.md.txt` (88 sections, v1.0).
3. **Approved Innvntory design system** — `docs/DESIGN-SYSTEM.md`.
4. **Approved design/code references** — `DESIGN-cursor.md`, `Design Refrence/`.
5. **Architecture decisions** — `docs/decisions/` (ADRs).
6. **Existing implementation** — code already in the repository.
7. **General conventions** — ecosystem norms, lint defaults, personal preference.

Additional rules:

- **Never silently invent product requirements.** If a requirement is not in the
  specification and not in the current task, it is `TBD` — mark it, do not guess.
- Where a decision is genuinely open, mark it explicitly as
  `TBD — requires architectural decision` or `TBD — architectural decision required`.
  Do not resolve ambiguity by picking the option that seems most likely.
- Specification-level conflict order (spec §88), which refines the list above:

  ```text
  User Safety → Security → Data Integrity → Product Requirements → UX → Implementation Convenience
  ```

  Implementation convenience never overrides data integrity or security.

---

## 3. Engineering rules

- **Inspect before modifying.** Read the relevant files and the surrounding context
  first. Never edit a file you have not read.
- **Prefer small vertical slices.** One coherent, verifiable change at a time.
- **Reuse existing components.** Search the codebase before creating anything new.
- **Avoid unnecessary dependencies.** A new dependency requires a concrete project
  requirement and a recorded decision. See `docs/DEPENDENCIES.md`.
- **Keep changes scoped.** Do not touch files outside the task's blast radius.
- **Preserve existing references.** The files listed in §5 must not be modified,
  renamed, moved, converted, or deleted.
- **Validate changes.** Run the applicable validation (§7) and report actual results.
- **Never claim completion without verification.**
- **Do not fabricate test results.** Never report a passing check that was not run.
- **Do not modify unrelated files.**

Additional standing rules:

- No dead code. No unused dependencies. No commented-out blocks left behind.
- Do not weaken or skip a failing validation to make a change look green.
- If a task cannot be completed as specified, stop and report rather than
  improvising a different product decision.
- Prefer deleting your own speculative code over leaving it for later cleanup.

---

## 4. UI rules

- **shadcn/ui is the default UI foundation.** See `docs/UI-LIBRARIES.md`.
- **Other UI libraries are specialized resources only.** Watermelon UI, Aceternity UI,
  Magic UI, Motion Primitives and HeroUI may be used only where there is a concrete,
  stated advantage over the shadcn/ui default.
- **Never create a UI-library collage.** One coherent Innvntory design system.
- Mixed visual systems must be adapted behind project wrappers, not imported raw and
  restyled per page.
- Follow `docs/DESIGN-SYSTEM.md` for all visual decisions.
- Follow `docs/UI-LIBRARIES.md` for all dependency decisions.
- Reference material (`Design Refrence/`, Aoutive AI exports) is **reference only**.
  Never copy third-party branding, copy, claims, pricing, metrics or customer names
  into Innvntory. Innvntory must develop its own identity.

---

## 5. Files that must not be modified

These are supplied source-of-truth and reference materials. Do not delete, rename,
rewrite, convert, overwrite or move them without an explicit instruction.

```text
Innvntory.md.txt
DESIGN-cursor.md
Design Refrence/
```

Reproduction of these files is also prohibited. If they need to change, that is a
separate, deliberate task.

---

## 6. AI-native rules

AI is an architectural layer in Innvntory, not a chatbot bolted onto the product.

Any future AI functionality must respect all of the following:

- **Tenant boundaries** — AI must never observe or act across organization boundaries.
- **RBAC** — AI actions are evaluated against the invoking user's real permissions.
  The model has no elevated privilege.
- **Business-service permissions** — AI reaches business data only through the same
  authorized business services/APIs the UI uses.
- **Auditability** — every AI-initiated read and write is attributable: who, what,
  when, before, after, reference.
- **Deterministic business data** — inventory quantities, money, stock levels and
  totals come from the transactional system, never from model output.
- **Explicit action confirmation** — consequential operations (payments, stock
  adjustments, invoices, deletes) require explicit human confirmation.

The AI layer sits **above** authoritative business systems. AI must not become the
transactional source of truth.

Prefer controlled, typed business tools/APIs over unrestricted database access.

See `docs/AI-DECISIONS.md`.

**Do not implement AI functionality as part of a foundation task.**

---

## 7. Validation

Before considering implementation work complete, run and report the actual outcome of:

- `lint`
- `typecheck`
- `tests` — where applicable to the change
- `build`
- `visual QA` — where UI changes are involved

Rules:

- These commands **do not exist yet**. The application stack is not installed at this
  point. Until it is, there is nothing to run, and nothing may be claimed to have run.
- When a validation command is unavailable, say so explicitly. Do not substitute a
  different check and present it as the requested one.
- Report results as pass / fail / not-run. "Not run" is an acceptable and honest
  outcome; a fabricated "pass" is not.

---

## 8. Development model

Work follows the Vibe Coding A-Z playbook supplied for this project:

```text
Context → Plan → Implement → Validate → Review → Commit
```

Work in small, controlled, verifiable slices. Do not make broad speculative changes.
See `docs/DEVELOPMENT.md`.

The commit and push steps of that loop are governed by
[Git and GitHub Workflow](#git-and-github-workflow) below.

---

## Git and GitHub Workflow

Git commit and GitHub synchronisation are part of the normal development loop, not a
separate manual activity. For every **meaningful, self-contained task**, an agent
follows this sequence to completion:

```text
Plan → Implement → Validate → Review diff → Commit → Push → Review/merge → Stop
```

### Branch strategy

Innvntory uses a `main` / `develop` model, consistent with specification §64.

```text
main       protected release branch. Release-ready history only.
           No routine development commits. Changes arrive by reviewed merge.

develop    normal integration branch. Ongoing development merges here.

feature/*  focused branches for substantial or isolated work.
           Created from develop. Merged back into develop after validation
           and review.
```

- **`main` is not a routine development branch.** Do not commit development work to
  it. It changes only by reviewed merge from `develop`, or by an explicitly requested
  release action.
- **Routine development work targets `develop`**, directly or via a `feature/*`
  branch.
- Specification §64 also lists `fix/*` and `hotfix/*`. These remain available for
  their purposes, and are carved from the appropriate base branch.
- Production deployments remain traceable to a commit (spec §64).

> **Note on the current repository state.** The repository was initialised on `main`
> during Phase 0.3, before this strategy was adopted, and `develop` does not yet
> exist. Until it is created by explicit instruction, work continues on `main`. See
> `docs/KNOWN-ISSUES.md` §2.1.

### Sequence

1. **Implement only the requested scope.** No adjacent improvements, no unrequested
   files, and no silent scope expansion.
2. **Run the appropriate validation** per §7.
3. **Do not commit if validation fails.** Fix the cause, or report the failure and
   stop. Never weaken or skip a check to make a change look green.
4. **Verify the working tree** — `git status --short` — before committing.
5. **Review `git diff`.** Read every changed line before committing.
6. **Verify the staged set** — `git diff --cached --name-only` — contains only the
   intended files and no secret, no `.env`, and no generated artefact.
   `.gitignore` is the safety net, not the check.
7. **Commit the completed task** with a concise conventional commit message.
8. **Push** to the configured GitHub remote, **after** validation has passed.
9. **Surface the change for review** — report the commit, branch, and push result,
   and state that review/merge is the next step. For substantial work on a
   `feature/*` branch, open or update a pull request targeting `develop`.
10. **Stop.** Do not begin the next task automatically.

### Flow for feature work

```text
develop → feature branch → implementation → validation → push → review → merge to develop
```

### Flow for a release

```text
develop → review → main → production/release
```

### Small documentation and configuration changes

For a very small documentation or configuration change where a feature branch
would be pointless overhead, a **direct commit to `develop`** is acceptable, subject
to the same validation, diff review and staged-file checks as any other commit. This
exception never applies to `main`.

### What counts as a meaningful task

A completed, independently reviewable unit of work — for example:

```text
architectural decision · feature · page · component system
integration · bug fix · documented configuration change
```

Do **not** create a commit for every individual file edit or a small formatting
change. Do not bundle several unrelated tasks into one commit.

### Prohibited

An agent must never:

```text
commit while validation is failing
push broken or unvalidated work
push secrets, credentials, or real .env files
push node_modules, build output, or generated/temporary artefacts
amend a previous commit unless explicitly requested
rewrite history
force push or force-with-lease
create unrelated or empty commits
bundle multiple unrelated tasks into one commit
expand scope silently
continue into a further task after pushing
```

Verify the working tree before committing, verify the staged files before
committing, validate before pushing, and inspect the diff before any merge.

### GitHub remote

An agent must **not** create a GitHub repository, and must **not** invent or guess a
GitHub URL. A remote is connected only by explicit human instruction.

- **Until a remote is configured**, commit locally only and report exactly:
  `GitHub remote not configured; commit locally only.`
- **Once a remote is configured**, push automatically as step 8 above, and include
  the push result in the report. If a push fails, report the failure — never retry
  destructively and never force-push to get green.
- The remote for this repository is `origin`:
  `https://github.com/Shreyansh-patni/innvntory.git`. No other remote is configured.

---

## 9. Definition of done

A feature is not complete when the UI works. Per specification §82, a feature is
complete only when requirements, UX, frontend, backend, database, authorization,
validation, error handling, tests, observability, documentation, security review and
production testing are all addressed. Use that as the target, and be explicit about
which parts a given slice does and does not cover.

---

## 10. Current repository stage

**Phase 0 — Foundation.**

This repository currently contains documentation and contracts only. There is no
application code, no installed dependency stack, no database, no API and no
authentication.

Do not begin implementation work without an explicit instruction to do so.

See `docs/KNOWN-ISSUES.md` for what is still unresolved, and `docs/ROADMAP.md` for
the stage sequence.
