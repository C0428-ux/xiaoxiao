# Sprint Planning Guide | Sprint Planning

## Core Objective

Assign tasks to sprints reasonably to ensure predictable delivery.

## Sprint Cycle

| Duration | Advantages | Disadvantages |
|----------|------------|---------------|
| 1 week | Fast feedback | High planning overhead |
| 2 weeks | Balanced | - |
| 3 weeks | Less planning | Slow feedback |

## Sprint Capacity Calculation

### Available Human Resources

```markdown
Team: 3 people
Each person per day: 6 hours (meetings/other takes 2 hours)
Sprint: 2 weeks (10 working days)

Capacity = 3 × 6 × 10 = 180 person-hours
        = 180 / 8 = 22 person-days
```

### Capacity Allocation

```markdown
Total capacity: 22 person-days
  - Planning/Retrospective: 2 person-days
  - Technical challenges: 2 person-days
  - Urgent tasks: 2 person-days
Available: 16 person-days
```

## Sprint Planning Steps

### 1. Define Sprint Goal

```markdown
Sprint 1 Goal:
- User login feature goes live
- Complete homepage UI design
```

### 2. Select PBIs

```
Priority from high to low:
☐ P0: User login ← Select
☐ P0: Homepage UI   ← Select
☐ P1: Social login   (Not enough capacity, skip)
```

### 3. Break Down Tasks

```markdown
User Login (P0)
├── Design login UI        4h
├── Design registration UI  4h
├── Develop login API       8h
├── Develop registration API 8h
├── Frontend login integration  8h
├── Frontend registration integration  8h
├── Testing              8h
└── Deployment           4h
────────────────────
Total: 52h ≈ 6.5 person-days
```

### 4. Validate Capacity

```markdown
Selected tasks: 6.5 person-days
Available capacity: 16 person-days
─────────────
Remaining: 9.5 person-days → Can add more P1 tasks
```

## Sprint Execution

### Daily Standup

```markdown
1. What did you complete yesterday?
2. What are you planning to do today?
3. What are the blockers?
```

### Sprint End

```markdown
1. Demo completed features
2. Review what went well/what needs improvement
3. Calculate burndown chart
```

## Estimate vs Actual

Record the gap between estimates and actual:

```markdown
| Task | Estimate | Actual | Variance |
|------|----------|--------|----------|
| Login UI | 4h | 5h | +1h |
| Login API | 8h | 8h | 0 |
```

**Purpose**: Continuously calibrate estimation ability

## When to Exit

- Sprint goal is clear
- Tasks are assigned
- Capacity is validated
- Team commits to the plan
