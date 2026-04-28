#!/bin/bash
# release.sh - 发布新版本
# 用法: ./release.sh [版本号]
# 示例: ./release.sh 0.2.0

set -e

VERSION=${1:-$(date +'%Y.%m.%d')}
REPO="C0428-ux/xiaoxiao"
FRAMEWORK_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "📦 发布 xiaoxiao v$VERSION"

cd "$FRAMEWORK_DIR"

# 检查 git 状态
if [ -d .git ] && ! git diff --quiet; then
  echo "❌ 有未提交的更改，请先提交"
  exit 1
fi

# 创建 tag
git tag -a "v$VERSION" -m "Release v$VERSION"

# 推送到远程
git push origin "v$VERSION"

echo "✅ 已推送 tag v$VERSION"
echo "   GitHub Actions 将自动创建 Release"
