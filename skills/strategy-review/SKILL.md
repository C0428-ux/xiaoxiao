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
**Prerequisites Check**:
- If `./SPEC.md` does not exist → **BLOCKED**: "Cannot start strategy-review. Run product-consult first to create SPEC.md."
**Actions**:
1. Read `./SPEC.md` - extract product type, core scenario, and P0 features
2. Ask: "Is this problem worth solving at this time?"
3. Ask: "What would we gain? What would we lose by not doing this?"
4. Assess strategic alignment with business goals
5. Ask: "What resources are available for this project?"
**Exit**: Clear on strategic intent and resource constraints

**Save Progress**:
```bash
xiaoxiao save-progress strategy-review phase1
```

**Key Questions**:
- "How does this align with [company/product] strategy?"
- "What's the opportunity cost of doing this vs other initiatives?"
- "Who are we betting on being right - users, market, or technology?"

---

### Phase 2: Market Analysis

**Entry**: Strategic intent confirmed
**Actions**:
1. Search for market size data using WebSearch:
   - Query: "[product category] market size 2024 TAM"
   - Query: "[product type] industry growth trend"
2. Document findings with sources:
   - **TAM**: [size] - Source: [URL or report name]
   - **Trend**: [Growing/Stable/Declining] - Source: [citation]
   - **Key Drivers**: [1-3 market forces] - Source: [evidence]
3. If search fails to return useful data:
   - Report: "Could not find reliable market data for [category]"
   - Ask user: "Do you have internal estimates for market size?"
   - Mark TAM as "Unverified - requires user input"
4. Ask: "Does this market opportunity align with our capabilities?"
**Exit**: Market opportunity quantified with source citations

**Save Progress**:
```bash
xiaoxiao save-progress strategy-review phase2
```

**IMPORTANT**:
- ❌ Do NOT fabricate numbers
- ❌ Do NOT use placeholder values like "[Total Addressable Market]"
- ✅ Report "Unverified" if data not found
- ✅ Always cite the source of any data point

**Template**:
```markdown
## Market Analysis
- **TAM**: [Amount] - Source: [URL/Report/Date]
- **SAM**: [Amount] - Source: [citation]
- **SOM**: [Amount] - Source: [basis for estimate]
- **Trend**: [Growing/Stable/Declining] - Source: [citation]
- **Key Drivers**: [1-3 market forces with citations]

**Research Notes**: [Any gaps or uncertainties found]
```

---

### Phase 3: Competitive Landscape

**Entry**: Market analysis complete
**Actions**:
1. Search for competitors using WebSearch:
   - Query: "[product category] competitors"
   - Query: "[core user need] solutions"
   - Query: "[product type] market leaders"
2. For each competitor identified, search for:
   - Pricing model
   - Key features
   - Market share (if available)
   - Strengths and weaknesses
3. Document findings with sources:
   - **Competitor Name**: [brief description] - Source: [URL]
   - **Pricing**: [if found] - Source: [citation]
4. If unable to find competitors:
   - Report: "No direct competitors found for [product type]"
   - Possible reasons: "Niche market", "Emerging category", "New problem space"
   - Ask user: "Are you aware of any solutions addressing this problem?"
5. Assess our positioning:
   - What do we do that competitors don't?
   - What is our differentiator?
   - Is this differentiation sustainable?
**Exit**: Competitive landscape mapped with source citations

**Save Progress**:
```bash
xiaoxiao save-progress strategy-review phase3
```

**IMPORTANT**:
- ❌ Do NOT invent competitors that don't exist
- ❌ Do NOT assume we know competitor features without research
- ✅ Report "Could not verify" if information is uncertain
- ✅ Distinguish between direct competitors, indirect competitors, and substitutes

**Template**:
```markdown
## Competitive Landscape

| Competitor | Type | Key Features | Pricing | Source |
|------------|------|--------------|---------|--------|
| [Name]     | [Direct/Indirect] | [X] | [$/month or N/A] | [URL] |

**Our Positioning**: [How we differ and why we can win]

**Research Notes**: [Competitors not found / Information uncertain]
```

