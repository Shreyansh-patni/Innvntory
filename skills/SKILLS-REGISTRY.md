# Skills Registry

Registry of skills relevant to Innvntory, and their **actual** current status.

**Status accuracy rule:** a skill is only recorded as *Installed* if it is
physically present in this repository or otherwise verifiably available to this
project. A skill that has been discussed, agreed on, or would be useful is
recorded as *Referenced* or *Candidate*. Never record a skill as installed unless
it actually is.

Last reviewed: Phase 0.1 — Repository Initialization.

---

## 1. Installed Skills

Skills physically present in the Innvntory repository or its environment.

| Skill | Location | Status |
|---|---|---|
| _(none)_ | — | No Innvntory project skill is installed at this point. |

Notes:

- `skills/` in this repository currently contains only this registry file. No
  skill definition (`SKILL.md` or equivalent) has been created for Innvntory.
- No third-party skill has been installed. Nothing was installed during Phase 0.1.

### Host-environment skills (not Innvntory skills)

These exist in the agent host environment, outside this repository. They are
recorded for transparency and are **not** Innvntory project skills.

| Skill | Scope | Relevance to Innvntory |
|---|---|---|
| `customize-opencode` | opencode platform | Not project-related. Only for configuring opencode itself. |
| `find-skills` | opencode platform | Generic skill discovery. May be used later to source Innvntory skills. |

---

## 2. Referenced Skills

Skills that have been **selected and agreed** as relevant to Innvntory, and are
intended to be reviewed or used as guidance. **None of these are installed.**

Installation is explicitly deferred. Do not install them as part of a foundation
or documentation task.

| Skill | Selected for | Status | Notes |
|---|---|---|---|
| `frontend-design` | Frontend design quality; keeping the Innvntory interface coherent and non-generic | Selected — not installed | Directly relevant to `docs/DESIGN-SYSTEM.md` and `docs/COMPONENTS.md`. |
| `web-design-guidelines` | Frontend quality, accessibility and UI correctness review | Selected — not installed | Aligns with specification §72 (WCAG 2.1 AA) and §39 (frontend requirements). |
| `vercel-react-best-practices` | React performance and correctness patterns | Selected — not installed | Relevant to the frontend once React is adopted. No dependency installed. |
| `vercel-composition-patterns` | Component composition and reuse patterns | Selected — not installed | Supports `AGENTS.md` §3 "reuse existing components" and avoids abstraction bloat. |
| `nextjs-saas` | SaaS application structure conventions | Selected — not installed | Next.js is named as a *possible* frontend in specification §61, not locked. Treat as conditional guidance only. |
| `playwright` | Browser automation and end-to-end testing | Selected — not installed | Required by specification §57 (E2E tests). No test stack exists yet. |
| `playwright-best-practices` | Reliability and maintainability of E2E suites | Selected — not installed | Pairs with `playwright`. Flake resistance matters for the §58 critical scenarios. |
| `verification-before-completion` | Preventing unverified completion claims | Selected — not installed | Directly enforces `AGENTS.md` §3 "never claim completion without verification" and §7. |

### Conditional-skill warning

`nextjs-saas` assumes Next.js. The **backend** architecture is now decided
([ADR 0001](../docs/decisions/0001-backend-architecture.md), Accepted) — but it
decided that a dedicated backend service exists, *not* which frontend framework is
used. Specification §61 lists Next.js only as a *possible* frontend stack.

**Do not adopt Next.js-specific conventions until the frontend framework decision is
made, and do not let this skill's presence influence that decision.** A skill chosen
before a decision is made must not become the reason for it.

The frontend framework is now the blocking decision for all implementation work. See
`docs/KNOWN-ISSUES.md` §1.2.

---

## 3. Candidate Skills

Skills that may become useful in later phases. **Not selected, not installed, not
reviewed.** Listed so they are not rediscovered from scratch.

| Skill | Potentially useful for | Earliest phase |
|---|---|---|
| Accessibility auditing skill | Validating specification §72 (WCAG 2.1 AA) | Phase 2 — Design System |
| Design token generation | Converting `docs/DESIGN-SYSTEM.md` direction into tokens | Phase 2 — Design System |
| Load / performance testing | Specification §59 performance targets, §7 production hardening | Phase 9 — Production hardening |
| Security review skill | Specification §50, §83 security checklist | Phase 9 — Production hardening |
| Migration / schema review | Database migration safety (§34) | Phase 1 — Core platform foundation |
| CSV / XLSX import-export | Specification §67 | Phase 4 — Sales / invoicing |
| GST / India tax tooling | Specification §74, §46 | Phase 4 — Sales / invoicing |
| Prompt-evaluation / AI guardrails | Specification §28, `docs/AI-DECISIONS.md` | Phase 7 — AI intelligence |
| Observability setup | Specification §53 | Phase 1 — Core platform foundation |

None of the above have been evaluated. Their existence in this table implies
nothing about availability or quality.

---

## 4. Project-Specific Skills

Skills that must be created specifically for Innvntory, because no general skill
covers the project's contracts.

**Status: none created yet.** Phase 0.1 deliberately created no skill definitions.

Proposed, for consideration at a later controlled step:

| Proposed skill | Purpose |
|---|---|
| `innvntory-source-hierarchy` | Enforce the conflict-resolution order in `AGENTS.md` §2 and refuse to invent requirements. |
| `innvntory-reference-preservation` | Refuse to modify, rename, move or reproduce `Innvntory.md.txt`, `DESIGN-cursor.md`, `Design Refrence/`. |
| `innvntory-validation-gate` | Run the §7 validation set and report honest pass / fail / not-run. Refuse to fabricate a pass. |
| `innvntory-ai-safety` | Apply the `AGENTS.md` §6 AI rules: tenant boundaries, RBAC parity, auditability, deterministic business data, explicit confirmation. |
| `innvntory-design-tokens` | Enforce `docs/DESIGN-SYSTEM.md` and prevent third-party branding, copy, pricing or metrics from entering Innvntory. |
| `innvntory-adr-author` | Draft architectural decision records in `docs/decisions/` for open `TBD` items. |

These are proposals only. None is written, reviewed, or agreed.

---

## 5. Registry maintenance rules

- Update this file whenever a skill's status genuinely changes.
- Never mark a skill installed before it exists on disk.
- Record a skill under *Referenced* if it has been agreed but not obtained.
- Record project-specific skills under *Project-Specific*, not *Installed*, until
  their `SKILL.md` exists.
- Installing a skill is a deliberate act with a recorded justification. See
  `docs/DEPENDENCIES.md`.

---

## 6. Current honest position

```text
Installed Innvntory skills:   0
Referenced (agreed) skills:   8
Candidate skills:             9 (unevaluated)
Project-specific skills:      0 created, 6 proposed
```

Nothing in this registry has been executed, and no validation has been run.
