# INTEGRATION BOUNDARIES

External services and complex internal modules must be isolated behind clean interfaces inside the `lib/` directory. Do not scatter third-party SDK calls throughout application UI components.

## 1. Directory Structure (`lib/`)
- `lib/supabase/`: Wraps the Supabase client (auth, database, storage). Ensures RLS context is correctly passed.
- `lib/polar/`: Wraps the Polar SDK. Handles SaaS subscription data, product checkouts, and webhooks.
- `lib/api/`: Internal API utilities (error formatting, request validation).
- `lib/services/`: Domain-specific business logic that orchestrates multiple database calls (e.g., `lib/services/inventory.ts`).
- `lib/validations/`: Shared Zod schemas used by both frontend and backend.
- `lib/permissions/`: Role-based access control checkers.

## 2. Operational Payments vs. SaaS Billing
It is critical to distinguish between these two payment flows:

**A. SaaS Billing (Polar)**
- **What it is:** The Innvntory customer paying Sahaya Technologies for the use of the software.
- **Owner:** `lib/polar/`
- **Scope:** Subscription plans, seat limits, feature entitlements.

**B. Operational Payments (Stripe, Razorpay)**
- **What it is:** The Innvntory customer receiving payments from *their* end customers (e.g., paying an invoice).
- **Owner:** `lib/payments/` (Future)
- **Scope:** Invoice links, point-of-sale integrations.

Do not conflate the two.
