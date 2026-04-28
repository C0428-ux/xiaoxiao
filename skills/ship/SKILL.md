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
  - ship
  - release
  - deploy
  - launch
prerequisites:
  - tdd-development
output-format: docs/xiaoxiao/plans/ship-output.md
related-skills:
  - tdd-development
---

# Ship | Production Release

## Mandatory Execution Protocol

**Rules**:
- MUST execute each Step in order, no skipping
- MUST verify each Step (checkpoint) before proceeding to next
- MUST use `xiaoxiao save-progress <skill> <step>` to mark step completion
- CONFIRM nodes MUST wait for user confirmation, never auto-continue

---

## Step 1: Initialization

**Action**:
1. Execute `xiaoxiao save-progress ship step1-complete`
2. Check if `docs/xiaoxiao/plans/tdd/` exists (development output)
3. Run local test suite: `npm test`
4. Verify all PRs reviewed and merged

**Verification**: Tests pass, PRs merged

**CONFIRM**: "Step 1 complete. Tests pass, code merged. Continue?"

---

## Step 2: Pre-Release Checklist

**Action**:
1. Run pre-release checklist:
   - [ ] Security scan complete
   - [ ] Performance benchmarks met
   - [ ] Database migrations reviewed
   - [ ] Environment variables configured
2. Create release candidate
3. Ask user: "Ready to deploy?"

**Verification**: Pre-release checklist complete

**CONFIRM**: "Pre-release check: [N] passed, [N] failed. Ready to deploy?"

---

## Step 3: Deployment Execution

**Action**:
1. Notify stakeholders deployment starting
2. Execute deployment steps:
   - Build artifacts
   - Deploy to target environment
   - Run database migrations
3. Monitor deployment progress
4. Verify deployment success
5. Ask user: "Deployment successful. Continue with verification?"

**Verification**: Deployment successful

**CONFIRM**: "Deployed to [environment]. Verification successful?"

---

## Step 4: Post-Deployment Verification

**Action**:
1. Run smoke tests (critical paths)
2. Verify key metrics:
   - Error rate: within normal range
   - Latency: within SLA
   - Traffic: normal pattern
3. Check logs for errors
4. Verify data integrity
5. Ask user: "All verifications passed. Release to users?"

**Verification**: Verification complete

**CONFIRM**: "Smoke tests: [N] passed. Verify metrics?"

---

## Step 5: Production Release

**Action**:
1. Enable traffic to new deployment (gradually if possible)
2. Monitor for 15-30 minutes:
   - Error rate
   - Latency
   - User metrics
3. Watch for anomalies
4. Set up post-release monitoring
5. Announce successful release

**Verification**: New version serving production traffic

**CONFIRM**: "Serving [X]% traffic. Monitoring for 30 minutes."

---

## Step 6: Post-Release Monitoring

**Action**:
1. Monitor for 24-48 hours:
   - Error rate
   - Performance metrics
   - User feedback
   - Support tickets
2. Set up anomaly alerts
3. Document lessons learned
4. Update runbooks if needed
5. Close release

**Verification**: Monitoring complete, release closed

**CONFIRM**: "Post-release monitoring complete (24-48h). Any incidents to handle?"

---

## Step 7: Rollback Preparation

**Action**:
1. Ensure rollback plan is ready
2. Document rollback triggers:
   - Error rate significantly increased
   - Critical functionality broken
   - Performance below SLA
   - Security issue detected
   - Data corruption detected
3. Ask user: "Do you need me to prepare a detailed rollback procedure document now?"

**Verification**: Rollback preparation ready

**CONFIRM**: "Rollback preparation ready. Continue?"

---

## Step 8: Output Document

**Action**:
1. Create `docs/xiaoxiao/plans/ship-output.md`
2. Include these sections:
   - Release Summary (version, changes, duration)
   - Pre-Release Validation (checklist results)
   - Deployment Steps (steps executed)
   - Post-Release Validation (smoke test results)
   - Monitoring Setup (alerts configured)
   - Incidents (if any)
   - Lessons Learned
3. Execute `xiaoxiao complete ship docs/xiaoxiao/plans/ship-output.md`

**Verification**: Document created with all sections

**CONFIRM**: "Ship complete. Document saved. All phases complete!"

---

## State Update Commands

After each Step, MUST execute:
```bash
xiaoxiao save-progress ship step[N]-complete
```

For final completion, MUST execute:
```bash
xiaoxiao complete ship docs/xiaoxiao/plans/ship-output.md
```
