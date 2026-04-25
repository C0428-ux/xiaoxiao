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
output-format: docs/xiaoxiao/plans/ship-output.md
related-skills:
  - tdd-development
---

# Ship | 发布上线

## 强制执行协议

**规则**：
- 必须按顺序执行每个 Step，不得跳过
- 每个 Step 必须执行验证（检查点）才能进入下一步
- 使用 `xiaoxiao save-progress <skill> <step>` 标记步骤完成
- CONFIRM 节点必须等待用户确认，不得自动继续

---

## Step 1: 初始化

**动作**：
1. 执行 `xiaoxiao save-progress ship step1-complete`
2. 检查 `docs/xiaoxiao/plans/tdd/` 是否存在（开发输出）
3. 运行本地测试套件：`npm test`
4. 验证所有 PR 已审查并合并

**验证**：测试通过，PR 已合并

**CONFIRM**："Step 1 完成。测试通过，代码已合并。继续？"

---

## Step 2: 预发布检查

**动作**：
1. 运行预发布清单：
   - [ ] 安全扫描完成
   - [ ] 性能基准达标
   - [ ] 数据库迁移已审查
   - [ ] 环境变量已配置
2. 创建发布候选版本
3. 询问用户："准备部署了吗？"

**验证**：预发布检查完成

**CONFIRM**："预发布检查：[N] 通过，[N] 失败。准备好部署了？"

---

## Step 3: 部署执行

**动作**：
1. 通知利益相关者部署开始
2. 执行部署步骤：
   - 构建产物
   - 部署到目标环境
   - 运行数据库迁移
3. 监控部署进度
4. 验证部署成功
5. 询问用户："部署成功。继续验证？"

**验证**：部署成功

**CONFIRM**："已部署到 [环境]。验证成功？"

---

## Step 4: 部署后验证

**动作**：
1. 运行冒烟测试（关键路径）
2. 验证关键指标：
   - 错误率：在正常范围内
   - 延迟：在 SLA 内
   - 流量：正常模式
3. 检查日志是否有错误
4. 验证数据完整性
5. 询问用户："所有验证通过。向用户发布？"

**验证**：验证完成

**CONFIRM**："冒烟测试：[N] 通过。验证指标？"

---

## Step 5: 生产发布

**动作**：
1. 启用新部署的流量（尽可能逐步）
2. 监控 15-30 分钟：
   - 错误率
   - 延迟
   - 用户指标
3. 观察异常
4. 设置发布后监控
5. 通知成功发布

**验证**：新版本正在服务生产流量

**CONFIRM**："正在服务 [X]% 流量。监控 30 分钟。"

---

## Step 6: 发布后监控

**动作**：
1. 监控 24-48 小时：
   - 错误率
   - 性能指标
   - 用户反馈
   - 支持工单
2. 设置异常警报
3. 记录经验教训
4. 更新操作手册（如需要）
5. 关闭发布

**验证**：监控完成，发布关闭

**CONFIRM**："发布后监控完成（24-48h）。有异常需要处理吗？"

---

## Step 7: 回滚准备

**动作**：
1. 确保回滚计划就绪
2. 记录回滚触发条件：
   - 错误率大幅上升
   - 关键功能损坏
   - 性能降至 SLA 以下
   - 发现安全问题
   - 检测到数据损坏
3. 询问用户："需要我现在准备详细的回滚方案文档吗？"

**验证**：回滚准备就绪

**CONFIRM**："回滚准备就绪。继续？"

---

## Step 8: 输出文档

**动作**：
1. 创建 `docs/xiaoxiao/plans/ship-output.md`
2. 包含以下章节：
   - Release Summary（版本、更改、持续时间）
   - Pre-Release Validation（检查清单结果）
   - Deployment Steps（执行的步骤）
   - Post-Release Validation（冒烟测试结果）
   - Monitoring Setup（配置的警报）
   - Incidents（如有）
   - Lessons Learned
3. 执行 `xiaoxiao complete ship docs/xiaoxiao/plans/ship-output.md`

**验证**：文档已创建且包含所有章节

**CONFIRM**："Ship 完成。文档已保存。所有阶段完成！"

---

## 状态更新命令

每个 Step 完成后必须执行：
```bash
xiaoxiao save-progress ship step[N]-complete
```

最终完成必须执行：
```bash
xiaoxiao complete ship docs/xiaoxiao/plans/ship-output.md
```