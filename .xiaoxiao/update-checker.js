#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const GITHUB_REPO = 'C0428-ux/xiaoxiao';
const FRAMEWORK_VERSION_FILE = '.xiaoxiao/version.json';

class UpdateChecker {
  constructor(skillPath) {
    this.skillPath = skillPath;
    // Try both possible locations for version.json
    this.versionFile = path.join(skillPath, FRAMEWORK_VERSION_FILE);
    if (!fs.existsSync(this.versionFile)) {
      // Fallback: version.json might be at skillPath directly (local dev structure)
      const fallback = path.join(skillPath, 'version.json');
      if (fs.existsSync(fallback)) {
        this.versionFile = fallback;
      }
    }
  }

  getLocalVersion() {
    if (!fs.existsSync(this.versionFile)) {
      return { version: '0.0.0', sha: null, updatedAt: null };
    }
    try {
      return JSON.parse(fs.readFileSync(this.versionFile, 'utf-8'));
    } catch (e) {
      return { version: '0.0.0', sha: null, updatedAt: null };
    }
  }

  getRemoteVersion() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: `/repos/${GITHUB_REPO}/commits/main`,
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
              reject(new Error('Repository not found or is private'));
              return;
            }
            if (res.statusCode !== 200) {
              reject(new Error(`GitHub API returned ${res.statusCode}`));
              return;
            }
            const commit = JSON.parse(data);
            resolve({
              version: commit.sha.substring(0, 7),
              sha: commit.sha,
              date: commit.commit.committer.date,
              message: commit.commit.message.split('\n')[0]
            });
          } catch (e) {
            reject(new Error('Failed to parse GitHub response'));
          }
        });
      });

      req.on('error', (err) => {
        reject(new Error(`Network error: ${err.message}`));
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  async check() {
    try {
      const local = this.getLocalVersion();
      const remote = await this.getRemoteVersion();

      return {
        hasUpdate: !local.sha || local.sha !== remote.sha.substring(0, 7),
        local,
        remote
      };
    } catch (err) {
      return {
        hasUpdate: false,
        error: err.message
      };
    }
  }

  async update() {
    const { execSync } = require('child_process');

    const backupDir = path.join(this.skillPath, '.backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = Date.now();
    const tempDir = path.join(backupDir, `update-${timestamp}`);

    try {
      console.log('📥 正在下载最新版本...');
      execSync(`git clone --depth=1 https://github.com/${GITHUB_REPO}.git "${tempDir}"`, {
        stdio: 'inherit',
        cwd: backupDir
      });

      this._copyRecursive(path.join(tempDir, 'xiaoxiao'), this.skillPath);

      const remote = await this.getRemoteVersion();
      const versionData = {
        version: remote.version,
        sha: remote.sha,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(this.versionFile, JSON.stringify(versionData, null, 2), 'utf-8');

      fs.rmSync(tempDir, { recursive: true, force: true });

      console.log('\n✅ 更新完成！');
      console.log(`版本: ${remote.version}`);
      console.log(`更新时间: ${versionData.updatedAt}`);
    } catch (err) {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
      throw new Error(`更新失败: ${err.message}`);
    }
  }

  _copyRecursive(src, dest) {
    if (!fs.existsSync(src)) {
      throw new Error(`Source directory does not exist: ${src}`);
    }

    fs.mkdirSync(dest, { recursive: true });

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name === '.git') continue;

      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this._copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  showVersion() {
    const local = this.getLocalVersion();
    console.log('📦 XiaoXiao 版本信息\n');
    console.log(`版本: ${local.version || 'unknown'}`);
    console.log(`SHA: ${local.sha || 'unknown'}`);
    console.log(`更新时间: ${local.updatedAt || 'unknown'}`);
    console.log(`\n框架目录: ${this.skillPath}`);
  }
}

module.exports = UpdateChecker;

if (require.main === module) {
  const FRAMEWORK_DIR = __dirname;
  const checker = new UpdateChecker(FRAMEWORK_DIR);

  const command = process.argv[2];

  if (command === 'check') {
    checker.check().then(result => {
      if (result.error) {
        console.log(`⚠️  检查更新失败: ${result.error}`);
        process.exit(1);
      }

      if (!result.hasUpdate) {
        console.log('✅ 已是最新版本');
        return;
      }

      console.log('🔔 发现新版本！\n');
      console.log(`当前版本: ${result.local.version || 'unknown'} (${result.local.sha || 'unknown'})`);
      console.log(`最新版本: ${result.remote.version} (${result.remote.sha})`);
      console.log(`更新时间: ${result.remote.date}`);
      console.log(`更新说明: ${result.remote.message}`);
      console.log('\n使用 "node update-checker.js update" 下载更新');
    });
  } else if (command === 'update') {
    checker.update().catch(err => {
      console.log(`❌ 更新失败: ${err.message}`);
      process.exit(1);
    });
  } else if (command === 'version') {
    checker.showVersion();
  } else {
    console.log(`
📦 XiaoXiao Update Checker

用法: update-checker.js <command>

命令:
  check    检查更新
  update   下载更新
  version  显示版本信息
    `);
  }
}
