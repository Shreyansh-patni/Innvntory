# DESIGN REFERENCES

## 1. Relationship Overview

The Innvntory visual design is a synthesis of two primary inspirations, heavily constrained by the practical needs of a data-dense SaaS product.

```text
Aoutive AI (Visual Language)
+ Cursor (Design Principles)
+ Supplied Palettes (Light Mode / Dark Mode)
+ Innvntory (Product Requirements)
= Final Design System
```

## 2. Aoutive AI (Primary Visual Authority)

**Role:** Defines what the application *looks* like.
**Location:** `docs/references/aoutive-ai/`

**What we inherit:**
- The overall premium, airy, and structured aesthetic.
- The use of very light (non-white) page backgrounds paired with pure white cards.
- Subtle 1px borders (hairlines) instead of heavy drop shadows.
- Strong, clean typography and spacing scales.
- Editorial quality and visual discipline.

**What we reject/exclude:**
- Aoutive's logo, branding, wordmark, and specific corporate colors.
- Aoutive's marketing illustrations and generic claims.
- Any layout that sacrifices data density where the SaaS app requires it (e.g., data tables).

## 3. Cursor (Secondary Principle Authority)

**Role:** Defines how the design *behaves* and the *philosophy* behind the aesthetics.
**Location:** `docs/references/cursor/CURSOR-DESIGN-ANALYSIS.md`

**What we inherit:**
- **Restraint:** Only one primary action color on the screen at a time.
- **Developer/Technical feel:** 8px border radii for controls, monospace fonts for data/code, tight interaction loops.
- **Elevation:** Flat design. Depth is created by contrast and hairlines, not shadows.

**What we reject/exclude:**
- Cursor Orange (`#f54e00`) and the timeline pastel palette.
- CursorGothic (unless we specifically license or choose a direct open-source equivalent like Geist/Inter).
- The dark "IDE" panes (Innvntory defaults to light-mode business operations, unless dark mode is specifically toggled).

## 4. Innvntory (The Palette Authority)

**Role:** Defines the exact application colors and neutral scales.
**Location:** `docs/design/reference-images/Light Mode.md` and `docs/design/reference-images/Dark Mode.md`

**What we inherit:**
- The explicit Light Mode and Dark Mode neutral scales provided by the product owner.
- The dual-mode definition for the application UI (distinct from the Aoutive-inspired `#f7f7f7` marketing canvas).

**What we reject/exclude:**
- Generic Tailwind scales (e.g. `zinc`, `slate`) in favor of these precise values.

## 5. Innvntory (The Product Authority)

**Role:** The ultimate arbiter of design choices.
**Location:** `docs/source-of-truth/INNVNTORY-PRODUCT-DEFINITION.md`

**Core Rule:** Do not make a visually beautiful design that makes inventory/business operations harder to use. If an Aoutive pattern makes a data table unreadable, the Aoutive pattern is discarded in favor of usability. "Make complex business operations feel simple."
