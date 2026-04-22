# 前置条件详解 | architect

## 进入条件

- `strategy-review` 状态为 `completed`
- 战略评审结论为"继续"

## 退出条件

- 架构文档完成，用户确认

## 中断处理

- 中断时保存当前架构设计进度
- `resume` 时从中断点继续

## 依赖说明

- 前置：`strategy-review`
- 输出：架构文档（写入 `docs/xiaoxiao/plans/architecture.md`）