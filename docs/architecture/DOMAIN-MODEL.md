# DOMAIN MODEL

This document defines the major business domains for Innvntory. These represent logical boundaries of responsibility.

## 1. Identity & Access (FOUNDATION IMPLEMENTED - SETUP 09 & 10)
- **Responsibilities:** Authentication, user management, organization (tenant) membership, role-based access control (RBAC).
- **Entities:** Organizations, Users (`auth.users`), Memberships, Roles, Permissions, RolePermissions, MembershipRoles.
- **Implementation Status:** Schema, indexes, security functions, RLS policies, and SSR session handlers implemented.
- **Dependencies:** Supabase Auth (`auth.users`).

## 2. Catalog (IMPLEMENTED - SETUP 11)
- **Responsibilities:** Definition of what can be bought or sold.
- **Entities:** Products, Categories, Units of Measure.
- **Implementation Status:** Real database schema, unique SKU/barcode constraints, Zod validation, Server Actions, pagination/filtering, and frontend CRUD implemented.
- **Dependencies:** Identity (tenant isolation).

## 3. Inventory (PLANNED)
- **Responsibilities:** Tracking physical quantities and locations of products.
- **Entities:** Stock Levels, Warehouses, Transfers, Adjustments, Movements.
- **Dependencies:** Catalog (Products), Identity.
- **Rules:** Inventory mutations must be atomic and strictly audited. No partial state changes.

## 4. Purchasing (PLANNED)
- **Responsibilities:** Acquiring inventory from external entities.
- **Entities:** Suppliers, Purchase Orders, Receipts, Purchase Returns, Purchase Payments.
- **Dependencies:** Catalog, Inventory, Identity.

## 5. Sales (PLANNED)
- **Responsibilities:** Selling inventory to external entities.
- **Entities:** Customers, Orders, Invoices, Sales Returns, Sales Payments.
- **Dependencies:** Catalog, Inventory, Identity.

## 6. Reporting & Analytics (Business) (PLANNED)
- **Responsibilities:** Aggregating data across domains to provide business insights.
- **Entities:** Sales Reports, Purchase Reports, Inventory Reports, Financial Reports.
- **Dependencies:** Sales, Purchasing, Inventory, Catalog.

## 7. Platform (AUDIT LOG FOUNDATION IMPLEMENTED - SETUP 09)
- **Responsibilities:** Cross-cutting product capabilities.
- **Entities:** Audit Logs (implemented), Notifications, Import/Export, Search, Onboarding.
- **Dependencies:** Identity.

## 8. Commercial (SaaS Billing) (PLANNED)
- **Responsibilities:** Managing the customer's subscription to the Innvntory software.
- **Entities:** Plans, Subscriptions, Entitlements, Billing (via Polar).
- **Dependencies:** Identity.

## 9. Intelligence (Future) (PLANNED)
- **Responsibilities:** Advanced forecasting, automation, and AI.
- **Entities:** Analytics, AI Models, Forecasting, Automations.
- **Dependencies:** All business domains.
