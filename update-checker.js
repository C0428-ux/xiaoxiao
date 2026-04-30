#!/usr/bin/env node

/**
 * XiaoXiao Update Checker
 *
 * Version source: GitHub Releases API (single source of truth)
 * Local version.json: created after successful update (runtime only)
 *
 * Flow:
 * 1. check() - Compare local (git or API) vs remote (GitHub API)
 * 2. update() - Download zipball, extract, write version.json
 * 3. version - Show current version info
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const { GITHUB_REPO } = require('./constants');

class UpdateChecker {
  constructor(frameworkDir) {
    this.frameworkDir = frameworkDir;
    this.versionFile = path.join(frameworkDir, 'version.json');
  }

  /**
   * Get local version info
   * Priority:
   * 1. Git (if available) - most accurate
   * 2. Local version.json (if exists) - fallback for non-git installs
   * 3. GitHub API - fallback when no local info
   */
  getLocalVersion() {
    // 1. Try git (most reliable for developers)
    try {
      const sha = execSync('git rev-parse HEAD', {
        cwd: this.frameworkDir,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();

      // Try to get current tag
      let tagName = null;
      try {
        const output = execSync('git describe --tags --exact-match HEAD 2>nul', {
          cwd: this.frameworkDir,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe']
        }).trim();
        if (output) tagName = output;
      } catch (e) {}

      return {
        sha,
        version: tagName ? tagName.replace(/^v/, '') : sha.substring(0, 7),
        tagName,
        source: 'git'
      };
    } catch (e) {}

    // 2. Try local version.json (for zipball installs)
    try {
      if (fs.existsSync(this.versionFile)) {
        const data = JSON.parse(fs.readFileSync(this.versionFile, 'utf-8'));
        return {
          sha: data.sha || null,
          version: data.version || 'unknown',
          source: 'local-file'
        };
      }
    } catch (e) {}

    // 3. No local info available
    return {
      sha: null,
      version: 'unknown',
      source: 'none'
    };
  }

  /**
   * Get remote version from GitHub API (single source of truth)
   */
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

  /**
   * Get the actual commit SHA for a tag (handles annotated tags)
   */
  async getRemoteTagSha() {
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
                resolve(remote.sha);
                return;
              }
              const ref = JSON.parse(data);
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

  /**
   * Check if update is available
   */
  async check() {
    try {
      const local = this.getLocalVersion();
      const remote = await this.getRemoteVersion();
      const remoteSha = await this.getRemoteTagSha();

      return {
        hasUpdate: local.sha && local.sha !== remoteSha,
        local,
        remote: {
          sha: remoteSha,
          version: remote.version,
          tag: remote.tag,
          date: remote.date
        }
      };
    } catch (err) {
      return {
        hasUpdate: false,
        error: err.message
      };
    }
  }

  /**
   * Download and install latest version
   */
  async update() {
    try {
      const remote = await this.getRemoteVersion();
      console.log(`📥 正在下载 ${remote.version}...`);

      const zipPath = path.join(this.frameworkDir, 'xiaoxiao-update.zip');
      await this._downloadFile(remote.zipball_url, zipPath);

      await this._extractAndReplace(zipPath);

      // Write version.json AFTER successful update (runtime only, not source)
      const versionData = {
        version: remote.version,
        sha: remote.sha,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(this.versionFile, JSON.stringify(versionData, null, 2));

      fs.unlinkSync(zipPath);
      console.log('\n✅ 更新完成！请重启 xiaoxiao');
    } catch (err) {
      throw new Error(`更新失败: ${err.message}`);
    }
  }

  _downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
      this._downloadWithRedirect(url, destPath, 10, reject, resolve);
    });
  }

  _downloadWithRedirect(url, destPath, maxRedirects, reject, resolve) {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);

    protocol.get(url, (res) => {
      if ((res.statusCode === 302 || res.statusCode === 301) && res.headers.location) {
        file.close();
        fs.unlinkSync(destPath);

        if (maxRedirects <= 0) {
          reject(new Error('Too many redirects'));
          return;
        }

        const redirectUrl = new URL(res.headers.location, url).toString();
        this._downloadWithRedirect(redirectUrl, destPath, maxRedirects - 1, reject, resolve);
        return;
      }

      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  }

  _extractAndReplace(zipPath) {
    const extractDir = path.join(this.frameworkDir, 'xiaoxiao-update-temp');

    // Clean old extract directory
    if (fs.existsSync(extractDir)) {
      fs.rmSync(extractDir, { recursive: true, force: true });
    }

    // Extract
    execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractDir}' -Force"`, {
      stdio: 'pipe'
    });

    // Verify extraction
    const entries = fs.readdirSync(extractDir);
    if (!entries || entries.length === 0) {
      throw new Error('解压失败：目标目录为空');
    }

    // GitHub zipball format: C0428-ux-xiaoxiao-{ref}/
    const extractedDir = path.join(extractDir, entries[0]);

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

  /**
   * Show version info
   */
  showVersion() {
    const local = this.getLocalVersion();
    console.log('📦 XiaoXiao 版本信息\n');
    console.log(`Version: ${local.version}`);
    console.log(`SHA: ${local.sha || 'unknown'}`);
    console.log(`Source: ${local.source}`);
    console.log(`Framework: ${this.frameworkDir}`);
  }
}

module.exports = UpdateChecker;

// CLI entry
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
      console.log(`CURRENT: ${result.local.version} (${result.local.sha?.substring(0, 7) || 'unknown'})`);
      console.log(`LATEST: ${result.remote.version} (${result.remote.sha?.substring(0, 7) || 'unknown'})`);
      console.log(`DATE: ${result.remote.date}`);
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