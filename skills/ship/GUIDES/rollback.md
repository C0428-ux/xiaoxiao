# Rollback Guide | Rollback Procedures

## Core Objective

Quickly and safely rollback to a stable version when deployment fails.

## Rollback Triggers

| Condition | Description |
|-----------|-------------|
| Health check failed | Still failing after multiple retries |
| Error rate spiked | Exceeds normal baseline by 3x |
| Critical functionality unavailable | Core features erroring |
| Severe performance degradation | Response time exceeds SLA by 5x |

## Rollback Strategies

### 1. Blue-Green Deployment

```markdown
[Green] Production Environment ← Current Traffic
[Blue]  New Version           ← Standby

When problem occurs:
Switch traffic to Blue → Stop problematic Green version
```

### 2. Canary Release

```markdown
Traffic allocation:
5%  → New version
95% → Stable version

Problem discovered:
Gradually reduce new version traffic until complete rollback
```

### 3. Fast Rollback

```markdown
When problem is discovered:
1. Immediately stop new version
2. Switch to previous stable version
3. Preserve现场 for investigation
```

## Rollback Steps

### Step 1: Confirm Problem

```markdown
Check metrics:
- Is error rate really increased?
- Is it another reason (network, dependency)?
- How large is the impact scope?
```

### Step 2: Decision

```markdown
Need to rollback?
- Problem affects core functionality → Rollback
- Problem affects small number of users → Can continue observing
- Problem is controllable → Try fixing then deploy
```

### Step 3: Execute Rollback

```bash
# Method A: Use version tags
git checkout v1.2.3
npm run build
pm2 restart app

# Method B: Use containers
kubectl rollout undo deployment/myapp

# Method C: Use load balancer
Switch traffic from new version back to old version
```

### Step 4: Verify

```bash
# Health check
curl https://api.example.com/health

# Functionality verification
Run smoke tests

# Metric confirmation
Error rate returns to normal
Response time returns to normal
```

### Step 5: Notify

```markdown
After rollback complete:
1. Notify relevant teams
2. Document incident
3. Schedule postmortem
```

## Rollback Time Objectives

| Scenario | Target Time |
|----------|-------------|
| Fast rollback | < 5 minutes |
| Standard rollback | < 15 minutes |
| Complex rollback | < 30 minutes |

## Post-Rollback Handling

### 1. Preserve现场

```markdown
Do not delete problematic version immediately
Preserve logs, Metrics, Traces
For problem investigation
```

### 2. Incident Documentation

```markdown
## Rollback Incident Report

Time: [Time]
Problem: [Phenomenon]
Cause: [Preliminary judgment]
Impact: [Scope]
Rollback: [Duration]
Improvement: [Measures]
```

### 3. Postmortem Meeting

```markdown
Discussion:
1. What is the root cause?
2. Why didn't testing catch it?
3. How to prevent it from happening again?
```

## When to Exit

- System restored to stable state
- Error rate back to normal baseline
- Core functionality working normally
- User impact minimized
