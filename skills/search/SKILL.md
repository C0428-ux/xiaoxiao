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

## 搜索引擎配置

**免费搜索引擎（无需 API key）**：
- DuckDuckGo - 默认引擎，隐私友好
- Bing - 备用引擎，RSS 接口

**需要配置的引擎（如有 key）**：
- Google Custom Search - 需要 GOOGLE_API_KEY + GOOGLE_CSE_ID
- SerpAPI - 需要 SERPAPI_KEY

## 使用方式

### 方式 1：直接调用 search.js（推荐）

在 strategy-review 或 product-consult 中，需要搜索时执行：

```bash
node search.js "<搜索词>" [--engine bing]
```

### 方式 2：在 Skill 中调用

当 strategy-review 需要市场数据时：

```bash
# 市场分析搜索
node search.js "[产品类别] market size 2024 TAM"
node search.js "[产品类型] industry growth trend"

# 竞品分析搜索
node search.js "[产品类别] competitors"
node search.js "[核心需求] solutions"
```

### 方式 3：使用 WebSearch 工具

直接使用 WebSearch 工具：
```
WebSearch "[查询词]"
```

## 搜索查询模板

| 场景 | 查询模板 |
|------|----------|
| 市场大小 | "[product category] market size 2024 TAM" |
| 行业趋势 | "[product type] industry growth trend" |
| 竞品搜索 | "[product category] competitors" |
| 解决方案 | "[core user need] solutions" |
| 市场领导者 | "[product type] market leaders" |

## 输出格式

搜索结果以标准化格式返回：

```markdown
## 搜索结果

### Query: [搜索词]
- **引擎**: [使用的搜索引擎]
- **结果数**: [N]

### 1. [标题]
- **URL**: [链接]
- **摘要**: [内容摘要]

### 2. [标题]
...
```

## 验证一手来源

搜索结果是信息发现的**入口**，不是终点。找到来源后：
1. 使用 WebFetch 读取原文
2. 验证信息的准确性
3. 引用时注明来源

## 搜索失败处理

当搜索无法返回有用数据时：
- 尝试备用搜索引擎（DuckDuckGo → Bing → Google）
- 报告: "Could not find reliable data for [category]"
- 询问用户是否有内部数据
- 标记为 "Unverified - requires user input"

## 约束

### MUST DO

- 始终引用数据来源
- 验证信息而非转述
- 搜索失败时如实报告
- 优先使用免费引擎

### MUST NOT DO

- 捏造数据
- 使用占位符值如 "[Total Addressable Market]"
- 将搜索引擎结果作为直接证据引用
- 在没有 API key 时强行使用付费引擎