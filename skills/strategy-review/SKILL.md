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
  - strategy review
  - review strategy
  - is it worth it
  - evaluate direction
  - ROI
output-format: docs/xiaoxiao/plans/strategy-review-output.md
related-skills:
  - product-consult
  - architect
prerequisites:
  - product-consult
---

# Strategy Review | Strategic Review

## Mandatory Execution Protocol

**Rules**:
- MUST execute each Step in order, no skipping
- MUST verify each Step (checkpoint) before proceeding to next
- MUST use `xiaoxiao save-progress <skill> <step>` to mark step completion
- CONFIRM nodes MUST wait for user confirmation, never auto-continue

---

## ⚠️ API Configuration Check (Required on First Use)

**Before executing this Skill, search API MUST be configured**:

1. Visit https://serper.dev to register (free 2500/month)
2. Get your API Key
3. Configure environment variable:
   ```bash
   # Windows (CMD)
   set SERPER_API_KEY=your_api_key

   # Windows (PowerShell)
   $env:SERPER_API_KEY="your_api_key"

   # Mac/Linux
   export SERPER_API_KEY=your_api_key
   ```
4. After configuration, continue to Step 1

**Important**:
- Without API Key, Step 3 (Market Analysis) and Step 4 (Competitive Analysis) cannot use search
- Configuration is one-time only, no need to repeat for subsequent uses

---

## Step 1: Initialization

**Action**:
1. Execute `xiaoxiao save-progress strategy-review step1-complete`
2. Read `./SPEC.md` for product information
3. Confirm product type, core scenario, P0 features

**Verification**: SPEC.md exists and contains product information

**CONFIRM**: "Step 1 complete. Product: [type], Core scenario: [scenario]. Continue?"

---

## Step 2: Direction Validation

**Action**:
1. Ask user:
   - "Is this problem worth solving right now?"
   - "What do we gain by doing this? What do we lose by not?"
   - "What is the strategic goal of this project?"
   - "What resources are available?"
2. Record direction validation conclusion

**Verification**: User answered all questions

**CONFIRM**: "Direction validation complete. Strategic match: [conclusion]. Continue?"

---

## Step 3: Market Analysis

**Prerequisite**: `SERPER_API_KEY` environment variable must be set (for search)
- Visit https://serper.dev to register for free API Key
- Windows: `set SERPER_API_KEY=your_key`
- Mac/Linux: `export SERPER_API_KEY=your_key`

**Action**:
1. Execute search commands to get market size data:
   ```bash
   node search.js "[product category] market size TAM" --engine serper
   node search.js "[product type] industry growth trend" --engine serper
   ```
2. Record findings (sources MUST be verifiable)
3. If search fails:
   - Mark as "Unverified - requires user input"
   - Ask user if they have internal data

**Verification**: Market data recorded (even if marked as Unverified)

**CONFIRM**: "Market analysis complete. TAM: [data], Trend: [trend]. Continue?"

---

## Step 4: Competitive Analysis

**Action**:
1. Execute search commands to find competitors:
   ```bash
   node search.js "[product category] competitors" --engine serper
   node search.js "[core need] solutions" --engine serper
   ```
2. Record competitor info (name, features, pricing, source)
3. If no competitors found:
   - Mark "No direct competitors found"
   - Ask user if they know of competitors

**Verification**: Competitor info recorded

**CONFIRM**: "Competitive analysis complete. Found [N] competitors. Continue?"

---

## Step 5: Feasibility Assessment

**Action**:
1. Technical feasibility:
   - Is the technology mature?
   - What is the biggest technical risk?
2. Resource feasibility:
   - What team is needed?
   - Estimated timeline?
3. Economic feasibility:
   - Development cost estimate?
   - ROI expectation?

**Verification**: All three dimensions assessed

**CONFIRM**: "Feasibility assessment complete. Biggest risk: [risk]. Continue?"

---

## Step 6: Risk Identification

**Action**:
1. Identify 3-5 major risks
2. For each risk, assess:
   - Probability: High/Medium/Low
   - Impact: High/Medium/Low
   - Mitigation strategy
3. Ask user:
   - "What risk could cause the project to fail?"
   - "What would make you change your mind?"

**Verification**: Risk list created and assessed

**CONFIRM**: "Risk identification complete. Major risks: [list]. Continue?"

---

## Step 7: Decision

**Action**:
1. Synthesize all analysis, form recommendation:
   - **Go**: Full investment
   - **Pivot**: Adjust scope/direction
   - **No-Go**: Terminate or re-evaluate
2. If Go: State success conditions
3. If No-Go: State what needs to change

**Verification**: Decision formed

**CONFIRM**: "Recommendation: [Go/Pivot/No-Go]. Confirm decision?"

---

## Step 8: Output Document

**Action**:
1. Create `docs/xiaoxiao/plans/strategy-review-output.md`
2. Include these sections:
   - Executive Summary
   - Market Analysis (with sources)
   - Competitive Landscape (with sources)
   - Feasibility Summary
   - Risk Assessment
   - Recommendation
   - Conditions for Success
   - Research Notes
3. Execute `xiaoxiao complete strategy-review docs/xiaoxiao/plans/strategy-review-output.md`

**Verification**: Document created with all sections

**CONFIRM**: "Strategy Review complete. Document saved. Confirm entry to Architect?"

---

## State Update Commands

After each Step, MUST execute:
```bash
xiaoxiao save-progress strategy-review step[N]-complete
```

For final completion, MUST execute:
```bash
xiaoxiao complete strategy-review docs/xiaoxiao/plans/strategy-review-output.md
```
