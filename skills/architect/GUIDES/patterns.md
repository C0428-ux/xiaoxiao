# Architecture Pattern Selection Guide | Architecture Patterns

## Core Objective

Select the most suitable architecture pattern based on product scale, team capability, and business characteristics.

## Common Architecture Patterns

### 1. Monolithic Architecture (Monolith)

**Characteristics**:
- All code packaged in one deployment unit
- All modules share database
- Simple and straightforward

**Applicable Scenarios**:
- Small teams (< 10 people)
- Rapid iteration phase
- Initial product validation

**Advantages**:
- Simple, easy to understand
- Easy deployment
- Fast development

**Disadvantages**:
- Single technology stack
- Limited scalability
- Hard to maintain as team grows

### 2. Modular Monolith

**Characteristics**:
- Clear boundaries between modules
- Modules can be developed independently
- Still a single deployment unit

**Applicable Scenarios**:
- Medium-sized teams (10-30 people)
- Need clear module division
- But no independent deployment needed

**Advantages**:
- Clear boundaries
- Easy for team division
- Simple deployment

**Disadvantages**:
- Still has scaling limitations
- Possible implicit coupling between modules

### 3. Microservices Architecture

**Characteristics**:
- Each service deployed independently
- Services communicate via APIs
- Each has its own database

**Applicable Scenarios**:
- Large teams (50+ people)
- Need independent scaling
- Multi-technology stack requirements

**Advantages**:
- Independent scaling
- Technology flexibility
- Good fault tolerance

**Disadvantages**:
- High complexity
- High operational cost
- Distributed system problems

### 4. Event-Driven Architecture

**Characteristics**:
- Services communicate via events
- Asynchronous processing
- Eventual consistency

**Applicable Scenarios**:
- High real-time requirements
- Need for decoupling
- Many asynchronous tasks

**Advantages**:
- Loose coupling
- Scalable
- Suitable for real-time systems

**Disadvantages**:
- Difficult to debug
- Eventual consistency
- High complexity

## Decision Matrix

| Factor | Monolith | Modular Monolith | Microservices | Event-Driven |
|--------|----------|------------------|---------------|---------------|
| Team size | <10 | 10-30 | 50+ | Any |
| Iteration speed | Fast | Fast | Slow | Medium |
| Scaling needs | Low | Medium | High | High |
| Technology diversity | No | Limited | Yes | Yes |
| Operational capability | Low | Medium | High | High |
| Complexity | Low | Medium | High | High |

## Selection Steps

```
1. Evaluate team size
   ↓
2. Evaluate scaling needs
   ↓
3. Evaluate operational capability
   ↓
4. Match pattern
```

## Architecture Evolution

Don't start with the most complex architecture from the beginning.

```
MVP → Modular Monolith → (if needed) Microservices
```

## Hybrid Architecture

Can also be combined:

```
Core system uses monolith + specific features use microservices
```

## Common Mistakes

| Mistake | Problem | Recommendation |
|---------|---------|----------------|
| Microservices phobia | Using microservices for everything | Start with monolith |
| Microservices mania | Premature splitting | Split when team and system grow |
| Technology trend following | Others use microservices so I do too | Choose based on actual needs |

## When to Exit

- Architecture pattern is selected
- Team has consensus on the pattern
- Pattern selection has clear justification
