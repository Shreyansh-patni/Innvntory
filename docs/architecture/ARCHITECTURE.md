# ARCHITECTURE

## Direction
- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4
- **UI Libraries:** shadcn/ui (Primary).
- **Backend / Platform:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Billing:** Polar

## Next.js Architecture & Route Groups
- **App Router Structure:**
  - `app/(marketing)/...`: Public website owning `/`, `/features`, `/pricing`, `/docs`, `/articles`, `/about`, `/contact`, `/login`, `/signup`, `/privacy`, `/terms`, `/cookie-policy`, `/disclaimer`.
  - `app/(application)/app/...`: Authenticated operational SaaS owning `/app/dashboard`, `/app/products`, `/app/inventory/*`, etc.
  - `app/layout.tsx`: Root shell defining HTML, typography fonts (`NewBlack` and `LT-amber`), and global CSS.
- **Default:** Server Components.
- **Client Components:** Used strictly where required for interactive state (e.g. mobile drawer sheet, accordion toggle, platform detection).
- **Data vs Rendering:** Reusable structured static content in `content/` (e.g. `content/marketing/`, `content/navigation.ts`).
- **Loading & Errors:** Handled via `loading.tsx`, `error.tsx`, and `not-found.tsx`.

## Project Structure
- `app/(marketing)/`: Marketing routes with dedicated `MarketingHeader` and `MarketingFooter`.
- `app/(application)/app/`: Application routes wrapped with `AppShell`, `AppSidebar`, and `AppHeader`.
- `components/marketing/`: High-level marketing composition components.
- `components/layout/`: Application shell and navigation layout primitives.
- `components/ui/`: Reusable primitives (shadcn/ui & base-ui).
- `content/marketing/`: Structured copy and data for marketing pages.
- `lib/`: Utilities, font registration (`lib/fonts.ts`), and future integration modules.
- `public/`: Static font files and assets.

## Core Rules
- **Simplicity:** Complexity belongs in architecture, simplicity in the interface.
- **Multi-tenant:** Organization-level isolation from day one via Supabase RLS.
- **Security by Design:** Validate everything, never trust the client. Runtime validation via Zod at boundaries.
- **Data Integrity:** Consistent inventory state is paramount. Atomic operations; zero partial inventory state.
- **API Convention:** `/api/v1/...` for developer endpoints.
