---
name: xiaoxiao
description: |
  XiaoXiao is an AI Agent development framework that guides projects from concept to launch through 7 ordered Skills.
  Flow: product-consult → strategy-review → architect → ui-design → task-planning → tdd-development → ship.
when_to_use: User says "/xiaoxiao", "/xiao", "start development flow", or "go through xiao"
version: 0.7
---

# XiaoXiao | AI Development Flow Framework

## Mandatory Execution Protocol

**Rules**:
- MUST execute each Step in order, no skipping
- MUST verify each Step (checkpoint) before proceeding to next
- MUST use `xiaoxiao save-progress xiaoxiao <step>` to mark step completion
- CONFIRM nodes MUST wait for user confirmation, never auto-continue

---

## Step 0: Check for Updates

**Action**:
1. Execute `node xiaoxiao.js update-check`

**Verification**: Based on output, decide next step

| Output contains | Meaning | Action |
|-----------------|---------|--------|
| `STATUS: UP_TO_DATE` | No new version | Proceed to Step 1 |
| `STATUS: UPDATE_AVAILABLE` | New version available | Ask user |
| `STATUS: SKIP_FOREVER` | Skipped permanently | Proceed to Step 1 |

**Ask user** (when update available):
> New version detected! Download update?
> - Yes: Run `node xiaoxiao.js update`
> - No: Continue to Step 1
> - Skip forever: Run `node xiaoxiao.js skip-update`

**CONFIRM**: "Update check complete. Continue?"

---

## Step 1: Install Subagents + Check Project Status

**Action**:
1. Check both locations for subagents:
   ```bash
   # Project-level
   ls "{PROJECT_ROOT}/.claude/agents/task-worker.md" 2>/dev/null && echo "PROJECT_FOUND" || echo "PROJECT_NOT_FOUND"
   # Global-level
   ls ~/.claude/agents/task-worker.md 2>/dev/null && echo "GLOBAL_FOUND" || echo "GLOBAL_NOT_FOUND"
   ```
2. If neither found, ask user:
   > xiaoxiao needs to install TDD subagents
   > Choose installation location:
   >   A. Current project: {PROJECT_ROOT}/.claude/agents/
   >   B. Global: ~/.claude/agents/
3. User selects (A or B)
4. If A: Claude runs `mkdir -p {PROJECT_ROOT}/.claude/agents && cp ~/.claude/skills/xiaoxiao/skills/tdd-development/agents/task-worker.md {PROJECT_ROOT}/.claude/agents/`
5. If B: Claude runs `bash ~/.claude/skills/xiaoxiao/install.sh`
6. Verify: `ls {selected_path}/ | grep task-worker`
7. Execute `node xiaoxiao.js status`
8. Read `xiaoxiao-state.json` (if exists)

**⚠️ API Configuration Check (Required for search)**:

Check if `SERPER_API_KEY` is configured:
```bash
# Windows CMD
echo %SERPER_API_KEY%
# Mac/Linux
echo $SERPER_API_KEY
```

If NOT configured, prompt user:
> ⚠️ Search functionality requires API Key configuration
>
> XiaoXiao's strategy-review needs search capability for market and competitive analysis.
>
> **Configuration steps**:
> 1. Visit https://serper.dev to register (free 2500/month)
> 2. Get your API Key
> 3. Configure environment variable:
>    - Windows CMD: `set SERPER_API_KEY=your_key`
>    - Windows PowerShell: `$env:SERPER_API_KEY="your_key"`
>    - Mac/Linux: `export SERPER_API_KEY=your_key`
>
> Continue after configuration.

**Verification**: Status retrieved, API configured or user chose to skip

**CONFIRM**:
- If no state.json: "No project detected. Create new project or add features to existing?"
- If state.json exists: "Existing project detected: [name]. Continue from current phase or restart?"

---

## Step 2: Project Initialization

**Based on user response**:

### Case A: New Project

