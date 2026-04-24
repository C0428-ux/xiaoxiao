const fs = require('fs');
const path = require('path');

const SKILLS = [
  'product-consult',
  'strategy-review',
  'architect',
  'ui-design',
  'task-planning',
  'tdd-development',
  'ship'
];

class StateManager {
  constructor(projectRoot, frameworkRoot = null) {
    this.projectRoot = projectRoot;
    this.frameworkRoot = frameworkRoot || projectRoot;
    this.stateDir = path.join(projectRoot, '.xiaoxiao');
    this.statePath = path.join(this.stateDir, 'state.json');
    this.backupDir = path.join(this.stateDir, 'backups');
  }

  /**
   * 初始化新项目状态
   */
  init(projectName) {
    const timestamp = new Date().toISOString();

    // 备份已有状态
    if (fs.existsSync(this.statePath)) {
      this._backup('state.json');
    }

    const state = {
      version: '0.7',  // 版本升级，支持迭代
      currentSkill: null,
      currentPhase: 'idle',
      project: {
        name: projectName,
        path: this.projectRoot,
        createdAt: timestamp
      },
      skills: SKILLS.reduce((acc, skill) => {
        acc[skill] = {
          status: 'pending',
          startedAt: null,
          completedAt: null,
          outputs: {},
          loopCount: 0,
          blockedReason: null
        };
        return acc;
      }, {}),
      // 迭代历史
      iterations: [
        {
          id: 'v1',
          number: 1,
          startedAt: timestamp,
          completedAt: null,
          summary: null,
          specFile: '.SPEC.md',
          plansDir: 'docs/xiaoxiao/plans'
        }
      ],
      currentIteration: 'v1',
      // 旧版本兼容字段（保留但不使用）
      handover: {
        from: null,
        to: null,
        timestamp: null,
        context: {}
      },
      userParticipation: {
        currentTask: null,
        pendingConfirmations: []
      },
      interrupt: {
        enabled: false,
        at: null,
        resumePoint: null,
        savedAt: null
      },
      settings: {
        skipUpdate: false
      },
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this._write(state);
    return state;
  }

  /**
   * 读取当前状态
   */
  read() {
    if (!fs.existsSync(this.statePath)) {
      return null;
    }
    const content = fs.readFileSync(this.statePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * 更新状态
   */
  update(updates) {
    const state = this.read();
    if (!state) {
      throw new Error('State file not found. Run "xiaoxiao start" first.');
    }

    const updated = {
      ...state,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this._write(updated);
    return updated;
  }

  /**
   * 更新单个 Skill 状态
   */
  updateSkill(skillName, updates) {
    const state = this.read();
    if (!state) {
      throw new Error('State file not found.');
    }

    // 如果 skill 不存在，初始化它（兼容旧状态文件）
    if (!state.skills[skillName]) {
      state.skills[skillName] = {
        status: 'pending',
        startedAt: null,
        completedAt: null,
        outputs: {},
        loopCount: 0,
        blockedReason: null
      };
    }

    state.skills[skillName] = {
      ...state.skills[skillName],
      ...updates
    };

    state.updatedAt = new Date().toISOString();
    this._write(state);
    return state;
  }

  /**
   * 获取跳过更新设置
   */
  getSkipUpdate() {
    const state = this.read();
    if (!state) return false;
    return state.settings?.skipUpdate || false;
  }

  /**
   * 设置跳过更新
   */
  setSkipUpdate(value) {
    const state = this.read();
    if (!state) {
      throw new Error('State file not found.');
    }

    if (!state.settings) {
      state.settings = {};
    }
    state.settings.skipUpdate = value;
    state.updatedAt = new Date().toISOString();
    this._write(state);
    return state;
  }

  /**
   * 保存 Skill 阶段进度
   */
  saveProgress(skillName, phase) {
    const state = this.read();
    if (!state) {
      throw new Error('State file not found.');
    }

    // 如果 skill 不存在，初始化它（兼容旧状态文件）
    if (!state.skills[skillName]) {
      state.skills[skillName] = {
        status: 'pending',
        startedAt: null,
        completedAt: null,
        outputs: {},
        loopCount: 0,
        blockedReason: null,
        currentPhase: null
      };
    }

    state.skills[skillName].currentPhase = phase;
    state.skills[skillName].lastProgressAt = new Date().toISOString();

    // 如果这个 skill 是当前 active 的，更新全局 phase
    if (state.currentSkill === skillName) {
      state.currentPhase = phase;
    }

    state.updatedAt = new Date().toISOString();
    this._write(state);
    return state;
  }

  /**
   * 设置当前活跃 Skill
   */
  setCurrentSkill(skillName) {
    return this.update({
      currentSkill: skillName,
      currentPhase: 'active'
    });
  }

  /**
   * 完成当前 Skill，触发交接
   */
  completeCurrentSkill(context = {}) {
    const state = this.read();
    if (!state || !state.currentSkill) {
      throw new Error('No active skill to complete.');
    }

    const skillName = state.currentSkill;
    state.skills[skillName].status = 'completed';
    state.skills[skillName].completedAt = new Date().toISOString();

    // 查找下一个 Skill
    const nextSkill = this._getNextSkill(skillName);
    if (nextSkill) {
      state.skills[nextSkill].status = 'ready';
    }

    // 记录交接
    state.handover = {
      from: skillName,
      to: nextSkill,
      timestamp: new Date().toISOString(),
      context
    };

    state.currentSkill = nextSkill;
    state.currentPhase = nextSkill ? 'active' : 'completed';

    this._write(state);
    return state;
  }

  /**
   * 中断当前 Skill
   */
  interrupt(skillName, resumePoint) {
    const state = this.read();
    if (!state) {
      throw new Error('State file not found.');
    }

    state.interrupt = {
      enabled: true,
      at: skillName || state.currentSkill,
      resumePoint,
      savedAt: new Date().toISOString()
    };

    state.currentPhase = 'waiting-user';
    this._write(state);
    return state;
  }

  /**
   * 恢复中断
   */
  resume() {
    const state = this.read();
    if (!state) {
      throw new Error('State file not found.');
    }

    if (!state.interrupt || !state.interrupt.enabled) {
      throw new Error('No interrupt to resume.');
    }

    const skillName = state.interrupt.at;
    state.currentSkill = skillName;
    state.currentPhase = 'active';

    // 清除中断状态，保留 resumePoint 供 Skill 读取
    state.interrupt.enabled = false;

    this._write(state);
    return state;
  }

  /**
   * 开始新一轮迭代
   */
  startNewIteration() {
    const state = this.read();
    if (!state) {
      throw new Error('State file not found.');
    }

    // 完成当前迭代（如果存在未完成的）
    if (state.currentIteration) {
      const currentIter = this.getCurrentIteration();
      if (currentIter && !currentIter.completedAt) {
        this.completeIteration('未完成迭代');
      }
    }

    // 创建新迭代
    const timestamp = new Date().toISOString();
    const prevIterations = state.iterations || [];
    const nextNumber = prevIterations.length + 1;
    const nextId = `v${nextNumber}`;

    const newIteration = {
      id: nextId,
      number: nextNumber,
      startedAt: timestamp,
      completedAt: null,
      summary: null,
      specFile: '.SPEC.md',  // 始终使用当前路径
      plansDir: 'docs/xiaoxiao/plans'  // 始终使用当前路径
    };

    state.iterations = [...prevIterations, newIteration];
    state.currentIteration = nextId;

    // 重置所有 skills 为 pending
    for (const skill of SKILLS) {
      state.skills[skill] = {
        status: 'pending',
        startedAt: null,
        completedAt: null,
        outputs: {},
        loopCount: 0,
        blockedReason: null
      };
    }
    state.currentSkill = null;
    state.currentPhase = 'idle';

    this._write(state);
    return state;
  }

  /**
   * 完成当前迭代
   */
  completeIteration(summary) {
    const state = this.read();
    if (!state) {
      throw new Error('State file not found.');
    }

    const currentIterId = state.currentIteration;
    const iterations = state.iterations.map(iter => {
      if (iter.id === currentIterId) {
        return {
          ...iter,
          completedAt: new Date().toISOString(),
          summary: summary
        };
      }
      return iter;
    });

    state.iterations = iterations;
    this._write(state);
    return state;
  }

  /**
   * 获取当前迭代信息
   */
  getCurrentIteration() {
    const state = this.read();
    if (!state || !state.currentIteration) return null;
    return state.iterations?.find(iter => iter.id === state.currentIteration) || null;
  }

  /**
   * 获取指定迭代
   */
  getIteration(iterId) {
    const state = this.read();
    if (!state) return null;
    return state.iterations?.find(iter => iter.id === iterId) || null;
  }

  /**
   * 获取所有迭代
   */
  getAllIterations() {
    const state = this.read();
    if (!state) return [];
    return state.iterations || [];
  }

  /**
   * 获取阻塞的 Skills
   */
  getBlockedSkills() {
    const state = this.read();
    if (!state) return [];

    return Object.entries(state.skills)
      .filter(([, s]) => s.status === 'blocked')
      .map(([name, s]) => ({ name, reason: s.blockedReason }));
  }

  /**
   * 检查前置条件
   */
  checkPrerequisites(skillName) {
    const state = this.read();
    if (!state) return { pass: false, reason: 'No state file' };

    const skill = state.skills[skillName];
    if (!skill) return { pass: false, reason: `Unknown skill: ${skillName}` };

    if (skill.status === 'completed') {
      return { pass: false, reason: `Skill ${skillName} already completed` };
    }

    if (skill.status === 'blocked') {
      return { pass: false, reason: skill.blockedReason };
    }

    // 检查前置 Skill 是否完成
    const prereqMap = {
      'strategy-review': ['product-consult'],
      'architect': ['strategy-review'],
      'ui-design': ['architect'],
      'task-planning': ['ui-design'],
      'tdd-development': ['task-planning'],
      'ship': ['tdd-development']
    };

    const prereqs = prereqMap[skillName] || [];
    for (const prereq of prereqs) {
      if (state.skills[prereq].status !== 'completed') {
        return {
          pass: false,
          reason: `Requires ${prereq} to be completed first. Current status: ${state.skills[prereq].status}`
        };
      }
    }

    return { pass: true };
  }

  /**
   * 获取当前状态摘要
   */
  getStatus() {
    const state = this.read();
    if (!state) {
      return { exists: false };
    }

    const blocked = this.getBlockedSkills();
    const nextSkill = this._getNextSkill(state.currentSkill);

    return {
      exists: true,
      version: state.version,
      project: state.project,
      currentSkill: state.currentSkill,
      currentPhase: state.currentPhase,
      interrupt: state.interrupt,
      blocked,
      nextSkill,
      skills: state.skills
    };
  }

  /**
   * 备份当前状态
   */
  _backup(filename) {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    const src = path.join(this.stateDir, filename);
    const timestamp = Date.now();
    const backupPath = path.join(this.backupDir, `${timestamp}_${filename}`);

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, backupPath);
    }

    // 清理旧备份（保留最近 10 个）
    const backups = fs.readdirSync(this.backupDir)
      .filter(f => f.endsWith(`_${filename}`))
      .sort()
      .reverse();

    backups.slice(10).forEach(f => {
      fs.unlinkSync(path.join(this.backupDir, f));
    });
  }

  _write(state) {
    if (!fs.existsSync(this.stateDir)) {
      fs.mkdirSync(this.stateDir, { recursive: true });
    }
    fs.writeFileSync(this.statePath, JSON.stringify(state, null, 2), 'utf-8');
  }

  _getNextSkill(current) {
    const idx = SKILLS.indexOf(current);
    if (idx === -1 || idx === SKILLS.length - 1) return null;
    return SKILLS[idx + 1];
  }
}

module.exports = { StateManager, SKILLS };