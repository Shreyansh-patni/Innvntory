# SERVER / CLIENT BOUNDARIES

Innvntory follows a strictly **Server by Default** architecture using Next.js App Router and React Server Components.

## 1. Server-Side Responsibilities (The Default)
All code should run on the server unless it strictly requires browser APIs or interactivity.
- **Secure Data Access:** Database queries and mutations.
- **Authentication & Authorization:** Enforcing RBAC and checking organization context.
- **Sensitive Business Logic:** Inventory calculations, payment validations.
- **Secrets:** API keys, database credentials, webhook secrets.
- **Service Integrations:** Calling external APIs (Supabase, Polar, payment gateways).
- **Webhook Handling:** Processing external events asynchronously.

## 2. Client-Side Responsibilities (The Exception)
Client Components (`'use client'`) should be pushed as far down the component tree as possible.
- **Interactive Controls:** Buttons that require complex local state, dropdowns, modals, and complex forms.
- **Browser APIs:** Usage of `window`, `localStorage`, `geolocation`, etc.
- **Local UI State:** `useState`, `useReducer`, or context providers for UI themes.
- **Optimistic UI:** Immediate UI updates before server confirmation (where safe).

## 3. Security Rule
- **Never expose secrets to the browser.** Do not prefix sensitive environment variables with `NEXT_PUBLIC_`.
- All client-to-server data must be treated as untrusted and validated (e.g., using Zod) at the server boundary (Server Actions or Route Handlers).
