#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const { GITHUB_REPO } = require('./constants');

class UpdateChecker {
  constructor(frameworkDir) {
    this.frameworkDir = frameworkDir;
  }

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
        return {
          version: data.version || 'unknown',
          sha: data.sha || null,
          hasGit: false
        };
      }
    } catch (e2) {}

    return { version: 'unknown', sha: null, hasGit: false };
  }

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
              version: release.tag_name?.replace(/^v/, '') || release.tag_name,
              tag: release.tag_name,
              sha: release.target_commitish,
              date: release.published_at,
              name: release.name,
              zipball_url: release.zipball_url,
              tarball_url: release.tarball_url
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

  async getRemoteTagSha() {
    // 获取 tag 对应的实际 commit SHA
    return new Promise((resolve, reject) => {
      this.getRemoteVersion().then(remote => {
        const options = {
          hostname: 'api.github.com',
          path: `/repos/${GITHUB_REPO}/git/refs/tags/${remote.tag}`,
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
              if (res.statusCode !== 200) {
                // 如果获取 tag ref 失败，回退到 target_commitish
                resolve(remote.sha);
                return;
              }
              const ref = JSON.parse(data);
              // 可能是 tag 或 annotated tag
              const sha = ref.object?.sha || remote.sha;
              resolve(sha);
            } catch (e) {
              resolve(remote.sha);
            }
          });
        });

        req.on('error', () => resolve(remote.sha));
        req.setTimeout(5000, () => resolve(remote.sha));
        req.end();
      }).catch(reject);
    });
  }

  async check() {
    try {
      const local = this.getLocalVersion();
      const remoteSha = await this.getRemoteTagSha();

      return {
        hasUpdate: local.sha && local.sha !== remoteSha,
        local,
        remote: { sha: remoteSha }
      };
    } catch (err) {
      return {
        hasUpdate: false,
        error: err.message
      };
    }
  }

  async update() {
    try {
      const remote = await this.getRemoteVersion();
      console.log(`📥 正在下载 ${remote.version}...`);

      const zipPath = path.join(this.frameworkDir, 'xiaoxiao-update.zip');
      await this._downloadFile(remote.zipball_url, zipPath);

      await this._extractAndReplace(zipPath);

      const versionData = {
        version: remote.version,
        sha: remote.sha,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(
        path.join(this.frameworkDir, 'version.json'),
        JSON.stringify(versionData, null, 2)
      );

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

    // 清理旧目录
    if (fs.existsSync(extractDir)) {
      fs.rmSync(extractDir, { recursive: true, force: true });
    }

    // 解压
    execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractDir}' -Force"`, {
      stdio: 'pipe'
    });

    // 验证解压结果
    const entries = fs.readdirSync(extractDir);
    if (!entries || entries.length === 0) {
      throw new Error('解压失败：目标目录为空');
    }

    // GitHub zipball 格式：C0428-ux-xiaoxiao-{ref}/
    const extractedDir = path.join(extractDir, entries[0]);

    // 验证解压的目录存在
    if (!fs.existsSync(extractedDir)) {
      throw new Error(`解压失败：目录 ${entries[0]} 不存在`);
    }

    this._copyRecursive(extractedDir, this.frameworkDir);

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

  showVersion() {
    const local = this.getLocalVersion();
    console.log('📦 XiaoXiao 版本信息\n');
    console.log(`SHA: ${local.sha || 'unknown'}`);
    console.log(`Git: ${local.hasGit ? '是' : '否'}`);
    console.log(`框架目录: ${this.frameworkDir}`);
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
      console.log(`TAG: ${result.remote.tag}`);
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
  update   下载并安装最新版本
  version  显示当前版本
    `);
  }
}
