---
name: product-consult
description: >-
  Conducts thorough product discovery through structured conversation to identify
  the core problem, validate real needs vs surface wants, define measurable success
  criteria, and scope MVP boundaries. Use when starting new projects, adding major
  features, pivoting product direction, or when requirements are unclear.
  NOT for: bug fixes, minor UI tweaks, performance optimizations, or tasks with
  existing detailed specs.
version: 1.0
domain: product
role: consultant
triggers:
  - /product-consult
  - 产品咨询
  - 我要做产品
  - 新项目
  - 添加功能
  - 需求不明确
  - 需求不清
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

### Phase 1: Problem Definition

**Entry**: User expresses intent to build something or add a feature
**Actions**:
1. Ask: "What problem are you trying to solve?"
2. Ask: "Why does this problem matter? What happens if we don't solve it?"
3. Ask: "Who is affected by this problem?"
4. Summarize back: "The core problem is [X]. Is this accurate?"
**Exit**: User confirms the problem statement

**Questions to probe deeper**:
- "What would happen if we did nothing for 6 months?"
- "What's the cost of the status quo?"
- "Who feels this pain most acutely?"

---

### Phase 2: Need Discovery

**Entry**: Problem confirmed in Phase 1
**Actions**:
1. Ask: "How do you currently solve this problem?"
2. Ask: "What would the ideal solution look like?"
3. Distinguish:
   - **Functional needs**: What the system must do
   - **Experience needs**: How it should feel to use
   - **Emotional needs**: What peace of mind looks like
4. Ask: "What have you tried before? What worked/didn't work?"
**Exit**: User validates the need hierarchy

**Warning signs**:
- User says "make an app" without being able to explain why
- "It needs to be fast/better/cleaner" without specifics
- Multiple competing priorities with equal weight

---

### Phase 3: Success Criteria

**Entry**: Need hierarchy validated
**Actions**:
1. Ask: "How will we know this is successful?"
2. Convert vague goals to measurable criteria:
   - ❌ "Fast" → ✅ "<200ms response time at p95"
   - ❌ "Easy to use" → ✅ "New user completes first task in <3 minutes"
   - ❌ "Popular" → ✅ "50% weekly active users by month 3"
3. Confirm: "We'll measure success by [these 3-5 metrics]. Agreed?"
**Exit**: At least 3 measurable success criteria defined

**Template**:
```markdown
## Success Criteria
- [ ] Metric 1: [specific, measurable outcome]
- [ ] Metric 2: [specific, measurable outcome]
- [ ] Metric 3: [specific, measurable outcome]
```

---

### Phase 4: Scope Boundary

**Entry**: Success criteria confirmed
**Actions**:
1. Ask: "What would the absolute minimum viable product look like?"
2. Ask: "What features are nice-to-have but not critical?"
3. Define:
   - **P0 (MVP)**: Must have for launch
   - **P1**: Important, can ship soon after
   - **P2**: Nice to have, future iteration
4. Explicitly state what's NOT in scope
**Exit**: Clear MVP scope with explicit boundaries

---

### Phase 5: Output SPEC.md

**Entry**: All previous phases complete
**Actions**:
1. Write the `.SPEC.md` document in the project root (see template below)
2. Review with user
3. Confirm: "This captures [X problem] with [Y scope] and [Z success criteria]. Ready to proceed?"
4. Run completion command

**Output location**: `./.SPEC.md` (project root)

**Run on completion**:
```bash
xiaoxiao complete product-consult .SPEC.md
```

---

## Constraints

### MUST DO

- Start with "What problem are you solving?" not "What do you want to build?"
- Distinguish surface requests ("make an app") from underlying needs
- Verify understanding before moving to next phase
- Make success criteria measurable and observable
- Define scope as explicitly as success criteria
- Document key insights discovered during consultation

### MUST NOT DO

- Accept the first answer as the final answer (always probe deeper)
- Skip the "why" - understanding motivation is critical
- Define success as technical metrics before business outcomes
- Allow scope to creep without re-evaluating priorities
- Output a spec without user confirmation
- Rush through discovery when stakes are high

---

## Reference Guide

| Topic | File | Load When |
|-------|------|-----------|
| Problem Definition Techniques | GUIDES/problem-definition.md | User can't articulate the problem |
| Need Discovery Questions | GUIDES/need-discovery.md | Surface needs vs real needs unclear |
| Success Criteria Templates | GUIDES/success-criteria.md | Criteria are vague or unmeasurable |
| Scope Prioritization | GUIDES/scoping.md | Scope is expanding uncontrollably |
| SPEC.md Template | OUTPUTS/SPEC-template.md | Writing the output document |

---

## Output: SPEC.md

### Required Sections

1. **Problem Statement** (1-3 sentences)
   - One clear sentence describing the core pain point

2. **Success Criteria** (3-5 bulleted, measurable)
   - Observable outcomes, not implementation details

3. **Scope**
   - **In**: What's included in MVP
   - **Out**: What's explicitly excluded

4. **Priority**
   - P0: MVP only - must have for launch
   - P1: Important but can ship later
   - P2: Nice to have, future

5. **Key Insights**
   - Discoveries during consultation that inform decisions

### Example Output

```markdown
# Login Flow Redesign

## Problem Statement
Users abandon the login flow at a 40% rate, with 60% of abandonments
occurring at the password reset step. This prevents core product usage
and drives negative reviews.

## Success Criteria
- [ ] Login completion rate increases from 60% to 85%
- [ ] Password reset completion rate increases from 40% to 75%
- [ ] Support tickets related to login issues decrease by 50%
- [ ] Time-to-login for new users under 90 seconds

## Scope
### In
- Simplified login form (email/password only)
- Social login (Google, GitHub)
- One-click password reset
- Remember device option

### Out
- Two-factor authentication (P1)
- SSO integration (P2)
- Account linking (P2)

## Priority
P0: Simplified login + password reset
P1: Social login
P2: Remember device

## Key Insights
- Password fatigue is the primary abandonment driver
- Users prefer social login over email when available
- Mobile abandonment rate (72%) is significantly higher than desktop (58%)
```

---

## CONFIRM Nodes

| Phase | Confirmation Prompt |
|-------|---------------------|
| Phase 1 Complete | "The core problem is **[X]**. Is this accurate?" |
| Phase 2 Complete | "Your needs are: Functional [X], Experience [Y], Emotional [Z]. Correct?" |
| Phase 3 Complete | "Success will be measured by: 1) [X], 2) [Y], 3) [Z]. Agreed?" |
| Phase 4 Complete | "MVP scope is [X]. P1 includes [Y]. Out of scope: [Z]. Proceed?" |
| Final | "SPEC.md is complete. Confirm to proceed to Strategy Review." |
