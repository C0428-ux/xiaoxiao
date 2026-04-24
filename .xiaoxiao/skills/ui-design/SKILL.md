---
name: ui-design
description: >-
  Designs user interfaces and interactions by translating product requirements
  into screen layouts, component structures, and user flows. Produces wireframes,
  ASCII prototypes, and design specifications. Use after architect when defining
  how users interact with the system.
  NOT for: backend design, task planning, or implementation.
version: 1.0
domain: design
role: designer
triggers:
  - /ui-design
  - 界面设计
  - UI设计
  - 画原型
  - 交互设计
prerequisites:
  - architect
output-format: ui-design.md
related-skills:
  - architect
  - task-planning
---

# UI Design | 界面设计

## When to Use

- After architect before task-planning
- When designing new screens or flows
- When redesigning existing interfaces
- When component libraries need definition
- When user interaction patterns need validation

## When NOT to Use

- Backend or API design (use architect skill)
- Task breakdown or estimation (use task-planning skill)
- Implementation (use tdd-development skill)
- Just asking for code snippets without design context
- Minor copy changes without structural impact

---

## Core Workflow

### Phase 1: Information Architecture

**Entry**: Architecture document exists
**Prerequisites Check**:
- If no architecture document found in `docs/xiaoxiao/plans/` → **BLOCKED**: "Cannot start ui-design. Run architect first to create architecture document."
**Actions**:
1. Review architecture - understand what screens/pages exist
2. Identify user touchpoints (where users interact with system)
3. Define page hierarchy and structure:
   - **Primary**: Most used screens
   - **Secondary**: Supporting screens
   - **Utility**: Settings, profile, etc.
4. Design navigation model (top nav, sidebar, tabs, etc.)
5. Ask: "What's the primary user journey through this system?"
**Exit**: Page structure and navigation model defined

**IA Template**:
```markdown
## Information Architecture

### Page Hierarchy
1. **Dashboard** (Primary) - /dashboard
   - Overview of key metrics and actions
2. **Projects** (Primary) - /projects
   - List and manage projects
3. **Settings** (Utility) - /settings
   - User and system settings

### Navigation Model
[Top bar with: Logo | Dashboard | Projects | Settings]

### User Journeys
1. [Login] → [Dashboard] → [Project Detail]
2. [Login] → [Projects] → [New Project]
```

---

### Phase 2: Screen Design

**Entry**: Information architecture defined
**Actions**:
1. Design each screen with ASCII wireframes or Mermaid
2. For each screen specify:
   - **Header**: Navigation, breadcrumbs
   - **Content Area**: Main content, lists, forms
   - **Sidebar**: Contextual navigation if needed
   - **Footer**: Secondary actions, help links
3. Define component states (default, hover, disabled, error)
4. Ask: "Does this layout support the user's primary task?"
**Exit**: All screens wireframed with component states

**Wireframe Example**:
```markdown
## Screen: Project List

```
+--------------------------------------------------+
| Logo   Dashboard | Projects | Settings    [User] |
+--------------------------------------------------+
| + New Project                                     |
+--------------------------------------------------+
| [Search projects...]                              |
+--------------------------------------------------+
| +----------------------------------------+-------+
| | [Icon] Project Alpha              >    | ...   |
| | Last edited: 2 hours ago               |       |
| +----------------------------------------+-------+|
| | [Icon] Project Beta                >    | ...   |
| | Last edited: yesterday                   |       |
| +----------------------------------------+-------+|
+--------------------------------------------------+
```
```

---

### Phase 3: Interaction Design

**Entry**: Screens wireframed
**Actions**:
1. Define user interactions and flows:
   - How users navigate between screens
   - Form submission flows
   - Feedback mechanisms (success, error, loading)
2. Identify micro-interactions:
   - Button states
   - Form validation
   - Toast notifications
3. Define edge cases:
   - Empty states
   - Loading states
   - Error states
4. Ask: "What happens when something goes wrong?"
**Exit**: Interaction patterns documented

**Flow Example**:
```markdown
## Interaction: Create Project

### Happy Path
1. User clicks [+ New Project]
2. Modal opens with form
3. User fills: Name (required), Description (optional)
4. User clicks [Create]
5. Modal closes, project appears in list
6. Toast: "Project created"

### Error: Empty Name
1. User clicks [+ New Project]
2. Modal opens
3. User clicks [Create] without entering name
4. Field shows: "Project name is required"
5. Modal stays open

### Loading State
1. User clicks [Create]
2. Button shows spinner, disabled
3. After 500ms, modal closes
```

---

### Phase 4: Component Definition

**Entry**: Interactions designed
**Actions**:
1. Define reusable components:
   - **Atomic**: Button, Input, Badge, Icon
   - **Molecular**: Form Group, Card, Modal
   - **Organism**: Navigation, Data Table, Filter Panel
