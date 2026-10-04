# API GUIDE

## Conventions
- Base Path: `/api/v1/...`

## Principles
- **Authentication:** Required for all non-public endpoints.
- **Authorization:** Tenant isolation and RBAC enforced at the API level.
- **Validation:** Strict payload validation (e.g., Zod).
- **Pagination:** Implement for all list endpoints.
- **Filtering & Sorting:** Standardized query parameters.
- **Search:** Dedicated search query support.
- **Rate Limiting:** Protect endpoints against abuse.
- **Idempotency:** Idempotency keys required for mutations (payments, webhooks, orders, inventory movements).
- **Request IDs:** Tracing across services.

## Error Model
Errors should be structured, safe, actionable, and free of internal secrets.
Categories include:
- `Validation` (400)
- `Authentication` (401)
- `Authorization` (403)
- `Not Found` (404)
- `Conflict` (409)
- `Rate Limited` (429)
- `External Service` (502)
- `Internal` (500)
- `Unavailable` (503)

External integrations must sit behind service boundaries inside `lib/`.
