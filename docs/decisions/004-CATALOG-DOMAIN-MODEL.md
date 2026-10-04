# ADR 004: Products & Categories Catalog Domain Architecture

## Status
Accepted (SETUP 11)

## Context
Innvntory requires a master catalog for products, units of measure, and GST categories. Products must support stable identity, organization-scoped unique SKUs, barcode lookup, category relationships with HSN/SAC codes, exact decimal monetary calculations (`numeric(15,2)`), and lifecycle status (`active`, `inactive`, `archived`) without introducing premature inventory stock quantities or warehouse allocations.

## Decisions
1. **Tenant Ownership:** `products` and `categories` tables strictly enforce `organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE` with PostgreSQL Row Level Security (RLS).
2. **SKU & Barcode Uniqueness:** Uniqueness is scoped per tenant: `CONSTRAINT unique_org_product_sku UNIQUE (organization_id, sku)` and `CONSTRAINT unique_org_product_barcode UNIQUE (organization_id, barcode)`. SKU is a business identifier, not the primary key.
3. **Monetary Precision:** Cost and selling prices use PostgreSQL `numeric(15, 2)` to eliminate floating-point rounding inaccuracies.
4. **Referential Integrity on Deletion:** `category_id` in `products` uses `ON DELETE RESTRICT` to prevent accidental orphaned products. Products use soft-lifecycle semantics (`archived`) rather than physical deletion to preserve future transaction history.
5. **Standard System Units:** Initialized global system units (`PCS`, `BOX`, `KG`, `G`, `LTR`, `MTR`, `PAC`, `SET`, `UNT`) with support for tenant-custom units if needed.
6. **Variants Deferred:** Product variants (matrices/combinatorics) are intentionally deferred for MVP clarity.
7. **Audit Logging:** All product and category create, update, and archive events write to `public.audit_logs`.

## Consequences
- Clean separation between catalog definition and operational stock balances.
- Full compatibility with future purchasing, sales, and multi-warehouse stock allocations.
