# Innvntory Design System

**Status:** Phase 0 — approved *direction* only. No tokens, theme files, or
components have been implemented.

This document records the currently approved design direction for Innvntory. It
deliberately stops short of publishing final token values, because the Innvntory
brand identity is not yet final. See `docs/KNOWN-ISSUES.md`.

Where a value would require a brand decision that has not been made, it is marked:

```text
TBD — requires brand decision
```

Do not fill these in by copying a reference. See §14.

---

## 1. Design philosophy

Innvntory should feel like software built in the current generation, not a legacy
ERP with a modern coat of paint. Specification §85 sets the target qualities:

```text
Fast · Simple · Reliable · Beautiful · Predictable · Extensible · Secure · Intelligent
```

Two governing ideas, taken directly from the specification:

- **The complexity belongs in the architecture. The simplicity belongs in the
  interface.** (spec §85)
- **Make complex business operations feel simple.** (spec §86)

Design consequences:

- Progressive disclosure. The default screen is understandable without training
  (spec §4.1); advanced capability exists without complicating the default
  (spec §4.2).
- Density is a function of the user, not of taste. See §11.
- Predictability outranks novelty. Repeated actions should look and behave the
  same everywhere.
- No decorative motion for its own sake. Motion explains change.

---

## 2. Visual character

The specification §40 names the intended reference points — **Linear, Cursor and
Apple** — and is explicit that the goal is *not* to copy them. It asks for
principles to be taken, not surfaces.

Principles adopted from the references:

| From | Principle taken |
|---|---|
| Linear | Information density, keyboard-first interaction, clean navigation, strong hierarchy |
| Cursor | Developer-tool clarity, fast interaction, command-driven workflow, minimal visual noise |
| Apple | Simplicity, typography, spacing, clear hierarchy, refined interaction design |

Character summary for Innvntory:

- Calm, high-contrast, low-noise surfaces.
- Hairline structure instead of heavy shadow.
- A single, scarce brand accent colour.
- Data is the visual subject. Chrome recedes.
- Dense but never cramped; hierarchy does the work that borders and boxes cannot.

Not adopted: any product's wordmark, logotype, illustration style, or signature
colour. See §14.

---

## 3. Typography direction

Reference reading: `DESIGN-cursor.md` (which itself documents a single
display/body family at weight 400 with negative tracking, plus a monospace for
code surfaces), and the Framer reference exports in `Design Refrence/` (which use
a geometric/grotesque display family with a separate UI sans).

**Direction.** One sans family carries both display and body roles. A monospace
family is reserved for code, identifiers, SKUs, and tabular numeric contexts where
character alignment aids scanning.

**Principles.**

- Display type is set light-to-regular, not bold. Editorial voice, not shouting.
- Negative letter-spacing on large display sizes only.
- A clear, limited type scale with defined roles, not ad-hoc sizes.
- Tabular figures for money, quantities, and stock counts so columns align.
- Line length for running text is bounded for readability.

**Scale values:** `TBD — requires brand decision` (exact sizes, weights and
tracking depend on the final type family).

**Font family:** `TBD — requires brand decision`.

> Licensing note carried over from `DESIGN-cursor.md`: the reference display face
> is a licensed typeface with an open-source substitute. Any family chosen for
> Innvntory must be verified for licence and web-font licensing cost before
> adoption. Do not adopt a font because a reference used it.

---

## 4. Colour direction

The product specification does not fix Innvntory colours. It requires a coherent
system (spec §41) and flags `HSN/SAC`, `GST`, `Tax Rate` and Indian taxation as
first-class domain concerns (spec §10, §74), which means semantic colour must
never be the only carrier of financial meaning.

**Direction.**

- A small, deliberate set of roles: canvas, surface, border, text, accent, and a
  minimal semantic set.
- **One** brand accent, used sparingly for primary actions and the wordmark —
  following the discipline described in `DESIGN-cursor.md` ("used scarcely"), not
  its specific hue.
- Warm or neutral canvas preferred over stark pure white, to reduce glare in
  long operational sessions.
- Semantic colours reserved strictly for status. They are never decorative.
- Status is never communicated by colour alone; pair with text or an icon.

**Specific values:** `TBD — requires brand decision`.

**Required semantic roles** (to be defined, values pending):

```text
background / surface        border (default, strong, subtle)
text (primary, secondary, muted, disabled)
accent (default, hover, active, on-accent)
success   — e.g. in stock, paid, completed
warning   — e.g. low stock, partially paid, pending
error     — e.g. out of stock, overdue, failed
info      — e.g. reserved, in transfer
```

**Do not** reuse AI-stage or timeline colours as system status colours. In
`DESIGN-cursor.md` that palette is explicitly scoped to in-product agent
visualisation only. If Innvntory adopts an analogous AI-stage palette, it stays
equally scoped.

