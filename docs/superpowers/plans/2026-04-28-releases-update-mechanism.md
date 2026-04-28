# Releases 更新机制实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 解决无 Git 环境下的框架更新问题，采用 GitHub Releases 发版机制

**Architecture:**
- 版本检测：有 Git 时用 `git ls-remote --tags`，无 Git 时用 GitHub Releases API
- 更新方式：下载最新 Release 的 .zip 覆盖本地文件
- 支持 skip-update 设置持久化

**Tech Stack:** Node.js, GitHub REST API, https.request

---

## 文件修改映射

| 文件 | 职责 |
|-----|------|
| `update-checker.js` | 重写版本检测逻辑，支持无 Git 环境 |
| `constants.js` | 保持 GITHUB_REPO 单一来源 |
| `xiaoxiao.js` | update-check 命令路由 |

---

## Task 1: 重写 UpdateChecker 版本检测逻辑

**Files:**
- Modify: `update-checker.js`

- [ ] **Step 1: 读取现有 update-checker.js 完整代码**

路径: `D:\123\xiaoxiao\update-checker.js`

- [ ] **Step 2: 重写 getLocalVersion 方法**

```javascript
getLocalVersion() {
  // 优先从 git 读取
  try {
    const sha = execSync('git rev-parse HEAD', {
      cwd: this.frameworkDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
    return { version: sha.substring(0, 7), sha, hasGit: true };
  } catch (e) {}

  // 无 git，从 version.json 读取
  try {
    const versionFile = path.join(this.frameworkDir, 'version.json');
    if (fs.existsSync(versionFile)) {
      const data = JSON.parse(fs.readFileSync(versionFile, 'utf-8'));
      return { version: data.version || 'unknown', sha: data.sha || null, hasGit: false };
    }
  } catch (e2) {}

  return { version: 'unknown', sha: null, hasGit: false };
}
```

- [ ] **Step 3: 重写 getRemoteVersion 方法**

```javascript
async getRemoteVersion() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${GITHUB_REPO}/releases/latest`,
      method: 'GET',
      headers: {
        'User-Agent': 'xiaoxiao-update-checker',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 404) {
            reject(new Error('Repository not found'));
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`GitHub API returned ${res.statusCode}`));
            return;
          }
          const release = JSON.parse(data);
          resolve({
            version: release.tag_name || release.tag_name?.replace('v', ''),
            tag: release.tag_name,
            sha: release.target_commitish,
            date: release.published_at,
            name: release.name,
            zipball: release.zipball_url,
            tarball: release.tarball_url
          });
        } catch (e) {
          reject(new Error('Failed to parse GitHub response'));
        }
      });
    });

    req.on('error', (err) => reject(new Error(`Network error: ${err.message}`)));
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Request timeout')); });
    req.end();
  });
}
```

- [ ] **Step 4: 添加 downloadAndExtract 方法**

```javascript
async update() {
  try {
    const remote = await this.getRemoteVersion();
    console.log(`📥 正在下载 ${remote.version}...`);

    // 使用 zipball_url 下载
    const zipPath = path.join(this.frameworkDir, 'xiaoxiao-update.zip');
    await this._downloadFile(remote.zipball, zipPath);

    // 解压覆盖
    await this._extractAndReplace(zipPath);

    // 更新 version.json
    const versionData = {
      version: remote.version,
      sha: remote.sha,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(
      path.join(this.frameworkDir, 'version.json'),
      JSON.stringify(versionData, null, 2)
    );

    // 清理
    fs.unlinkSync(zipPath);
    console.log('\n✅ 更新完成！请重启 xiaoxiao');
  } catch (err) {
    throw new Error(`更新失败: ${err.message}`);
  }
}

_downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // 重定向，跟随
        https.get(res.headers.location, (res2) => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
      } else {
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }
    }).on('error', reject);
  });
}

_extractAndReplace(zipPath) {
  const extractDir = path.join(this.frameworkDir, 'xiaoxiao-update-temp');
  const { execSync } = require('child_process');

  // 解压
  execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractDir}' -Force"`, {
    stdio: 'pipe'
  });

  // 读取解压后的目录名
  const entries = fs.readdirSync(extractDir);
  const extractedDir = path.join(extractDir, entries[0]);

  // 替换文件（跳过 .git）
  this._copyRecursive(extractedDir, this.frameworkDir);

  // 清理临时目录
  fs.rmSync(extractDir, { recursive: true, force: true });
}

_copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
      this._copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
```

- [ ] **Step 5: 修改 constructor 接受 frameworkDir 参数**

```javascript
constructor(frameworkDir) {
  this.frameworkDir = frameworkDir;
}
```

- [ ] **Step 6: 运行测试验证**

```bash
cd D:/123/xiaoxiao
node -e "const U = require('./update-checker'); const u = new U('D:/123/xiaoxiao'); u.check().then(r => console.log(JSON.stringify(r, null, 2))).catch(e => console.log('Error:', e.message))"
```

预期输出：`{ hasUpdate: boolean, local: {...}, remote: {...} }`

- [ ] **Step 7: 提交**

```bash
git add update-checker.js
git commit -m "refactor: 重写更新机制支持无Git环境和Releases下载"
```

---

## Task 2: 更新 xiaoxiao.js 中的 UpdateChecker 实例化

**Files:**
- Modify: `xiaoxiao.js`

- [ ] **Step 1: 找到 UpdateChecker 实例化位置**

搜索 `new UpdateChecker` 相关代码

- [ ] **Step 2: 修改为传入 FRAMEWORK_DIR**

```javascript
const updateChecker = new UpdateChecker(FRAMEWORK_DIR);
```

- [ ] **Step 3: 验证语法**

```bash
node --check D:/123/xiaoxiao/xiaoxiao.js
```

- [ ] **Step 4: 提交**

```bash
git add xiaoxiao.js
git commit -m "fix: UpdateChecker 实例化传入 frameworkDir"
```

---

## Task 3: 创建 Release 发布脚本

**Files:**
- Create: `release.sh`

- [ ] **Step 1: 创建发布脚本**

```bash
#!/bin/bash
# release.sh - 发布新版本
# 用法: ./release.sh [版本号]
# 示例: ./release.sh 0.2.0

set -e

VERSION=${1:-$(date +'%Y.%m.%d')}
REPO="C0428-ux/xiaoxiao"
FRAMEWORK_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "📦 发布 xiaoxiao v$VERSION"

# 检查 git 状态
cd "$FRAMEWORK_DIR"
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
```

- [ ] **Step 2: 测试脚本语法**

```bash
bash -n D:/123/xiaoxiao/release.sh
```

- [ ] **Step 3: 提交**

```bash
git add release.sh
git commit -m "feat: 添加发布脚本 release.sh"
```

---

## Task 4: 创建 GitHub Actions Release 工作流

**Files:**
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: 创建目录**

```bash
mkdir -p D:/123/xiaoxiao/.github/workflows
```

- [ ] **Step 2: 创建工作流文件**

```yaml
name: Create Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            *.js
            *.json
            *.md
            skills/
            docs/
            .gitignore
            FRAMEWORK.md
            SKILL.md
            CLAUDE.md
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 3: 提交**

```bash
git add .github/workflows/release.yml
git commit -m "feat: 添加 GitHub Actions release 工作流"
```

---

## Task 5: 验证完整流程

- [ ] **Step 1: 本地版本检测测试**

```bash
node -e "
const U = require('./update-checker');
const u = new U('D:/123/xiaoxiao');
u.check().then(r => {
  console.log('hasUpdate:', r.hasUpdate);
  console.log('local:', JSON.stringify(r.local));
  console.log('remote:', r.remote ? {version: r.remote.version, tag: r.remote.tag} : null);
}).catch(e => console.log('Error:', e.message));
"
```

- [ ] **Step 2: 查看更新命令帮助**

```bash
node xiaoxiao.js help | grep -A2 update
```

预期输出：update-check, update, skip-update, unskip-update 相关说明

- [ ] **Step 3: 最终提交**

```bash
git status
git log --oneline -3
```

---

## 验证检查清单

- [ ] update-checker.js 支持无 .git 目录环境
- [ ] 版本检测使用 GitHub Releases API
- [ ] 更新下载最新 Release 的 .zip
- [ ] xiaoxiao.js 正确传入 frameworkDir
- [ ] release.sh 脚本可用
- [ ] GitHub Actions 工作流已创建
- [ ] 所有修改已提交

---

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
