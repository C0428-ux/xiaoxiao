#!/bin/bash
# xiaoxiao install script - installs subagents
# Usage: install.sh [--project|--global]

XIAOXIAO_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENTS_DIR="$XIAOXIAO_DIR/skills/tdd-development/agents"
TARGET_DIR="${PROJECT_ROOT:-$HOME}/.claude/agents"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --project)
      [[ -z "$PROJECT_ROOT" ]] && echo "Error: --project requires PROJECT_ROOT env var" && exit 1
      TARGET_DIR="${PROJECT_ROOT}/.claude/agents"
      shift
      ;;
    --global)
      TARGET_DIR="$HOME/.claude/agents"
      shift
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

echo "Installing xiaoxiao subagents to $TARGET_DIR"

# Create target directory
mkdir -p "$TARGET_DIR" || { echo "Error: Cannot create directory $TARGET_DIR"; exit 1; }

# Copy task-worker agent file
if [[ ! -f "$AGENTS_DIR/task-worker.md" ]]; then
  echo "Error: task-worker.md not found in $AGENTS_DIR"
  exit 1
fi

echo "  Installing task-worker.md..."
cp "$AGENTS_DIR/task-worker.md" "$TARGET_DIR/"

echo "Installation complete"
ls -la "$TARGET_DIR/"