---

## 5. Spacing philosophy

**Base unit: 4px.**

Direction: a 4px-based scale with named steps, used consistently so that vertical
rhythm is predictable across screens.

Reference behaviour worth noting without copying values: `DESIGN-cursor.md`
documents an 80px section rhythm on the marketing surface — generous editorial
pacing for a public page. That rhythm is a *marketing* choice. It does not transfer
to dense application screens. See §11.

**Scale values:** `TBD — requires brand decision`, though a 4 / 8 / 12 / 16 / 20 /
24 / 32 / 48 progression is the natural fit for a 4px base.

Rule: spacing communicates grouping. Related elements sit closer than unrelated
ones. Alignment and proximity do the work that boxes would otherwise need.

---

## 6. Grid and layout philosophy

**Direction.**

- A 12-column grid as the application layout basis, with a defined max content
  width and consistent gutters.
- Fluid between breakpoints; capped at the maximum container width so lines do not
  become unreadably long on wide displays.
- Layout is composed from a small number of recognised shells — e.g. dashboard,
  list/detail, form, settings, marketing page — rather than bespoke arrangements
  per screen.
- Data tables are first-class layout citizens, not an afterthought. Specification
  §39 requires clear tables, powerful filtering, and inline editing where
  appropriate; §59 requires pagination and virtualisation for large datasets.
  Layout must therefore accommodate a fixed toolbar, a scrollable body, and a
  paginated footer without breaking.

**Column count, max width and gutter values:** `TBD — requires brand decision`.

---

## 7. Border and radius philosophy

**Depth is carried by hairlines, not shadow.**

Direction:

- 1px hairline borders define structure. Elevation tiers and drop shadows are not
  the default depth mechanism.
- Where a surface must separate, a slightly different surface tone is preferred
  before shadow is considered.
- Border strength has tiers: subtle dividers, default borders, strong borders for
  focused or critical containers.
- Corners are consistent per component class. Interactive elements use a
  moderately compact radius; containers use a slightly larger one.

**Radius scale values:** `TBD — requires brand decision`.

Prohibition: no decorative drop shadows, and no glow effects.

---

## 8. Motion philosophy

Motion is functional. It explains what changed and where attention should go.

Direction:

- Short, restrained durations. Fast interfaces feel fast partly because motion
  does not delay input.
- Transitions originate from the element that caused them.
- Data changes animate only enough to draw the eye to the change.
- **Honour `prefers-reduced-motion`.** Non-essential motion must be removable
  without removing meaning. This is a requirement, not an enhancement —
  specification §72 lists reduced motion explicitly.
- No looping, attention-seeking, or parallax motion.

**Duration and easing tokens:** `TBD — requires brand decision`.

Specification §41 requires every component to define default, hover, focus,
active, disabled, loading, error and success states where applicable. Motion
tokens are part of that state definition.

---

## 9. Responsive principles

Specification §39 requires responsive layouts; §4.6 requires important workflows
to work on mobile; §44 prioritises a specific mobile surface set.

Direction:

- Mobile-first intent, but density is allowed to be *higher* on small screens for
  operational lists — the user is scanning, not reading prose.
- Touch targets meet accessibility minimums. `DESIGN-cursor.md` records a 40px
  primary control and a 44px larger control; treat these as reference evidence
  that ≥44px is a reasonable interactive floor, to be confirmed against
  specification §72 rather than copied.
- Priority workflows on mobile, per specification §44: dashboard, products,
  stock, sales, invoices, customers, notifications.
- Complex data tables degrade deliberately: reduce columns, allow horizontal
  scroll for the remainder, or switch to a card list. Never silently truncate
  financial or quantity data.
- Barcode scanning is specified as a future mobile capability (spec §44). It is
  not implemented and has no visual design yet.

**Breakpoint names and values:** `TBD — requires brand decision`.

Note on the supplied references: the Framer exports in `Design Refrence/` contain
a single `min-width: 810px` media query. That is a property of those exported
pages, not a recommended breakpoint system for Innvntory. Do not adopt it.

---

## 10. Accessibility principles

**Target: WCAG 2.1 AA** (specification §72).

This is a binding constraint on design, not a review step at the end. Required
considerations from spec §72:

- Keyboard navigation for every interactive element
- Visible, consistent focus states
- Screen-reader support: semantic structure, labels, meaningful names
- Colour contrast — for text, for meaningful non-text elements, and for focus
  indicators
- Error messaging that is perceivable and associated with the offending field
- Reduced-motion support (§8)

Design-system obligations that follow:

- Every interactive component needs a designed focus state. Focus is never
  removed for aesthetic reasons.
- Every state required by spec §41 must also be distinguishable without colour.
- Status must never be conveyed by hue alone.
- Touch targets sized per §9.

