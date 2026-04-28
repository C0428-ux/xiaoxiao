---
name: architect
description: >-
  Designs system architecture by translating product requirements into technical
  blueprints. Defines subsystems, modules, interfaces, data flows, and technology
  choices. Use after strategy-review when technical implementation planning is needed.
  NOT for: UI design decisions, task breakdown, or coding implementation.
version: 1.0
domain: architecture
role: architect
triggers:
  - /architect
  - architecture design
  - design architecture
  - tech stack
  - system design
  - optimize architecture
  - refactor
  - adjust architecture
prerequisites:
  - strategy-review
output-format: docs/xiaoxiao/plans/architect-output.md
related-skills:
  - strategy-review
  - ui-design
  - task-planning
---

# Architect | Architecture Design

## Mandatory Execution Protocol

**Rules**:
- MUST execute each Step in order, no skipping
- MUST verify each Step (checkpoint) before proceeding to next
- MUST use `xiaoxiao save-progress <skill> <step>` to mark step completion
- CONFIRM nodes MUST wait for user confirmation, never auto-continue

---

## Step 1: Initialization

**Action**:
1. Execute `xiaoxiao save-progress architect step1-complete`
2. Check if `./SPEC.md` exists
3. Check if `docs/xiaoxiao/plans/strategy-review-output.md` exists

**Verification**: Both files exist

**CONFIRM**: "Step 1 complete. Both SPEC.md and strategy-review-output.md exist. Continue?"

---

## Step 2: Requirements Extraction

**Action**:
1. Read `./SPEC.md` - extract functional requirements
2. Read `docs/xiaoxiao/plans/strategy-review-output.md` - record constraints and decisions
3. Identify non-functional requirements:
   - Performance: latency, throughput, scalability
   - Reliability: uptime, recovery, redundancy
   - Security: authentication, authorization, data protection
   - Observability: logging, metrics, tracing

**Verification**: Requirements organized by category

**CONFIRM**: "Requirements extraction complete. Found [N] functional requirements, [N] non-functional constraints. Continue?"

---

## Step 3: Architecture Pattern Selection

**Action**:
1. Ask user: "How large is your team?" (<10 / 10-50 / 50+)
2. Ask user: "What matters most?" (fast iteration / stability / scalability / cost)
3. Based on answers, recommend architecture pattern:
   - <10 people + fast iteration → Monolith or Modular Monolith
   - 10-50 people + scalability → Modular Monolith or Microservices
   - 50+ people + independent deployment → Microservices
4. Record selected pattern and rationale

**Verification**: Architecture pattern selected with rationale recorded

**CONFIRM**: "Architecture pattern: [pattern]. Rationale: [reason]. Continue?"

---

## Step 4: Subsystem Decomposition

**Action**:
1. Identify bounded contexts / major domains
2. Define subsystems, each with single responsibility
3. Name each subsystem (ubiquitous language)
4. Record subsystem responsibilities
5. Identify cross-cutting concerns (authentication, logging, config)

**Verification**: Subsystem list created

**CONFIRM**: "Subsystems: [list]. Total: [N]. Continue?"

---

## Step 5: Interface & Data Flow Design

**Action**:
1. Define interfaces between subsystems
2. Clarify:
   - API contracts (request/response format)
   - Event patterns (async communication)
   - Data ownership (who is source of truth)
3. Design data flows: sync vs async paths
4. Record error handling and fallback paths

**Verification**: Key interfaces defined

**CONFIRM**: "Interface design complete. Defined [N] APIs. Continue?"

---

## Step 6: Technology Decisions

**Action**:
1. Make key technology choices for each subsystem:
   - Language/framework
   - Database (SQL vs NoSQL, specific technology)
   - Infrastructure (cloud, containers, serverless)
2. Create ADR (Architecture Decision Record) for each major decision
3. Ask user: "Are there technologies you have existing expertise with that you want to continue using?"

**Verification**: Tech stack defined, each major decision has ADR

**CONFIRM**: "Tech stack: [stack]. ADRs: [N]. Continue?"

---

## Step 7: Risks & Mitigation

**Action**:
1. Identify 3-5 major technical risks
2. For each risk, assess:
   - Probability: High/Medium/Low
   - Impact: High/Medium/Low
   - Mitigation strategy
3. Ask user: "What risk could cause the architecture to fail?"

**Verification**: Risk list created

**CONFIRM**: "Major risks: [list]. Continue?"

---

## Step 8: Output Document

**Action**:
1. Create `docs/xiaoxiao/plans/architect-output.md`
2. Include these sections:
   - Overview (system purpose and scope)
   - Architecture Pattern (selected pattern with rationale)
   - Subsystem Decomposition (subsystems and responsibilities)
   - Interface Design (key APIs and data flows)
   - Technology Stack (technology choices per subsystem with rationale)
   - ADRs (major decision records)
   - Architecture Diagram (Mermaid diagram)
   - Cross-Cutting Concerns (authentication, logging, config)
3. Execute `xiaoxiao complete architect docs/xiaoxiao/plans/architect-output.md`

**Verification**: Document created with all sections

**CONFIRM**: "Architect complete. Document saved. Confirm entry to UI Design?"

---

## State Update Commands

After each Step, MUST execute:
```bash
xiaoxiao save-progress architect step[N]-complete
```

For final completion, MUST execute:
```bash
xiaoxiao complete architect docs/xiaoxiao/plans/architect-output.md
```
