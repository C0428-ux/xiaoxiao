# XiaoXiao Framework

> AI Agent Development Framework: Guides projects from concept to launch through 7 ordered Skills.

---

## Installation

### Step 1: Download the Framework

In Claude Code, just say:

```
Please download and install the xiaoxiao framework
Repository: https://github.com/C0428-ux/xiaoxiao
Install to: ~/.claude/skills/xiaoxiao
```

### Or Manual Installation

In terminal (git bash / WSL / Mac/Linux):

```bash
git clone https://github.com/C0428-ux/xiaoxiao.git ~/.claude/skills/xiaoxiao
```

---

## Quick Start

After installation, tell Claude:

```
I want to build a food delivery platform
```

Claude will automatically load the product consultation flow and guide you through the entire development process.

---

## Development Flow

```
product-consult → strategy-review → architect → ui-design → task-planning → tdd-development → ship
```

### 7 Skills

| Skill | Trigger | What it does |
|-------|---------|--------------|
| product-consult | "I want to build a product", "new project" | Define product type, features, user flows |
| strategy-review | "Evaluate this", "Is it worth it" | Market analysis, competitive research |
| architect | "Design architecture", "Tech stack" | System design, subsystem division |
| ui-design | "UI design", "Prototype" | Layout, interaction, components |
| task-planning | "Task planning", "Schedule" | Task breakdown, estimation |
| tdd-development | "Start development", "Write code", "Fix bug" | Test-driven development |
| ship | "Deploy", "Launch" | Deployment, verification, monitoring |

---

## Maintenance Scenarios

| You say | Claude does |
|---------|-------------|
| "Fix a bug" | Invokes TDD development flow |
| "Add a feature" | Invokes task planning flow |
| "Optimize performance" | Invokes architecture design flow |
| "Upgrade product" | Invokes product consultation flow |

---

## Common Commands

Run in your project directory (not the framework directory):

```bash
# Initialize project
xiaoxiao init-project [project-name]

# Check status
xiaoxiao status

# Check for framework updates
xiaoxiao update-check

# Update framework
xiaoxiao update

# Skip update check (permanent)
xiaoxiao skip-update

# Check version
xiaoxiao version

# Save progress
xiaoxiao save-progress <skill> <phase>

# Continue development
xiaoxiao continue

# Resume interrupted work
xiaoxiao resume

# Mark complete
xiaoxiao complete <skill> [output-file-path]
```

---

## Core Principles

- **Do Less**: Narrow is better than wide, YAGNI
- **Do It Right**: Complete what you start, RED-GREEN-REFACTOR
- **Evidence**: Interest ≠ demand
- **Use Systems**: Systematic debugging
- **Finish**: No half-done projects

---

## License

MIT
