# INNVNTORY DESIGN SYSTEM

**Date:** 2026-10-04
**Primary Visual Reference:** Aoutive AI (`docs/references/aoutive-ai/`)
**Secondary Design Principle Reference:** Cursor Design Analysis (`docs/references/cursor/`)

## 1. System Philosophy
A premium, modern, disciplined inventory/business SaaS. 
- **Refined & Minimal:** Low visual noise.
- **Spacious:** Let the data breathe.
- **Highly Structured:** Clear hierarchy and alignment.
- **Subtle Borders:** Hairline separation over heavy shadows.
- **Restrained Color:** One primary semantic action color per context.

---

## 2. Color System

*Note: The base palette avoids pure white backgrounds and pure black text to reduce eye strain, mimicking editorial printing where appropriate.*

### Source Palettes (Product UI)
These are the explicit source scales supplied by the product owner. 

**LIGHT MODE PALETTE**
- `#FFFFFF`
- `#F8F8F8`
- `#F0F1F2`
- `#DDDEE1`
- `#B7B9BE`
- `#8C8F97`
- `#7D818A`
- `#6B6E76`
- `#505258`
- `#3B3D42`
- `#292A2E`
- `#1E1F21`
- `#000000`

**DARK MODE PALETTE**
- `#111213`
- `#18191A`
- `#1F1F21`
- `#242528`
- `#2B2C2F`
- `#303134`
- `#3D3F43`
- `#4B4D51`
- `#63666B`
- `#7E8188`
- `#96999E`
- `#A9ABAF`
- `#BFC1C4`
- `#CECFD2`
- `#E2E3E4`
- `#FFFFFF`

### Semantic Tokens (Product UI vs Marketing)
Marketing elements use the Aoutive-inspired `#f7f7f7` canvas, while the internal application UI leans on the stricter supplied Light/Dark palettes. Exact mappings are partially TBD pending implementation.

| Token | Light Value | Dark Value | Purpose / Evidence | Status |
|-------|-------------|------------|--------------------|--------|
| `--color-canvas` | `#f7f7f7` | TBD | Marketing/Editorial base background. Derived from Aoutive. | ADAPTED |
| `--color-background` | `#FFFFFF` | `#111213` | Application base background. | PROPOSED |
| `--color-background-subtle` | `#F8F8F8` | `#18191A` | Secondary background, sidebars, nested containers. | PROPOSED |
| `--color-surface` | `#FFFFFF` | `#1F1F21` | Elevated cards, dialogs, dropdowns. | PROPOSED |
| `--color-surface-muted` | `#F0F1F2` | `#242528` | Badge backgrounds, secondary button fills. | PROPOSED |
| `--color-border-subtle` | `#DDDEE1` | `#2B2C2F` | Hairline dividers, subtle card borders. | PROPOSED |
| `--color-border` | `#B7B9BE` | `#3D3F43` | Inputs, interactive elements borders. | PROPOSED |
| `--color-text-primary` | `#1E1F21` | `#E2E3E4` | Primary display and heading text. | PROPOSED |
| `--color-text-secondary` | `#505258` | `#A9ABAF` | Default reading text, body text. | PROPOSED |
| `--color-text-muted` | `#7D818A` | `#7E8188` | Subtitles, disabled text, placeholder text. | PROPOSED |
| `--color-primary-action` | TBD | TBD | Primary CTA button background. | TBD |
| `--color-success` | `#10b261` | `#10b261` | Confirmation, stock received, success states. | OBSERVED |
| `--color-warning` | `#f08519` | `#f08519` | Low stock, pending payments. | OBSERVED |
| `--color-error` | `#ea6118` | `#ea6118` | Validation errors, deletion warnings. | OBSERVED |

*Implementation Note: Do not implement CSS variables until authorized by an implementation phase.*

---

## 3. Typography System

**Typeface:** `NewBlack` (Primary / Display) and `LT-amber` (Secondary / UI). 
*The system uses these custom brand fonts for all UI elements. The main logo/wordmark is also `NewBlack`.*

| Token | Size | Weight | Line Height | Tracking | Usage | Status |
|-------|------|--------|-------------|----------|-------|--------|
| `display-mega` | 64px | 400/500 | 1.1 | Tight (-1px) | Marketing hero h1 | ADAPTED |
| `display-lg` | 48px | 500 | 1.2 | Tight | Section headers | ADAPTED |
| `display-md` | 36px | 500 | 1.25 | Tight | Sub-section headers | ADAPTED |
| `title-lg` | 24px | 600 | 1.3 | Normal | Dashboard widget titles | PROPOSED |
| `title-md` | 18px | 600 | 1.4 | Normal | Card titles, Modal titles | PROPOSED |
| `body-md` | 16px | 400 | 1.5 | Normal | Default paragraph/reading | OBSERVED |
| `body-sm` | 14px | 400 | 1.5 | Normal | Table cells, inputs, dense UI | PROPOSED |
| `caption` | 12px | 500 | 1.4 | Normal | Badges, timestamps, small labels | OBSERVED |
| `code/data` | 13px/14px | 400 | 1.5 | Normal | SKUs, Barcodes, Monospace data | PROPOSED |

