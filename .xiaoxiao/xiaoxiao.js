#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const os = require('os');

// ========== 路径解析 ==========

// 全局框架目录（脚本所在目录）
const FRAMEWORK_DIR = __dirname;

// 项目根目录：从当前目录向上查找 state.json
function findProjectRoot(startDir) {
  let dir = startDir;
  const home = os.homedir();

  while (dir !== home && dir !== path.parse(dir).root) {
    const statePath = path.join(dir, '.xiaoxiao', 'state.json');
    if (fs.existsSync(statePath)) {
      return dir;
    }
    dir = path.dirname(dir);
  }

  // 没找到，返回启动目录
  return startDir;
}

// 当前工作目录
const CWD = process.cwd();

// 全局框架路径
const FRAMEWORK_ROOT = FRAMEWORK_DIR;

// 项目根目录（只在 state.json 存在时才算项目）
const PROJECT_ROOT = findProjectRoot(CWD);

// 加载模块
const { StateManager, SKILLS } = require(path.join(FRAMEWORK_ROOT, 'state-manager'));
const { SkillLoader } = require(path.join(FRAMEWORK_ROOT, 'skill-loader'));
const { Handover } = require(path.join(FRAMEWORK_ROOT, 'handover'));
const UpdateChecker = require(path.join(FRAMEWORK_ROOT, 'update-checker'));

// 实例化（注意：skillLoader 从全局加载 skills，stateManager 操作项目本地 state）
const stateManager = new StateManager(PROJECT_ROOT, FRAMEWORK_ROOT);
const skillLoader = new SkillLoader(PROJECT_ROOT, FRAMEWORK_ROOT);
const handover = new Handover(PROJECT_ROOT, FRAMEWORK_ROOT);