Accessibility is not deferred to a later phase for new UI work. Where a component
is built before its full state set exists, that gap must be recorded in
`docs/KNOWN-ISSUES.md`.

---

## 11. Marketing site vs application density

These are two distinct design modes. Treating them as one system is a common cause
of incoherence, so the distinction is stated explicitly.

| | Marketing site | Application |
|---|---|---|
| Purpose | Communicate, explain, convert | Operate |
| Density | Low. Generous section rhythm, large display type | High. Compact rows, dense tables |
| Type scale | Large display sizes dominate | Small, tight scale; hierarchy from weight, colour and spacing |
| Components | Sections, cards, CTAs, FAQ, footer | Tables, forms, filters, command menu, detail panels |
| Motion | Permissive, on scroll and hover | Minimal; functional only |
| Reference | Editorial direction in `DESIGN-cursor.md` | Density and keyboard-first principles from Linear/Cursor |

Rules:

- The two modes **share tokens** — the same colour roles, type family, radius
  scale, and hairline treatment. One system, two densities.
- Marketing sections are never pasted into the application, and application
  components are never stretched into marketing bands.
- Marketing components belong to the *public website*; see `docs/COMPONENTS.md`
  for the separation.

---

## 12. AI interaction visual language

Innvntory is intended to become AI-native, so the interface must be able to
express machine participation honestly. No AI UI is implemented; this is
direction only, and implementation is explicitly out of scope for foundation work
(`AGENTS.md` §6).

Direction:

- **AI activity is visible, not ambient.** When the system is reading, reasoning,
  or proposing, the user can see it.
- **AI proposals are visually distinct from executed facts.** A recommendation is
  not a record. This distinction is a correctness requirement, not styling.
  Specification §28 requires AI recommendations to be traceable to underlying
  business data.
- **Provenance is part of the design.** Answers that carry numbers should make
  those numbers inspectable.
- **Consequential actions require an explicit confirmation step** whose visual
  weight communicates consequence (specification §6 AI rules; `AGENTS.md` §6).
- An AI stage may have its own scoped colour or status vocabulary — analogous to
  the timeline-stage pastels in `DESIGN-cursor.md`, which that document explicitly
  restricts to in-product agent visualisation. Such a palette must never be reused
  as system status colour.
- AI failure and refusal states are designed, not improvised. A declining or
  uncertain model is a normal outcome, not an error to hide.

Detailed interaction and safety rules live in `docs/AI-DECISIONS.md`. The
authoritative constraint is that AI must not become the transactional source of
truth.

---

## 13. Component state requirement

Per specification §41, every Innvntory component must define, where applicable:

```text
Default · Hover · Focus · Active · Disabled · Loading · Error · Success
```

Additional states required by other parts of the specification:

- **Empty state** — spec §70 requires a *useful* empty state on every major
  screen, with a next action. "No data." is explicitly called out as bad.
- **Error state** — spec §39.
- **Loading state** — spec §39.
- **Permission-denied state** — implied by spec §32 (RBAC) and §33 (audit). A
  user without permission needs a real state, not a broken screen.

---

## 14. Reference boundary and non-copying rule

References consulted for this document:

- `DESIGN-cursor.md` — design-system reference direction.
- `Design Refrence/` — supplied visual and code references for the public
  website (Framer exports and screenshots). Documented in
  `docs/DESIGN-REFERENCES.md`.
- The supplied Aoutive AI reference pages and their exported HTML/code, treated
  as visual and implementation reference for the public website only.

**Hard rules.**

- Aoutive AI is a reference. It is **not** Innvntory branding, and must never be
  described as such.
- Never copy third-party branding, wordmarks, logotypes, colour values as brand
  identity, copy, taglines, claims, pricing, metrics, customer names, or
  testimonials into Innvntory.
- Never copy a Framer export's Framer-specific class names, component structure,
  or generated CSS into Innvntory source. It is reference material, not a
  starting template to commit.
- Innvntory develops its own identity. Where a decision is open it stays `TBD`,
  even if a reference already made one.

`TBD — requires brand decision`: the final Innvntory colour palette, type family,
logo/wordmark, and overall brand voice.

---

## 15. What this document does not yet contain

Deliberately absent, because the inputs do not exist yet:

- Concrete token values (colour hex, type sizes, spacing, radius, durations).
- Component specifications or variants.
- Dark mode strategy.
- Icon set choice. (Specification §41 requires icons to be defined; no set is
  selected.)
- Chart visual specification. (Specification §41 requires charts to be defined;
  deferred to the analytics phase.)
- Print and document styling, which matters for invoices and exports
  (specification §67 lists PDF export).
- Illustration, photography, and empty-state illustration direction.

None of the above may be invented. They require brand and architecture decisions
recorded in `docs/decisions/`.
