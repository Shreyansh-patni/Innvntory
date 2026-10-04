# PUBLIC WEBSITE REFERENCE MAP

**Purpose:** Explicit mapping of every Innvntory public marketing page to its primary Aoutive AI visual reference, secondary principles, section structure, and adaptation rules.

---

## 1. Page Reference Matrix

| Page Route | Primary Reference (Aoutive AI) | Secondary Reference | Sections Implemented | Innvntory Adaptation & Rules |
| :--- | :--- | :--- | :--- | :--- |
| `/` (Landing) | `Home-page.html` + `Home page.jpg` | Cursor Design Principles | Hero, Capabilities Grid, Operations Workflow, Architecture Principles, FAQ, CTA, Footer | Adapts Aoutive's generous whitespace, 1px hairlines, and editorial headline scale. Replaces abstract art with UI abstractions. |
| `/features` | Derived from Aoutive visual system | Innvntory Product Definition | Page Header, Categorized Domains (Inventory, Catalog, Procurement, Sales, Analytics, Security), CTA | Structured by domain models. Clear separation between core available, scheduled, and future capabilities. |
| `/pricing` | Aoutive visual system | Innvntory Product Definition | Header, Tier Cards (Free, Starter, Growth, Business, Enterprise), Feature Highlights, FAQ | Clean card hierarchy with provisional/TBD prices clearly stated. No fabricated commitments. |
| `/docs` & `/docs/[slug]` | Aoutive structural language | Developer Docs UX | Header, Quick Start Card, Categorized Guides (Getting Started, Products, Inventory, Purchasing, Sales, API) | Minimalist technical documentation hub with clean category cards and reading measure. |
| `/articles` | `Articles.html` + `Articles.jpg` | Editorial typography | Editorial Header, Featured Article Hero Card, Multi-column Article Archive Grid | Clean metadata layout (category, read time, date, author), 1px border cards, hover micro-interactions. |
| `/articles/[slug]` | `Articles-Details.html` + `Articles Details.jpg` | Editorial typography | Back Nav, Article Header, Author Attribution, Content Sections, Editorial Callouts, Footer | High-readability measure (max-w-4xl), structured section headings, italic callout quotes. |
| `/about` | `About-us.html` + `About us.jpg` | Sahaya Tech Vision | Header, Mission & Philosophy Cards, 4-Phase Product Evolution Timeline, CTA | Focus on Sahaya Technologies Pvt. Ltd., problem statement, and architectural principles. No fabricated metrics. |
| `/contact` | `Contact.html` + `Contact.jpg` | Enterprise Support UX | Header, 2-Column Layout (Company Info, Support Hours, Contact Form Structure), FAQ | Clean input fields with 8px radius and subtle focus rings. Non-operational form submission. |
| `/login` | Innvntory Design System | Aoutive Minimal Form | Centered Auth Card, Email/Password Fields, SSO Placeholder, Signup Link | Restrained monochrome auth entry point. |
| `/signup` | Innvntory Design System | Aoutive Minimal Form | Centered Auth Card, Full Name, Email, Organization Name, Terms Notice, CTA | Clean onboarding entry point. |
| `/privacy`, `/terms`, `/cookie-policy`, `/disclaimer` | Innvntory Design System | Legal Document UX | Document Header, Last Updated Timestamp, Provisional Notice Alert, Structured Clauses | Clear draft notices emphasizing pending legal counsel review. |
| `/404` | `404.html` + `404.jpg` | Minimal Error UX | Error Icon, Badge, Display Heading, Explanatory Message, Return Actions | Clean centered not-found state matching Aoutive rhythm without copied branding. |

---

## 2. Visual Forensics & Shared Rules

1. **Surfaces & Canvas:**
   - Marketing canvas: `#f7f7f7` / `#fcfcfc` subtle contrast on elevated pure white `#ffffff` cards (`bg-surface`).
   - 1px hairline borders (`border-border-subtle`) instead of drop shadows.
2. **Typography:**
   - Primary heading & wordmark: `NewBlack`
   - Secondary font: `LT-amber`
3. **Responsive Rhythm:**
   - Desktop (1280px–1440px+): Max-width 7xl (1280px) centered containers with generous padding.
   - Tablet (768px–1024px): 2-column compressed grids, compact headers.
   - Mobile (< 768px): Single-column stack, full-width touch targets, slideout sheet navigation.
