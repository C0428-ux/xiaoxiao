#!/usr/bin/env node

/**
 * XiaoXiao CLI - 状态管理和流程控制入口
 *
 * 路径设计：
 * - 脚本文件在框架目录（__dirname）
 * - 状态文件和输出在项目目录（PROJECT_ROOT，通过向上查找 xiaoxiao-state.json 确定）
 *
 * 修复：所有常量从 constants.js 单一来源加载，避免代码重复
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const { execSync } = require('child_process');

const { SKILLS, PREREQ_MAP, OUTPUT_MAP, GITHUB_REPO } = require('./constants');
const { StateManager } = require('./state-manager');
const UpdateChecker = require('./update-checker');

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


// ========== CLI 实例 ==========

const stateManager = new StateManager(PROJECT_ROOT, FRAMEWORK_DIR);
const updateChecker = new UpdateChecker(FRAMEWORK_DIR);

// ========== 命令处理器 ==========

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
