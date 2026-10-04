# INNVNTORY COMPONENT REGISTRY

**Status:** IMPLEMENTED (SETUP 06)
**Last Updated:** October 2026

---

## 1. Marketing Components (`components/marketing/`)

Reusable components engineered specifically for the public marketing website (`/`, `/features`, `/pricing`, `/docs`, `/articles`, `/about`, `/contact`, `/login`, `/signup`, `/privacy`, `/terms`).

| Component | Path | Description | Client/Server |
| :--- | :--- | :--- | :--- |
| `MarketingHeader` | `components/marketing/marketing-header.tsx` | Top public navigation bar with Innvntory wordmark, active link states, sign in / get started actions, and responsive mobile drawer sheet. | Client |
| `MarketingFooter` | `components/marketing/marketing-footer.tsx` | 4-column structured footer (Product, Resources, Company, Legal) with Sahaya Technologies Pvt. Ltd. corporate attribution. | Server |
| `HeroSection` | `components/marketing/hero-section.tsx` | Centered display typography hero with product subtitle, dual action CTAs, and structural UI abstraction card. | Server |
| `CapabilitiesSection` | `components/marketing/capabilities-section.tsx` | 6-card platform capability grid with 1px hairline borders and subtle hover elevation. | Server |
| `OperationsWorkflow` | `components/marketing/operations-workflow.tsx` | 4-step operations pipeline (Catalog → Allocation → Procurement → Fulfillment). | Server |
| `WhyInnvntory` | `components/marketing/why-innvntory.tsx` | Core architectural principles (Zero Partial State, Event Ledger, India-first GST, High-Performance). | Server |
| `FAQSection` | `components/marketing/faq-section.tsx` | Accessible collapsible FAQ accordion. | Client |
| `CTASection` | `components/marketing/cta-section.tsx` | High-contrast callout banner driving workspace creation. | Server |

---

## 2. Authenticated Application Components (`components/layout/`)

Layout and navigation components providing the persistent application shell for `/app/*`.

| Component | Path | Description | Client/Server |
| :--- | :--- | :--- | :--- |
| `AppShell` | `components/layout/app-shell.tsx` | Top-level layout container composing sidebar, header, and scrollable content area with max-width container. | Server |
| `AppSidebar` | `components/layout/app-sidebar.tsx` | Persistent desktop left navigation with Innvntory wordmark, grouped navigation sections, and public site link. | Client |
| `AppHeader` | `components/layout/app-header.tsx` | Restrained top application header containing workspace context, mobile nav trigger, and command center entry point. | Server |
| `MobileNavigation` | `components/layout/mobile-navigation.tsx` | Accessible slide-out sheet drawer for mobile and tablet navigation. | Client |
| `CommandCenterTrigger`| `components/layout/command-center-trigger.tsx` | Visual entry point button for the command center showing platform-aware `⌘K` or `Ctrl+K`. | Client |

---

## 3. UI Primitives (`components/ui/`)

Foundational UI primitives built on shadcn/ui and base-ui.

| Primitive | Path | Description |
| :--- | :--- | :--- |
| `Button` | `components/ui/button.tsx` | Button primitive with variant and size configurations. |
| `Separator` | `components/ui/separator.tsx` | 1px horizontal and vertical visual separators. |
| `Tooltip` | `components/ui/tooltip.tsx` | Accessible hover tooltips. |
| `Sheet` | `components/ui/sheet.tsx` | Accessible dialog slideout drawer. |
| `DropdownMenu` | `components/ui/dropdown-menu.tsx`| Accessible context menu and dropdown. |
