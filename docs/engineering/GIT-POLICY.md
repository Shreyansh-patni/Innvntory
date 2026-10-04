# GLOBAL GIT & PUBLISHING POLICY

## 1. Official Repository
The official project repository is named exactly: `Innvntory`. It is the canonical published source repository. Do not create differently named primary repositories unless explicitly instructed.

## 2. Phase Publication Rule
After EVERY completed project phase, setup phase, or development milestone:
1. Inspect changed files.
2. Run relevant validation.
3. Review git diff.
4. Confirm no unintended changes.
5. Create a focused commit.
6. Push/publish the commit to the official `Innvntory` repository.
7. Confirm the push succeeded.
8. Report the commit hash and published branch.
*A phase is NOT considered fully complete until its approved changes have been successfully published. Exception: If the user explicitly says not to publish, follow that.*

## 3. Never Publish Unverified Changes
Do not push when: validation failed, working tree contains unexplained changes, unrelated files are included, secrets are present, generated artifacts are accidentally included, implementation has known critical issues, or requested phase is incomplete.

## 4. Focused Commits
Use focused commits. Preferred prefixes: `feat:`, `fix:`, `docs:`, `style:`, `perf:`, `refactor:`, `test:`, `chore:`. Do not combine unrelated work into a single commit.

## 5. Branch Discipline & Vercel Environments
Use the agreed workflow:
`main (Production)` ← PR / Merge ← `develop (Vercel Preview)` ← `feature/[small-outcome]`

- **`main` (Production):** Stable production baseline. Linked to Vercel Production deployment. Direct commits to `main` are restricted.
- **`develop` (Preview):** Active integration branch. Every push automatically generates a Vercel Preview deployment for multi-device live QA.
- **`feature/*`:** Ephemeral feature branches for isolated changes before merging into `develop`.
- **Release Boundary:** `develop` is NEVER deployed directly to the production domain. Promotion to production requires testing on Vercel Preview followed by an approved merge to `main`.

## 6. No Unrelated Changes
Run Git status/diff before every commit. Commits must contain ONLY changes related to the current phase. Do not silently include, delete, or overwrite unrelated changes.

## 7. Secrets
Never commit: `.env`, API keys, private keys, tokens, passwords, service credentials, production secrets, Supabase service-role secrets, Polar private credentials. Ensure `.gitignore` protects local secret files.

## 8. Publishing Report
After successful phase publication, report: Phase, Branch, Commit, Commit Hash, Remote, Push Status, Validation Status, Files Changed, Unrelated Changes, Notes.

## 9. Failed Publication
If commit succeeds but push fails, report: "COMMIT CREATED — PUSH FAILED" with commit hash, branch, reason for failure, and exact next blocker.

## 10. Phase Completion Format
Every completed phase ends with:
PHASE COMPLETE
COMMIT CREATED
CHANGES PUBLISHED (if push succeeds)
VALIDATION PASSED

## 11. Product Owner Control
The product owner controls repository visibility, branch protection, merge/release policies, production deployment, and destructive Git operations.
Never force-push. Never rewrite shared history. Never delete the remote repository. Never change repository visibility without explicit authorization.

## 12. Hard Rule
Git publication is part of the phase workflow, not an optional cleanup step. Every completed phase must leave the project in a: `IMPLEMENTED → VERIFIED → REVIEWED → COMMITTED → PUBLISHED` state. Do not silently skip publication.
