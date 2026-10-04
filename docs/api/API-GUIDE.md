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
- **Idempotency:** Idempotency keys for mutations.
- **Structured Errors:** Consistent error shapes and codes.
- **Request IDs:** Tracing across services.

External integrations must sit behind service boundaries inside `lib/`.
