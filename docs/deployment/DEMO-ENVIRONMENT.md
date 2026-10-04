# DEMO ENVIRONMENT

**Project:** Innvntory
**Company:** Sahaya Technologies Pvt. Ltd.
**Setup:** SETUP 11.6 (COMPLETE BUSINESS DATASET FOUNDATION)
**Last Updated:** October 2026

---

## Purpose

Innvntory maintains a real, persistent **Demo Workspace** that any visitor can use to
explore the product without creating an account.

The Demo Workspace is:
- A real Supabase Auth user
- A dedicated, isolated `organizations` row with slug `innvntory-demo` (`85ac679b-a96b-4218-9b97-c2d4f1f5bc51`)
- A real `memberships` + `membership_roles` record (viewer role)
- Complete, interconnected operational records across Business, Inventory, Sales, Purchases, and Reports domains.

It is **NOT**:
- A fake/mocked authentication flow
- A frontend-only bypass
- A set of hardcoded dashboard/report figures
- A shared tenancy with any real customer organization

---

## Public Demo Credentials Policy

The demo credentials are **intentionally public**. They are displayed on the
`/login` page for anyone to use.

This is safe because:
- The demo account belongs **only** to the isolated Demo Workspace organization
- PostgreSQL RLS enforces tenant isolation — the account cannot read other orgs
- The account has the `viewer` system role (read-only)
- No real customer, billing, or business-sensitive data exists in this workspace
- No service-role or admin key is exposed

**The credentials are not secrets.** They should be treated as public credentials
for a disposable sandbox, not as protected authentication material.

---

## Demo Workspace Baseline

| Property             | Canonical Value              |
|----------------------|------------------------------|
| Organization         | Innvntory Demo Workspace     |
| Slug                 | `innvntory-demo`             |
| Role                 | `viewer` (read-only)         |
| Warehouses           | 3 warehouses                 |
| Categories           | 8 categories                 |
| Products             | 50 products                  |
| Stock Balances       | 150 stock records            |
| Customers            | 20 B2B/B2C customers         |
| Suppliers            | 10 verified vendors          |
| Sales Orders         | 50 orders (149 line items)   |
| Invoices             | 50 invoices                  |
| Sales Payments       | 44 payment records           |
| Sales Returns        | 5 return records             |
| Purchase Orders      | 25 orders (74 line items)    |
| Purchase Receipts    | 23 receipt records           |
| Purchase Payments    | 20 payment records           |
| Purchase Returns     | 4 return records             |
| Inventory Transfers  | 10 warehouse transfers       |
| Inventory Adjustments| 12 adjustment records        |
| Inventory Movements  | 242 movement ledger entries  |
| Billing access       | None                         |
| Admin access         | None                         |

---

## Environment Variables

### Public (intentionally displayable)

```env
NEXT_PUBLIC_DEMO_EMAIL=demo@innvntory.sahaya.tech
NEXT_PUBLIC_DEMO_PASSWORD=<set this in Vercel environment settings>
NEXT_PUBLIC_DEMO_MODE=false   # controls env-wide fixture mode; normally false
```

Set `NEXT_PUBLIC_DEMO_EMAIL` and `NEXT_PUBLIC_DEMO_PASSWORD` in your Vercel
project's environment configuration for both Preview and Production environments.

These values are displayed on `/login`. They are NOT secrets.

### Server-only (never expose to browser)

```env
SUPABASE_SERVICE_ROLE_KEY=...   # used by provisioning script only
```

---

## Provisioning & Reset Commands

### 1. Initial Provisioning
```bash
npm run demo:provision
```
Runs `scripts/provision-demo-account.mjs` to idempotently ensure the demo user, workspace, viewer role, and the complete 17-table canonical business dataset are seeded.

### 2. Manual Baseline Reset
```bash
npm run demo:reset
```
Runs `scripts/reset-demo-workspace.mjs` to restore the demo workspace to canonical baseline, pruning any visitor-created transient records across all 17 operational tables while preserving the demo auth identity and organization.

---

## Automated 2-Hour Reset Architecture

Innvntory implements an automated **2-hour server-side reset** to keep the public demo sandbox clean, deterministic, and operational:

### 1. Scheduler (`vercel.json`)
Vercel Cron triggers the reset job on the 2-hour cadence:
```json
{
  "crons": [
    {
      "path": "/api/cron/demo-reset",
      "schedule": "0 */2 * * *"
    }
  ]
}
```

### 2. Protected Endpoint (`/api/cron/demo-reset`)
- **Route Handler:** `app/api/cron/demo-reset/route.ts`
- **Security:** Requires `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret: <CRON_SECRET>`. In production, requests without a valid secret are rejected with `401 Unauthorized`.
- **Scope Restriction:** Scoped strictly to `innvntory-demo`. Never resets or touches any non-demo organization.
- **Fail-Safe:** Validates organization identity before performing any mutations.
- **Audit:** Logs safe operational telemetry (restored counts, pruned counts, duration) without exposing secrets.

