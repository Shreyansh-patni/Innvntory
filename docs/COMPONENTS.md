# INNVNTORY COMPONENT REGISTRY

**Status:** EXPANDED WITH CATALOG COMPONENTS (SETUP 11)
**Last Updated:** October 2026

---

## 1. Marketing Components (`components/marketing/`)

Reusable components engineered specifically for the public marketing website (`/`, `/features`, `/pricing`, `/docs`, `/articles`, `/about`, `/contact`, `/privacy`, `/terms`).

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

## 2. Authentication Components (`components/auth/`)

Interactive authentication forms implementing client-side validation, server actions, password visibility toggles, and safe normalized error reporting.

| Component | Path | Description | Client/Server |
| :--- | :--- | :--- | :--- |
| `LoginForm` | `components/auth/login-form.tsx` | Work email and password form submitting to `loginAction` with error alert handling and one-click "Use Demo Account" flow. | Client |
| `SignupForm` | `components/auth/signup-form.tsx` | Workspace registration form (Full Name, Work Email, Organization Name, Password) with `signupAction`. | Client |
| `ForgotPasswordForm`| `components/auth/forgot-password-form.tsx` | Password reset request form with non-leaking dispatched notice. | Client |
| `ResetPasswordForm` | `components/auth/reset-password-form.tsx` | New password setup form verifying password confirmation match and minimum length. | Client |

---

## 3. Catalog & Products Components (`components/catalog/`)

Data-dense product and category management components connecting to Server Actions with audit logging.

| Component | Path | Description | Client/Server |
| :--- | :--- | :--- | :--- |
| `ProductTable` | `components/catalog/product-table.tsx` | Paginated, searchable, filterable master product table with prices, status pills, and empty states. | Client |
| `ProductForm` | `components/catalog/product-form.tsx` | Product creation and edit form with SKU, barcode, category selector, UOM, and price inputs. | Client |
| `CategoryManager` | `components/catalog/category-manager.tsx` | Category table with HSN codes, default GST rates, and inline create/edit drawer form. | Client |

---

## 4. Authenticated Application Shell (`components/layout/`)

Layout and navigation components providing the persistent operational application shell for `/app/*`.

| Component | Path | Description | Client/Server |
| :--- | :--- | :--- | :--- |
| `AppShell` | `components/layout/app-shell.tsx` | Top-level layout container composing sidebar, header, and scrollable content area with max-width container. | Server |
| `AppSidebar` | `components/layout/app-sidebar.tsx` | Persistent desktop left navigation with active route highlights, section groups, and public site return link. | Client |
| `AppHeader` | `components/layout/app-header.tsx` | Operational top header with organization context, Demo Workspace indicator badge, notifications, and profile menu. | Server |
| `UserAccountMenu` | `components/layout/user-account-menu.tsx` | Account dropdown displaying authenticated user initials/email and sign out action. | Client |
| `MobileNavigation` | `components/layout/mobile-navigation.tsx` | Accessible slide-out sheet drawer for mobile and tablet navigation with active route indicators. | Client |
| `CommandCenterTrigger`| `components/layout/command-center-trigger.tsx` | Visual entry point button for the command center showing platform-aware `⌘K` or `Ctrl+K`. | Client |

---

## 5. Shared Application Primitives (`components/shared/`)

High-density, reusable operational UI primitives designed for data-dense business workflows across all `/app/*` modules.

| Component | Path | Description | Client/Server |
| :--- | :--- | :--- | :--- |
| `PageHeader` | `components/shared/page-header.tsx` | Standardized page title, description, operational status badge, breadcrumb trail, and contextual action buttons. | Server |
| `MetricCard` | `components/shared/metric-card.tsx` | High-density operational KPI card supporting status pills, trend indicators, neutral unavailable states, and footer metadata. | Server |
| `EmptyState` | `components/shared/empty-state.tsx` | Standardized truthful empty state container with icon, title, description, and optional primary CTA. | Server |
| `StatusBadge` | `components/shared/status-badge.tsx` | Operational status indicator pill with semantic variants (success, warning, error, info, neutral, outline). | Server |
| `PageToolbar` | `components/shared/page-toolbar.tsx` | Standardized table/module search bar with multi-category filter dropdowns, sort buttons, and secondary actions. | Client |
| `DataPlaceholderTable`| `components/shared/data-placeholder-table.tsx` | High-density table scaffolding with column headers, alignment support, and integrated truthful empty state. | Server |
| `DashboardDemoData` | `lib/demo/dashboard-data.ts` | Typed in-memory fixture dataset providing simulated operational metrics, live activity stream, and reorder queue when `NEXT_PUBLIC_DEMO_MODE=true`. | Server / Shared |

---

## 6. UI Primitives (`components/ui/`)

Foundational UI primitives built on Radix UI / shadcn/ui.

| Primitive | Path | Description |
| :--- | :--- | :--- |
| `Button` | `components/ui/button.tsx` | Button primitive with variant and size configurations. |
| `Separator` | `components/ui/separator.tsx` | 1px horizontal and vertical visual separators. |
| `Tooltip` | `components/ui/tooltip.tsx` | Accessible hover tooltips. |
| `Sheet` | `components/ui/sheet.tsx` | Accessible dialog slideout drawer. |
| `DropdownMenu` | `components/ui/dropdown-menu.tsx`| Accessible context menu and dropdown. |
