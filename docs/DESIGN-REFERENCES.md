# Design References

Catalogue of the design material supplied to the Innvntory project, what it is
good for, and the limits on how it may be used.

**All files listed here are supplied source-of-truth or reference material. Do not
modify, rename, move, convert, overwrite, or delete them** (`AGENTS.md` §5).

---

## 1. Innvntory references

### 1.1 `DESIGN-cursor.md`

A design-system analysis of the Cursor marketing site, presented as a token
document plus prose. It is the **primary design-direction reference** for
Innvntory.

What it provides:

- A complete token vocabulary — canvas, ink, body, muted, hairline tiers, radius
  scale, spacing scale, type scale, and semantic colours.
- Named component patterns (nav, buttons, hero band, feature card, pricing card,
  CTA band, footer, code block, and a scoped AI-timeline pill palette).
- Explicit do/don't guidance and a known-gaps section.
- Documented responsive breakpoints and touch-target reasoning.
- An honest note that its display typeface is licensed and needs a substitute.

How Innvntory uses it: as a **structural and philosophical** reference. The
discipline it demonstrates — one scarce accent colour, hairline depth instead of
shadow, light-weight display type, a monospace reserved for code surfaces, a
strictly scoped AI-stage palette — is the part worth carrying over.

How Innvntory does **not** use it: its colour values, its typeface, its wordmark,
and its component CSS are not Innvntory's. Specific values are marked
`TBD — requires brand decision` in `docs/DESIGN-SYSTEM.md`.

### 1.2 `Design Refrence/`

Directory of supplied public-website references, as inventoried at Phase 0.1.

| File | Type | Reference content |
|---|---|---|
| `Home-page.html` | Framer export (~453 KB) | Full landing page structure |
| `About-us.html` | Framer export (~391 KB) | About page — **see integrity note below** |
| `Articles.html` | Framer export (~391 KB) | Article listing — **see integrity note below** |
| `Articles Details.html` | Framer export (~298 KB) | Long-form article detail layout |
| `Contact.html` | Framer export (~299 KB) | Contact layout with form and FAQ |
| `404.html` | Framer export (~212 KB) | Not-found pattern |
| `Home page.jpg` | Screenshot | Landing page visual |
| `About us.jpg` | Screenshot | About page visual |
| `Articles.jpg` | Screenshot | Article listing visual |
| `Articles Details.jpg` | Screenshot | Article detail visual |
| `Contact.jpg` | Screenshot | Contact page visual |
| `404.jpg` | Screenshot | Not-found visual |
| `Innvntory_design-refrence_.png` | Image | Innvntory-specific design reference |
| `Rectangle 240650587.png` | Image | Asset used in the supplied references |

> **Integrity note (Phase 0.1 finding).** `About-us.html` and `Articles.html` are
> **byte-identical** (verified by checksum), and both render the About page content
> ("Our story", "Meet the team", "What our customers say"). The Articles listing
> export is therefore **missing or mis-exported**. Separately, `Home-page.html`
> carries a different `<title>` ("Autonexa — Workflow Automation SaaS") from the
> other exports ("Aoutive"). These are defects in the supplied material, **not
> bugs in this repository**. Logged in `docs/KNOWN-ISSUES.md`. Do not "fix" the
> files — request a correct export.

**Usage limits.** These are Framer-generated exports. Their hashed class names
(`framer-*`) and generated CSS are not a component source. Study the layout
decisions; do not commit the markup or stylesheet.

---

## 2. Aoutive AI references

The public-website reference pages supplied to this project, and their exported
HTML/code. The export set in `Design Refrence/` is the Aoutive AI reference
material.

> **Aoutive AI is a visual and implementation reference only. It is not Innvntory
> branding, and must never be presented as Innvntory.**

### 2.1 What the reference set demonstrates

