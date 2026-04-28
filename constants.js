/**
 * XiaoXiao Framework - 常量定义（单一来源）
 * 所有全局常量集中在此文件，避免多处定义导致的不一致
 */

const SKILLS = [
  'product-consult',
  'strategy-review',
  'architect',
  'ui-design',
  'task-planning',
  'tdd-development',
  'ship'
];

const PREREQ_MAP = {
  'strategy-review': ['product-consult'],
  'architect': ['strategy-review'],
  'ui-design': ['architect'],
  'task-planning': ['ui-design'],
  'tdd-development': ['task-planning'],
  'ship': ['tdd-development']
};

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

module.exports = {
  SKILLS,
  PREREQ_MAP,
  OUTPUT_MAP,
  GITHUB_REPO
};
