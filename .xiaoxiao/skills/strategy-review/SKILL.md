---
name: strategy-review
description: >-
  Evaluates product strategic value through market analysis, competitive research,
  feasibility assessment, and risk identification. Determines whether to proceed,
  pivot, or terminate. Use after product-consult when decisions about direction,
  investment, or priority need validation.
  NOT for: technical architecture decisions, UI design choices, or implementation planning.
version: 1.0
domain: strategy
role: advisor
triggers:
  - /strategy-review
  - 战略评审
  - 审查策略
  - 值不值得做
  - 评估方向
  - 投资回报
output-format: strategy-review.md
related-skills:
  - product-consult
  - architect
prerequisites:
  - product-consult
---

# Strategy Review | 战略评审

## When to Use

- After product-consult before architect
- When deciding whether to build, buy, or partner
- When validating product-market fit assumptions
- When resource allocation decisions are being made
- When pivot vs persist decisions are needed

## When NOT to Use

- Technical architecture decisions (use architect skill)
- UI/UX design choices (use ui-design skill)
- Implementation planning (use task-planning skill)
- When you already have a detailed spec and just need execution
- Bug fixes or feature additions to validated products

---

## Core Workflow

### Phase 1: Direction Validation

**Entry**: SPEC.md exists from product-consult
**Actions**:
1. Review SPEC.md problem statement
2. Ask: "Is this problem worth solving at this time?"
3. Ask: "What would we gain? What would we lose by not doing this?"
4. Assess strategic alignment with business goals
**Exit**: Clear on strategic intent and value proposition

**Key Questions**:
- "How does this align with [company/product] strategy?"
- "What's the opportunity cost of doing this vs other initiatives?"
- "Who are we betting on being right - users, market, or technology?"

---

### Phase 2: Market Analysis

**Entry**: Strategic intent confirmed
**Actions**:
1. Define target market segment
2. Assess market size (TAM/SAM/SOM if applicable)
3. Identify market trends (growing, stable, declining)
4. Ask: "What's driving this market?"
**Exit**: Market opportunity is quantified and validated

**Template**:
```markdown
## Market Analysis
- **TAM**: [Total Addressable Market]
- **SAM**: [Serviceable Addressable Market]
- **SOM**: [Serviceable Obtainable Market]
- **Trend**: [Growing/Stable/Declining]
- **Key Drivers**: [1-3 market forces]
```

---

### Phase 3: Competitive Landscape

**Entry**: Market analysis complete
**Actions**:
1. Identify direct competitors (solutions solving same problem)
2. Identify indirect competitors (alternative approaches)
3. Identify substitutes (users solving problem without products)
4. Assess competitive advantages and moats
**Exit**: Competitive positioning understood

**Analysis Template**:
```markdown
## Competitive Landscape
| Competitor | Target | Strengths | Weaknesses | Moat |
|------------|--------|-----------|------------|------|
| [Name]     | [Seg]  | [X]       | [Y]        | [Z]  |

**Our Positioning**: [How we differ and why we can win]
```

---

### Phase 4: Feasibility Assessment

**Entry**: Competitive analysis complete
**Actions**:
1. **Technical Feasibility**
   - Is the technology proven or experimental?
   - What are the technical risks?
   - Ask: "What's the biggest technical uncertainty?"

2. **Resource Feasibility**
   - Do we have/can we acquire the needed skills?
   - What's the timeline reality?
   - Ask: "What's the minimum team needed?"

3. **Economic Feasibility**
   - What's the development cost?
   - What's the expected ROI?
   - Ask: "What does success look like financially?"

**Exit**: Feasibility is validated with identified risks

---

### Phase 5: Risk Identification

**Entry**: Feasibility assessment complete
**Actions**:
1. Identify top 3-5 risks (market, technical, operational, financial)
2. Assess each risk:
   - **Probability**: High/Medium/Low
   - **Impact**: High/Medium/Low
   - **Mitigation**: What's the response strategy?
3. Ask: "What's the biggest risk that could kill this?"
**Exit**: Top risks are identified with mitigation strategies

---

### Phase 6: Go/No-Go Decision

