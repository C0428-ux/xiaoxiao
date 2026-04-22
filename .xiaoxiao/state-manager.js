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
      version: '0.6',
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

    if (!state.skills[skillName]) {
      throw new Error(`Unknown skill: ${skillName}`);
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