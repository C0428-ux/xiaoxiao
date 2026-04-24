const fs = require('fs');
const path = require('path');
const { SKILLS } = require('./state-manager');

class SkillLoader {
  constructor(projectRoot, frameworkRoot = null) {
    this.projectRoot = projectRoot;
    // Skills 从全局框架目录加载
    this.frameworkRoot = frameworkRoot || __dirname;
    this.skillDir = path.join(this.frameworkRoot, 'skills');
  }

  /**
   * 获取所有可用 Skill
   */
  listSkills() {
    return SKILLS.map(name => ({
      name,
      path: this._getSkillPath(name),
      exists: fs.existsSync(this._getSkillPath(name))
    }));
  }

  /**
   * 检查 Skill 是否存在
   */
  exists(skillName) {
    return SKILLS.includes(skillName) && fs.existsSync(this._getSkillPath(skillName));
  }

  /**
   * 加载 Skill 的主文件（SKILL.md）
   */
  load(skillName) {
    if (!this.exists(skillName)) {
      throw new Error(`Skill not found: ${skillName}`);
    }

    const skillPath = this._getSkillPath(skillName);
    const skillMdPath = path.join(skillPath, 'SKILL.md');

    if (!fs.existsSync(skillMdPath)) {
      throw new Error(`SKILL.md not found for ${skillName}`);
    }

    const content = fs.readFileSync(skillMdPath, 'utf-8');
    return this._parseSkillMd(content, skillName);
  }

  /**
   * 加载 Skill 的 Guide 文档
   */
  loadGuide(skillName, guideName) {
    if (!this.exists(skillName)) {
      throw new Error(`Skill not found: ${skillName}`);
    }

    const guidePath = path.join(this._getSkillPath(skillName), 'GUIDES', guideName);
    if (!fs.existsSync(guidePath)) {
      throw new Error(`Guide not found: ${guideName} for ${skillName}`);
    }

    return fs.readFileSync(guidePath, 'utf-8');
  }

  /**
   * 加载 Skill 的输出模板
   */
  loadOutputTemplate(skillName, templateName) {
    if (!this.exists(skillName)) {
      throw new Error(`Skill not found: ${skillName}`);
    }

    const templatePath = path.join(this._getSkillPath(skillName), 'OUTPUTS', templateName);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templateName} for ${skillName}`);
    }

    return fs.readFileSync(templatePath, 'utf-8');
  }

  /**
   * 获取 Skill 的所有 Guide 文件
   */
  listGuides(skillName) {
    const guidesDir = path.join(this._getSkillPath(skillName), 'GUIDES');
    if (!fs.existsSync(guidesDir)) return [];

    return fs.readdirSync(guidesDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''));
  }

  /**
   * 验证触发词是否匹配 Skill
   */
  matchTrigger(input, skillName) {
    const skill = this.load(skillName);
    const triggers = skill.triggers || [];

    for (const trigger of triggers) {
      if (input.toLowerCase().includes(trigger.toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  /**
   * 根据输入查找匹配的 Skill
   */
  findSkillByInput(input) {
    for (const skillName of SKILLS) {
      if (this.matchTrigger(input, skillName)) {
        return skillName;
      }
    }
    return null;
  }

  /**
   * 解析 SKILL.md 内容，提取触发词和流程
   */
  _parseSkillMd(content, skillName) {
    const lines = content.split('\n');
    const result = {
      name: skillName,
      triggers: [],
      prerequisites: [],
      coreSteps: [],
      fullContent: content
    };

    // 解析 Layer 1（触发词、前置、核心步骤）
    let inCoreSteps = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('**触发词**') || line.startsWith('触发词')) {
        const match = line.match(/[:：]\s*(.+)/);
        if (match) {
          result.triggers = match[1].split(/[,，]/).map(t => t.trim());
        }
      }

      if (line.startsWith('**前置条件**') || line.startsWith('前置条件')) {
        const match = line.match(/[:：]\s*(.+)/);
        if (match) {
          result.prerequisites = match[1].split(/[,，]/).map(t => t.trim());
        }
      }

      if (line.startsWith('**核心动作**') || line.startsWith('核心动作')) {
        inCoreSteps = true;
        continue;
      }

      if (inCoreSteps && line.startsWith('-')) {
        result.coreSteps.push(line.substring(1).trim());
      } else if (inCoreSteps && line && !line.startsWith('-') && !line.startsWith('**')) {
        inCoreSteps = false;
      }
    }

    return result;
  }

  /**
   * 获取 Skill 目录路径
   */
  _getSkillPath(skillName) {
    return path.join(this.skillDir, skillName);
  }
}

module.exports = { SkillLoader, SKILLS };