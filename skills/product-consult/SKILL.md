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
  - product consultation
  - I want to build a product
  - new project
  - add feature
  - requirements unclear
  - build product
  - design product
output-format: .SPEC.md
related-skills:
  - strategy-review
  - architect
prerequisites: []
---

# Product Consult | Product Consultation

## Mandatory Execution Protocol

**Rules**:
- MUST execute each Step in order, no skipping
- MUST verify each Step (checkpoint) before proceeding to next
- MUST use `xiaoxiao save-progress <skill> <step>` to mark step completion
- CONFIRM nodes MUST wait for user confirmation, never auto-continue

---

## Step 1: Initialization

**Action**:
1. Execute `xiaoxiao save-progress product-consult step1-complete`
2. Ask user:
   - "What type of product is this?" (e.g., Web App, Mobile App, SaaS Platform)
   - "Who are the primary users?" (e.g., Admin, End Users, Developers)
3. Confirm product type

**Verification**: User answered product type and users

**CONFIRM**: "Step 1 complete. Product type: [type], Primary users: [users]. Continue?"

---

## Step 2: Core Scenario

**Action**:
1. Ask user:
   - "What core problem does the user solve?"
   - "What is the single most important action for users?"
2. Summarize in one sentence:
   - "This is a [product type] that helps [users] complete [core action]"
3. Confirm summary is correct

**Verification**: Core scenario confirmed

**CONFIRM**: "Core scenario: [one sentence summary]. Correct?"

---

## Step 3: Feature Design

**Action**:
1. Ask user:
   - "What features MUST be in the first version?" (P0)
   - "What features are important but not critical?" (P1)
   - "What features are nice to have?" (P2)
2. For each P0 feature, define user flow:
   - Entry: How does user start?
   - Core steps: What must happen?
   - Exit: How does user complete?
3. Ask: "What should this product ABSOLUTELY NOT do?" (explicit out-of-scope)

**Verification**: P0/P1/P2 features defined, out-of-scope explicit

**CONFIRM**: "P0: [feature list]. Out of scope: [list]. Continue?"

---

## Step 4: UX Structure

**Action**:
1. Ask user:
   - "How do users navigate between features?"
   - "What is the main Dashboard/Home layout?"
   - "How do users access P0 features?"
2. List required pages:
   - Home/Dashboard
   - P0 feature pages
   - Settings/Profile (if needed)
3. Ask: "Are there different user roles with different permissions?" (e.g., Admin vs Regular users)

**Verification**: Page list and navigation structure confirmed

**CONFIRM**: "Pages: [list]. Navigation: [model]. Continue?"

---

## Step 5: Success Criteria

**Action**:
1. Ask user: "How do we measure if this product is successful?"
2. Define 3-5 measurable criteria (not technical metrics, business outcomes):
   - ❌ "Fast" → ✅ "<3 seconds for main operation"
   - ❌ "Easy to use" → ✅ "New users complete first task in <5 minutes"
   - ❌ "Popular" → ✅ "50% weekly active users by month 3"

**Verification**: 3-5 measurable criteria defined

**CONFIRM**: "Success criteria: [list]. Agree?"

---

## Step 6: MVP Scope

**Action**:
1. Ask user: "What is the absolute minimum required to launch?"
2. Define boundaries:
   - **In (included)**: What MVP must have
   - **Out (excluded)**: What is explicitly not doing
3. Confirm MVP scope

**Verification**: MVP boundaries explicit

**CONFIRM**: "MVP: [features]. Out of scope: [features]. Continue?"

---

## Step 7: Output SPEC.md

**Action**:
1. Create `.SPEC.md` in project root
2. Include these sections:
   - Product Type & Users
   - Core Scenario
   - Features (P0/P1/P2 + user flows)
   - UX Structure (pages + navigation)
   - Success Criteria (3-5 measurable criteria)
   - MVP Scope (In/Out lists)
3. Execute `xiaoxiao complete product-consult .SPEC.md`

**Verification**: .SPEC.md created with all sections

**CONFIRM**: "SPEC.md complete and saved. Confirm entry to Strategy Review?"

---

## State Update Commands

After each Step, MUST execute:
```bash
xiaoxiao save-progress product-consult step[N]-complete
```

For final completion, MUST execute:
```bash
xiaoxiao complete product-consult .SPEC.md
```
