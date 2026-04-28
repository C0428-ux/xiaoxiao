# Monitoring Setup Guide | Monitoring Setup

## Core Objective

Establish a complete monitoring system to ensure problems are discovered early and handled promptly.

## Four Pillars of Monitoring

| Type | Purpose | Examples |
|------|---------|---------|
| **Metrics** | Quantify system state | CPU, memory, request count |
| **Logs** | Record event details | Error logs, access logs |
| **Traces** | Track request chains | End-to-end call chains |
| **Alerts** | Notify anomalies | Email, SMS, Slack |

## Key Metrics

### Application Metrics

| Metric | Alert Threshold | Description |
|--------|-----------------|-------------|
| Error Rate | > 1% | 5-minute average |
| Response Time (p95) | > 500ms | 95th percentile |
| Response Time (p99) | > 1s | 99th percentile |
| Request Rate | < normal - 50% | Abnormal decline |

### System Metrics

| Metric | Alert Threshold | Description |
|--------|-----------------|-------------|
| CPU | > 80% | 5-minute average |
| Memory | > 85% | Sustained 5 minutes |
| Disk | > 80% | - |
| Process Restart | > 3 times/hour | Abnormal restart |

### Business Metrics

| Metric | Alert Threshold | Description |
|--------|-----------------|-------------|
| Order Count | < normal - 50% | Abnormal decline |
| Conversion Rate | < normal - 30% | Abnormal decline |
| Active Users | < normal - 40% | Abnormal decline |

## Monitoring Dashboard

### 1. Overview Dashboard

```
┌─────────────────────────────────────────────────┐
│  System Status: Normal  Uptime: 15 days         │
├─────────────────────────────────────────────────┤
│  Requests   │  Error Rate │ Response Time │ CPU │
│  1,234/s    │  0.1%       │  45ms         │ 35% │
└─────────────────────────────────────────────────┘
```

### 2. Trend Charts

```
Error Rate Trend (24h)
─────────────────
5% │        ╭─╮
   │    ╭──╯  ╰──╮
 0%─┼───╯───────────╰──
   00:00  06:00  12:00  18:00
```

## Log Monitoring

### Log Levels

| Level | Purpose | Example |
|-------|---------|---------|
| ERROR | Errors | Database connection failed |
| WARN | Warnings | Succeeded after 3 retries |
| INFO | Information | Request succeeded |
| DEBUG | Debugging | Detailed execution flow |

### Log Format

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "ERROR",
  "service": "api-gateway",
  "traceId": "abc123",
  "message": "Database connection failed",
  "error": {
    "code": "ECONNREFUSED",
    "stack": "..."
  }
}
```

## Alert Configuration

### Alert Rule Examples

```yaml
# Prometheus Alert Rules
groups:
- name: api-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_errors_total[5m]) > 0.01
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"

  - alert: HighLatency
    expr: histogram_quantile(0.95, http_request_duration_seconds) > 0.5
    for: 5m
    labels:
      severity: warning
```

### Alert Notifications

```markdown
## Alert Notification

Subject: [Critical] High Error Rate Alert

Body:
Time: 2024-01-15 10:30:00
Service: api-gateway
Environment: production
Error Rate: 5.2% (Threshold: 1%)

Recommended Actions:
1. Check logs
2. Review Metrics
3. Rollback if needed
```

## Health Checks

### Endpoints

```bash
# Health Check
GET /health

Response:
{
  "status": "healthy",
  "version": "1.2.3",
  "uptime": 86400,
  "checks": {
    "database": "ok",
    "redis": "ok",
    "external": "ok"
  }
}
```

### Checklist

- [ ] Health check endpoint is working
- [ ] Alert rules configured
- [ ] Alert notifications reachable
- [ ] Dashboard accessible
- [ ] Logs being collected

## When to Exit

- All key metrics are monitored
- Alert rules configured
- Alert notifications working
