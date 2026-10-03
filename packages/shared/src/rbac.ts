/**
 * Platform-owned RBAC catalogue (ADR 0004 Q6 / ADR 0003 Q3).
 *
 * Role and permission DEFINITIONS are platform-level. Assignment of a user to a role
 * is organization-scoped, carried by `organization_memberships`. No per-tenant custom
 * role model is introduced.
 */

import type { Permission } from "./tenant/types.js";

export interface RoleDefinition {
  readonly id: string;
  readonly label: string;
  readonly permissions: readonly Permission[];
}

/**
 * The eight default roles named in specification §32.
 *
 * This is a catalogue of definitions, not an assignment. Which roles a given user
 * holds in a given organization comes from their membership record.
 */
export const ROLES = {
  owner: {
    id: "owner",
    label: "Owner",
    permissions: [
      "products.read",
      "products.create",
      "products.update",
      "products.delete",
      "inventory.read",
      "inventory.adjust",
      "inventory.transfer",
      "sales.read",
      "sales.create",
      "sales.cancel",
      "purchases.read",
      "purchases.create",
      "purchases.approve",
    ],
  },
  admin: {
    id: "admin",
    label: "Admin",
    permissions: [
      "products.read",
      "products.create",
      "products.update",
      "inventory.read",
      "inventory.adjust",
      "inventory.transfer",
      "sales.read",
      "sales.create",
      "purchases.read",
      "purchases.create",
      "purchases.approve",
    ],
  },
  manager: {
    id: "manager",
    label: "Manager",
    permissions: [
      "products.read",
      "products.create",
      "products.update",
      "inventory.read",
      "inventory.adjust",
      "inventory.transfer",
      "sales.read",
      "sales.create",
      "purchases.read",
      "purchases.create",
      "purchases.approve",
    ],
  },
  inventory_manager: {
    id: "inventory_manager",
    label: "Inventory Manager",
    permissions: [
      "products.read",
      "products.create",
      "products.update",
      "inventory.read",
      "inventory.adjust",
      "inventory.transfer",
      "purchases.read",
    ],
  },
  sales_staff: {
    id: "sales_staff",
    label: "Sales Staff",
    permissions: [
      "products.read",
      "sales.read",
      "sales.create",
    ],
  },
  purchase_staff: {
    id: "purchase_staff",
    label: "Purchase Staff",
    permissions: [
      "products.read",
      "inventory.read",
      "purchases.read",
      "purchases.create",
    ],
  },
  accountant: {
    id: "accountant",
    label: "Accountant",
    permissions: [
      "products.read",
      "inventory.read",
      "sales.read",
      "purchases.read",
    ],
  },
  viewer: {
    id: "viewer",
    label: "Viewer",
    permissions: ["products.read", "inventory.read", "sales.read", "purchases.read"],
  },
} as const satisfies Record<string, RoleDefinition>;

export type RoleId_ = keyof typeof ROLES;

/** Look up a role's permission list. Unknown roles grant nothing. */
export function permissionsForRole(roleId: string): readonly Permission[] {
  const role = (ROLES as Record<string, RoleDefinition | undefined>)[roleId];
  return role ? role.permissions : [];
}