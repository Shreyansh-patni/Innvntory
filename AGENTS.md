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
