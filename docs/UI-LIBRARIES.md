# UI Libraries

**Status:** Phase 0 — policy only. **No UI library, framework, or styling tool is
installed.** Nothing in this document has been executed.

This document defines the UI dependency hierarchy for Innvntory and the rules for
adopting anything into it.

---

## 1. The core rule

```text
One coherent Innvntory design system. No UI-library collage.
```

Every visual decision traces back to `docs/DESIGN-SYSTEM.md`. A dependency that
introduces its own visual language is a liability, not an asset.

---

## 2. Level 1 — Default foundation

### shadcn/ui

**Role:** the default UI foundation for Innvntory. All application and marketing
UI is built from it by default.

Why it is the default:

- It is **not a runtime component library** — components are copied into the
  project source. That means the code is owned, reviewable, and modifiable, which
  matches `AGENTS.md` §3 ("inspect before modifying", "no dead code").
- It is styled with Tailwind CSS and themed through CSS variables, which maps
  directly onto a token-driven design system and onto WCAG-contrast requirements
  (spec §72).
- It is the ecosystem default for the stack named in specification §61
  (Next.js / React / TypeScript / Tailwind CSS / shadcn/ui).
- It supports the accessible primitives the specification requires — focus
  management, labelling, keyboard interaction — rather than leaving them to be
  hand-built per screen.

**Rules.**

- shadcn/ui components are the starting point, not the finished component. Adapting
  them to the Innvntory design system is expected and correct.
- Additions go into project wrappers, not into per-page forks of a base component.
- Every added component must satisfy the state requirement in
  `docs/DESIGN-SYSTEM.md` §13.
- If a shadcn/ui component cannot be made to meet the accessibility target,
  that is recorded as a known issue, not waived.

**Not yet installed.** Installation requires a recorded decision — see
`docs/DEPENDENCIES.md`. Tailwind CSS and the Next.js/React stack are likewise not
installed.

---

## 3. Level 2 — Specialized resources

These are **not** defaults. Each may be adopted only where there is a concrete,
stated advantage over the shadcn/ui approach for a specific Innvntory need.

| Library | Potential Innvntory use | Status |
|---|---|---|
| **Watermelon UI** | Mobile-first component patterns. Relevant to spec §4.6, §44 (mobile workflows) | Not installed. Not evaluated |
| **Aceternity UI** | Animated / premium marketing sections for the public site | Not installed. Not evaluated |
| **Magic UI** | Animated text, animated components, special effects — marketing surfaces | Not installed. Not evaluated |
| **Motion Primitives** | Interaction and layout animation primitives, `prefers-reduced-motion` handling | Not installed. Not evaluated |
| **HeroUI** | Additional component coverage if shadcn/ui has a genuine gap | Not installed. Not evaluated |

The "potential use" column is a hypothesis to be tested when a specific need
appears. It is **not** an approval, a plan, or a justification. No Level 2 library
has been evaluated for bundle size, maintenance, or licence.

### Adoption bar

A Level 2 library may be adopted only when **all** of the following are recorded
in `docs/decisions/`:

1. The specific Innvntory requirement it serves.
2. Why shadcn/ui plus project code is insufficient.
3. Bundle-size and load impact.
4. Maintenance health and licence.
5. Framework compatibility with the chosen stack.
6. How its visual language will be reconciled with `docs/DESIGN-SYSTEM.md` —
   typically by wrapping and restyling it, never by importing it raw.
7. Which specific components are adopted, not the whole library.

---

## 4. Prohibitions

- **Do not install all libraries.** A dependency added "just in case" is dead
  weight, a bundle cost, and an unowned visual system.
- **Do not duplicate existing shadcn/ui functionality.** If shadcn/ui already
  provides it, extend or adapt it.
- **Do not mix incompatible visual systems.** Two libraries whose radius, spacing,
  and elevation models disagree will produce an incoherent product.
- **Do not import raw and restyle per page.** A mixed system is adapted once,
  behind a project wrapper, and consumed through that wrapper.
- **Do not import generated or vendor CSS wholesale.** A Framer export in
  `Design Refrence/` is reference material. Its generated class names and CSS are
  not a component source.
- **Do not use a third-party component library's branding, name, or iconography
  in Innvntory.**
- **Do not use a Level 2 library to bypass the design system.** Novelty is not an
  argument.
- **Do not add an icon library per component.** One icon set for Innvntory,
  selected and recorded — currently `TBD`.

---

## 5. Evaluation checklist

Run before adopting any Level 2 library, and record the answers:

```text
[ ] Concrete product requirement identified (spec section cited)
[ ] shadcn/ui alone confirmed insufficient, with reasoning
[ ] Framework compatibility verified against the chosen stack
[ ] Bundle size / load impact measured or estimated
[ ] Maintenance activity and issue responsiveness checked
[ ] Licence reviewed
[ ] Accessibility of the specific components checked against spec §72
[ ] Visual reconciliation plan written
[ ] Wrapper component identified as the integration boundary
[ ] Recorded as an ADR in docs/decisions/
[ ] Recorded in docs/DEPENDENCIES.md
```

If any box cannot be honestly ticked, do not adopt it yet.

---

## 6. Current state

```text
shadcn/ui ................ not installed (designated default)
Tailwind CSS .............. not installed
Watermelon UI ............. not installed
Aceternity UI ............. not installed
Magic UI .................. not installed
Motion Primitives ......... not installed
HeroUI .................... not installed
```

Framework and styling-tool selection is **TBD — requires architectural decision**.
The specification §61 names Next.js / React / TypeScript / Tailwind CSS /
shadcn/ui as a *possible* stack and explicitly leaves the backend architecture
open; it does not lock the frontend. The choice must be recorded in
`docs/decisions/` before installation.