### 3. Reset Engine (`lib/demo/reset.ts` & `lib/demo/reset-engine.mjs`)
- **Deterministic Baseline:** 8 categories, 50 products, 3 warehouses, 150 stock balances, 20 customers, 10 suppliers, 25 purchase orders, 74 PO line items, 23 purchase receipts, 20 purchase payments, 4 purchase returns, 50 sales orders, 149 SO line items, 50 invoices, 44 sales payments, 5 sales returns, 10 transfers, 12 adjustments, and 242 ledger movements.
- **Controlled Deletion Order:** Deletes in reverse foreign key order (payments, returns, receipts/invoices, order items, orders, movements, adjustments, transfers, stock balances, customers, suppliers, products, categories, warehouses) scoped strictly by `organization_id`.
- **Full Restoration:** Re-inserts the pristine canonical rows with preserved UUIDs and relational integrity.
- **Identity Preservation:** Leaves `auth.users`, `organizations`, `memberships`, and `membership_roles` intact so demo sessions remain stable.

---

## Real DB Demo Data Architecture

All authenticated pages in the demo workspace are powered directly by live Supabase PostgreSQL queries:

- **Dashboard:** Queries `sales_orders`, `stock_balances`, `inventory_movements`, and `purchase_orders` to calculate real revenue, stock valuation, low-stock alerts, and activity feed in real time.
- **Business:** `products`, `categories`, `customers`, `suppliers`
- **Inventory:** `stock_balances`, `warehouses`, `inventory_transfers`, `inventory_adjustments`, `inventory_movements`
- **Sales:** `sales_orders`, `invoices`, `sales_payments`, `sales_returns`
- **Purchases:** `purchase_orders`, `purchase_receipts`, `purchase_payments`, `purchase_returns`
- **Reports:** Aggregate sales, purchase, inventory, and financial summaries computed dynamically from transaction tables.

**Zero hardcoded fake figures exist on individual pages.** All dashboard KPIs and report analytics reconcile with the underlying database tables.

---

## Login Page UX

The `/login` page renders a **Demo Workspace panel** when `NEXT_PUBLIC_DEMO_EMAIL`
and `NEXT_PUBLIC_DEMO_PASSWORD` are configured. It shows:

- The demo email (selectable text)
- The demo password (selectable text)
- A "Use Demo Account" button that populates the form and submits it
- A note about the isolated, read-only nature of the account

The "Use Demo Account" button uses the same real Supabase Auth `signInWithPassword`
flow as any other login. No bypassing, no fake tokens.

---

## Demo Workspace Indicator

When a user is authenticated in the Demo Workspace, the application header shows:

- The org name `Innvntory Demo Workspace` with an amber `⚗ Demo` badge
- The dashboard shows the `⚗ Demo Workspace` badge next to the page title

The demo password is never shown in the authenticated application.

---

## First-Time Onboarding Behavior (SETUP 11.8)

- **Normal Accounts:** Undergoes a 4-step business profile and warehouse setup wizard at `/app/onboarding`. Progress and completion state are saved server-side to PostgreSQL `public.user_preferences`.
- **Demo Workspace:** Displays a dedicated 3-step interactive tour explaining the pre-populated catalog and operational ledger.
- **Browser-Scoped Isolation:** Demo completion is stored in the visitor's local browser (`innvntory_demo_onboarding_completed` cookie and `localStorage`). It **never modifies the shared demo user record in PostgreSQL**, ensuring other concurrent or future demo visitors receive their initial walkthrough cleanly.

---

## Security Review

| Item                                  | Status                         |
|---------------------------------------|--------------------------------|
| Demo creds are public by design       | ✓ Intentional                  |
| Demo creds only access demo org       | ✓ RLS enforced at DB level     |
| Service role key is never public      | ✓ Server-only / provisioning   |
| No admin API calls from browser       | ✓ LoginForm uses client auth   |
| Demo user has viewer role only        | ✓ Read-only, no admin access   |
| Supabase Auth rate limiting active    | ✓ Not disabled                 |
| Demo org isolated from other orgs     | ✓ `organization_id` FK + RLS   |
| Provisioning script is manual-only    | ✓ Never runs automatically     |

---

## Credential Rotation

If the demo password needs to be changed:

1. Update `NEXT_PUBLIC_DEMO_PASSWORD` in Vercel environment settings
2. Run `npm run demo:provision` locally with the new password set in `.env.local`
3. The provisioning script will update the Supabase Auth user password via admin API

Do not use the Supabase dashboard password reset email for this.

---

## Recovery & Re-provisioning

If demo data is corrupted or accidentally deleted, run:

```bash
npm run demo:provision
```

The script is fully idempotent and will restore any missing records:
- Auth user (creates if absent)
- Organization (creates if absent)
- Membership (creates if absent)
- Role assignment (creates if absent)
- Categories (creates missing ones)
- Products (creates missing ones)

---

## Production / Preview Considerations

If Preview and Production use the **same Supabase project**:
- One provisioning run covers both environments
- Configure `NEXT_PUBLIC_DEMO_EMAIL` and `NEXT_PUBLIC_DEMO_PASSWORD` in both
  Preview and Production environment groups in Vercel

If they use **separate Supabase projects**:
- Run `npm run demo:provision` for each project separately
- Use the appropriate `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` each time

### Vercel Preview Deployment Protection Notice
- By default, Vercel enables **Deployment Protection** (Vercel Authentication) on preview URLs (`*.vercel.app`), issuing a `302 Found` redirect to Vercel SSO (`vercel.com/sso-api`).
- For public access to the preview demo workspace without a Vercel account, configure **Deployment Protection: Disabled or Password Protected** under *Vercel Project Settings → Deployment Protection*.
- For authenticated team members, signing in to Vercel SSO allows immediate access to `/login` and the "Use Demo Account" flow.
