#!/usr/bin/env node

/**
 * XiaoXiao CLI - 状态管理和流程控制入口
 *
 * 路径设计：
 * - 脚本文件在框架目录（__dirname）
 * - 状态文件和输出在项目目录（PROJECT_ROOT，通过向上查找 xiaoxiao-state.json 确定）
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// ========== 常量定义 ==========

const SKILLS = [
  'product-consult',
  'strategy-review',
  'architect',
  'ui-design',
  'task-planning',
  'tdd-development',
  'ship'
];

// 共享的依赖链定义（唯一来源）
const PREREQ_MAP = {
  'strategy-review': ['product-consult'],
  'architect': ['strategy-review'],
  'ui-design': ['architect'],
  'task-planning': ['ui-design'],
  'tdd-development': ['task-planning'],
  'ship': ['tdd-development']
};

// 输出文件路径映射（唯一来源）
const OUTPUT_MAP = {
  'product-consult': '.SPEC.md',
  'strategy-review': 'docs/xiaoxiao/plans/strategy-review-output.md',
  'architect': 'docs/xiaoxiao/plans/architect-output.md',
  'ui-design': 'docs/xiaoxiao/plans/ui-design/',
  'task-planning': 'docs/xiaoxiao/plans/task-planning-output.md',
  'tdd-development': 'docs/xiaoxiao/plans/tdd/',
  'ship': 'docs/xiaoxiao/plans/ship-output.md'
};

const GITHUB_REPO = 'C0428-ux/xiaoxiao';

// ========== 路径解析 ==========

// 框架目录（脚本所在）
const FRAMEWORK_DIR = __dirname;

// 当前工作目录
const CWD = process.cwd();

// 向上查找项目根目录
function findProjectRoot(startDir) {
  let dir = startDir;
  const home = os.homedir();

  while (dir !== home && dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, 'xiaoxiao-state.json'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return startDir;
}

const PROJECT_ROOT = findProjectRoot(CWD);

// ========== 状态管理 ==========

class StateManager {
  constructor(projectRoot, frameworkRoot) {
    this.projectRoot = projectRoot;
    this.frameworkRoot = frameworkRoot;
    this.statePath = path.join(projectRoot, 'xiaoxiao-state.json');
  }

  _write(state) {
    if (!fs.existsSync(this.projectRoot)) {
      fs.mkdirSync(this.projectRoot, { recursive: true });
    }
    fs.writeFileSync(this.statePath, JSON.stringify(state, null, 2), 'utf-8');
  }

  _read() {
    if (!fs.existsSync(this.statePath)) return null;
    return JSON.parse(fs.readFileSync(this.statePath, 'utf-8'));
  }

  _getNextSkill(current) {
    const idx = SKILLS.indexOf(current);
    if (idx === -1 || idx === SKILLS.length - 1) return null;
    return SKILLS[idx + 1];
  }

  // 初始化项目
  init(projectName) {
    const timestamp = new Date().toISOString();
    if (fs.existsSync(this.statePath)) {
      const backupDir = path.join(this.projectRoot, '.backups');
      if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
      const backupPath = path.join(backupDir, `${Date.now()}_xiaoxiao-state.json`);
      fs.copyFileSync(this.statePath, backupPath);
    }

    const state = {
      version: '0.7',
      currentSkill: null,
      currentPhase: 'idle',
      project: { name: projectName, path: this.projectRoot, createdAt: timestamp },
      skills: SKILLS.reduce((acc, skill) => {
        acc[skill] = { status: 'pending', startedAt: null, completedAt: null, outputs: {}, loopCount: 0, blockedReason: null };
        return acc;
      }, {}),
      iterations: [{ id: 'v1', number: 1, startedAt: timestamp, completedAt: null, summary: null, specFile: '.SPEC.md', plansDir: 'docs/xiaoxiao/plans' }],
      currentIteration: 'v1',
      handover: { from: null, to: null, timestamp: null, context: {} },
      userParticipation: { currentTask: null, pendingConfirmations: [] },
      interrupt: { enabled: false, at: null, resumePoint: null, savedAt: null },
      settings: { skipUpdate: false },
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this._write(state);
    return state;
  }

  // 读取状态
  read() { return this._read(); }

  // 更新状态
  update(updates) {
    const state = this._read();
    if (!state) throw new Error('State file not found. Run "xiaoxiao start" first.');
    const updated = { ...state, ...updates, updatedAt: new Date().toISOString() };
    this._write(updated);
    return updated;
  }

  // 更新单个 Skill
  updateSkill(skillName, updates) {
    const state = this._read();
    if (!state) throw new Error('State file not found.');
    if (!state.skills[skillName]) {
      state.skills[skillName] = { status: 'pending', startedAt: null, completedAt: null, outputs: {}, loopCount: 0, blockedReason: null };
    }
    state.skills[skillName] = { ...state.skills[skillName], ...updates };
    state.updatedAt = new Date().toISOString();
    this._write(state);
    return state;
  }

  // 保存进度
  saveProgress(skillName, phase) {
    const state = this._read();
    if (!state) throw new Error('State file not found.');
    if (!state.skills[skillName]) {
      state.skills[skillName] = { status: 'pending', startedAt: null, completedAt: null, outputs: {}, loopCount: 0, blockedReason: null, currentPhase: null };
    }
    state.skills[skillName].currentPhase = phase;
    state.skills[skillName].lastProgressAt = new Date().toISOString();
    if (state.currentSkill === skillName) {
      state.currentPhase = phase;
    }
    state.updatedAt = new Date().toISOString();
    this._write(state);
    return state;
  }

  // 设置当前 Skill
  setCurrentSkill(skillName) {
    return this.update({ currentSkill: skillName, currentPhase: 'active' });
  }

  // 完成当前 Skill
  completeCurrentSkill(context = {}) {
    const state = this._read();
    if (!state || !state.currentSkill) throw new Error('No active skill to complete.');
    const skillName = state.currentSkill;
    state.skills[skillName].status = 'completed';
    state.skills[skillName].completedAt = new Date().toISOString();
    const nextSkill = this._getNextSkill(skillName);
    if (nextSkill) state.skills[nextSkill].status = 'ready';
    state.handover = { from: skillName, to: nextSkill, timestamp: new Date().toISOString(), context };
    state.currentSkill = nextSkill;
    state.currentPhase = nextSkill ? 'active' : 'completed';
    this._write(state);
    return state;
  }

  // 检查前置条件
  checkPrerequisites(skillName) {
    const state = this._read();
    if (!state) return { pass: false, reason: 'No state file' };
    const skill = state.skills[skillName];
    if (!skill) return { pass: false, reason: `Unknown skill: ${skillName}` };
    if (skill.status === 'completed') return { pass: false, reason: `Skill ${skillName} already completed` };
    if (skill.status === 'blocked') return { pass: false, reason: skill.blockedReason };
    const prereqs = PREREQ_MAP[skillName] || [];
    for (const prereq of prereqs) {
      if (state.skills[prereq].status !== 'completed') {
        return { pass: false, reason: `Requires ${prereq} to be completed first. Current status: ${state.skills[prereq].status}` };
      }
    }
    return { pass: true };
  }

  // 中断/恢复
  interrupt(skillName, resumePoint) {
    const state = this._read();
    if (!state) throw new Error('State file not found.');
    state.interrupt = { enabled: true, at: skillName || state.currentSkill, resumePoint, savedAt: new Date().toISOString() };
    state.currentPhase = 'waiting-user';
    this._write(state);
    return state;
  }

  resume() {
    const state = this._read();
    if (!state) throw new Error('State file not found.');
    if (!state.interrupt || !state.interrupt.enabled) throw new Error('No interrupt to resume.');
    state.currentSkill = state.interrupt.at;
    state.currentPhase = 'active';
    state.interrupt.enabled = false;
    this._write(state);
    return state;
  }

  // 迭代管理
  startNewIteration() {
    const state = this._read();
    if (!state) throw new Error('State file not found.');
    if (state.currentIteration) {
      const currentIter = this.getCurrentIteration();
      if (currentIter && !currentIter.completedAt) this.completeIteration('未完成迭代');
    }
    const timestamp = new Date().toISOString();
    const nextNumber = (state.iterations || []).length + 1;
    const newIteration = { id: `v${nextNumber}`, number: nextNumber, startedAt: timestamp, completedAt: null, summary: null, specFile: '.SPEC.md', plansDir: 'docs/xiaoxiao/plans' };
    state.iterations = [...(state.iterations || []), newIteration];
    state.currentIteration = newIteration.id;
    for (const skill of SKILLS) {
      state.skills[skill] = { status: 'pending', startedAt: null, completedAt: null, outputs: {}, loopCount: 0, blockedReason: null };
    }
    state.currentSkill = null;
    state.currentPhase = 'idle';
    this._write(state);
    return state;
  }

  completeIteration(summary) {
    const state = this._read();
    if (!state) throw new Error('State file not found.');
    state.iterations = state.iterations.map(iter =>
      iter.id === state.currentIteration ? { ...iter, completedAt: new Date().toISOString(), summary } : iter
    );
    this._write(state);
    return state;
  }

  getCurrentIteration() {
    const state = this._read();
    if (!state || !state.currentIteration) return null;
    return state.iterations?.find(iter => iter.id === state.currentIteration) || null;
  }

  getAllIterations() {
    const state = this._read();
    return state ? (state.iterations || []) : [];
  }

  // 状态摘要
  getStatus() {
    const state = this._read();
    if (!state) return { exists: false };
    const blocked = Object.entries(state.skills).filter(([, s]) => s.status === 'blocked').map(([name, s]) => ({ name, reason: s.blockedReason }));
    return { exists: true, version: state.version, project: state.project, currentSkill: state.currentSkill, currentPhase: state.currentPhase, interrupt: state.interrupt, blocked, skills: state.skills };
  }

  // 跳过更新设置
  getSkipUpdate() {
    const state = this._read();
    return state ? (state.settings?.skipUpdate || false) : false;
  }

  setSkipUpdate(value) {
    const state = this._read();
    if (!state) throw new Error('State file not found.');
    if (!state.settings) state.settings = {};
    state.settings.skipUpdate = value;
    state.updatedAt = new Date().toISOString();
    this._write(state);
    return state;
  }

  // 审计
  audit() {
    const state = this._read();
    if (!state) return { exists: false, skills: [] };
    const results = [];
    for (const skillName of SKILLS) {
      const skillState = state.skills[skillName];
      const expectedOutput = OUTPUT_MAP[skillName];
      let outputExists = false;
      if (expectedOutput) {
        const fullPath = path.join(this.projectRoot, expectedOutput);
        outputExists = fs.existsSync(fullPath);
      }
      results.push({ name: skillName, status: skillState.status, outputExists, expectedOutput, completedAt: skillState.completedAt, currentPhase: skillState.currentPhase, blockedReason: skillState.blockedReason });
    }
    return { exists: true, project: state.project?.name, currentIteration: state.currentIteration, skills: results };
  }

  // 诊断
  diagnose(skillName) {
    const state = this._read();
    if (!state) return { error: 'No state file' };
    const skillState = state.skills[skillName];
    if (!skillState) return { error: `Unknown skill: ${skillName}` };
    const expectedOutput = OUTPUT_MAP[skillName];
    const fullPath = path.join(this.projectRoot, expectedOutput);
    const outputExists = fs.existsSync(fullPath);
    const issues = [];
    if (skillState.status === 'completed' && !outputExists) issues.push({ type: 'output-missing', message: '状态显示完成但输出文件不存在' });
    if (skillState.status === 'pending' && outputExists) issues.push({ type: 'output-exists-but-pending', message: '输出文件存在但状态未更新' });
    if (skillState.status === 'active' && !skillState.currentPhase) issues.push({ type: 'no-phase', message: '状态为 active 但没有记录 phase' });
    return { skillName, status: skillState.status, outputExists, expectedOutput, fullPath, phase: skillState.currentPhase, completedAt: skillState.completedAt, issues };
  }

  // 修复 Skill 状态
  fixSkill(skillName, action) {
    const state = this._read();
    if (!state) throw new Error('No state file');
    const skillState = state.skills[skillName];
    if (!skillState) throw new Error(`Unknown skill: ${skillName}`);
    switch (action) {
      case 'mark-complete':
        state.skills[skillName].status = 'completed';
        state.skills[skillName].completedAt = new Date().toISOString();
        break;
      case 'mark-pending':
        state.skills[skillName].status = 'pending';
        state.skills[skillName].completedAt = null;
        break;
      case 'reset':
        state.skills[skillName] = { status: 'pending', startedAt: null, completedAt: null, outputs: {}, loopCount: 0, blockedReason: null, currentPhase: null };
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    state.updatedAt = new Date().toISOString();
    this._write(state);
    return state;
  }

  // 列出可执行的 Skills
  listExecutableSkills() {
    const state = this._read();
    if (!state) return [];
    return SKILLS.filter(name => this.checkPrerequisites(name).pass);
  }
}

// ========== 版本检查 ==========

class UpdateChecker {
  constructor(skillPath) {
    this.skillPath = skillPath;
  }

  getLocalVersion() {
    try {
      const sha = execSync('git rev-parse HEAD', { cwd: this.skillPath, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
      return { version: sha.substring(0, 7), sha };
    } catch (e) {
      try {
        const versionFile = path.join(this.skillPath, 'version.json');
        if (fs.existsSync(versionFile)) {
          const data = JSON.parse(fs.readFileSync(versionFile, 'utf-8'));
          return { version: data.version || data.sha?.substring(0, 7) || 'unknown', sha: data.sha || null };
        }
      } catch (e2) {}
      return { version: 'unknown', sha: null };
    }
  }

  getRemoteVersion() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: `/repos/${GITHUB_REPO}/commits/main`,
        method: 'GET',
        headers: { 'User-Agent': 'xiaoxiao-update-checker', 'Accept': 'application/vnd.github.v3+json' }
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 404) { reject(new Error('Repository not found')); return; }
            if (res.statusCode !== 200) { reject(new Error(`GitHub API returned ${res.statusCode}`)); return; }
            const commit = JSON.parse(data);
            resolve({ version: commit.sha.substring(0, 7), sha: commit.sha, date: commit.commit.committer.date, message: commit.commit.message.split('\n')[0] });
          } catch (e) { reject(new Error('Failed to parse GitHub response')); }
        });
      });
      req.on('error', err => reject(new Error(`Network error: ${err.message}`)));
      req.setTimeout(10000, () => { req.destroy(); reject(new Error('Request timeout')); });
      req.end();
    });
  }

  async check() {
    try {
      const local = this.getLocalVersion();
      const remote = await this.getRemoteVersion();
      return { hasUpdate: !local.sha || local.sha !== remote.sha, local, remote };
    } catch (err) {
      return { hasUpdate: false, error: err.message };
    }
  }

  async update() {
    console.log('📥 正在更新...');
    execSync('git pull origin main', { cwd: this.skillPath, stdio: 'inherit' });
    console.log('\n✅ 更新完成！');
  }

  showVersion() {
    const local = this.getLocalVersion();
    console.log(`📦 XiaoXiao 版本信息\n`);
    console.log(`SHA: ${local.sha || 'unknown'}`);
    console.log(`框架目录: ${this.skillPath}`);
  }
}

const https = require('https');

// ========== 命令处理器 ==========

const stateManager = new StateManager(PROJECT_ROOT, FRAMEWORK_DIR);
const updateChecker = new UpdateChecker(FRAMEWORK_DIR);

const COMMANDS = {
  'update-check': async () => {
    if (stateManager.getSkipUpdate()) {
      console.log('STATUS: SKIP_FOREVER');
      console.log('已永久跳过更新检查');
      return;
    }
    const result = await updateChecker.check();
    if (result.error) { console.log(`ERROR: ${result.error}`); return; }
    if (!result.hasUpdate) { console.log('STATUS: UP_TO_DATE'); console.log(`VERSION: ${result.local.version}`); return; }
    console.log('STATUS: UPDATE_AVAILABLE');
    console.log(`CURRENT: ${result.local.version}`);
    console.log(`LATEST: ${result.remote.version}`);
    console.log(`DATE: ${result.remote.date}`);
    console.log(`COMMIT: ${result.remote.message}`);
  },

  'skip-update': () => {
    stateManager.setSkipUpdate(true);
    console.log('✅ 已永久跳过更新检查');
    console.log('下次运行时将直接继续 Step 1');
  },

  'unskip-update': () => {
    stateManager.setSkipUpdate(false);
    console.log('✅ 已恢复更新检查');
  },

  'update': async () => {
    try {
      await updateChecker.update();
    } catch (err) {
      console.log(`❌ 更新失败: ${err.message}`);
    }
  },

  'version': () => {
    updateChecker.showVersion();
  },

  'complete': (args) => {
    const skillName = args[0];
    const outputPath = args[1];
    if (!skillName) { console.log('❌ 请指定 Skill 名称'); return; }
    const state = stateManager.read();
    if (!state) { console.log('❌ 未找到状态文件'); return; }
    const plansDir = path.join(PROJECT_ROOT, 'docs', 'xiaoxiao', 'plans');
    const defaultOutput = path.join(plansDir, `${skillName}-output.md`);
    const finalOutputPath = outputPath || defaultOutput;
    if (!fs.existsSync(plansDir)) fs.mkdirSync(plansDir, { recursive: true });
    if (!fs.existsSync(finalOutputPath)) { console.log(`❌ 输出文件不存在: ${finalOutputPath}`); return; }
    stateManager.updateSkill(skillName, { status: 'completed', completedAt: new Date().toISOString(), outputs: { main: path.relative(PROJECT_ROOT, finalOutputPath) } });
    if (state.currentSkill === skillName) {
      const nextSkill = SKILLS[SKILLS.indexOf(skillName) + 1];
      stateManager.completeCurrentSkill({ outputPath: finalOutputPath });
      if (nextSkill) {
        console.log(`✅ ${skillName} 完成`);
        console.log(`📄 输出: ${path.relative(PROJECT_ROOT, finalOutputPath)}`);
        console.log(`\n▶ 进入下一阶段: ${nextSkill}`);
      } else {
        stateManager.completeIteration('完成所有阶段');
        console.log(`✅ ${skillName} 完成`);
        console.log(`📄 输出: ${path.relative(PROJECT_ROOT, finalOutputPath)}`);
        console.log(`\n🎉 所有阶段完成！`);
        console.log(`\n📌 迭代 ${state.currentIteration} 已完成`);
        console.log(`   使用 "xiaoxiao new-iteration" 开始新功能开发`);
      }
    } else {
      console.log(`✅ ${skillName} 标记为完成`);
      console.log(`📄 输出: ${path.relative(PROJECT_ROOT, finalOutputPath)}`);
    }
  },

  'init-project': (args) => {
    const projectName = args[0] || path.basename(PROJECT_ROOT);
    const plansDir = path.join(PROJECT_ROOT, 'docs', 'xiaoxiao', 'plans');

    // 修复：直接检测框架标志文件
    const hasFrameworkMarkers =
      fs.existsSync(path.join(PROJECT_ROOT, 'FRAMEWORK.md')) &&
      fs.existsSync(path.join(PROJECT_ROOT, 'SKILL.md')) &&
      fs.existsSync(path.join(PROJECT_ROOT, 'skills', 'product-consult', 'SKILL.md'));

    if (hasFrameworkMarkers) {
      console.log(`❌ 错误：不能在框架目录内初始化项目`);
      console.log(`   当前目录 (${PROJECT_ROOT}) 似乎是 XiaoXiao 框架目录`);
      console.log(`\n请切换到项目目录后再运行 xiaoxiao init-project`);
      console.log(`   例如：cd ~/my-project && xiaoxiao init-project`);
      return;
    }

    if (!fs.existsSync(plansDir)) fs.mkdirSync(plansDir, { recursive: true });
    stateManager.init(projectName);
    console.log(`✅ 项目初始化完成: ${projectName}`);
    console.log(`   状态文件: ${path.join(PROJECT_ROOT, 'xiaoxiao-state.json')}`);
    console.log(`   输出目录: ${plansDir}`);
    console.log(`\n使用 /xiaoxiao 开始开发流程`);
  },

  'status': () => {
    const status = stateManager.getStatus();
    if (!status.exists) { console.log('❌ 未找到状态文件。先运行 "xiaoxiao init-project" 初始化项目。'); return; }
    const currentIter = stateManager.getCurrentIteration();
    console.log(`📊 XiaoXiao 状态\n`);
    console.log(`项目: ${status.project.name}`);
    console.log(`当前迭代: ${status.currentIteration || '无'} ${currentIter?.summary ? `(${currentIter.summary})` : ''}\n`);
    console.log('Skills:');
    for (const [name, skill] of Object.entries(status.skills)) {
      const icon = skill.status === 'completed' ? '✅' : skill.status === 'active' ? '🔄' : skill.status === 'blocked' ? '🚫' : skill.status === 'ready' ? '📌' : '⏳';
      const loops = skill.loopCount ? ` (×${skill.loopCount})` : '';
      console.log(`  ${icon} ${name}${loops} - ${skill.status}`);
      if (skill.blockedReason) console.log(`      └─ ${skill.blockedReason}`);
    }
    if (status.interrupt?.enabled) {
      console.log(`\n⚠️  有未完成的中断: ${status.interrupt.at}`);
      console.log(`   恢复点: ${JSON.stringify(status.interrupt.resumePoint)}`);
      console.log(`   使用 "xiaoxiao resume" 继续`);
    }
    if (status.blocked?.length > 0) {
      console.log(`\n🚫 阻塞的 Skills:`);
      status.blocked.forEach(b => console.log(`   - ${b.name}: ${b.reason}`));
    }
  },

  'resume': () => {
    const result = stateManager.resume();
    console.log(`✅ 已恢复中断`);
    console.log(`当前 Skill: ${result.currentSkill}`);
    if (result.interrupt.resumePoint) console.log(`恢复点: ${JSON.stringify(result.interrupt.resumePoint)}`);
  },

  'goto': (args) => {
    const targetSkill = args[0];
    if (!targetSkill) { console.log('❌ 请指定目标 Skill'); return; }
    const prereq = stateManager.checkPrerequisites(targetSkill);
    if (!prereq.pass) { console.log(`❌ 无法跳转到 ${targetSkill}`); console.log(`   原因: ${prereq.reason}`); return; }
    const state = stateManager.read();
    const currentSkill = state?.currentSkill;
    if (currentSkill && currentSkill !== targetSkill) stateManager.completeCurrentSkill();
    stateManager.setCurrentSkill(targetSkill);
    stateManager.updateSkill(targetSkill, { status: 'active', startedAt: new Date().toISOString() });
    stateManager.update({ handover: { from: currentSkill, to: targetSkill, timestamp: new Date().toISOString(), context: {} } });
    console.log(`✅ 已切换到 ${targetSkill}`);
    if (currentSkill) console.log(`   从 ${currentSkill} 交接`);
  },

  'save-progress': (args) => {
    const skillName = args[0];
    const phase = args[1];
    if (!skillName || !phase) { console.log('❌ 请指定 Skill 名称和阶段'); return; }
    stateManager.saveProgress(skillName, phase);
    console.log(`✅ 已保存进度`);
    console.log(`   Skill: ${skillName}`);
    console.log(`   Phase: ${phase}`);
  },

  'new-iteration': () => {
    try {
      const state = stateManager.startNewIteration();
      console.log(`✅ 已开始新迭代: ${state.currentIteration}`);
      console.log(`   项目: ${state.project.name}`);
      console.log(`   迭代总数: ${state.iterations.length}`);
      console.log(`   所有 Skills 已重置为 pending`);
    } catch (e) { console.log(`❌ 失败: ${e.message}`); }
  },

  'iterations': () => {
    const iterations = stateManager.getAllIterations();
    const current = stateManager.getCurrentIteration();
    console.log(`📋 迭代历史 (${iterations.length} 个)\n`);
    iterations.forEach(iter => {
      const marker = iter.id === current?.id ? '→' : ' ';
      const status = iter.completedAt ? '✅' : '🔄';
      console.log(`${marker} ${status} ${iter.id} - ${iter.summary || '进行中'}`);
      console.log(`   开始: ${iter.startedAt}`);
      if (iter.completedAt) console.log(`   完成: ${iter.completedAt}`);
    });
    if (current) console.log(`\n当前迭代: ${current.id}`);
  },

  'interrupt': (args) => {
    const state = stateManager.read();
    if (!state) { console.log('❌ 未找到状态文件'); return; }
    const resumePoint = args.length > 0 ? args.join(' ') : null;
    stateManager.interrupt(state.currentSkill, resumePoint);
    console.log(`✅ 已中断当前 Skill: ${state.currentSkill}`);
    console.log(`   恢复点: ${resumePoint || '未指定'}`);
    console.log(`   使用 "xiaoxiao resume" 继续`);
  },

  'skills': () => {
    console.log('📦 可用 Skills:\n');
    SKILLS.forEach(name => {
      const skillDir = path.join(FRAMEWORK_DIR, 'skills', name);
      const exists = fs.existsSync(path.join(skillDir, 'SKILL.md'));
      console.log(`  ${exists ? '✅' : '❌'} ${name}`);
    });
  },

  'list': () => {
    const executable = stateManager.listExecutableSkills();
    console.log('▶ 可执行的 Skills:\n');
    executable.forEach(s => console.log(`  - ${s}`));
  },

  'continue': () => {
    const state = stateManager.read();
    if (!state) { console.log('❌ 未找到状态文件。先运行 "xiaoxiao init-project" 初始化项目。'); return; }
    let currentSkill = state.currentSkill;
    if (!currentSkill) {
      for (const skillName of SKILLS) {
        if (state.skills[skillName].status !== 'completed') { currentSkill = skillName; break; }
      }
    }
    if (!currentSkill) {
      console.log('🎉 所有 Skills 已完成！');
      console.log(`迭代 ${state.currentIteration} 已完成`);
      console.log('使用 "xiaoxiao new-iteration" 开始新功能开发');
      return;
    }
    const skillState = state.skills[currentSkill];
    console.log(`📍 当前: ${currentSkill} (${skillState.status})`);
    console.log('\n使用 "xiaoxiao goto ' + currentSkill + '" 开始或继续执行');
    const protocolPath = path.join(FRAMEWORK_DIR, 'skills', currentSkill, 'PROTOCOL.json');
    if (fs.existsSync(protocolPath)) {
      const protocol = JSON.parse(fs.readFileSync(protocolPath, 'utf-8'));
      console.log('\n📋 执行协议:');
      if (protocol.phases) protocol.phases.forEach((phase, i) => console.log(`  ${i + 1}. ${phase.name} ${phase.requiresConfirm ? '⚠️ 需确认' : ''}`));
    }
  },

  'audit': () => {
    const result = stateManager.audit();
    if (!result.exists) { console.log('❌ 未找到状态文件'); return; }
    console.log(`📊 XiaoXiao 审计报告\n`);
    console.log(`项目: ${result.project}`);
    console.log(`迭代: ${result.currentIteration}\n`);
    let hasIssues = false;
    for (const skill of result.skills) {
      const statusIcon = skill.status === 'completed' ? '✅' : skill.status === 'active' ? '🔄' : skill.status === 'blocked' ? '🚫' : '⏳';
      const outputIcon = skill.outputExists ? '✅' : '❌';
      console.log(`${statusIcon} ${skill.name} (${skill.status})`);
      console.log(`   输出: ${outputIcon} ${skill.expectedOutput}`);
      if (skill.status === 'completed' && !skill.outputExists) { console.log(`   ⚠️  状态显示完成但输出文件不存在`); hasIssues = true; }
      else if (skill.status === 'pending' && skill.outputExists) { console.log(`   ⚠️  输出文件存在但状态未更新`); hasIssues = true; }
    }
    if (!hasIssues) console.log('\n✅ 所有 Skills 状态正常');
    else console.log('\n⚠️  发现问题，使用 "xiaoxiao fix-missing <skill>" 修复');
  },

  'fix-missing': (args) => {
    const skillName = args[0];
    if (!skillName) { console.log('❌ 请指定 Skill 名称'); return; }
    const diagnosis = stateManager.diagnose(skillName);
    if (diagnosis.error) { console.log(`❌ ${diagnosis.error}`); return; }
    console.log(`📋 ${skillName} 诊断结果\n`);
    console.log(`状态: ${diagnosis.status}`);
    console.log(`输出文件: ${diagnosis.expectedOutput}`);
    console.log(`文件存在: ${diagnosis.outputExists ? '是' : '否'}`);
    if (diagnosis.issues.length > 0) {
      console.log('\n发现问题:');
      diagnosis.issues.forEach(issue => console.log(`  - ${issue.message}`));
      console.log('\n补救选项:');
      console.log('  1) mark-complete - 标记为完成（文件已存在）');
      console.log('  2) mark-pending - 标记为未完成（重新做）');
      console.log('  3) reset - 重置状态');
      console.log('\n使用 "xiaoxiao fix-missing <skill> <action>" 执行修复');
    } else console.log('\n✅ 未发现问题');
  },

  'help': () => {
    console.log(`
🔧 XiaoXiao CLI

用法: xiaoxiao <command> [args]

命令:
  init-project [name]    初始化项目（创建目录结构和状态）
  status                  显示当前状态
  audit                   审计所有 Skills 状态和输出
  fix-missing <skill>     诊断并修复 Skill 状态问题
  continue                显示当前 Skill 并指导继续
  iterations              显示所有迭代历史
  new-iteration           开始新迭代（新功能/第二轮开发）
  resume                  恢复中断
  goto <skill>            跳转到指定 Skill
  interrupt [note]         中断当前 Skill
  save-progress <skill> <phase>  保存进度
  complete <skill>        标记 Skill 完成（需先创建输出文件）
  update-check            检查更新
  update                  下载更新
  skip-update             永久跳过更新检查
  unskip-update           恢复更新检查
  version                 显示版本信息
  skills                  列出所有可用 Skill
  list                    列出可执行的 Skills
  help                    显示帮助

示例:
  xiaoxiao init-project my-project
  xiaoxiao audit
  xiaoxiao fix-missing strategy-review
  xiaoxiao status
  xiaoxiao continue

Skills:
  product-consult → strategy-review → architect → ui-design → task-planning → tdd-development → ship

输出规范:
  各阶段输出文件放在 docs/xiaoxiao/plans/ 目录
  文件命名: {skill-name}-output.md
`);
  }
};

// ========== 主入口 ==========

function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  if (!command || command === 'help') {
    COMMANDS['help']();
    return;
  }

  const handler = COMMANDS[command];
  if (!handler) {
    console.log(`❌ 未知命令: ${command}`);
    console.log(`   运行 "xiaoxiao help" 查看帮助`);
    process.exit(1);
  }

  try {
    handler(args);
  } catch (e) {
    console.log(`❌ 执行失败: ${e.message}`);
    process.exit(1);
  }
}

main();