---

## 4. Layout & Spacing System

**Base Unit:** 4px spacing scale.

| Token | Value | Purpose |
|-------|-------|---------|
| `space-xs` | 4px | Between icon and text inside a badge. |
| `space-sm` | 8px | Between stacked elements in a card. |
| `space-md` | 16px | Default component padding, input padding. |
| `space-lg` | 24px | Inner card padding, modal padding. |
| `space-xl` | 32px | Separation between distinct UI groups. |
| `space-section` | 80px | Marketing/Dashboard section separation. |

**Layout Container:**
- `content-max-width`: `1200px` (or `1226px` as observed).
- `page-gutters`: `24px` on desktop, `16px` on mobile.

---

## 5. Shape & Elevation

**Border Radius Scale:**
- `rounded-sm`: `4px` (Checkboxes, small tags)
- `rounded-md`: `8px` (Inputs, Buttons, Dropdowns - Technical/Cursor feel)
- `rounded-lg`: `12px` (Standard Cards, Modals - Aoutive feel)
- `rounded-full`: `9999px` (Avatars, Pills)

**Elevation (Depth):**
- Strictly **Hairline-only**.
- 1px solid border (`hairline` color) separating cards from the canvas. 
- Avoid heavy drop shadows entirely.

---

## 6. Marketing vs. Application

**Marketing Website:**
- Uses large typography (`display-mega`).
- Extremely generous vertical rhythm (`space-section` 80px+).
- Abstract/Hero illustrations.

**Product Application (SaaS Dashboard):**
- Higher information density (relying on `body-sm` and `title-md`).
- Condensed spacing (16px to 24px gaps).
- Retains the exact same typography family, shapes (radii), and color tokens to ensure the app feels like the same product family as the website.

---

## 7. Responsive Behavior

- **Desktop (>1024px):** Max-width containers, multi-column grids (2-up, 3-up, 4-up for metrics), full sidebars, expansive data tables.
- **Tablet (768px - 1024px):** 2-column grids. Sidebars collapse to icons. Data tables may truncate or scroll horizontally. Font sizes scale down slightly (e.g., 64px -> 48px).
- **Mobile (<768px):** 1-column stack. Top navigation becomes a hamburger menu. Touch targets expand to full width. `page-gutters` tighten to 16px.

---

## 8. Component Inventory (Definitions Only)

**Foundations:** Container, Section, Divider, Typography, Icon, Avatar.
**Actions:** Button (Primary, Secondary, Ghost, Destructive), Icon Button, Link.
**Forms:** Input, Select, Textarea, Checkbox, Radio, Switch, DatePicker.
**Data:** Table, Metric Card, Badge, Status indicator, List, Empty State.
**Navigation:** Header, Sidebar, Tabs, Breadcrumbs, Pagination.
**Overlays:** Dialog/Modal, Sheet/Drawer, Dropdown, Popover, Tooltip, Toast.

### Component States
All interactive components must define predictable states: `Default`, `Hover`, `Focus` (visible keyboard focus rings), `Active`, `Disabled`, `Loading`.

---

## 9. Motion & Accessibility

**Motion:**
- Purposeful and brief.
- Easing: standard ease-out for entrances.
- Limit decorative animations. Respect `prefers-reduced-motion`.

**Accessibility:**
- Semantic HTML tags.
- Visible focus rings for keyboard navigation.
- Minimum contrast ratio 4.5:1 for text.
- Minimum touch target 44px x 44px for primary mobile actions.

---

## 10. UI Library Strategy

- **PRIMARY:** `shadcn/ui`
  - *Implementation Rule:* Do not blindly copy shadcn's default styling. Modify the `tailwind.config.ts` and component primitives to match Innvntory's radii (8px/12px) and hairline borders.
- **SECONDARY:** Watermelon UI, Aceternity UI, Magic UI, Motion Primitives, HeroUI. (Conditional usage only).

## 11. Dark Mode
**Status:** RESOLVED (Source Palette Level).
The product owner supplied the explicit Dark Mode palette (`docs/design/reference-images/Dark Mode.md`). 

## 12. Unresolved / TBD Decisions
- Exact semantic mapping of the Light/Dark palettes for specific components.
- Primary Brand Color / Accent Color.
- Component-specific dark-mode behavior, image treatment, chart colors.