---

### Phase 4: Feasibility Assessment

**Entry**: Competitive analysis complete
**Actions**:
1. **Technical Feasibility**
   - Is the technology proven or experimental?
   - What are the technical risks?
   - Ask: "What's the biggest technical uncertainty?"
   - If uncertain, propose a spike or POC

2. **Resource Feasibility**
   - Do we have/can we acquire the needed skills?
   - What's the timeline reality?
   - Ask: "What's the minimum team needed?"
   - Ask: "What's the estimated development time?"

3. **Economic Feasibility**
   - What's the estimated development cost?
   - What's the expected ROI?
   - Ask: "What does success look like financially?"
   - If uncertain, provide best-case / worst-case estimates

**Exit**: Feasibility validated with identified risks and uncertainties

**Save Progress**:
```bash
xiaoxiao save-progress strategy-review phase4
```

**IMPORTANT**:
- ❌ Do not understate risks to please the user
- ✅ Acknowledge uncertainty explicitly
- ✅ Provide ranges (e.g., "3-6 months") when exact estimates aren't possible

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
4. Ask: "What would make you change your mind about pursuing this?"
**Exit**: Top risks identified with mitigation strategies

**Save Progress**:
```bash
xiaoxiao save-progress strategy-review phase5
```

**IMPORTANT**:
- ❌ Do not hide risks that are obvious
- ✅ Be direct about critical risks
- ✅ Distinguish between risks we can mitigate vs risks we must accept

---

### Phase 6: Go/No-Go Decision

**Entry**: All analysis complete
**Actions**:
1. Synthesize findings into recommendation
2. Three possible outcomes:
   - **Go**: Proceed with full investment
   - **Pivot**: Modify scope/direction based on findings
   - **No-Go**: Terminate or re-evaluate later
3. If recommending Go, state conditions that must be true
4. If recommending No-Go, explain what would need to change
5. Confirm decision with user

**Run on completion**:
```bash
xiaoxiao complete strategy-review docs/xiaoxiao/plans/strategy-review-output.md
```
This updates `xiaoxiao-state.json` and records the skill output path.

**IMPORTANT**: Without running `xiaoxiao complete`, the skill is not marked as done and next skills will be blocked.

---

## Constraints

### MUST DO

- Research actual market data, not fabricated numbers
- Cite sources for all competitive and market information
- Be honest when data is unavailable or uncertain
- Challenge assumptions that seem optimistic
- Consider opportunity cost, not just direct costs
- Make Go/No-Go decisions based on evidence, not enthusiasm

### MUST NOT DO

- Recommend "Go" just because the problem is interesting
- Fabricate TAM/SAM/SOM numbers without research
- Invent competitors or feature claims without verification
- Ignore competitive moats - being first isn't enough
- Skip technical feasibility when it's uncertain
- Recommend proceeding when risks outweigh rewards

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
   - Product, opportunity, recommendation

2. **Market Analysis**
   - Size, trends, key drivers (with source citations)

3. **Competitive Landscape**
   - Direct/indirect competitors (with source citations)
   - Our positioning and differentiator

4. **Feasibility Summary**
   - Technical, resource, economic assessment

5. **Risk Assessment**
   - Top risks with probability/impact/mitigation

6. **Recommendation**
   - Go/Pivot/No-Go with reasoning

7. **Conditions for Success**
   - What must be true for this to work

8. **Research Notes**
   - Any data gaps, unverified assumptions, or uncertainties

---

## CONFIRM Nodes

| Phase | Confirmation Prompt |
|-------|---------------------|
| Phase 2 Complete | "Market is [size] with [trend] trend. Sources: [citations]. Continue?" |
| Phase 3 Complete | "Competitors: [X]. Our advantage: [Y]. Proceed?" |
| Phase 4 Complete | "Feasibility: [assessment]. Biggest risk: [X]. Continue?" |
| Phase 5 Complete | "Top risks: [list]. Acceptable?" |
| Phase 6 Complete | "Recommendation: **[Go/Pivot/No-Go]**. Confirmed?" |
