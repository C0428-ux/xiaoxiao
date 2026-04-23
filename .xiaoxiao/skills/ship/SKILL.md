---
name: ship
description: >-
  Executes safe, monitored production releases from code review through deployment,
  validation, and post-launch monitoring. Handles rollback procedures when issues
  arise. Use after tdd-development when code is ready for production.
  NOT for: development work, architecture decisions, or design tasks.
version: 1.0
domain: operations
role: release-engineer
triggers:
  - /ship
  - 发布
  - 上线
  - 部署
  - deploy
prerequisites:
  - tdd-development
output-format: deployment-report.md
related-skills:
  - tdd-development
---

# Ship | 发布上线

## When to Use

- After tdd-development when all tasks complete
- When deploying to any environment (staging, production)
- When validating releases before going live
- When rolling back problematic deployments
- When establishing monitoring for new features

## When NOT to Use

- Development or coding tasks (use tdd-development)
- Architecture decisions (use architect)
- UI design (use ui-design)
- Task planning (use task-planning)
- Quick hotfixes without proper process
- When tests are failing

---

## Core Workflow

### Phase 1: Pre-Release Validation

**Entry**: Development complete
**Actions**:
1. Verify all tasks completed:
   - [ ] All tests pass locally
   - [ ] All PRs reviewed and merged
   - [ ] Code follows project standards
2. Run pre-release checklist:
   - [ ] Security scan completed
   - [ ] Performance benchmarks met
   - [ ] Database migrations reviewed
   - [ ] Environment variables configured
3. Create release candidate
4. Ask: "Ready for deployment?"
**Exit**: Release validated, ready to deploy

**Pre-Release Checklist**:
```markdown
## Pre-Release Validation

### Code Quality
- [ ] All tests passing (local)
- [ ] All tests passing (CI)
- [ ] Code review approved
- [ ] No security vulnerabilities (lint/scan)
- [ ] No console errors in logs

### Performance
- [ ] API response < [SLA] p95
- [ ] Page load < [SLA] ms
- [ ] No memory leaks detected

### Data
- [ ] Migration scripts reviewed
- [ ] Rollback scripts prepared
- [ ] Seed data ready (if needed)

### Config
- [ ] Environment variables set
- [ ] Secrets secured (not in code)
- [ ] Feature flags configured
```

---

### Phase 2: Deployment Execution

**Entry**: Pre-release validated
**Actions**:
1. Announce deployment start (notify stakeholders)
2. Execute deployment steps (specific to infrastructure):
   - Build artifacts
   - Deploy to target environment
   - Run database migrations
3. Monitor deployment progress
4. Verify deployment success
5. Ask: "Deployment successful. Proceed to validation?"
**Exit**: Application deployed to target environment

**Deployment Announcement Template**:
```markdown
## 🚀 Deployment Started

**Project**: [Name]
**Version**: [Version/Commit]
**Environment**: [Staging/Production]
**Deployed by**: [User]
**Time**: [Timestamp]

### Changes
- [List of features/changes]

### Monitoring
[Link to monitoring dashboard]
```

---

### Phase 3: Post-Deploy Validation

**Entry**: Deployment complete
**Actions**:
1. Run smoke tests (critical paths)
2. Verify key metrics:
   - **Error rate**: Within normal bounds
   - **Latency**: Within SLA
   - **Traffic**: Normal pattern
3. Check logging for errors
4. Verify data integrity
5. Ask: "All validations passed. Release to users?"
**Exit**: Validation complete, ready for traffic

**Smoke Test Template**:
```markdown
## Post-Deploy Smoke Tests

### Critical Paths
- [ ] Login flow works
- [ ] Core feature X accessible
- [ ] API health check passes
- [ ] No increase in error rate

### Metrics Check
| Metric | Expected | Actual | Status |
|--------|----------|--------|--------|
| Error rate | <0.1% | X% | ✅/❌ |
| p95 latency | <200ms | Xms | ✅/❌ |
| Uptime | 99.9% | X% | ✅/❌ |
```

---

### Phase 4: Production Release

**Entry**: Validation passed
**Actions**:
1. Enable traffic to new deployment (gradual if possible)
2. Monitor for 15-30 minutes:
   - Error rates
   - Latency
   - User-facing metrics
3. Watch for anomalies
4. Set up post-launch monitoring
5. Announce successful release
**Exit**: New version serving production traffic

---

### Phase 5: Post-Launch Monitoring

