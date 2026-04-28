# Success Criteria Design | Success Criteria

## Core Objective

Transform vague "success" into **measurable, verifiable metrics**.

## Good Criteria vs. Bad Criteria

| Bad Criteria | Good Criteria | Improvement |
|--------------|---------------|--------------|
| "System must be fast" | "API response time p95 < 200ms" | Specific value |
| "Easy to use" | "New user first task completion rate > 80%" | Measurable |
| "More users" | "Monthly active user growth 20%" | Has baseline |
| "Stable" | "Availability > 99.9%" | Verifiable |

## Metric Types

### 1. Business Metrics
```
- Revenue growth X%
- User growth X%
- Conversion rate improvement X%
- Customer satisfaction improvement X%
```

### 2. Product Metrics
```
- DAU/MAU users
- User retention rate
- Feature adoption rate
- Task completion rate
```

### 3. Technical Metrics
```
- Response time (p50/p95/p99)
- Availability (uptime %)
- Error rate (error rate %)
- Performance (throughput)
```

## Metric Design Steps

### Step 1: Backtrack from Business Goals

```
Business goal: Increase revenue
    ↓
User behavior: More paying users
    ↓
Conversion funnel: Register → Trial → Pay
    ↓
Key metric: Trial to paid conversion rate
```

### Step 2: Establish Baseline

```
Current state: [current value]
Goal: [expected value]
Gap: [how much improvement needed]
```

### Step 3: Set Acceptance Criteria

```
Metric: Paid conversion rate
Baseline: Current 5%
Target: Increase to 10%
Acceptance: Conversion rate >= 10% for 30 consecutive days
```

## Metric Template

```markdown
## Success Criteria

| # | Metric Name | Current | Target | Measurement | Acceptance Criteria |
|---|-------------|---------|--------|-------------|---------------------|
| 1 |             |         |        |             |                     |
| 2 |             |         |        |             |                     |
| 3 |             |         |        |             |                     |

### Metric Details

**Metric 1: [Name]**
- Definition: [Specific calculation method]
- Data source: [Where to get data]
- Measurement frequency: [Daily/Weekly/Monthly]
```

## Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Prioritizing technical metrics | May disconnect from business | Business first, then technical |
| Too many metrics | Cannot focus | Maximum 5 core metrics |
| Cannot measure | Cannot verify | Find quantifiable alternative metrics |
| No baseline | Cannot assess progress | Establish baseline first |

## SMART Principles

Good metrics should be:

- **S**pecific: Metric definition is clear
- **M**easurable: Has explicit values
- **A**chievable: Resources available to achieve
- **R**elevant: Relevant to business goals
- **T**ime-bound: Has clear time milestones

## When to Exit

- At least 3 measurable metrics
- Each metric has clear current value and target value
- User confirms these metrics can measure success
