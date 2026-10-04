# DOMAIN MODEL

This document defines the major business domains for Innvntory. These represent logical boundaries of responsibility.

## 1. Identity & Access
- **Responsibilities:** Authentication, user management, organization (tenant) membership, role-based access control (RBAC).
- **Entities:** Organizations, Users, Roles, Permissions.
- **Dependencies:** None.

## 2. Catalog
- **Responsibilities:** Definition of what can be bought or sold.
- **Entities:** Products, Variants, Categories, Brands, Units of Measure.
- **Dependencies:** Identity (tenant isolation).

## 3. Inventory
- **Responsibilities:** Tracking physical quantities and locations of products.
- **Entities:** Stock Levels, Warehouses, Transfers, Adjustments, Movements.
- **Dependencies:** Catalog (Products), Identity.
- **Rules:** Inventory mutations must be atomic and strictly audited. No partial state changes.

## 4. Purchasing
- **Responsibilities:** Acquiring inventory from external entities.
- **Entities:** Suppliers, Purchase Orders, Receipts, Purchase Returns, Purchase Payments.
- **Dependencies:** Catalog, Inventory, Identity.

## 5. Sales
- **Responsibilities:** Selling inventory to external entities.
- **Entities:** Customers, Orders, Invoices, Sales Returns, Sales Payments.
- **Dependencies:** Catalog, Inventory, Identity.

## 6. Reporting & Analytics (Business)
- **Responsibilities:** Aggregating data across domains to provide business insights.
- **Entities:** Sales Reports, Purchase Reports, Inventory Reports, Financial Reports.
- **Dependencies:** Sales, Purchasing, Inventory, Catalog.

## 7. Platform
- **Responsibilities:** Cross-cutting product capabilities.
- **Entities:** Notifications, Audit Logs, Import/Export, Search, Onboarding, Product Analytics.
- **Dependencies:** Identity (and generic access to other domains for audit/search).

## 8. Commercial (SaaS Billing)
- **Responsibilities:** Managing the customer's subscription to the Innvntory software.
- **Entities:** Plans, Subscriptions, Entitlements, Billing (via Polar).
- **Dependencies:** Identity.

## 9. Intelligence (Future)
- **Responsibilities:** Advanced forecasting, automation, and AI.
- **Entities:** Analytics, AI Models, Forecasting, Automations.
- **Dependencies:** All business domains.
