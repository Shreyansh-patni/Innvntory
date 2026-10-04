# ARCHITECTURE

## Direction
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **UI Libraries:** shadcn/ui (Primary). Watermelon UI, Aceternity UI, Magic UI, Motion Primitives, HeroUI used ONLY when explicitly justified.
- **Backend / Platform:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Billing:** Polar

## Next.js Architecture & Boundaries
- **App Router:** The application uses Next.js App Router exclusively.
- **Default:** Server Components.
- **Client Components:** Use only when needed for interaction, local client state, browser APIs, or client-only behavior. Avoid making the entire application client-rendered.
- **Data vs Rendering:** Keep content structured and separated from view logic (`content/`).
- **Server-Side Data Access:** Database access, auth checks, and external API calls must happen on the server.
- **Loading & Errors:** Utilize `loading.tsx`, `error.tsx`, and `not-found.tsx` for predictable boundaries.

## Project Structure
- `app/`: Next.js routing and pages.
- `components/ui/`: Reusable primitives (shadcn).
- `components/<feature>/`: Feature specific composition.
- `lib/<service>/`: Integration logic and service boundaries (e.g., Supabase, Polar).
- `public/`: Static assets for the application.

## Core Rules
- **Simplicity:** Complexity belongs in architecture, simplicity in the interface.
- **Multi-tenant:** Organization-level isolation from day one via Supabase RLS. Every tenant-owned record should have an organization boundary.
- **Security by Design:** Validate everything, never trust the client. Runtime validation via Zod at all boundaries.
- **Cloud & API First.**
- **Data First & Automation First.**
- **Production Quality & Mobile-Friendly.**

## Data & Tenancy Principles
- Multi-tenant from day one.
- Tenant isolation enforced via RLS and DB constraints.
- Full referential integrity and transaction usage.
- Consistent inventory state is paramount. Inventory operations should be atomic; no partial inventory state.
- Safe migrations and auditability.

## API Principles
- **Convention:** `/api/v1/...`
- **Behaviors:** Authentication, authorization, validation, pagination, filtering, sorting, search, rate limiting, idempotency, structured errors, request IDs.
- External services must sit behind service/lib boundaries.

## External Integrations (Future/Post-MVP)
- **Payments:** Razorpay, Stripe (Operational payments, NOT SaaS billing).
- **Accounting:** Tally, Zoho Books, QuickBooks.
- **Communication:** WhatsApp, Email, SMS.
- **Commerce:** Shopify, WooCommerce, Amazon.
- **Tax:** GST, E-Invoice, E-Way Bill.
*(Note: Do not implement these integrations now).*

## State Model
Where applicable, every important feature should consider:
Default, Loading, Success, Empty, Error, Disabled, Offline/unavailable, Permission denied.
Distinguish between UI state, server state, persisted state, and integration state. (Do not implement yet).