**Action**:
1. Execute `node xiaoxiao.js init-project [project-name]`
2. Ask user for project name (if not provided)
3. Create project directory and initial state

**Verification**: Project initialized

**CONFIRM**: "Project [name] created. Continue to product consultation?"

### Case B: Add Features to Existing

**Action**:
1. Read project structure (package.json, README, main source files)
2. Ask user what features to add
3. Start product-consult based on existing code
4. Execute `node xiaoxiao.js init-project` if not initialized

**Verification**: Existing project understood, feature requirements clear

**CONFIRM**: "Existing project: [name]. Feature to add: [feature]. Continue to product consultation?"

---

## Step 3: Read and Execute product-consult

**Action**:
1. Read `skills/product-consult/SKILL.md`
2. **Also read** `skills/product-consult/PROTOCOL.json` (machine-readable protocol)
3. Execute product-consult skill (following SKILL.md Steps in order)

**Verification**: product-consult phase complete

**CONFIRM**: "product-consult complete. Confirm entry to strategy-review?"

---

## Step 4: Auto-transition to Next Skill

**After each Skill completes**:
1. Read next Skill's `SKILL.md`
2. **Also read** corresponding `PROTOCOL.json`
3. Execute Steps in order

| Completed | Read |
|-----------|------|
| product-consult | `skills/strategy-review/SKILL.md` + `PROTOCOL.json` |
| strategy-review | `skills/architect/SKILL.md` + `PROTOCOL.json` |
| architect | `skills/ui-design/SKILL.md` + `PROTOCOL.json` |
| ui-design | `skills/task-planning/SKILL.md` + `PROTOCOL.json` |
| task-planning | `skills/tdd-development/SKILL.md` + `PROTOCOL.json` |
| tdd-development | `skills/ship/SKILL.md` + `PROTOCOL.json` |
| ship | Complete |

**CONFIRM**: Ask for confirmation after each phase before proceeding to next

---

## State Update Commands

After each Step completes, MUST execute:
```bash
node xiaoxiao.js save-progress xiaoxiao step[N]-complete
```

---

## Progressive Disclosure

**Three-layer structure**:

1. **Entry Layer** (this file): Framework entry, mandatory execution script
2. **Skill Layer** (`skills/*/SKILL.md` + `PROTOCOL.json`): Execution script + machine-readable protocol
3. **Reference Layer** (`skills/*/GUIDES/*`): Detailed docs, read as needed

**Reading order**:
```
User triggers → Read root SKILL.md → Execute Steps → Read skill SKILL.md + PROTOCOL.json → Execute → Next skill
```

**PROTOCOL.json purpose**:
- Read by `xiaoxiao.js continue` command for step-by-step guidance
- Framework verifies each Step executed in order
- Entry/exit commands for each Phase auto-executed by framework

---

## Architecture

```
D:\XiaoXiao\
├── SKILL.md                  ← Entry file (this file)
├── xiaoxiao.js               ← CLI
├── state-manager.js          ← State management
├── skill-loader.js           ← Skill loading
├── handover.js              ← Handover protocol
├── skills/                   ← 7 phases
│   ├── product-consult/
│   │   ├── SKILL.md         ← Execution script
│   │   ├── PROTOCOL.json   ← Machine-readable protocol
│   │   └── GUIDES/         ← Reference docs
│   ├── strategy-review/
│   ├── architect/
│   ├── ui-design/
│   ├── task-planning/
│   ├── tdd-development/
│   ├── ship/
│   └── search/              ← Built-in search tool
└── docs/xiaoxiao/plans/     ← Phase output directory
```

---

## Core Principles

- **Do Less**: Narrow is better than wide, YAGNI
- **Do It Right**: Complete what you start, RED-GREEN-REFACTOR
- **Evidence**: Interest ≠ demand
- **Use Systems**: Systematic debugging
- **Finish**: No half-done projects

**Key**: Every CONFIRM node MUST wait for user confirmation, never auto-continue.