const COMMANDS = {
  'update-check': async () => {
    // 检查是否永久跳过更新
    if (stateManager.getSkipUpdate()) {
      console.log('STATUS: SKIP_FOREVER');
      console.log('已永久跳过更新检查');
      return;
    }

    const checker = new UpdateChecker(FRAMEWORK_ROOT);
    const result = await checker.check();

    if (result.error) {
      console.log(`ERROR: ${result.error}`);
      return;
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
    const checker = new UpdateChecker(FRAMEWORK_ROOT);
    try {
      await checker.update();
    } catch (err) {
      console.log(`❌ 更新失败: ${err.message}`);
    }
  },

  'version': () => {
    const checker = new UpdateChecker(FRAMEWORK_ROOT);
    checker.showVersion();
  },

  'complete': (args) => {
    const skillName = args[0];
    const outputPath = args[1]; // 可选，显式指定输出路径

    if (!skillName) {
      console.log('❌ 请指定 Skill 名称');
      console.log('用法: xiaoxiao complete <skill> [output-path]');
      return;
    }

    const state = stateManager.read();
    if (!state) {
      console.log('❌ 未找到状态文件');
      return;
    }

    // 确定输出路径
    const plansDir = path.join(PROJECT_ROOT, 'docs', 'xiaoxiao', 'plans');
    const defaultOutput = path.join(plansDir, `${skillName}-output.md`);
    const finalOutputPath = outputPath || defaultOutput;

    // 确保输出目录存在
    if (!fs.existsSync(plansDir)) {
      fs.mkdirSync(plansDir, { recursive: true });
    }

    // 检查输出文件是否存在
    if (!fs.existsSync(finalOutputPath)) {
      console.log(`❌ 输出文件不存在: ${finalOutputPath}`);
      console.log('请先创建输出文件后再完成 Skill');
      return;
    }

    // 更新状态，记录输出路径
    stateManager.updateSkill(skillName, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      outputs: {
        main: path.relative(PROJECT_ROOT, finalOutputPath)
      }
    });

    // 如果有当前 Skill 且是要完成的，执行交接
    if (state.currentSkill === skillName) {
      const nextSkill = SKILLS[SKILLS.indexOf(skillName) + 1];
      stateManager.completeCurrentSkill({
        outputPath: finalOutputPath
      });
      if (nextSkill) {
        console.log(`✅ ${skillName} 完成`);
        console.log(`📄 输出: ${path.relative(PROJECT_ROOT, finalOutputPath)}`);
        console.log(`\n▶ 进入下一阶段: ${nextSkill}`);
      } else {
        console.log(`✅ ${skillName} 完成`);
        console.log(`📄 输出: ${path.relative(PROJECT_ROOT, finalOutputPath)}`);
        console.log(`\n🎉 所有阶段完成！`);
      }
    } else {
      console.log(`✅ ${skillName} 标记为完成`);
      console.log(`📄 输出: ${path.relative(PROJECT_ROOT, finalOutputPath)}`);
    }
  },

  'init-project': (args) => {
    const projectName = args[0] || path.basename(PROJECT_ROOT);
    const plansDir = path.join(PROJECT_ROOT, 'docs', 'xiaoxiao', 'plans');

    // 创建项目结构
    if (!fs.existsSync(plansDir)) {
      fs.mkdirSync(plansDir, { recursive: true });
    }

    stateManager.init(projectName);
    console.log(`✅ 项目初始化完成: ${projectName}`);
    console.log(`   状态文件: ${path.join(PROJECT_ROOT, '.xiaoxiao', 'state.json')}`);
    console.log(`   输出目录: ${plansDir}`);
    console.log(`\n使用 /xiaoxiao 开始开发流程`);
  },

  'status': () => {
    const status = stateManager.getStatus();
    if (!status.exists) {
      console.log('❌ 未找到状态文件。先运行 "xiaoxiao start" 初始化项目。');
      return;
    }

    console.log(`📊 XiaoXiao 状态\n`);
    console.log(`项目: ${status.project.name}`);
    console.log(`当前阶段: ${status.currentSkill || 'idle'}`);
    console.log(`阶段状态: ${status.currentPhase}\n`);

    console.log('Skills:');
    for (const [name, skill] of Object.entries(status.skills)) {
      const icon = skill.status === 'completed' ? '✅' :
                   skill.status === 'active' ? '🔄' :
                   skill.status === 'blocked' ? '🚫' :
                   skill.status === 'ready' ? '📌' : '⏳';
      const loops = skill.loopCount ? ` (×${skill.loopCount})` : '';
      console.log(`  ${icon} ${name}${loops} - ${skill.status}`);
      if (skill.blockedReason) {
        console.log(`      └─ ${skill.blockedReason}`);
      }
    }

    if (status.interrupt && status.interrupt.enabled) {
      console.log(`\n⚠️  有未完成的中断: ${status.interrupt.at}`);
      console.log(`   恢复点: ${JSON.stringify(status.interrupt.resumePoint)}`);
      console.log(`   使用 "xiaoxiao resume" 继续`);
    }

    if (status.blocked && status.blocked.length > 0) {
      console.log(`\n🚫 阻塞的 Skills:`);
      status.blocked.forEach(b => {
        console.log(`   - ${b.name}: ${b.reason}`);
      });
    }
  },

  'resume': () => {
    const result = stateManager.resume();
    const skill = result.currentSkill;
    console.log(`✅ 已恢复中断`);
    console.log(`当前 Skill: ${skill}`);
    if (result.interrupt.resumePoint) {
      console.log(`恢复点: ${JSON.stringify(result.interrupt.resumePoint)}`);
    }
  },

  'goto': (args) => {
    const targetSkill = args[0];
    if (!targetSkill) {
      console.log('❌ 请指定目标 Skill');
      console.log('可用 Skills: product-consult, strategy-review, architect, ui-design, task-planning, tdd-development, ship');
      return;
    }

    // 检查前置条件
    const prereq = stateManager.checkPrerequisites(targetSkill);
    if (!prereq.pass) {
      console.log(`❌ 无法跳转到 ${targetSkill}`);
      console.log(`   原因: ${prereq.reason}`);
      return;
    }

    const result = handover.transitionTo(targetSkill);
    if (result.success) {
      console.log(`✅ 已切换到 ${targetSkill}`);
      if (result.previousSkill) {
        console.log(`   从 ${result.previousSkill} 交接`);
      }
    } else {
      console.log(`❌ 切换失败: ${result.reason}`);
    }
  },

  'save-progress': (args) => {
    const skillName = args[0];
    const phase = args[1];

    if (!skillName || !phase) {
      console.log('❌ 请指定 Skill 名称和阶段');
      console.log('用法: xiaoxiao save-progress <skill> <phase>');
      return;
    }

    stateManager.saveProgress(skillName, phase);
    console.log(`✅ 已保存进度`);
    console.log(`   Skill: ${skillName}`);
    console.log(`   Phase: ${phase}`);
  },

  'interrupt': (args) => {
    const state = stateManager.read();
    if (!state) {
      console.log('❌ 未找到状态文件');
      return;
    }

    const resumePoint = args.length > 0 ? args.join(' ') : null;
    stateManager.interrupt(state.currentSkill, resumePoint);
    console.log(`✅ 已中断当前 Skill: ${state.currentSkill}`);
    console.log(`   恢复点: ${resumePoint || '未指定'}`);
    console.log(`   使用 "xiaoxiao resume" 继续`);
  },

  'skills': () => {
    const skills = skillLoader.listSkills();
    console.log('📦 可用 Skills:\n');
    skills.forEach(s => {
      const icon = s.exists ? '✅' : '❌';
      console.log(`  ${icon} ${s.name}`);
    });
  },

  'load': (args) => {
    const skillName = args[0];
    if (!skillName) {
      console.log('❌ 请指定 Skill 名称');
      return;
    }

    try {
      const skill = skillLoader.load(skillName);
      console.log(`📄 Skill: ${skill.name}\n`);
      console.log(`触发词: ${skill.triggers.join(', ')}`);
      console.log(`前置条件: ${skill.prerequisites.join(', ')}`);
      console.log(`\n核心动作:`);
      skill.coreSteps.forEach((step, i) => {
        console.log(`  ${i + 1}. ${step}`);
      });
      console.log(`\n--- Layer 2 内容 ---`);
      console.log(skill.fullContent);
    } catch (e) {
      console.log(`❌ 加载失败: ${e.message}`);
    }
  },

  'list': () => {
    const executable = handover.listExecutableSkills();
    console.log('▶ 可执行的 Skills:\n');
    executable.forEach(s => console.log(`  - ${s}`));
  },

  'help': () => {
    console.log(`
🔧 XiaoXiao CLI

用法: xiaoxiao <command> [args]

命令:
  init-project [name]  初始化项目（创建目录结构和状态）
  status               显示当前状态
  resume               恢复中断
  goto <skill>         跳转到指定 Skill
  interrupt [note]      中断当前 Skill
  complete <skill>     标记 Skill 完成（需先创建输出文件）
  update-check         检查更新
  update               下载更新
  skip-update          永久跳过更新检查
  unskip-update        恢复更新检查
  version              显示版本信息
  skills               列出所有可用 Skill
  load <skill>         加载 Skill 信息（显示完整内容）
  list                 列出可执行的 Skills
  help                 显示帮助

示例:
  xiaoxiao init-project my-project
  xiaoxiao status
  xiaoxiao complete product-consult docs/xiaoxiao/plans/product-consult-output.md
  xiaoxiao goto strategy-review

Skills:
  product-consult → strategy-review → architect → ui-design → task-planning → tdd-development → ship

输出规范:
  各阶段输出文件放在 docs/xiaoxiao/plans/ 目录
  文件命名: {skill-name}-output.md
`);
  }
};

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