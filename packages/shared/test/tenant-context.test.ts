import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  fromAuthenticatedSession,
  fromJobContext,
  operatorContext,
  permissionsForRole,
  requirePermissions,
  requirePlatformPermissions,
  requireTenantContext,
  ROLES,
  TenantContextError,
} from "../src/index.js";

const base = {
  organizationId: "org_alpha",
  actorId: "user_1",
  roleId: "owner",
  permissions: ROLES.owner.permissions,
  correlationId: "corr_1",
};

describe("TenantContext construction", () => {
  it("builds a frozen context from an authenticated session", () => {
    const ctx = fromAuthenticatedSession(base);
    assert.equal(ctx.organizationId, "org_alpha");
    assert.equal(ctx.actorType, "user");
    assert.ok(Object.isFrozen(ctx));
  });

  it("defaults actorType to user and honours an explicit ai_tool actor", () => {
    assert.equal(fromAuthenticatedSession(base).actorType, "user");
    assert.equal(
      fromAuthenticatedSession({ ...base, actorType: "ai_tool" }).actorType,
      "ai_tool",
    );
  });

  it("rejects platform permissions on a tenant context", () => {
    assert.throws(
      () =>
        fromAuthenticatedSession({
          ...base,
          permissions: ["platform.read" as never],
        }),
      /must not appear on a TenantContext/,
    );
  });
});

describe("fail-closed behaviour", () => {
  it("throws when a tenant operation has no context at all", () => {
    assert.throws(
      () => requireTenantContext(undefined, "listProducts"),
      (e: unknown) =>
        e instanceof TenantContextError && e.code === "TENANT_CONTEXT_MISSING",
    );
  });

  it("refuses an operator context where tenant context is required", () => {
    const op = operatorContext({
      actorId: "op_1",
      platformPermissions: ["platform.read"],
      correlationId: "corr_2",
      reason: "support investigation",
    });
    assert.equal(op.organizationId, null);
    assert.throws(
      () => requireTenantContext(op, "listProducts"),
      (e: unknown) =>
        e instanceof TenantContextError &&
        e.code === "ORGANIZATION_CONTEXT_REQUIRED",
    );
  });

  it("does not treat a missing organizationId as operator access", () => {
    // The heart of ADR 0004 Q2: absence must never escalate.
    assert.throws(() => requireTenantContext(null, "listProducts"));
    assert.throws(() => requireTenantContext(undefined, "listProducts"));
  });

  it("refuses a worker job with no durable organization context", () => {
    assert.throws(
      () => fromJobContext("reconcile", null, ROLES.admin.permissions),
      (e: unknown) =>
        e instanceof TenantContextError && e.code === "WORKER_CONTEXT_MISSING",
    );
    assert.throws(
      () =>
        fromJobContext(
          "reconcile",
          { organizationId: "", actorId: "u1", roleId: "owner", correlationId: "c" },
          ROLES.admin.permissions,
        ),
      (e: unknown) =>
        e instanceof TenantContextError && e.code === "WORKER_CONTEXT_MISSING",
    );
  });
});

describe("worker context reconstruction", () => {
  it("rebuilds a worker tenant context from durable job context", () => {
    const ctx = fromJobContext(
      "reconcile",
      {
        organizationId: "org_beta",
        actorId: "system_reconcile",
        roleId: "admin",
        correlationId: "corr_3",
      },
      ROLES.admin.permissions,
    );
    assert.equal(ctx.organizationId, "org_beta");
    assert.equal(ctx.actorType, "worker");
  });
});

describe("authorization", () => {
  it("grants access when the permission is held", () => {
    const ctx = fromAuthenticatedSession(base);
    assert.doesNotThrow(() =>
      requirePermissions(ctx, "deleteProduct", ["products.delete"]),
    );
  });

  it("denies access when the permission is absent", () => {
    const ctx = fromAuthenticatedSession({
      ...base,
      roleId: "viewer",
      permissions: ROLES.viewer.permissions,
    });
    assert.throws(
      () => requirePermissions(ctx, "deleteProduct", ["products.delete"]),
      (e: unknown) =>
        e instanceof TenantContextError && e.code === "PERMISSION_DENIED",
    );
  });

  it("separates platform permissions from tenant permissions", () => {
    const op = operatorContext({
      actorId: "op_1",
      platformPermissions: ["platform.read"],
      correlationId: "corr_4",
      reason: "audit",
    });
    assert.doesNotThrow(() =>
      requirePlatformPermissions(op, "readPlatform", ["platform.read"]),
    );
    assert.throws(() => requirePlatformPermissions(op, "readSupport", ["platform.support.read"]));
    assert.throws(() =>
      requirePlatformPermissions(fromAuthenticatedSession(base), "readPlatform", [
        "platform.read",
      ]),
    );
  });
});

describe("platform RBAC catalogue", () => {
  it("defines exactly the eight roles from specification 32", () => {
    assert.equal(Object.keys(ROLES).length, 8);
    assert.deepEqual(
      Object.keys(ROLES).sort(),
      [
        "accountant",
        "admin",
        "inventory_manager",
        "manager",
        "owner",
        "purchase_staff",
        "sales_staff",
        "viewer",
      ],
    );
  });

  it("grants nothing for an unknown role", () => {
    assert.deepEqual(permissionsForRole("does_not_exist"), []);
  });

  it("keeps viewer read-only", () => {
    for (const p of ROLES.viewer.permissions) assert.ok(p.endsWith(".read"));
  });
});