/**
 * Canonical application schema — ADR 0004 Q4.
 *
 * SCOPE: identity, tenancy and RBAC ONLY. This is the minimum foundation required to
 * validate the architecture. Product, inventory, sales and purchasing tables are
 * deliberately NOT created here; inventing them now would be speculative
 * (`AGENTS.md` §3) and they are not needed to prove tenant isolation works.
 *
 * TENANT-OWNED vs SYSTEM-LEVEL (ADR 0003 S22, ADR 0004 Q6):
 *   tenant-owned   -> organization_id NOT NULL  -> RLS applies
 *   system-level   -> no organization_id        -> RLS does NOT apply
 *
 *   users, organizations, organization_memberships, audit_logs   tenant-owned
 *   roles, permissions, role_permissions                          system-level
 *
 * `users` is platform-level IDENTITY (ADR 0004 Q6): it carries NO organization_id.
 * A user's organizations come from `organization_memberships`, and the active one is
 * session state.
 */

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/* System-level enums (not tenant-owned)                                        */
/* -------------------------------------------------------------------------- */

export const membershipStatusEnum = pgEnum("membership_status", [
  "active",
  "invited",
  "suspended",
]);

/* -------------------------------------------------------------------------- */
/* System-level: role and permission definitions (ADR 0004 Q6)                  */
/* These are platform-owned. No organization_id. RLS does not apply.            */
/* -------------------------------------------------------------------------- */

export const roles = pgTable(
  "roles",
  {
    id: text("id").primaryKey(),
    label: text("label").notNull(),
    /** Platform-level definition only. Assignment lives in organization_memberships. */
    description: text("description"),
    isSystem: boolean("is_system").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("roles_label_idx").on(t.label)],
);

export const permissions = pgTable(
  "permissions",
  {
    id: text("id").primaryKey(),
    /** e.g. "products.read" — granular strings from specification 32. */
    key: text("key").notNull(),
    description: text("description"),
  },
  (t) => [uniqueIndex("permissions_key_idx").on(t.key)],
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: text("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.roleId, t.permissionId] }),
    index("role_permissions_permission_idx").on(t.permissionId),
  ],
);

/* -------------------------------------------------------------------------- */
/* Tenant-owned: organizations                                                   */
/* -------------------------------------------------------------------------- */

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("organizations_slug_idx").on(t.slug),
    // Tenant-owned tables lead indexes with organization_id (ADR 0004 §Migration).
    index("organizations_id_created_idx").on(t.id, t.createdAt),
  ],
);

/* -------------------------------------------------------------------------- */
/* Tenant-owned: users — platform identity, NO organization_id (ADR 0004 Q6)    */
/* -------------------------------------------------------------------------- */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    displayName: text("display_name"),
    /**
     * Identity is platform-level. There is intentionally NO organization_id here.
     * A user may belong to many organizations via organization_memberships, and the
     * active organization is session state (ADR 0004 Q6).
     */
    status: text("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("users_email_idx").on(sql`lower(${t.email})`),
  ],
);

/* -------------------------------------------------------------------------- */
/* Tenant-owned: organization_memberships — the user<->organization relationship  */
/* -------------------------------------------------------------------------- */

export const organizationMemberships = pgTable(
  "organization_memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Organization-scoped role ASSIGNMENT (definitions are system-level). */
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id),
    status: membershipStatusEnum("status").notNull().default("invited"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("org_memberships_org_user_idx").on(t.organizationId, t.userId),
    index("org_memberships_user_idx").on(t.userId),
    // Leads with organization_id so RLS predicates can use it (ADR 0004 §Migration).
    index("org_memberships_org_role_idx").on(t.organizationId, t.roleId),
  ],
);

/* -------------------------------------------------------------------------- */
/* Tenant-owned: audit log — append-only (specification 33, 66)                  */
/* -------------------------------------------------------------------------- */

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    actorId: uuid("actor_id").references(() => users.id),
    actorType: text("actor_type").notNull(),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    correlationId: text("correlation_id").notNull(),
    /**
     * Structured, non-sensitive payload only. Secrets must never be written here
     * (ADR 0004 Q7). The column is documented to deter casual misuse.
     */
    metadata: text("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("audit_logs_org_created_idx").on(t.organizationId, t.createdAt),
    index("audit_logs_correlation_idx").on(t.correlationId),
  ],
);

/* -------------------------------------------------------------------------- */
/* Relations                                                                     */
/* -------------------------------------------------------------------------- */

export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(organizationMemberships),
  auditLogs: many(auditLogs),
}));

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(organizationMemberships),
}));

export const organizationMembershipsRelations = relations(
  organizationMemberships,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationMemberships.organizationId],
      references: [organizations.id],
    }),
    user: one(users, {
      fields: [organizationMemberships.userId],
      references: [users.id],
    }),
    role: one(roles, {
      fields: [organizationMemberships.roleId],
      references: [roles.id],
    }),
  }),
);

/**
 * Every table that RLS must protect.
 *
 * The migration generator and the structural migration test both read this list, so a
 * new tenant-owned table cannot be added without a corresponding policy (ADR 0003 K3
 * / ADR 0004 test P6).
 */
export const TENANT_OWNED_TABLES = [
  "organizations",
  "users",
  "organization_memberships",
  "audit_logs",
] as const;

export type TenantOwnedTable = (typeof TENANT_OWNED_TABLES)[number];

/** Tables that are system-level and must NOT receive an organization_id or RLS. */
export const SYSTEM_TABLES = ["roles", "permissions", "role_permissions"] as const;