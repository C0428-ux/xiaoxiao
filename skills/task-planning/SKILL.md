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
  - task planning
  - plan tasks
  - break down tasks
  - schedule
  - add feature
  - add functionality
  - iteration
  - new feature
prerequisites:
  - ui-design
output-format: docs/xiaoxiao/plans/task-planning-output.md
related-skills:
  - ui-design
  - tdd-development
---

# Task Planning | Task Planning

## Mandatory Execution Protocol

**Rules**:
- MUST execute each Step in order, no skipping
- MUST verify each Step (checkpoint) before proceeding to next
- MUST use `xiaoxiao save-progress <skill> <step>` to mark step completion
- CONFIRM nodes MUST wait for user confirmation, never auto-continue

---

## Step 1: Initialization

**Action**:
1. Execute `xiaoxiao save-progress task-planning step1-complete`
2. Check if `docs/xiaoxiao/plans/architect-output.md` exists
3. Check if `docs/xiaoxiao/plans/ui-design/` exists
4. Check if `./SPEC.md` exists

**Verification**: All three files/directories exist

**CONFIRM**: "Step 1 complete. Architect doc, UI design, and SPEC.md all exist. Continue?"

---

## Step 2: Read Tech Stack

**Action**:
1. Read `docs/xiaoxiao/plans/architect-output.md`
2. Extract tech stack info:
   - Frontend: React/Vue/Angular
   - Backend: Node.js/Go/Python
   - Database: PostgreSQL/MongoDB
3. **Important**: Task planning does NOT make tech decisions, tech choices come from architecture phase

**Verification**: Tech stack extracted

**CONFIRM**: "Tech stack: Frontend [framework], Backend [framework], Database [db]. Continue?"

---

## Step 3: Read UI Design

**Action**:
1. Read `docs/xiaoxiao/plans/ui-design/preview.html` (main preview)
2. Read `docs/xiaoxiao/plans/ui-design/pages/*.html` (each page)
3. Extract component structure for frontend task reference
4. **Important**: Frontend tasks reference UI design files, do not copy UI specs into task descriptions

**Verification**: UI design read

**CONFIRM**: "UI design read. Found [N] pages. Continue?"

---

## Step 4: Backlog Extraction

**Action**:
1. Extract P0 features from SPEC.md (must-haves)
2. Extract P1 features from SPEC.md (important but not critical)
3. Extract P2 features from SPEC.md (nice-to-have)
4. Ask user: "Any features that were cancelled?"

**Verification**: Backlog items identified

**CONFIRM**: "Backlog extraction complete. P0: [N], P1: [N], P2: [N]. Continue?"

---

## Step 5: Task Breakdown

**Action**:
1. For each P0 story, break down into tasks:
   - Backend tasks: API endpoints, database changes
   - Frontend tasks: components, pages, state
   - Infra tasks: config, deployment, migration
2. Each task MUST:
   - Be small: **max 1 day** (for TDD compatibility, 1-3 days is too large)
   - Be testable: can verify completion
   - Be independent: no internal blocking dependencies
3. Ask user: "Is this task too large? Can it be split?"

**Verification**: All stories broken down into tasks

**CONFIRM**: "Task breakdown complete. Total: [N] tasks. Continue?"

---

## Step 6: Dependency Mapping

**Action**:
1. Identify dependencies between tasks:
   - Internal: within same story (frontend needs API)
   - External: across stories (auth before project creation)
   - Technical: database migration before API change
2. Create dependency graph
3. Identify critical path (longest dependency chain)
4. Ask user: "What is blocking other work?"

**Verification**: Dependencies mapped, critical path identified

**CONFIRM**: "Dependency mapping complete. Critical path: [path]. Continue?"

---

## Step 7: Estimation

**Action**:
1. Use relative estimation:
   - XS: 1-2 hours
   - S: half day
   - M: 1-2 days
   - L: 3-5 days
   - XL: 5+ days (split further)
2. Sum estimates per story
3. Calculate total effort
4. Ask user: "Does this estimate match your intuition?"

**Verification**: All tasks estimated

**CONFIRM**: "Estimation complete. Total: [N] days. Continue?"

---

## Step 8: Priority Ordering

**Action**:
1. Apply priority rules:
   - P0 (MVP): Must have for launch
   - P1: Important, ship soon
   - P2: Nice-to-have, ship later
2. Order tasks by:
   - Priority (P0 first)
   - Dependencies (blocking tasks first)
   - Efficiency (parallelize where possible)
3. Confirm priority order

**Verification**: Priority confirmed

**CONFIRM**: "Priority: P0 [N] tasks, P1 [N] tasks. Confirm order?"

---

## Step 9: Output Document

**Action**:
1. Create `docs/xiaoxiao/plans/task-planning-output.md`
2. Include these sections:
   - Overview (total tasks, total estimate, timeline)
   - Epic Breakdown (stories grouped by epic)
   - Task List (all tasks with estimates and dependencies)
   - **Task Dependency Table** (structured DAG for TDD workers):
     ```
     | Task ID | Task Name | Type | Estimate | Depends On | Priority |
     |---------|-----------|------|----------|------------|----------|
     | T1      | API auth  | backend | M | - | P0 |
     | T2      | UI login  | frontend | S | T1 | P0 |
     ```
   - Priority Order (P0/P1/P2 with rationale)
   - Sprint Plan (if applicable, grouped by sprint)
   - Assumptions (assumptions estimates are based on)
3. Execute `xiaoxiao complete task-planning docs/xiaoxiao/plans/task-planning-output.md`

**Verification**: Document created with all sections including Task Dependency Table

**CONFIRM**: "Task Planning complete. Document saved. Confirm entry to TDD Development?"

---

## State Update Commands

After each Step, MUST execute:
```bash
xiaoxiao save-progress task-planning step[N]-complete
```

For final completion, MUST execute:
```bash
xiaoxiao complete task-planning docs/xiaoxiao/plans/task-planning-output.md
```
