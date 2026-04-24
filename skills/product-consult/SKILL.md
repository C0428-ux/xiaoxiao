---
name: product-consult
description: >-
  Designs product features and functionality through structured conversation.
  Defines what product to build, core features, user flows, and MVP scope.
  Use when starting new projects, adding major features, or pivoting product direction.
  NOT for: bug fixes, minor UI tweaks, performance optimizations, or tasks with
  existing detailed specs.
version: 1.0
domain: product
role: product-designer
triggers:
  - /product-consult
  - 产品咨询
  - 我要做产品
  - 新项目
  - 添加功能
  - 需求不明确
  - 需求不清
  - 做产品
  - 设计产品
  - 产品设计
output-format: SPEC.md
related-skills:
  - strategy-review
  - architect
---

# Product Consult | 产品咨询

## When to Use

- Starting a new project from scratch
- Adding a major feature to existing project
- Pivoting or significantly changing product direction
- Requirements are vague, conflicting, or missing
- Team disagrees on priorities or scope

## When NOT to Use

- Bug fixes or technical debt tasks
- Minor UI tweaks without behavior change
- Performance optimizations with clear requirements
- Tasks where you already have a detailed spec
- Emergency hotfixes with no time for discovery

---

## Core Workflow

### Phase 1: Product Type & Core Scenario

**Entry**: User expresses intent to build something or add a feature
**Actions**:
1. Ask: "What type of product is this?" (e.g., web app, mobile app, API, SaaS platform, internal tool)
2. Ask: "Who are the primary users?" (e.g., admins, end users, developers, business users)
3. Ask: "What is the core user scenario you're solving?" (the main flow users will perform)
4. Ask: "What's the single most important action users must be able to do?"
5. Summarize back: "This is a [product type] for [users] to [core action]. Correct?"
**Exit**: Product type and core scenario confirmed

**Key Questions**:
- "Is this B2B or B2C?" (helps define complexity)
- "Is this for internal use or external customers?" (affects security/UX)
- "What's the first thing a user should see when they open the product?"

---

### Phase 2: Feature Design

**Entry**: Product type confirmed in Phase 1
**Actions**:
1. Ask: "What features are essential for the first version?" (P0)
2. Ask: "What features are important but not critical?" (P1)
3. Ask: "What features would be nice to have?" (P2)
4. For each P0 feature, define the primary user flow:
   - Entry point: How does user start?
   - Core steps: What must happen?
   - Exit point: How does user complete?
5. Ask: "What should this product ABSOLUTELY NOT do?" (explicit out-of-scope)
**Exit**: Features prioritized and core flows outlined

**Feature Template**:
```markdown
## Feature: [Name]

### Primary User Flow
1. User [action]
2. System [response]
3. User [action]
4. System [response]

### Key Data
- **Input**: [What user provides]
- **Output**: [What user receives]
- **Storage**: [What gets saved]
```

---

### Phase 3: User Experience Outline

**Entry**: Features defined
**Actions**:
1. Ask: "How do users navigate between features?" (navigation structure)
2. Ask: "What's the main dashboard/home screen layout?"
3. Ask: "How do users access the P0 features you mentioned?"
4. Outline key screens needed:
   - Landing/Home screen
   - Primary feature screens
   - Settings/Profile (if needed)
5. Ask: "Are there any user roles with different access?" (admin vs user)
**Exit**: High-level UX structure documented

---

### Phase 4: Success Criteria

**Entry**: UX structure outlined
**Actions**:
1. Ask: "How will we know this product is successful?"
2. Define measurable criteria (not technical, but business outcomes):
   - ❌ "Fast" → ✅ "<3 seconds for primary action"
   - ❌ "Easy to use" → ✅ "New user completes first task in <5 minutes"
   - ❌ "Popular" → ✅ "50% weekly active users by month 3"
3. Confirm: "Success will be measured by [3-5 metrics]. Agreed?"
**Exit**: 3-5 measurable success criteria defined

**Template**:
```markdown
## Success Criteria
- [ ] [Metric 1]: [specific, measurable outcome]
- [ ] [Metric 2]: [specific, measurable outcome]
- [ ] [Metric 3]: [specific, measurable outcome]
```

---

### Phase 5: MVP Scope

**Entry**: Success criteria confirmed
**Actions**:
1. Ask: "What is the absolute minimum for launch?"
2. Define explicit boundaries:
   - **P0 (MVP)**: Must have for launch - no more, no less
   - **P1**: Important, can ship soon after
   - **P2**: Nice to have, future iteration
