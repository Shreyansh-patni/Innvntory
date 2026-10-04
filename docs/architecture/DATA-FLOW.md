# DATA FLOW

This document defines how data moves through the Innvntory system, specifically ensuring consistency across critical business workflows.

## 1. State Management Strategy
- **Server State:** Supabase / PostgreSQL. Use Next.js Server Components and Server Actions as the primary data fetching and mutation layer.
- **Client UI State:** React `useState`/`useReducer` for immediate interactive components (e.g., modals, form toggles).
- **URL State:** Use URL Search Params for filtering, sorting, and pagination, allowing deep linking and shareable views.
- **Global Client State (e.g., Zustand):** Conditional. Only introduce if prop-drilling becomes unmanageable or complex multi-step client workflows require it.

## 2. Caching & Data Fetching
- **Conservative Approach:** Prefer server-side fetching with Next.js App Router caching.
- **Invalidation:** Use explicit revalidation (`revalidatePath`, `revalidateTag`) after mutations.
- **Redis/External Cache:** Conditional. Do not introduce prematurely. Rely on database indexing and Next.js caching first.

## 3. Transaction Boundaries
Critical workflows that modify multiple business entities must execute within a transactional boundary to prevent partial state.
Examples requiring transactions:
- **Receiving Stock:** Updates Purchase Order status + increases Warehouse Stock + logs Stock Movement.
- **Selling Stock:** Creates Invoice + decreases Warehouse Stock + logs Stock Movement.
- **Transfers:** Decreases Source Stock + increases Destination Stock + logs Movement.

## 4. Idempotency
To prevent duplicate data from network retries or webhooks:
- **Webhooks:** Verify signatures and track processed event IDs.
- **Critical Mutations:** Use idempotency keys for payments, stock movements, and order creation.
