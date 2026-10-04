# CODE STYLE & ORGANIZATION

## 1. Core Principles
- **Clarity over cleverness:** Code is read more often than written.
- **Strong Typing:** Use TypeScript strictly. No `any` types.
- **Validation:** Validate all external/untrusted data boundaries with Zod.
- **Modular Domains:** Keep domain-specific logic co-located. Don't create giant catch-all files.

## 2. Directory Structure
- `app/`: Next.js App Router (pages, layouts, route handlers).
- `components/ui/`: Reusable, generic UI primitives (shadcn).
- `components/<domain>/`: Feature-specific UI compositions (e.g., `components/inventory/StockTable.tsx`).
- `content/`: Static, typed content and configuration strings.
- `lib/`: Services, utilities, integration wrappers (Supabase, Polar), and shared validations.
- `tests/`: Automated test suites.
- `docs/`: Project knowledge base.

## 3. Formatting & Linting
- **Prettier:** Used for all code formatting.
- **ESLint:** Used for catching programmatic errors and enforcing Next.js/React best practices.
- **Tailwind:** Classnames should be sorted (e.g., via `prettier-plugin-tailwindcss`).
