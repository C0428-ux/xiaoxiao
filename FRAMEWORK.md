# XiaoXiao Framework | Framework Specification

> **For Claude**: This is the framework's execution specification, not documentation.
> All content MUST be mandatory execution directives.

---

## Core Principles (MUST FOLLOW)

1. **Do Less**: Narrow is better than wide, YAGNI
2. **Do It Right**: Complete what you start, RED-GREEN-REFACTOR
3. **Evidence**: Interest ≠ demand
4. **Use Systems**: Systematic debugging
5. **Finish**: No half-done projects

---

## Architecture

```
Global Framework (~/.claude/skills/xiaoxiao/) + Project Local (each project independent)
```

| Layer | Location | Description |
|-------|----------|-------------|
| Global Framework | `~/.claude/skills/xiaoxiao/` | Framework code, install once |
| Project Local | `./xiaoxiao-state.json` | State file |
| Project Local | `./.SPEC.md` | Product specification |
| Project Local | `./docs/xiaoxiao/plans/` | Phase outputs |

---

## Flow (MUST EXECUTE IN ORDER)

```
product-consult → strategy-review → architect → ui-design → task-planning → tdd-development → ship
```

### Skill Dependency Chain (MUST RESPECT)

| Skill | Prerequisites |
|-------|---------------|
| product-consult | None |
| strategy-review | product-consult completed |
| architect | strategy-review completed |
| ui-design | architect completed |
| task-planning | ui-design completed |
| tdd-development | task-planning completed |
| ship | tdd-development completed |

---

## Skill States (MUST TRACK)

| State | Meaning | Action |
|-------|---------|--------|
| `pending` | Not executed | Wait for activation |
| `ready` | Can execute | Prerequisites met |
| `active` | In progress | Currently executing |
| `completed` | Done | Output generated |
| `blocked` | Blocked | Prerequisites not met |

---

## State Management Commands

```bash
xiaoxiao init-project [name]           # Initialize project
xiaoxiao status                         # Show status
xiaoxiao save-progress <skill> <phase>  # Save progress
xiaoxiao complete <skill>               # Mark complete
xiaoxiao goto <skill>                   # Jump to skill
xiaoxiao interrupt [note]               # Interrupt
xiaoxiao resume                         # Resume
xiaoxiao continue                       # Continue
```

---

## Update System (MUST CHECK)

Every time framework executes:
1. Execute `node xiaoxiao.js update-check`
2. Handle based on output:

| Output | Meaning | Action |
|--------|---------|--------|
| `STATUS: UP_TO_DATE` | No new version | Continue |
| `STATUS: UPDATE_AVAILABLE` | New version | Ask user |
| `STATUS: SKIP_FOREVER` | Skipped | Continue |

---

## Progressive Disclosure (PROGRESSION)

Each Skill has three layers:

1. **Layer 1 (SKILL.md)**: Triggers + Prerequisites + Core Steps
2. **Layer 2 (GUIDES/)**: Detailed flow + judgment criteria
3. **Layer 3 (OUTPUTS/)**: Templates + examples

---

## Handover Protocol (HANDOVER MUST FOLLOW)

After Skill completes:
1. Update current Skill state to `completed`
2. Set next Skill state to `ready`
3. Record `handover` context
4. Activate next Skill

---

## File Structure

### Global (Install Once)

```
~/.claude/skills/xiaoxiao/
├── xiaoxiao.js             # CLI entry
├── update-checker.js       # Update check
├── state-manager.js        # State management
├── skill-loader.js         # Skill loading
├── handover.js            # Handover protocol
├── constants.js           # Single source of truth
├── SKILL.md               # Framework entry
├── FRAMEWORK.md           # This file
├── README.md              # User manual
├── README-en.md           # English manual
└── skills/                # 7 Skills
    └── {skill}/
        ├── SKILL.md       # Execution script
        ├── PROTOCOL.json  # Machine-readable protocol
        ├── GUIDES/        # Reference docs
        └── OUTPUTS/       # Output templates
```

### Project Local

```
Project Root/
├── xiaoxiao-state.json     # State
├── .SPEC.md                # Product specification
└── docs/xiaoxiao/plans/    # Phase outputs
```

---

## Installation

```bash
mkdir -p ~/.claude/skills/xiaoxiao
git clone https://github.com/C0428-ux/xiaoxiao.git ~/.claude/skills/xiaoxiao
```
