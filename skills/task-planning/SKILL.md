---
name: task-planning
description: >-
  Breaks down designs and requirements into actionable task lists with estimates,
  dependencies, and priorities. Creates sprint-ready backlog from epics and stories.
  Use after ui-design when implementation planning is needed.
  NOT for: architecture decisions, UI design, or actual coding.
version: 1.0
domain: planning
role: planner
triggers:
  - /task-planning
  - 任务规划
  - 规划任务
  - 拆解任务
  - 排期
  - 加功能
  - 添加功能
  - 迭代
  - 新功能
prerequisites:
  - ui-design
output-format: task-list.md
related-skills:
  - ui-design
  - tdd-development
---

# Task Planning | 任务规划

## When to Use

- After ui-design before tdd-development
- When creating implementation plans
- When estimating effort and timeline
- When prioritizing features for release
- When breaking down large features into sprintable units

## When NOT to Use

- Architecture decisions (use architect skill)
- UI design decisions (use ui-design skill)
- Actual coding (use tdd-development skill)
- Just getting status updates on existing work
- Quick questions without planning context

---

## Core Workflow

### Phase 1: Backlog Extraction

**Entry**: UI designs and architecture exist
**Prerequisites Check**:
- If no ui-design output found in `docs/xiaoxiao/plans/` → **BLOCKED**: "Cannot start task-planning. Run ui-design first."
**Actions**:
1. Read `docs/xiaoxiao/plans/ui-design/` - reference screens and components (do NOT copy UI specs into task descriptions)
2. Read `docs/xiaoxiao/plans/architect-output.md` - note subsystem boundaries
3. Read `./SPEC.md` - verify scope and priorities
4. Create initial backlog items (Epics → Stories)
5. Ask: "Are there any features that were deprioritized?"
**Exit**: Raw backlog items identified

**Backlog Structure**:
```markdown
## Epic: User Authentication
### Stories
- [ ] Story: User can sign up with email
- [ ] Story: User can sign in with password
- [ ] Story: User can reset password

## Epic: Project Management
### Stories
- [ ] Story: User can create a project
- [ ] Story: User can view project list
...
```

**IMPORTANT: UI Reference vs Copy**
- When creating frontend tasks, reference UI design files, don't duplicate specs
- Example: Write "Implement LoginForm per ui-design/preview.html" not "LoginForm: email input + password input + submit button"
- TDD Development will read the actual UI design files for implementation details

---

### Phase 2: Task Decomposition

**Entry**: Backlog items identified
**Actions**:
1. For each story, break into tasks:
   - **Backend tasks**: API endpoints, database changes
   - **Frontend tasks**: Components, pages, state
   - **Infra tasks**: Config, deployment, migrations
2. Each task should be:
   - **Small**: 1-3 days max
   - **Testable**: Can verify completion
   - **Independent**: No blocking dependencies within
3. Ask: "Is this task too large? Can it be split?"
**Exit**: All stories decomposed into tasks

**Task Template**:
```markdown
### Story: User can sign in with password

#### Tasks
1. [ ] **Backend**: Create POST /auth/login endpoint
   - Validate email/password
   - Return JWT on success
   - Return 401 on failure

2. [ ] **Frontend**: Create LoginForm component
   - Reference: `docs/xiaoxiao/plans/ui-design/preview.html` (Login section)
   - Implementation follows UI design, not task description

3. [ ] **Frontend**: Create LoginPage
   - Reference: `docs/xiaoxiao/plans/ui-design/pages/login.html`
   - Wire up LoginForm
   - Handle success → redirect to dashboard
   - Handle error → show error message

4. [ ] **Test**: Add login integration tests
   - Happy path
   - Invalid credentials
   - Network error
```

**IMPORTANT: Frontend tasks must reference UI design files**
- Task descriptions should reference the actual UI design, not duplicate specs
- Example: "Create LoginForm per ui-design/preview.html" not full component spec
- TDD workers will read UI design files directly for implementation details
- This avoids task-planning re-doing ui-design's work

---

### Phase 3: Dependency Mapping

**Entry**: Tasks decomposed
**Actions**:
1. Identify dependencies between tasks:
   - **Internal**: Within same story (frontend needs API)
   - **External**: Across stories (auth before project creation)
   - **Technical**: Database migration before API change
2. Create dependency graph
3. Identify the critical path (longest dependency chain)
4. Ask: "What's blocking other work?"
**Exit**: Dependencies mapped, critical path identified

**Dependency Format**:
```markdown
## Dependencies

### Blocking Relationships
- Task 3 (LoginPage) blocked by Task 1 (login API)
- Task 7 (ProjectList) blocked by Task 4 (auth infrastructure)

### Critical Path
Login API → Auth infrastructure → Project API → ProjectList
```

---

### Phase 4: Estimation

**Entry**: Dependencies mapped
**Actions**:
1. Estimate each task using relative sizing:
   - **XS**: 1-2 hours
   - **S**: Half a day
   - **M**: 1-2 days
   - **L**: 3-5 days
   - **XL**: 5+ days (split further)
2. Add up estimates for each story
3. Calculate total effort
4. Ask: "Does this estimate match your intuition?"
**Exit**: All tasks estimated

**Estimation Guide**:
```markdown
| Size | Hours | When to Use |
|------|-------|-------------|
| XS | 1-2h | Simple, well-understood |
| S | 4h | Standard, predictable |
| M | 1-2d | Some complexity, minor unknowns |
| L | 3-5d | High complexity, multiple unknowns |
| XL | 5+d | Break into smaller tasks |
```

---

### Phase 5: Prioritization

