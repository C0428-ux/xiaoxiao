const { StateManager, SKILLS } = require('./state-manager');
const { SkillLoader } = require('./skill-loader');

/**
 * Handover 模块：负责 Skill 之间的交接、依赖链检测、状态转移
 */
class Handover {
  constructor(projectRoot, frameworkRoot = null) {
    this.stateManager = new StateManager(projectRoot, frameworkRoot);
    this.skillLoader = new SkillLoader(projectRoot, frameworkRoot);
  }

  /**
   * 尝试切换到指定 Skill
   * - 检查前置条件
   * - 更新状态
   * - 传递上下文
   */
  transitionTo(targetSkill, context = {}) {
    const prereq = this.stateManager.checkPrerequisites(targetSkill);

    if (!prereq.pass) {
      return {
        success: false,
        reason: prereq.reason,
        blocked: true
      };
    }

    const state = this.stateManager.read();
    const currentSkill = state.currentSkill;

    // 如果有当前 Skill，先完成它
    if (currentSkill && currentSkill !== targetSkill) {
      this.stateManager.completeCurrentSkill(context);
    }

    // 激活目标 Skill
    this.stateManager.setCurrentSkill(targetSkill);
    this.stateManager.updateSkill(targetSkill, {
      status: 'active',
      startedAt: new Date().toISOString()
    });

    // 更新交接记录
    this.stateManager.update({
      handover: {
        from: currentSkill,
        to: targetSkill,
        timestamp: new Date().toISOString(),
        context
      }
    });

    return {
      success: true,
      previousSkill: currentSkill,
      currentSkill: targetSkill
    };
  }

  /**
   * 获取依赖链信息
   */
  getDependencyChain(skillName) {
    const prereqMap = {
      'strategy-review': ['product-consult'],
      'architect': ['strategy-review'],
      'ui-design': ['architect'],
      'task-planning': ['ui-design'],
      'tdd-development': ['task-planning'],
      'ship': ['tdd-development']
    };

    const state = this.stateManager.read();
    const prereqs = prereqMap[skillName] || [];

    return prereqs.map(name => ({
      skill: name,
      status: state.skills[name].status,
      completedAt: state.skills[name].completedAt
    }));
  }

  /**
   * 获取阻塞原因及修复路径
   */
  getBlockage(skillName) {
    const chain = this.getDependencyChain(skillName);
    const blockers = chain.filter(s => s.status !== 'completed');

    if (blockers.length === 0) return null;

    return {
      blockedBy: blockers,
      resolution: `需要先完成: ${blockers.map(b => b.skill).join(' → ')}`
    };
  }

  /**
   * 检测是否有循环依赖
   */
  detectCircularDeps() {
    const prereqMap = {
      'strategy-review': ['product-consult'],
      'architect': ['strategy-review'],
      'ui-design': ['architect'],
      'task-planning': ['ui-design'],
      'tdd-development': ['task-planning'],
      'ship': ['tdd-development']
    };

    // 线性链式结构，不可能存在循环依赖
    // 这里预留扩展接口
    return null;
  }

  /**
   * 列出所有可执行的 Skill
   */
  listExecutableSkills() {
    const state = this.stateManager.read();
    if (!state) return [];

    return SKILLS.filter(name => {
      const prereq = this.stateManager.checkPrerequisites(name);
      return prereq.pass;
    });
  }

  /**
   * 获取交接上下文摘要
   */
  getHandoverSummary() {
    const state = this.stateManager.read();
    if (!state) return null;

    return {
      from: state.handover.from,
      to: state.handover.to,
      timestamp: state.handover.timestamp,
      context: state.handover.context
    };
  }
}

module.exports = { Handover };