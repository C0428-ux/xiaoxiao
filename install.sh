#!/bin/bash
# xiaoxiao 安装脚本 - 安装 subagents 到 ~/.claude/agents/

XIAOXIAO_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENTS_DIR="$HOME/.claude/agents"

echo "📦 安装 xiaoxiao subagents..."

mkdir -p "$AGENTS_DIR"

# 复制 task-worker 和 parallel-dispatcher
cp "$XIAOXIAO_DIR/skills/tdd-development/agents/task-worker.md" "$AGENTS_DIR/"
cp "$XIAOXIAO_DIR/skills/tdd-development/agents/parallel-dispatcher.md" "$AGENTS_DIR/"

echo "✅ Subagents 已安装到 ~/.claude/agents/"
ls -la "$AGENTS_DIR/"