**Entry**: All analysis complete
**Actions**:
1. Synthesize findings into recommendation
2. Three possible outcomes:
   - **Go**: Proceed with full investment
   - **Pivot**: Modify scope/direction based on findings
   - **No-Go**: Terminate or re-evaluate later
3. Document reasoning clearly
4. Confirm decision with user

**Decision Template**:
```markdown
## Recommendation: [Go/Pivot/No-Go]

### Reasoning
[Clear explanation of why]

### Conditions for Success
- [Condition 1]
- [Condition 2]

### Watch Items (risks to monitor)
- [Risk 1]
- [Risk 2]
```

**Run on completion**:
```bash
xiaoxiao complete strategy-review docs/xiaoxiao/plans/strategy-review-output.md
```

---

## Constraints

### MUST DO

- Be honest about negative findings - don't sugarcoat
- Consider opportunity cost, not just direct costs
- Distinguish between risks you can mitigate vs accept
- Make Go/No-Go decisions based on evidence, not enthusiasm
- Document assumptions explicitly

### MUST NOT DO

- Recommend "Go" just because the problem is interesting
- Ignore competitive moats - being first isn't enough
- Skip technical feasibility when it's uncertain
- Recommend proceeding when risks outweigh rewards
- Make decisions based on stakeholder pressure rather than data

---

## Reference Guide

| Topic | File | Load When |
|-------|------|-----------|
| Market Analysis Methods | GUIDES/market-analysis.md | Need to quantify market opportunity |
| Competitive Analysis Framework | GUIDES/competitive-analysis.md | Evaluating competitive positioning |
| Feasibility Assessment Checklist | GUIDES/feasibility.md | Technical/resource uncertainty exists |
| Risk Assessment Matrix | GUIDES/risk-assessment.md | Need structured risk evaluation |
| Go/No-Go Template | OUTPUTS/go-no-go-template.md | Making final decision document |

---

## Output: Strategy Review Document

### Required Sections

1. **Executive Summary** (3-5 sentences)
   - Problem, opportunity, recommendation

2. **Market Analysis**
   - Size, trends, key drivers

3. **Competitive Landscape**
   - Direct/indirect competitors, positioning

4. **Feasibility Summary**
   - Technical, resource, economic assessment

5. **Risk Assessment**
   - Top risks with probability/impact/mitigation

6. **Recommendation**
   - Go/Pivot/No-Go with reasoning

7. **Conditions for Success**
   - What must be true for this to work

### Example Output

```markdown
# Login Flow Redesign - Strategy Review

## Executive Summary
The login abandonment problem represents a significant market opportunity
(40% of users affected) with moderate competitive intensity. Technical
feasibility is high given proven auth patterns. Recommended: **Go** with
pivot to social-first login to differentiate.

## Market Analysis
- **TAM**: $2.4B (auth解决方案市场)
- **SAM**: $800M (SMB/SaaS segment)
- **SOM**: $40M (Year 1 reachable)
- **Trend**: Growing 15% YoY
- **Key Drivers**: Security compliance, SSO demand, password fatigue

## Competitive Landscape
[See competitive analysis table]

## Feasibility Summary
- **Technical**: Low risk - proven OAuth/social login patterns
- **Resource**: Medium - needs 2 backend + 1 frontend for MVP
- **Economic**: 3-month payback period projected

## Risk Assessment
| Risk | P | I | Mitigation |
|------|---|---|------------|
| OAuth provider dependency | M | H | Multi-provider strategy |
| Migration complexity | H | M | Phased rollout plan |

## Recommendation: **Go**
[Pivot from email-first to social-first approach]

## Conditions for Success
- [ ] Secure partnerships with OAuth providers
- [ ] Complete migration in under 4 months
- [ ] Achieve 80% login success rate
```

---

## CONFIRM Nodes

| Phase | Confirmation Prompt |
|-------|---------------------|
| Phase 2 Complete | "Market is [size] with [trend] trend. Continue?" |
| Phase 3 Complete | "Competitors: [X]. Our advantage: [Y]. Proceed?" |
| Phase 4 Complete | "Feasibility: [assessment]. Biggest risk: [X]. Continue?" |
| Phase 5 Complete | "Top risks: [list]. Acceptable?" |
| Phase 6 Complete | "Recommendation: **[Go/Pivot/No-Go]**. Confirmed?" |
