# Scope Definition Techniques | Scope Definition

## Core Objective

Clarify **what to do** and **what not to do**, avoid scope creep while not missing important content.

## Scope Definition Principles

### 1. MVP First

MVP (Minimum Viable Product) = Minimum features to satisfy early user validation

```
Problem → Minimum solution → Quick validation → Iterate
```

### 2. Explicit Exclusions

Not only tell users "what to do," but also explicitly state "what not to do."

```markdown
### Included
- User registration and login
- Basic profile management

### Not Included
- Social sharing features
- Third-party login (P2)
- Admin dashboard (P2)
```

## Priority Definition

| Priority | Definition | Delivery time | Notes |
|----------|------------|---------------|-------|
| P0 | Must have | MVP | Product cannot be used without this |
| P1 | Should have | v1.0 | Important but not MVP |
| P2 | Nice to have | v1.x | Nice to have |

## Scope Creep Handling

### Warning Signs

- User says "while we're at it..."
- "This is simple, let's do it on the side"
- Discussion scope gradually expanding

### Response Phrases

```
"This feature will affect the release date, we can..."
- "Write it down as P1"
- "Add it after MVP validation"
- "But it requires X more days of work, is it worth it?"
```

## Scope Boundary Dialogue Template

```
"The core of MVP is solving [core problem], we only need..."
  ↓
"These features will be in P1: ..."
  ↓
"These are explicitly not in MVP scope: ..."
  ↓
"When the core problem is validated, we'll prioritize P1"
```

## Scope Confirmation Checklist

- [ ] Core problem (P0) is clearly defined
- [ ] Each P0 feature has user value
- [ ] P1/P2 have clear boundaries
- [ ] User explicitly agrees to scope boundaries
- [ ] "Not included" content is explicitly listed

## When to Exit

- P0/MVP scope is clear and confirmed by user
- P1/P2 have preliminary definitions
- "Not included" content is clearly explained
- User agrees to priority ordering
