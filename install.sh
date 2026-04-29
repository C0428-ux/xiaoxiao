#!/bin/bash
# xiaoxiao 安装脚本 - 安装 subagents
# 用法: install.sh [--project|--global]

XIAOXIAO_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_TDD_AGENTS="$XIAOXIAO_DIR/skills/tdd-development/agents"

# 默认项目级安装
TARGET_DIR="${PROJECT_ROOT:-$HOME}/.claude/agents"

while [[ $# -gt 0 ]]; do
  case $1 in
    --project)
      TARGET_DIR="${PROJECT_ROOT}/.claude/agents"
      shift
      ;;
    --global)
      TARGET_DIR="$HOME/.claude/agents"
      shift
      ;;
    *)
      echo "未知参数: $1"
      exit 1
      ;;
  esac
done

echo "📦 安装 xiaoxiao subagents 到 $TARGET_DIR"

mkdir -p "$TARGET_DIR"

# 复制所有 agent 文件
cp "$SKILLS_TDD_AGENTS/task-worker.md" "$TARGET_DIR/"
cp "$SKILLS_TDD_AGENTS/parallel-dispatcher.md" "$TARGET_DIR/"

echo "✅ 安装完成: $TARGET_DIR"
ls -la "$TARGET_DIR/"