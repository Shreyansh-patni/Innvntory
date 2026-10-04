# TESTING

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
- Product creation -> Purchase -> Receive -> Stock update -> Sell -> Deduct stock -> Invoice -> Payment

## Additional Testing Expectations
- Concurrent sales (race conditions)
- Duplicate webhooks (idempotency)
- Tenant isolation (security)
- Failure states
- Empty states
- Permission denied states

*Note: Tests are not implemented yet.*
