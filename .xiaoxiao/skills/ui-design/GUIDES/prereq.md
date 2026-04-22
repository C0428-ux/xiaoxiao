# 前置条件详解 | ui-design

## 进入条件

- `architect` 状态为 `completed`
- 架构文档已完成

## 退出条件

- 界面设计文档完成，用户确认

## 中断处理

- 中断时保存当前设计进度
- `resume` 时从中断点继续

## 依赖说明

- 前置：`architect`
- 输出：设计文档（写入 `docs/xiaoxiao/plans/ui-design.md`）