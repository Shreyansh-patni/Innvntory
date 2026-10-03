/**
 * HTTP server for the dedicated backend service (ADR 0001).
 *
 * Deliberately small and dependency-free at this stage: the foundation that
 * matters architecturally is the /api/v1 versioning convention, the structured
 * error contract from specification §38, and the tenant fail-closed boundary.
 *
 * No /api/v1 business endpoint is implemented here. Those belong to business
 * modules and require authentication, which is not yet specified.
 */

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import { TenantContextError } from "@innvntory/shared";

const PORT = Number(process.env.API_PORT ?? 4000);
const SERVICE_NAME = "innvntory-api";

/**
 * Structured error response — specification §38.
 *
 * Never exposes stack traces, secrets, database details, or internal
 * infrastructure (specification §38).
 */
function sendStructuredError(
  res: ServerResponse,
  status: number,
  code: string,
  message: string,
  requestId: string,
): void {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: { code, message, requestId } }));
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function requestId(req: IncomingMessage): string {
  const header = req.headers["x-request-id"];
  return typeof header === "string" && header.length > 0 ? header : `req_${Date.now()}`;
}

const server = createServer((req, res) => {
  const rid = requestId(req);
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  // Liveness. Deliberately does not touch the database, so it reports process
  // health rather than pretending the data layer is verified.
  if (url.pathname === "/health") {
    sendJson(res, 200, {
      status: "ok",
      service: SERVICE_NAME,
      version: process.env.npm_package_version ?? "0.0.0",
    });
    return;
  }

  // Readiness: reports whether a database connection is configured, WITHOUT
  // claiming the database works. Connecting is attempted only when DATABASE_URL is
  // present; otherwise the response says so honestly.
  if (url.pathname === "/ready") {
    const configured = Boolean(process.env.DATABASE_URL);
    sendJson(res, configured ? 200 : 503, {
      status: configured ? "configured" : "not_configured",
      service: SERVICE_NAME,
      database: {
        urlConfigured: configured,
        // Honest: no live database verification is claimed here.
        verified: false,
      },
      architecture: {
        isolation: "hybrid (application scoping + PostgreSQL RLS)",
        tenantContext: "transaction-local SET LOCAL",
        runtimeRoleOwnsTables: false,
      },
    });
    return;
  }

  // Versioned API root. Confirms the convention from specification §36 without
  // inventing endpoints the specification does not define.
  if (url.pathname === "/api/v1") {
    sendJson(res, 200, {
      service: SERVICE_NAME,
      api: "v1",
      endpoints: [],
      note: "No business endpoints implemented yet. Authentication is not configured.",
    });
    return;
  }

  if (url.pathname.startsWith("/api/v1/")) {
    // Fail closed and honestly: this is not a 404 pretending the route might be
    // public. It reports that the surface exists but is not implemented.
    sendStructuredError(
      res,
      501,
      "ENDPOINT_NOT_IMPLEMENTED",
      "This API version is reserved. No business endpoints have been implemented yet.",
      rid,
    );
    return;
  }

  sendStructuredError(res, 404, "NOT_FOUND", "The requested resource was not found.", rid);
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `${SERVICE_NAME} listening on http://localhost:${PORT} ` +
      `(API convention /api/v1, tenant isolation via transaction-local context)`,
  );
});

function shutdown(signal: string): void {
  // eslint-disable-next-line no-console
  console.log(`${SERVICE_NAME} received ${signal}, shutting down.`);
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export { server, TenantContextError };