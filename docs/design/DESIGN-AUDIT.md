# DESIGN AUDIT: Aoutive & References

**Date:** 2026-10-04
**Subject:** Visual forensics of Aoutive HTML exports, Aoutive screenshots, and Cursor design analysis.

## 1. Aoutive HTML / CSS Forensics

### Extracted Values
From analyzing the exported HTML (`Home-page.html`, `About-us.html`, `Articles.html`, etc.) and bundled CSS variables:

- **Background Colors:**
  - Very light canvas/off-white: `#f7f7f7`, `#fcfcfc`, `#f2f2f2`, `#fafafa`
  - Pure white surface: `#ffffff`
  - Dark elements/text: `#1a1a1a`, `#111116`, `#1f1f1f`
  - Muted text: `#666666`, `#737373`, `#4d4d4d`
  - Accents (observed in CSS): `#ea6118` (orange-ish), `#10b261` (green), `#f08519`
- **Typography Sizing:**
  - Display/Hero: `64px`, `58px`, `51px`, `48px`, `44px`
  - Section Headers: `38px`, `35px`, `30px`, `28px`
  - Subtitles/Body Large: `24px`, `22px`, `20px`, `18px`
  - Base Body: `16px` (default fallback), `15px`, `14px`
  - Captions/Small: `12px`
- **Fonts:**
  - Primary observed families: `Geist`, `Instrument Sans`, `Space Grotesk`, `Inter`.
- **Layout & Widths:**
  - Max-widths observed for containers: `1226px`, `1200px`, `1150px`, `980px`.
  - Horizontal padding on outer containers often sits around `20px` to `24px` on mobile/tablet, expanding to larger margins on desktop.
- **Shapes (Border Radii):**
  - Small elements (inputs/tags): `4px`, `5px`, `8px`
  - Cards/Containers: `10px`, `12px`, `15px`, `16px`, `20px`, `24px`
  - Pills/Buttons: `100px`, `112px`

## 2. Screenshot Forensics

### Desktop
- **Spacing:** Extremely generous vertical rhythm between sections (estimated 80px - 120px).
- **Navigation:** Clean, horizontal, sticky or floating top bar. Logo left, nav center, CTA right.
- **Borders:** Barely visible. 1px solid lines with very low opacity (e.g., `#000000` at 5-10% opacity) used to separate cards from the canvas.

### Tablet
- **Layout Changes:** 3-column grids compress to 2-column. Font sizes on massive display text scale down (e.g., from 64px to ~48px).

### Mobile
- **Layout Changes:** Complete stack (1-column). Navigation collapses into a hamburger menu. Horizontal padding tightens (e.g., 16px-20px). Touch targets (buttons) remain full width of the container.

## 3. Discrepancies & Notes
- **Colors:** The Aoutive color tokens include several greens, oranges, and dark blues. Innvntory will not blindly adopt these semantic colors but will adopt the *concept* of high-contrast, refined semantic actions.
- **Brand Elements:** Aoutive uses abstract placeholder art. Innvntory will rely on UI-as-art.
- **Depth:** Aoutive uses almost zero drop-shadows, relying entirely on hairlines and background contrast. This aligns perfectly with the Cursor design analysis.
