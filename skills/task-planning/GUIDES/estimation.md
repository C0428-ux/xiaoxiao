# Estimation Techniques Guide | Estimation Techniques

## Core Objective

Break down tasks and estimate reasonable workload.

## Estimation Units

| Level | Hours | Description |
|-------|-------|-------------|
| XS | 1-2h | Simple, certain |
| S | 4h | Standard, predictable |
| M | 1-2d | Has complexity |
| L | 3-5d | High complexity |
| XL | 5+d | Needs splitting |

## Estimation Methods

### 1. Comparison Method

```markdown
Select a known task as baseline
↓
Compare the new task's complexity with the baseline
↓
Give a relative estimate
```

### 2. Three-Point Estimation

```markdown
Optimistic (O): Everything goes well
Most Likely (M): Normal conditions
Pessimistic (P): Many problems

Final estimate = (O + 4M + P) / 6
```

### 3. Story Point Method

```markdown
1 point = 1 standard person-day

Reference task: 1 point
New task vs reference:
- 2x complex → 2 points
- 3x complex → 3 points
```

## Influencing Factors

### Factors that increase estimates

- Unknown technology (needs learning)
- Complex business logic
- Multi-party dependency coordination
- High quality requirements
- Needs test coverage

### Factors that decrease estimates

- Familiar tech stack
- Simple CRUD
- Existing code to reference
- Clear business rules

## Estimation Conversation Template

```markdown
"What does this task involve?"
  ↓
"Are there similar tasks we can reference?"
  ↓
"What is the biggest uncertainty?"
  ↓
"Considering these factors, what is the estimate?"
```

## Buffer Time

| Task Complexity | Recommended Buffer |
|-----------------|--------------------|
| Low | 10% |
| Medium | 20% |
| High | 30% |
| Experimental | 50%+ |

## Common Mistakes

| Mistake | Problem | Correction |
|---------|---------|------------|
| Optimistic estimation | Only considers smooth scenarios | Add buffer |
| Ignoring research | Uncertain technology not accounted for | Split into research and implementation |
| Ignoring testing | Only estimated development | Add testing time |
| Ignoring meetings | Assumes pure development time | Add 20% |

## When to Exit

- All tasks have estimates
- Estimates have been discussed with the team
- Buffer time has been considered
- User confirms estimates are reasonable
