---
name: search
description: >-
  内置网络搜索工具，为 strategy-review 和 product-consult 提供市场研究能力。
  不依赖外部插件，框架自带搜索功能。
version: 1.0
domain: search
role: search-engine
triggers:
  - (internal use only - called by other skills)
output-format: search-results.md
related-skills:
  - strategy-review
  - product-consult
prerequisites: []
---

# Search | 搜索工具

## 概述

XiaoXiao 框架内置的搜索工具，为需要市场研究、竞品分析的 Skill 提供搜索能力。
不依赖外部插件，所有用户开箱即用。

## 使用场景

- **strategy-review**: 市场分析、竞品调研
- **product-consult**: 行业信息、竞品概览
- 其他需要网络搜索的场景

## 搜索模式

### 基础搜索

使用 WebSearch 工具进行关键词搜索：

```bash
WebSearch "[query]"
```

### 搜索查询模板

| 场景 | 查询模板 |
|------|----------|
| 市场大小 | "[product category] market size 2024 TAM" |
| 行业趋势 | "[product type] industry growth trend" |
| 竞品搜索 | "[product category] competitors" |
| 解决方案 | "[core user need] solutions" |
| 市场领导者 | "[product type] market leaders" |

## 搜索结果处理

### 验证一手来源

搜索结果是信息发现的**入口**，不是终点。找到来源后：
1. 使用 WebFetch 读取原文
2. 验证信息的准确性
3. 引用时注明来源

### 处理搜索失败

当搜索无法返回有用数据时：
- 报告: "Could not find reliable data for [category]"
- 询问用户是否有内部数据
- 标记为 "Unverified - requires user input"

## 约束

### MUST DO

- 始终引用数据来源
- 验证信息而非转述
- 搜索失败时如实报告

### MUST NOT DO

- 捏造数据
- 使用占位符值如 "[Total Addressable Market]"
- 将搜索引擎结果作为直接证据引用

## 输出格式

```markdown
## 搜索结果

### Query: [搜索词]
- **来源**: [URL]
- **内容摘要**: [关键发现]
- **验证状态**: [已验证/未验证]
```
