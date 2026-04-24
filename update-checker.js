#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GITHUB_REPO = 'C0428-ux/xiaoxiao';

class UpdateChecker {
  constructor(skillPath) {
    this.skillPath = skillPath;
  }

  getLocalVersion() {
    // 优先从 git 读取
    try {
      const sha = execSync('git rev-parse HEAD', {
        cwd: this.skillPath,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();

      return {
        version: sha.substring(0, 7),
        sha: sha
      };
    } catch (e) {
      // 没有 git，从 version.json 读取
      try {
        const versionFile = path.join(this.skillPath, 'version.json');
        if (fs.existsSync(versionFile)) {
          const data = JSON.parse(fs.readFileSync(versionFile, 'utf-8'));
          return {
            version: data.version || data.sha?.substring(0, 7) || 'unknown',
            sha: data.sha || null
          };
        }
      } catch (e2) {}
      return {
        version: 'unknown',
        sha: null
      };
    }
  }

  // 通过 GitHub API 获取远程最新版本
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
              reject(new Error('Repository not found'));
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
        hasUpdate: !local.sha || local.sha !== remote.sha,
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

  // 使用 git pull 更新
  async update() {
    try {
      console.log('📥 正在更新...');
      execSync('git pull origin main', {
        cwd: this.skillPath,
        stdio: 'inherit'
      });
      console.log('\n✅ 更新完成！');
    } catch (err) {
      throw new Error(`更新失败: ${err.message}`);
    }
  }

  showVersion() {
    const local = this.getLocalVersion();
    console.log('📦 XiaoXiao 版本信息\n');
    console.log(`SHA: ${local.sha || 'unknown'}`);
    console.log(`框架目录: ${this.skillPath}`);
  }
}

module.exports = UpdateChecker;

// CLI 入口
if (require.main === module) {
  const FRAMEWORK_DIR = __dirname;
  const checker = new UpdateChecker(FRAMEWORK_DIR);

  const command = process.argv[2];

  if (command === 'check') {
    checker.check().then(result => {
      if (result.error) {
        console.log(`ERROR: ${result.error}`);
        process.exit(1);
      }

      if (!result.hasUpdate) {
        console.log('STATUS: UP_TO_DATE');
        console.log(`VERSION: ${result.local.version}`);
        return;
      }

      console.log('STATUS: UPDATE_AVAILABLE');
      console.log(`CURRENT: ${result.local.version}`);
      console.log(`LATEST: ${result.remote.version}`);
      console.log(`DATE: ${result.remote.date}`);
      console.log(`COMMIT: ${result.remote.message}`);
    });
  } else if (command === 'update') {
    checker.update().catch(err => {
      console.log(`ERROR: ${err.message}`);
      process.exit(1);
    });
  } else if (command === 'version') {
    checker.showVersion();
  } else {
    console.log(`
XiaoXiao Update Checker

用法: update-checker.js <command>

命令:
  check    检查更新（输出 STATUS: UP_TO_DATE 或 STATUS: UPDATE_AVAILABLE）
  update   执行 git pull 更新
  version  显示当前版本
    `);
  }
}
