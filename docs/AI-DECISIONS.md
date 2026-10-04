# AI DECISIONS

*Record durable AI-related project decisions here.*

## Agent Roles
The following agent roles are established for future development tasks:

**PRODUCT / PLANNING AGENT**
Responsibilities:
- product requirements
- scope
- acceptance criteria
- roadmap
- user flows

**DESIGN AGENT**
Responsibilities:
- design system
- responsive design
- UI consistency
- visual QA
- accessibility

**FRONTEND AGENT**
Responsibilities:
- Next.js
- React
- TypeScript
- components
- interaction
- frontend performance

**BACKEND / DATA AGENT**
Responsibilities:
- Supabase
- PostgreSQL
- APIs
- domain logic
- data integrity

**QA / SECURITY AGENT**
Responsibilities:
- unit/integration/E2E
- security
- regression detection
- accessibility
- visual QA

**RELEASE / DEVOPS AGENT**
Responsibilities:
- CI/CD
- deployment
- observability
- production checks
- rollback

## Agent Orchestration Principles
**Context:** Orchestrating multiple agents to build Innvntory.
**Chosen:** Use the Vibe Coding workflow: CONTEXT → PLAN → IMPLEMENT → VERIFY → REVIEW → SHIP → LEARN.
**Why:** Ensures methodical step-by-step progress, minimizing mistakes.
**Rules:**
- Do not parallelize trivial work.
- Do not duplicate work across agents.
- Do not allow competing agents to edit the same files casually.
- Define ownership before parallel work.
- Require a final integration review.
