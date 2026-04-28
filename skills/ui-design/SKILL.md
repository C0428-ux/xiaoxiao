---
name: ui-design
description: >-
  Designs user interfaces by producing actual visual output (HTML pages) that users
  can see and judge directly. Supports iteration based on user feedback before
  proceeding. Use after architect when the product needs screen designs.
  NOT for: backend design, task planning, or implementation.
version: 2.0
domain: design
role: designer
triggers:
  - /ui-design
  - UI design
  - interface design
  - wireframe
  - interaction design
prerequisites:
  - architect
output-format: HTML preview files in docs/xiaoxiao/plans/ui-design/
related-skills:
  - architect
  - task-planning
---

# UI Design | Interface Design

## Mandatory Execution Protocol

**Rules**:
- MUST execute each Step in order, no skipping
- MUST verify each Step (checkpoint) before proceeding to next
- MUST use `xiaoxiao save-progress <skill> <step>` to mark step completion
- CONFIRM nodes MUST wait for user confirmation, never auto-continue

---

## Step 1: Initialization

**Action**:
1. Execute `xiaoxiao save-progress ui-design step1-complete`
2. Check if `docs/xiaoxiao/plans/architect-output.md` exists
3. Check if `./SPEC.md` exists

**Verification**: Both files exist

**CONFIRM**: "Step 1 complete. Both architect document and SPEC.md exist. Continue?"

---

## Step 2: Design Style Selection

**Action**:
1. Read `docs/xiaoxiao/plans/architect-output.md` - understand subsystem boundaries
2. Read `./SPEC.md` - extract P0 features
3. Present 5 design style presets to user:

```
┌─────────────────────────────────────────────────────────┐
│  Design Style Selection                                  │
├─────────────────────────────────────────────────────────┤
│  [1] Modern SaaS      - B2B products, admin dashboards  │
│  [2] Apple Minimal    - Consumer apps, tools             │
│  [3] Enterprise      - Enterprise internal systems      │
│  [4] Creative         - Portfolios, creative websites    │
│  [5] Dashboard       - Data platforms, Analytics         │
└─────────────────────────────────────────────────────────┘
```

4. Ask user: "Which design style best matches your product?"
5. Load selected preset (from `GUIDES/design-presets.md`)

**Verification**: Design preset confirmed

**CONFIRM**: "Design style: [style]. Is this the direction you like?"

---

## Step 3: Information Architecture

**Action**:
1. Define page hierarchy:
   - Primary: Most used pages (Dashboard, Home)
   - Secondary: Supporting pages (Settings, Profile)
   - Utility: Rarely accessed pages
2. Design navigation model:
   - Top navigation (suitable for 3-5 items)
   - Sidebar (suitable for 5+ items)
   - Tabs (suitable for same-page panel switching)
3. Identify user touchpoints for each P0 feature
4. Ask user: "Navigation structure: [top nav/sidebar]. Is this familiar to you?"

**Verification**: IA confirmed

**CONFIRM**: "IA: [structure]. Navigation: [model]. Continue?"

---

## Step 4: Page Design

**Action**:
1. For each page:
   - Define content structure
   - Select appropriate components from pattern library
   - Write HTML using Tailwind CSS classes
2. Use Tailwind CDN for preview (no build step required)
3. Generate preview: `node skills/ui-design/preview/generate.js --data <page-data.json> --output docs/xiaoxiao/plans/ui-design/preview.html`
4. Ask user: "Page [X] design complete. How does the preview look? Any adjustments needed?"

**Verification**: All pages designed

**CONFIRM**: "Page design complete. Total: [N] pages. Continue?"

---

## Step 5: Preview & Iteration

**Action**:
1. Run preview generation
2. Open preview file for user
3. For each page, ask:
   - "Does this page's design convey the right information hierarchy?"
   - "Are colors, spacing, and components appropriate?"
   - "What needs adjustment?"
4. If user requests changes:
   - Modify HTML
   - Regenerate preview
   - Repeat until satisfied
5. Confirm each page before proceeding to next

**Verification**: All pages approved by user

**CONFIRM**: "All pages approved. Continue?"

---

## Step 6: Component Definition

**Action**:
1. Define cross-page reusable components:
   - Atomic: Button, Input, Badge, Icon
   - Molecular: Card, Form Group, Modal
   - Organism: Navigation, Data Table, Filter Panel
2. Record component states (default, hover, disabled, error)
3. Reference `GUIDES/component-patterns.md`
4. Ask user: "Component library defined. Any component specs to add?"

**Verification**: Component library defined

**CONFIRM**: "Component library complete. Continue?"

---

## Step 7: Final Review

**Action**:
1. Review complete design with user
2. Check against original requirements:
   - All P0 features have pages?
   - Navigation supports user flows?
   - Component patterns applied consistently?
3. Ask user: "Is the overall design approved?"

**Verification**: Overall design approved

**CONFIRM**: "Is UI Design overall approved? Confirm to proceed to Task Planning."

---

## Step 8: Output Files

**Action**:
1. Create output directory structure:
```
docs/xiaoxiao/plans/ui-design/
├── preview.html              # Full preview
├── pages/
│   ├── dashboard.html
│   ├── settings.html
│   └── ...
├── components/
│   └── component-spec.md    # Component specs
└── design-tokens.json        # Design tokens
```
2. Execute `xiaoxiao complete ui-design docs/xiaoxiao/plans/ui-design/`

**Verification**: All files created

**CONFIRM**: "UI Design complete. Files saved. Confirm entry to Task Planning?"

---

## State Update Commands

After each Step, MUST execute:
```bash
xiaoxiao save-progress ui-design step[N]-complete
```

For final completion, MUST execute:
```bash
xiaoxiao complete ui-design docs/xiaoxiao/plans/ui-design/
```
