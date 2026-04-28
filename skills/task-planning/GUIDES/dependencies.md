# Dependency Management Guide | Dependency Management

## Core Objective

Identify inter-task dependencies, sequence them properly, and ensure efficient execution.

## Dependency Types

### 1. Technical Dependencies

```markdown
Task A (prerequisite) → Task B (dependent)

Example:
Database Design → API Development
UI Component Development → Page Integration
```

### 2. Business Dependencies

```markdown
Requirements Confirmation → Design Development
Design Review → Development Implementation
```

### 3. Resource Dependencies

```markdown
Designer A → Can only do design work A and B
Frontend Resources → Can only handle 2 tasks simultaneously
```

## Drawing Dependency Graphs

```markdown
## Dependency Graph

Task A ──┬──> Task D
         │
Task B ──┴──> Task D ──> Task F
         │
Task C ───────────────> Task F
```

## Critical Path Identification

### Critical Path = Longest time required to complete the project

```markdown
Longest dependency chain:
A → B → D → F → G = 15 days

Other tasks can run in parallel, but these must be sequential:
Total duration = 15 days
```

## Dependency Handling Strategies

### 1. Serialization

```markdown
When A is a prerequisite for B:
→ Complete A first
→ Then start B
```

### 2. Parallelization

```markdown
When A and B have no dependencies:
→ Start A and B simultaneously
→ Saves total time
```

### 3. Dependency Resolution

```markdown
When A and B block each other:
→ Find a common intermediate point
→ Define clear interfaces
→ Both sides can develop independently
```

## Dependency Risk Management

| Risk | Impact | Response |
|------|--------|----------|
| External dependency delay | Blocks downstream tasks | Engage early, find alternatives |
| Internal dependency conflict | Resource contention | Coordinate priorities, parallel processing |
| Missing dependencies | Rework later | Careful review, regular checks |

## Dependency Checklist

- [ ] Prerequisite tasks are marked for each task
- [ ] No circular dependencies (A→B→C→A)
- [ ] Critical path identified
- [ ] External dependencies have owners
- [ ] Dependencies updated when changes occur

## When to Exit

- All dependency relationships are clear
- Critical path identified
- No circular dependencies
- Dependency risks assessed
