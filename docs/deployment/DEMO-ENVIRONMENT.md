# DEMO ENVIRONMENT

**Project:** Innvntory
**Company:** Sahaya Technologies Pvt. Ltd.
**Setup:** SETUP 11.4

---

## Purpose

Innvntory maintains a real, persistent **Demo Workspace** that any visitor can use to
explore the product without creating an account.

The Demo Workspace is:
- A real Supabase Auth user
- A dedicated, isolated `organizations` row with slug `innvntory-demo`
- A real `memberships` + `membership_roles` record (viewer role)
- Real seeded `categories` and `products` data

It is **NOT**:
- A fake/mocked authentication flow
- A frontend-only bypass
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

## Demo Workspace

| Property        | Value                        |
|-----------------|------------------------------|
| Organization    | Innvntory Demo Workspace     |
| Slug            | `innvntory-demo`             |
| Role            | `viewer` (read-only)         |
| Catalog         | 5 categories, 35 products    |
| Billing access  | None                         |
| Admin access    | None                         |

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

## Provisioning Command

```bash
npm run demo:provision
```

This runs `scripts/provision-demo-account.mjs`. It:
1. Loads credentials from `.env.local`
2. Creates/verifies the demo Supabase Auth user
3. Creates/verifies the Demo Workspace organization (`innvntory-demo`)
4. Creates/verifies the membership
5. Assigns the `viewer` role
6. Creates demo categories (idempotent upsert)
7. Creates demo products (idempotent upsert)
8. Prints a summary (never prints the password)

**When to run:**
- When provisioning a fresh Supabase project
- When demo data has been corrupted or deleted
- Never during `npm install`, `npm build`, or Vercel deployments

**Required env:**
```env
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_DEMO_EMAIL=demo@innvntory.sahaya.tech
NEXT_PUBLIC_DEMO_PASSWORD=...
```

---

## Real DB Demo Data vs Dashboard Fixture Data

Innvntory Demo uses two distinct types of demo data:

### Real Demo Database Records (Supabase)

These records exist in Supabase and are served via authenticated RLS queries:

- `auth.users` — the demo auth user
- `organizations` — Demo Workspace row
- `memberships` — demo user ↔ Demo Workspace link
- `membership_roles` — viewer role assignment
- `categories` — 5 demo categories (Apparel, Footwear, etc.)
- `products` — 35 realistic demo products

These records are **real database data**. They appear in `/app/products`,
`/app/categories`, etc. just like any real workspace would.

### Dashboard Fixture Data (In-memory)

These values are defined in `lib/demo/dashboard-data.ts` and returned by
`getDashboardData(orgSlug)`. They represent **not-yet-implemented domains**:

- Monthly Revenue (Sales domain — not yet built)
- Stock Valuation (Inventory domain — not yet built)
- Open Orders (Sales domain — not yet built)
- Low Stock Alerts (Inventory domain — not yet built)
- Recent Activity feed (multi-domain — not yet built)

**These values never go through Supabase.** They are in-memory fixtures for
demonstration only. They are clearly labelled in the UI with the "Demo Workspace"
amber badge.

---

## Demo Data Activation

Dashboard fixture data activates when either:

1. `NEXT_PUBLIC_DEMO_MODE=true` (env-wide, affects all users), or
2. The authenticated user's organization slug is `innvntory-demo`

Condition (2) is the primary production path — the real demo account uses it
automatically without needing `DEMO_MODE=true`.

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