| Area | What to study |
|---|---|
| **Editorial layout** | Wide container, generous vertical rhythm, single-column narrative flow alternating with multi-column sections |
| **Typography hierarchy** | Large display headline; small uppercase letter-spaced section labels rendered as spaced-out characters; clear body/title separation; type scale contrast over weight variety |
| **Workflow visualisation** | Multi-pane product mockup presenting a pipeline; diagram-like layout for a "centralized intelligence engine"; step groupings for automation flows |
| **Feature sections** | Repeated feature blocks (icon + title + description); alternating section backgrounds; grouped "capability" clusters |
| **Metrics** | Numeric stat band with large figures and small labels; a four-up stat row |
| **FAQ** | Accordion list — question as the interactive row, answer revealed on expand |
| **Article cards** | Card grid of article entries, typically image/title/excerpt |
| **Article details** | Long-form layout — title, metadata, sectioned body, headings, concluding section |
| **Contact layout** | Split layout — narrative/support panel beside a form; direct email and phone contact rows; accompanying FAQ |
| **CTA sections** | Pre-footer conversion band — headline, one primary action, minimal competing elements |
| **Footer patterns** | Multi-column link groups (company / product / legal), a newsletter subscribe block, a copyright line |
| **404 pattern** | Minimal centred message, one clear "back to home" action, site nav and footer retained |
| **Responsive behaviour** | Mobile-first CSS with a single `min-width: 810px` breakpoint for desktop; grids collapse to single column |

### 2.2 Structural notes observed in the exports

For accuracy when consulting these files:

- **Tooling:** Framer exports. Heavily hashed `framer-*` class names, inline
  `<style>`, `data-framer-name` component metadata.
- **Typefaces referenced:** a geometric/grotesque display family (Space Grotesk),
  plus `Geist` and `Instrument Sans` in the Framer font stacks. These are the
  reference's choices, not Innvntory's.
- **Canvas:** near-white (`rgb(252, 252, 252)` in the exported root body rule).
- **Breakpoints:** one desktop breakpoint at 810px. This is a property of the
  exports — **not** a recommended breakpoint system for Innvntory.
- **Navigation pattern:** `About · Features · Pricing · Articles · Contact` plus a
  primary `Get Started` action, consistent across the exports including 404.

### 2.3 Hard limits on use

**Never copy into Innvntory:**

- The Aoutive AI name, wordmark, logotype, or brand identity.
- Brand colours or a colour palette derived from the reference.
- Copy, headlines, taglines, section text, or FAQ content.
- Pricing and plan tiers. (The references show `$29 / $22 / $99`-style figures —
  these are the reference's, and Innvntory pricing is explicitly undetermined:
  specification §47 states pricing "should be determined after validating
  willingness to pay".)
- Metrics and stat claims (the references show "1,000+", "500+", "100% uptime",
  "100+ integrations"). **Innvntory has no such metrics.** Fabricating them would
  be a false business claim.
- Customer names, logos, testimonials, or "trusted by" logo strips.
- Contact details (the references contain a third party's email and phone number).
- Copyright lines, or any other third-party attribution.
- The Framer-generated markup, hashed class names, or generated CSS.

**Do** take: structural and layout *patterns* — section rhythm, how a feature
cluster is organised, how a stat band is composed, how a FAQ accordion is
structured, how a footer link group is laid out, how a 404 keeps navigation
orientation.

**Also note:** the exports contain a "Create a free website with Framer" footer
attribution. This is stripped automatically by serving from a real deployment and
must never be reproduced in Innvntory source.

---

## 3. Reference usage rules

1. **Read before designing.** Consult the relevant reference rather than
   inventing a pattern that already has an established solution.
2. **Cite the source** in code comments when a layout or structural decision was
   informed by a reference.
3. **Never reproduce a reference file.** Not into components, not into a new
   directory, not into documentation.
4. **Never let a reference make a decision for you.** Where the references have
   chosen and Innvntory has not, Innvntory's answer is `TBD`, not theirs.
5. **Innvntory has its own identity.** The references show how one team solved a
   problem. They do not define what Innvntory is.
6. **Preserve the files.** See `AGENTS.md` §5.

---

## 4. Reference gap

No visual reference has yet been supplied for:

- The **application** (dashboard, tables, forms, command menu) — only marketing
  surfaces are referenced. Application density direction in
  `docs/DESIGN-SYSTEM.md` §11 is therefore reasoned from specification §39/§42/§59
  and `DESIGN-cursor.md`, not from a supplied application reference.
- Dark mode.
- Mobile-specific screens.
- Charts and data visualisation (spec §41 requires charts to be defined).
- Print/invoice document styling.
- Empty, loading, and error state visuals.

These gaps are recorded in `docs/KNOWN-ISSUES.md`.