2. For each component specify:
   - **Props/Attributes**: What data it accepts
   - **States**: default, hover, active, disabled, error
   - **Variants**: primary/secondary, sm/md/lg
3. Document component composition rules
**Exit**: Component library defined

**Component Spec Example**:
```markdown
## Component: Button

### Variants
- **Primary**: Main actions, filled background
- **Secondary**: Secondary actions, outlined
- **Ghost**: Tertiary actions, text only
- **Danger**: Destructive actions, red

### Sizes
- **sm**: 32px height, 12px padding
- **md**: 40px height, 16px padding (default)
- **lg**: 48px height, 20px padding

### States
| State | Visual Treatment |
|-------|------------------|
| Default | Base variant styles |
| Hover | Darken 10%, cursor pointer |
| Active | Darken 20%, slight scale down |
| Disabled | 50% opacity, cursor not-allowed |
| Loading | Spinner replaces text, disabled |
```

---

### Phase 5: Design Specification

**Entry**: Components defined
**Actions**:
1. Create design tokens:
   - **Colors**: Primary, secondary, semantic colors
   - **Typography**: Font family, sizes, weights
   - **Spacing**: 4px base unit system
   - **Shadows**: Elevation levels
2. Document responsive breakpoints
3. Specify accessibility requirements
4. Review complete design with user

**Run on completion**:
```bash
xiaoxiao complete ui-design docs/xiaoxiao/plans/ui-design-output.md
```

---

## Constraints

### MUST DO

- Design for the user's primary task, not edge cases
- Follow platform conventions (iOS HIG, Material Design, etc.)
- Design for empty states, loading states, and error states
- Use consistent component patterns
- Consider accessibility from the start (WCAG 2.1 AA)
- Document states explicitly, not just the happy path

### MUST NOT DO

- Design for the exception, not the rule
- Skip mobile/responsive design
- Use jargon or internal names without explanation
- Design without understanding the user's context
- Overcomplicate with animations or interactions
- Skip validation states on forms

---

## Reference Guide

| Topic | File | Load When |
|-------|------|-----------|
| Wireframe Symbols | GUIDES/wireframe-symbols.md | Creating ASCII wireframes |
| Component States | GUIDES/component-states.md | Documenting all component states |
| Interaction Patterns | GUIDES/interaction-patterns.md | Common user flow patterns |
| Accessibility Checklist | GUIDES/accessibility.md | WCAG compliance verification |
| Design Token Template | OUTPUTS/design-tokens.md | Creating consistent design system |

---

## Output: UI Design Document

### Required Sections

1. **Overview** (design goals and principles)
2. **Information Architecture** (page structure, navigation)
3. **Screen Wireframes** (ASCII or Mermaid for each screen)
4. **User Flows** (key interaction paths)
5. **Component Library** (atomic → organism)
6. **Design Tokens** (colors, typography, spacing)
7. **State Specifications** (all component states)

### Example Output

```markdown
# Login Flow - UI Design

## Overview
[Design goal: minimize login abandonment, support social login]

## Information Architecture
[See IA template above]

## Screen: Login Page

```
+--------------------------------------------------+
| [Logo]                                           |
+--------------------------------------------------+
|                                                  |
|           Sign in to your account                |
|                                                  |
|   +--------------------------------------------+ |
|   | Email                          | john@...  | |
|   +--------------------------------------------+ |
|                                                  |
|   +--------------------------------------------+ |
|   | Password                               **** | |
|   +--------------------------------------------+ |
|                                                  |
|   [ ] Remember me        Forgot password?       |
|                                                  |
|   +--------------------------------------------+ |
|   |            Sign In                         | |
|   +--------------------------------------------+ |
|                                                  |
|         or continue with                         |
|                                                  |
|   [Google]  [GitHub]  [Microsoft]               |
|                                                  |
+--------------------------------------------------+
```

## Component: Input Field

### States
| State | Border | Background | Text |
|-------|--------|------------|------|
| Default | #ddd | white | black |
| Focus | #0066cc | white | black |
| Error | #cc0000 | #fff5f5 | black |
| Disabled | #eee | #f5f5f5 | #999 |

[Additional components...]
```

---

## CONFIRM Nodes

| Phase | Confirmation Prompt |
|-------|---------------------|
| Phase 1 Complete | "IA: [structure]. Navigation: [model]. Proceed?" |
| Phase 2 Complete | "Screens: [count] wireframed. Layout approach: [X]. Continue?" |
| Phase 3 Complete | "Key flows documented. Error handling: [X]. Continue?" |
| Phase 4 Complete | "Components: [count] defined. Reuse strategy: [X]. Continue?" |
| Final | "UI Design complete. Proceed to Task Planning?" |