**Entry**: Production release complete
**Actions**:
1. Monitor for 24-48 hours:
   - Error rates
   - Performance metrics
   - User feedback
   - Support tickets
2. Set up alerts for anomalies
3. Document lessons learned
4. Update runbooks if needed
5. Close release

**Monitoring Template**:
```markdown
## 📊 Post-Launch Monitoring (24h)

### Key Metrics
| Metric | Baseline | Current | Delta |
|--------|----------|---------|-------|
| Error rate | X% | X% | +/-Y% |
| p95 latency | Xms | Xms | +/-Y% |
| Requests/sec | X | X | +/-Y% |

### Incidents
- None / [List any incidents]

### User Feedback
[Summary of feedback received]

### Lessons Learned
[What went well/what to improve]
```

**Run on completion**:
```bash
xiaoxiao complete ship docs/xiaoxiao/plans/ship-output.md
```

---

## Rollback Procedures

### When to Rollback

- Error rate spikes significantly
- Critical functionality broken
- Performance degrades below SLA
- Security issue discovered
- Data corruption detected

### How to Rollback

1. **Immediate Actions**:
   ```bash
   # Stop traffic to new version
   # Route to previous stable version
   ```

2. **Communication**:
   ```markdown
   ## ⚠️ Rollback Initiated

   **Reason**: [Description]
   **Impact**: [What's affected]
   **ETA**: [Time to complete]
   ```

3. **Post-Rollback**:
   - Verify system stable
   - Investigate root cause
   - Plan fix before next release

---

## Constraints

### MUST DO

- Verify all tests pass before deployment
- Have working rollback plan ready
- Monitor immediately after deployment
- Communicate with stakeholders
- Document everything (deploys, incidents, resolutions)
- Keep deployment small and frequent

### MUST NOT DO

- Deploy with failing tests
- Skip monitoring after deployment
- Deploy on Fridays or before holidays (unless critical)
- Force push to production without validation
- Ignore warning signs in metrics
- Deploy during high-traffic periods (unless urgent)

---

## Reference Guide

| Topic | File | Load When |
|-------|------|-----------|
| Deployment Scripts | GUIDES/deployment-scripts.md | Environment-specific deployment |
| Rollback Procedures | GUIDES/rollback.md | Emergency rollback steps |
| Monitoring Setup | GUIDES/monitoring.md | Setting up alerts and dashboards |
| Incident Response | GUIDES/incident-response.md | Handling production issues |
| Release Checklist | OUTPUTS/release-checklist.md | Pre-release validation |

---

## Output: Deployment Report

### Required Sections

1. **Release Summary** (version, changes, duration)
2. **Pre-Release Validation** (checklist results)
3. **Deployment Steps** (what was executed)
4. **Post-Release Validation** (smoke test results)
5. **Monitoring Setup** (alerts configured)
6. **Incidents** (if any)
7. **Lessons Learned**

### Example Output

```markdown
# Release Report: v2.1.0

## Summary
- **Version**: 2.1.0 (commit abc123)
- **Environment**: Production
- **Duration**: 45 minutes
- **Status**: ✅ Success

## Changes
- Feature: User authentication (OAuth)
- Feature: Project dashboard redesign
- Fix: Login timeout issue

## Pre-Release
- [x] All tests passing
- [x] Code review approved
- [x] Security scan clean
- [x] Migration reviewed

## Deployment Steps
1. 14:00 - Build artifacts
2. 14:15 - Deploy to staging
3. 14:25 - Smoke tests passed
4. 14:30 - Deploy to production
5. 14:35 - Monitoring enabled

## Post-Release Monitoring (48h)
| Metric | Expected | Actual |
|--------|----------|--------|
| Error rate | <0.1% | 0.05% |
| p95 latency | <200ms | 145ms |

## Incidents
None

## Lessons Learned
- OAuth integration took longer than expected (3d vs 2d estimate)
- Consider OAuth token refresh in next release
```

---

## CONFIRM Nodes

| Phase | Confirmation Prompt |
|-------|---------------------|
| Phase 1 Complete | "Pre-release checks: [N] passed, [N] failed. Proceed?" |
| Phase 2 Complete | "Deployed to [environment]. Verify success?" |
| Phase 3 Complete | "Smoke tests: [N] passed. Validating metrics?" |
| Phase 4 Complete | "Serving [X]% traffic. Monitoring for 30min." |
| Final | "Release successful. Monitoring for 24-48h. Done?" |
