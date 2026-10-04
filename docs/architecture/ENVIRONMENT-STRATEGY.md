# ENVIRONMENT STRATEGY

Innvntory relies on strict separation of environments to ensure security, stability, and clean development workflows.

## 1. Environments

- **LOCAL:** The developer's machine. Uses local Supabase instance (or a dedicated dev project), local Polar sandbox, and mock webhooks.
- **DEVELOPMENT:** Shared deployment for developer testing and integration. Connected to development instances of third-party services.
- **STAGING:** Production-mirror environment. Used for QA, stakeholder review, and final validation before release. Uses staging/test keys for all external integrations.
- **PRODUCTION:** The live environment. Holds real customer data. Access to production secrets is strictly limited.

## 2. Configuration vs. Secrets
- **Configuration:** Non-sensitive settings (e.g., feature flags, public URLs, public API keys). Can be committed to version control or safely exposed to the client via `NEXT_PUBLIC_` prefixes.
- **Secrets:** Passwords, private API keys, webhook signing secrets, database connection strings. **Never hardcode secrets. Never expose secrets to the client.**
- **Runtime Feature Flags:** Handled via environment variables or a dedicated service, separating deployment from release.

## 3. Environment Variables
- Ensure `.env.example` is maintained without real sensitive values (mark as `TBD` or use dummy values).
- The CI/CD pipeline injects real secrets during the build/deploy process securely.
