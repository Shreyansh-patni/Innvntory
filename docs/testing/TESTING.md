# TESTING & QUALITY MODEL

## Quality Gates
1. Lint
2. Typecheck
3. Unit tests
4. Integration tests
5. E2E tests
6. Visual QA
7. Accessibility
8. Production build
9. Security review
10. Diff review

## Critical Future Workflows
Product → Purchase → Receive → Stock Update → Sale → Stock Deduction → Invoice → Payment

## Additional Future Test Categories
- Concurrent sales (race conditions)
- Duplicate webhooks (idempotency)
- Tenant isolation (security)
- Permission failures
- Empty data
- Network failure
- Integration failure
- Rollback behavior

## Vibe Coding Workflow
**Operating Loop:** CONTEXT → PLAN → IMPLEMENT → LINT → TYPECHECK → TEST → VISUAL QA → DIFF REVIEW → COMMIT → PREVIEW → PRODUCTION

**Prompt Discipline:**
Future prompts should normally follow: CONTEXT → GOAL → SOURCE OF TRUTH → REQUIREMENTS → CONSTRAINTS → ACCEPTANCE → VALIDATION → STOP.
Never use one giant prompt to build the entire product. Never silently widen the scope.
