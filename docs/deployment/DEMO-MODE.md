# INNVNTORY DASHBOARD DEMO MODE SPECIFICATION

**Project:** Innvntory  
**Company:** Sahaya Technologies Pvt. Ltd.  
**Status:** IMPLEMENTED (SETUP 11.3)  
**Configuration Flag:** `NEXT_PUBLIC_DEMO_MODE` (`true` | `false`)  

---

## 1. Overview & Purpose

The **Dashboard Demo Mode** provides a realistic, high-fidelity operational view of the Innvntory Operations Dashboard (`/app/dashboard`) for stakeholder demos, product walkthroughs, and visual QA without requiring manual database seeding or polluting the production Supabase database with mock transactions.

```
                  ┌───────────────────────────────┐
                  │   /app/dashboard (Page)       │
                  └───────────────┬───────────────┘
                                  │
                 Is NEXT_PUBLIC_DEMO_MODE === 'true'?
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
      [Demo Mode = true]                 [Demo Mode = false]
  Loads local typed fixtures           Truthful initial states /
  (lib/demo/dashboard-data.ts)         Awaiting real database data
  Shows "Demo Workspace" badge         Shows "V0 Foundation" badge
  ZERO database records inserted       Strict empty states rendered
```

---

## 2. Environment Configuration Matrix

| Environment | Recommended Setting | Rationale |
| :--- | :--- | :--- |
| **Vercel Preview** | `NEXT_PUBLIC_DEMO_MODE=true` | Provides stakeholders and PR reviewers with an immediate operational dashboard experience. |
| **Vercel Production** | `NEXT_PUBLIC_DEMO_MODE=false` | Ensures production users see truthful operational states until real transactions occur. |
| **Local Development** | Developer Controlled (`false` default) | Configured in `.env.local` as needed for testing or development. |

---

## 3. Data Integrity & Security Guarantees

1. **Zero Database Pollution:** Demo data is purely local in-memory TypeScript fixtures ([`lib/demo/dashboard-data.ts`](../../lib/demo/dashboard-data.ts)). No rows are inserted into `products`, `stock_movements`, `purchase_orders`, or `audit_logs`.
2. **Authentication Boundary Preserved:** `/app/dashboard` remains strictly behind Next.js authentication middleware/proxy. Unauthenticated requests are redirected to `/login?next=%2Fapp%2Fdashboard`.
3. **No Dynamic Fallback:** The application never falls back to demo data upon database errors. Demo mode is enabled only when explicitly set via environment variable.
4. **Visual Indicator:** The dashboard displays an amber **"Demo Workspace"** badge and indicator whenever demo mode is active.

---

## 4. Fixture Schema Summary

The demo dataset simulates an Indian inventory-driven business with:
- **Stock Valuation:** ₹24,75,300 (FIFO / Weighted-Average model)
- **Monthly Revenue:** ₹8,42,650
- **Open Orders:** 28 active orders
- **Low Stock Alerts:** 7 items below safety buffer
- **Recent Activity Ledger:** 5 simulated operational events (Goods Receipt, Inter-Facility Transfer, Sales Allocation, Cycle Count Adjustment, GST Invoice Payment)
- **Reorder Queue:** 5 critical SKUs with current stock vs safety buffer thresholds
