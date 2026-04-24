# 监控设置指南 | Monitoring Setup

## 核心目标

建立完整的监控体系，确保问题早发现、早处理。

## 监控四大支柱

| 类型 | 作用 | 示例 |
|------|------|------|
| **Metrics** | 量化系统状态 | CPU、内存、请求数 |
| **Logs** | 记录事件详情 | 错误日志、访问日志 |
| **Traces** | 追踪请求链路 | 端到端调用链 |
| **Alerts** | 通知异常 | 邮件、短信、Slack |

## 关键指标

### 应用指标

| 指标 | 告警阈值 | 说明 |
|------|----------|------|
| Error Rate | > 1% | 5分钟内平均 |
| Response Time (p95) | > 500ms | 95分位 |
| Response Time (p99) | > 1s | 99分位 |
| Request Rate | < 正常 - 50% | 异常下降 |

### 系统指标

| 指标 | 告警阈值 | 说明 |
|------|----------|------|
| CPU | > 80% | 5分钟内平均 |
| Memory | > 85% | 持续 5 分钟 |
| Disk | > 80% | - |
| Process Restart | > 3次/小时 | 异常重启 |

### 业务指标

| 指标 | 告警阈值 | 说明 |
|------|----------|------|
| 订单数 | < 正常 - 50% | 异常下降 |
| 转化率 | < 正常 - 30% | 异常下降 |
| 活跃用户 | < 正常 - 40% | 异常下降 |

## 监控仪表盘

### 1. 概览仪表盘

```
┌─────────────────────────────────────────────────┐
│  系统状态：正常  运行时间：15天                   │
├─────────────────────────────────────────────────┤
│  请求量    │  错误率   │ 响应时间  │   CPU     │
│  1,234/s  │  0.1%    │  45ms     │   35%     │
└─────────────────────────────────────────────────┘
```

### 2. 趋势图表

```
错误率趋势 (24h)
─────────────────
5% │        ╭─╮
   │    ╭──╯  ╰──╮
 0%─┼───╯───────────╰──
   00:00  06:00  12:00  18:00
```

## 日志监控

### 日志级别

| 级别 | 用途 | 示例 |
|------|------|------|
| ERROR | 错误 | 数据库连接失败 |
| WARN | 警告 | 重试 3 次后成功 |
| INFO | 信息 | 请求成功 |
| DEBUG | 调试 | 详细执行流程 |

### 日志格式

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

## 告警配置

### 告警规则示例

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

### 告警通知

```markdown
## 告警通知

主题：[严重] 高错误率告警

正文：
时间：2024-01-15 10:30:00
服务：api-gateway
环境：production
错误率：5.2%（阈值：1%）

建议操作：
1. 检查日志
2. 查看 Metrics
3. 如需要回滚
```

## 健康检查

### 端点

```bash
# 健康检查
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

### 检查清单

- [ ] 健康检查端点正常
- [ ] 告警规则已配置
- [ ] 告警通知可达
- [ ] Dashboard 可访问
- [ ] 日志正常采集

## 何时退出

- 所有关键指标有监控
- 告警规则配置完成
- 告警通知正常