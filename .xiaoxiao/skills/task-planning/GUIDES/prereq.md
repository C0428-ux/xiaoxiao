# 前置条件详解 | task-planning

## 进入条件

- `ui-design` 状态为 `completed`
- 界面设计文档已完成

## 退出条件

- 任务列表完成，用户确认

## 中断处理

- 中断时保存当前规划进度
- `resume` 时从中断点继续

## 依赖说明

- 前置：`ui-design`
- 输出：任务列表（写入 `docs/xiaoxiao/plans/tasks.md`）