**Entry**: Tasks estimated
**Actions**:
1. Apply priority rules:
   - **P0 (MVP)**: Must have for launch
   - **P1**: Important, ship soon after
   - **P2**: Nice to have, future release
2. Order tasks by:
   - Priority (P0 first)
   - Dependencies (blocking tasks first)
   - Efficiency (parallel when possible)
3. Create sprint groups if applicable
4. Confirm priority order with user

**Priority Template**:
```markdown
## Task Prioritization

### P0 - MVP (Must have)
1. [ ] Task 1 - [name] - [M]
2. [ ] Task 2 - [name] - [L]
...

### P1 - Important
1. [ ] Task N - [name] - [S]
...

### P2 - Nice to have
1. [ ] Task M - [name] - [M]
...
```

**Run on completion**:
```bash
xiaoxiao complete task-planning docs/xiaoxiao/plans/task-planning-output.md
```

---

## Iteration Management

### Starting a New Iteration

When user says "add feature", "new development cycle", or "start iteration":

1. **Check current iteration state** (from `xiaoxiao-state.json`):
   - If `currentIteration` has unstarted/incomplete skills → continue that iteration
   - If all skills are completed → create new iteration

2. **Create new iteration** by running:
   ```bash
   node ~/.claude/skills/xiaoxiao/xiaoxiao.js new-iteration
   ```
   This calls `stateManager.startNewIteration()` which:
   - Completes current iteration with summary
   - Resets all skills to pending
   - Creates new iteration (v2, v3, etc.)

3. **Output file naming**: Use version suffix when adding features
   - First cycle: `docs/xiaoxiao/plans/task-planning-output.md`
   - Second cycle: `docs/xiaoxiao/plans/task-planning-output-v2.md`
   - Third cycle: `docs/xiaoxiao/plans/task-planning-output-v3.md`
   - Same applies to other skill outputs

4. **SPEC.md handling**: Append new features to existing SPEC.md, mark with current iteration ID

### MUST DO for Iteration

- Read `xiaoxiao-state.json` before starting to know which iteration we're in
- When adding features to existing project, create new iteration (don't restart from v1)
- Output files should use v2, v3 suffix to avoid overwriting previous cycle's work
- Complete iteration after finishing all P0 tasks: `xiaoxiao complete-iteration "<summary>"`

### MUST NOT DO

- Do not overwrite previous iteration's output files
- Do not reset skills if previous iteration is incomplete
- Do not modify .SPEC.md by replacing content; only append new sections

---

## Constraints

### MUST DO

- Keep tasks small enough to complete in 1-3 days
- Identify all dependencies explicitly
- Include testing tasks with each feature task
- Group related tasks logically
- Leave 20% buffer for unexpected complexity
- Document assumptions that affect estimates

### MUST NOT DO

- Create tasks larger than 5 days (split them)
- Skip integration points between frontend/backend
- Forget about documentation tasks
- Estimate without understanding the implementation
- Ignore non-functional requirements (security, performance)
- Plan every detail for P2 tasks (leave flexibility)

---

## Reference Guide

| Topic | File | Load When |
|-------|------|-----------|
| Estimation Techniques | GUIDES/estimation.md | Sizing unfamiliar tasks |
| Dependency Mapping | GUIDES/dependencies.md | Complex dependency graphs |
| Sprint Planning | GUIDES/sprint-planning.md | Creating sprint backlogs |
| Task Templates | OUTPUTS/task-templates.md | Standard task formats |

---

## Output: Task List Document

### Required Sections

1. **Overview** (total tasks, total estimate, timeline)
2. **Epic Breakdown** (stories grouped by epic)
3. **Task List** (all tasks with estimates and dependencies)
4. **Priority Order** (P0/P1/P2 with reasoning)
5. **Sprint Plan** (if applicable, grouped by sprint)
6. **Assumptions** (what we're assuming in estimates)

### Example Output

```markdown
# Login Flow - Task Plan

## Overview
- **Total Tasks**: 12
- **Total Estimate**: 8 days
- **Team**: 2 developers

## Story: User Authentication

### Epic: User Authentication
| Task | Type | Estimate | Dependencies |
|------|------|----------|--------------|
| Create auth database schema | Backend | S | - |
| Implement password hashing | Backend | XS | 1 |
| Create login API | Backend | M | 2 |
| Create signup API | Backend | M | 1 |
| Add JWT generation | Backend | S | 3, 4 |
| Create LoginForm component | Frontend | M | 3 |
| Create SignupForm component | Frontend | M | 4 |
| Create LoginPage | Frontend | S | 5 |
| Create SignupPage | Frontend | S | 6 |
| Add auth integration tests | Test | L | 3, 4, 5, 6 |

## Priority Order

### P0 - MVP
1. Tasks 1-6 (Authentication core)
2. Tasks 5, 8 (Login flow - user facing)

### P1 - Important
1. Tasks 7, 9 (Signup flow)
2. Task 10 (Integration tests)

### P2 - Future
1. Tasks 11-12 (Remember me, forgot password)

## Assumptions
- Team has experience with JWT
- Database migration can happen without downtime
- Frontend has existing component library
```

---

## CONFIRM Nodes

| Phase | Confirmation Prompt |
|-------|---------------------|
| Phase 1 Complete | "[N] stories identified. Scope looks correct?" |
| Phase 2 Complete | "[N] tasks created. Task sizes appropriate?" |
| Phase 3 Complete | "Dependencies mapped. Critical path: [X]. Continue?" |
| Phase 4 Complete | "Total estimate: [X] days. Matches intuition?" |
| Phase 5 Complete | "Priority order: P0 [N] tasks, P1 [N] tasks. Confirm?" |
| Final | "Task planning complete. Proceed to TDD Development?" |