3. Explicitly state what's NOT in scope (prevents creep)
4. Confirm: "MVP is [X features]. Out of scope: [Y]. Proceed?"
**Exit**: Clear MVP scope with explicit boundaries

---

### Phase 6: Output SPEC.md

**Entry**: All previous phases complete
**Actions**:
1. Write the `.SPEC.md` document in the project root (see template below)
2. Review with user
3. Confirm: "This defines a [product type] with [N] P0 features. Ready to proceed?"
4. Run completion command

**Output location**: `./.SPEC.md` (project root)

**Run on completion**:
```bash
xiaoxiao complete product-consult .SPEC.md
```

---

## Constraints

### MUST DO

- Ask "what to build" before "why to build"
- Define product type, core users, and primary scenarios first
- Design features with actual user flows, not just feature lists
- Make success criteria measurable and time-bound
- Define explicit out-of-scope to prevent creep
- Document UX structure at high level

### MUST NOT DO

- Spend too much time on user research (product-design focus, not market-research)
- Accept "make an app like X" without probing what that means
- Define technical architecture (that's architect's job)
- Skip the "what" questions and jump to implementation details
- Allow unlimited P0 features (MVP should be small)

---

## Reference Guide

| Topic | File | Load When |
|-------|------|-----------|
| Product Type Examples | GUIDES/product-types.md | Unclear what product type fits |
| Feature Prioritization | GUIDES/prioritization.md | Can't decide P0 vs P1 vs P2 |
| User Flow Design | GUIDES/user-flows.md | Need help mapping user flows |
| Success Criteria Templates | GUIDES/success-criteria.md | Criteria are vague or unmeasurable |
| SPEC.md Template | OUTPUTS/SPEC-template.md | Writing the output document |

---

## Output: SPEC.md

### Required Sections

1. **Product Type & Users** (product category, primary users, user roles)
2. **Core Scenario** (the main problem being solved)
3. **Features** (P0/P1/P2 with primary user flows)
4. **UX Structure** (high-level screens and navigation)
5. **Success Criteria** (3-5 measurable outcomes)
6. **MVP Scope** (explicit In/Out lists)

### Example Output

```markdown
# Task Management SaaS

## Product Type & Users
- **Type**: B2B SaaS Web Application
- **Primary Users**: Project managers, team leads
- **User Roles**: Admin (manage team), Member (use tasks)

## Core Scenario
A project manager creates tasks, assigns them to team members, and tracks progress through to completion.

## Features

### P0 - MVP
1. **Task Creation**
   - User clicks "+ New Task"
   - Fills: title, description, assignee, due date
   - Task appears in assignee's list

2. **Task List View**
   - Shows all tasks for current user
   - Filter by: status, assignee, due date
   - Sort by: due date, priority, created

3. **Task Status Update**
   - User drags task between columns: Todo → In Progress → Done
   - Status updates immediately

### P1
- Comments on tasks
- Email notifications

### P2
- Task dependencies
- Gantt chart view

## UX Structure
- **Home**: Dashboard with task counts by status
- **Task List**: Filterable list of tasks
- **Task Detail**: Modal or page with task info
- **Settings**: User profile, team management

## Success Criteria
- [ ] 80% of tasks created are completed within due date
- [ ] New user completes first task in <3 minutes
- [ ] 60% weekly active users within first month

## MVP Scope
### In
- Task CRUD
- Basic task list with filters
- Kanban-style status board

### Out
- Comments (P1)
- Notifications (P1)
- Mobile app (P2)
- Advanced analytics (P2)
```

---

## CONFIRM Nodes

| Phase | Confirmation Prompt |
|-------|---------------------|
| Phase 1 Complete | "Product type: **[X]**, Core scenario: **[Y]**. Correct?" |
| Phase 2 Complete | "P0: [A, B, C]. P1: [D, E]. Flows defined. Proceed?" |
| Phase 3 Complete | "UX Structure: [screens]. Navigation: [model]. Continue?" |
| Phase 4 Complete | "Success: 1) [X], 2) [Y], 3) [Z]. Agreed?" |
| Phase 5 Complete | "MVP: [features]. Out of scope: [excluded]. Proceed?" |
| Final | "SPEC.md is complete. Confirm to proceed to Strategy Review." |
