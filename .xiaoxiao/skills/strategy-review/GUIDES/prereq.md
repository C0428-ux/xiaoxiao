# 前置条件详解 | strategy-review

## 进入条件

- `.SPEC.md` 文件存在
- `product-consult` 状态为 `completed`

## 退出条件

满足以下任一条件即可退出：
- Go/No-Go 决策为"继续"，用户确认战略建议
- Go/No-Go 决策为"终止"，用户确认并结束

## 中断处理

- 中断时保存当前分析进度
- `resume` 时从中断点继续

## 依赖说明

- 前置：`product-consult`
- 输出：战略建议（写入 `docs/xiaoxiao/plans/strategy-review.md`）