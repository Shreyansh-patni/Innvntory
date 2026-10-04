# INNVNTORY DESIGN SYSTEM

**Date:** 2026-10-04 (Updated SETUP 06)
**Primary Visual Reference:** Aoutive AI (`docs/references/aoutive-ai/`)
**Secondary Design Principle Reference:** Cursor Design Analysis (`docs/references/cursor/`)
**Implementation Status:** Visual System & Shell Active in Code

---

## 1. System Philosophy

Innvntory is a premium, modern, disciplined inventory and business operations platform.
- **Refined & Minimal:** Low visual noise, monochrome elegance.
- **Spacious:** Generous vertical whitespace on public pages; disciplined high-density layout in the operational application.
- **Highly Structured:** Clear grid alignment, 1px structural borders over heavy drop shadows.
- **Restrained Color:** Neutral monochrome base with one primary semantic action color per context. Primary brand accent remains TBD.
- **Zero Partial State:** Visual and architectural reliability across all states.

---

## 2. Color System & Implemented Tokens

### Source Palettes

The color scales are rooted in the explicit source files:
- Light Mode: `docs/design/reference-images/Light Mode.md`
- Dark Mode: `docs/design/reference-images/Dark Mode.md`

### Implemented Semantic Tokens (`app/globals.css`)

| Token | Light Mode Value | Dark Mode Value | Usage Context |
| :--- | :--- | :--- | :--- |
| `--canvas` | `#f7f7f7` | `#111213` | Marketing base canvas background |
| `--background` | `#FFFFFF` | `#111213` | Default application/page background |
| `--background-subtle` | `#F8F8F8` | `#18191A` | Sidebar background, secondary sections, footers |
| `--surface` | `#FFFFFF` | `#1F1F21` | Elevated cards, dialogs, dropdowns |
| `--surface-muted` | `#F0F1F2` | `#242528` | Badge backgrounds, hover states, input fills |
| `--border-subtle` | `#DDDEE1` | `#2B2C2F` | Hairline dividers, card borders (1px) |
| `--border` | `#B7B9BE` | `#3D3F43` | Inputs, interactive borders, focus rings |
| `--text-primary` | `#1E1F21` | `#E2E3E4` | Display headings, high-contrast text, primary buttons |
| `--text-secondary` | `#505258` | `#A9ABAF` | Body text, paragraph descriptions |
| `--text-muted` | `#7D818A` | `#7E8188` | Section subtitles, captions, timestamps |
| `--text-disabled` | `#8C8F97` | `#63666B` | Inactive controls, placeholder text |
| `--success` | `#10b261` | `#10b261` | Stock receipts, success confirmations |
| `--warning` | `#f08519` | `#f08519` | Reorder alerts, pending actions |
| `--error` | `#ea6118` | `#ea6118` | Validation errors, critical alerts |

---

## 3. Typography System

**Registered Brand Fonts (`lib/fonts.ts`):**
- Primary & Headings: `NewBlack` (UltraLight, Light, Regular, Medium, SemiBold, Bold, ExtraBold)
- Secondary & Body: `LT-amber` (Light, Regular, Medium, Demibold, Bold)
- Wordmark: `NewBlack` (Bold)

---

## 4. Radii & Hairline Elevation

**Border Radius Scale:**
- Controls & Inputs: `8px` (`--radius-md`) — Technical/Cursor precision
- Cards & Dialogs: `12px` (`--radius-lg`) / `16px` (`--radius-xl`) — Aoutive structural elegance
- Badges & Pills: `9999px` (`rounded-full`)

**Elevation (Depth):**
- Strictly **Hairline 1px borders** (`border-border-subtle` and `border-border`).
- Avoid heavy drop shadows. Contrast is achieved via background-to-surface layer differentiation.

---

## 5. Experience Separation: Public vs. Application

### Public Marketing Website (`/`)
- Aoutive-inspired editorial composition.
- Generous whitespace (`py-16` to `py-24` section spacing).
- Large display typography (`text-4xl` to `text-6xl`).
- Restrained monochrome actions.
- Layout: `MarketingHeader` + `<main>` + `MarketingFooter`.

### Authenticated Application (`/app/*`)
- Denser operational layout for multi-warehouse workflows.
- Persistent collapsible sidebar (`AppSidebar`) and top application bar (`AppHeader`).
- Accessible slide-out sheet on mobile (`MobileNavigation`).
- Command Center entry point (`⌘K` / `Ctrl+K`).
- Neutral shell preview state under `/app/dashboard`.

---

## 6. Persistent Theme System (SETUP 11.7)

- **Default Theme:** `light` (Default baseline for all unauthenticated visitors and initial accounts).
- **Supported Themes:** `light` and `dark` strictly (no system/auto override).
- **Persistence Architecture:**
  - **Authenticated Users:** Stored durably in PostgreSQL table `public.user_preferences` (`user_id`, `theme`, timestamps) and queried server-side.
  - **Fast SSR / Anti-Flicker:** Cached via `innvntory_theme` cookie and executed through inline script before DOM paint to ensure 0 flash of unstyled theme.
  - **Demo Account Isolation:** For the shared public demo account (`demo@innvntory.com`), theme selection is preserved locally in the visitor's browser (cookie & localStorage) without mutating the shared database row for other visitors.
  - **Settings Control:** Managed at `/app/settings/appearance` and quick header toggle. Selection changes theme immediately without full page reload.

---

## 7. Accessibility & Motion

- **Focus State:** Visible `:focus-visible` outline rings with offset (`outline-2 outline-offset-2 outline-border`).
- **Touch Targets:** Minimum 44px on mobile touch interactions.
- **Motion:** Subtle transitions (`transition-colors duration-150`), zero distracting animations or parallax. Respects `prefers-reduced-motion`.
