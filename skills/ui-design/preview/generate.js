#!/usr/bin/env node
/**
 * UI Design Preview Generator
 *
 * Generates standalone HTML files for visual preview of UI designs.
 * Usage: node generate.js --data <json-file> --output <html-file>
 *        node generate.js --preset <preset-name> --pages <pages-json>
 */

const fs = require('fs');
const path = require('path');

// Design preset CSS variables
const PRESETS = {
  'modern-saas': {
    name: 'Modern SaaS',
    css: `
      --color-bg: #fafafa;
      --color-surface: #ffffff;
      --color-border: #e5e5e5;
      --color-text-primary: #171717;
      --color-text-secondary: #737373;
      --color-accent: #2563eb;
      --color-accent-hover: #1d4ed8;
      --color-success: #16a34a;
      --color-warning: #ca8a04;
      --color-error: #dc2626;
      --radius: 8px;
      --shadow: 0 1px 3px rgba(0,0,0,0.1);
    `
  },
  'apple-minimal': {
    name: 'Apple-level Minimal',
    css: `
      --color-bg: #ffffff;
      --color-surface: #f5f5f7;
      --color-border: #d2d2d7;
      --color-text-primary: #1d1d1f;
      --color-text-secondary: #86868b;
      --color-accent: #0071e3;
      --color-accent-hover: #0077ed;
      --color-success: #34c759;
      --color-warning: #ff9500;
      --color-error: #ff3b30;
      --radius: 12px;
      --shadow: 0 2px 12px rgba(0,0,0,0.08);
    `
  },
  'enterprise': {
    name: 'Enterprise / Corporate',
    css: `
      --color-bg: #f3f4f6;
      --color-surface: #ffffff;
      --color-border: #d1d5db;
      --color-text-primary: #111827;
      --color-text-secondary: #6b7280;
      --color-accent: #4f46e5;
      --color-accent-hover: #4338ca;
      --color-success: #059669;
      --color-warning: #d97706;
      --color-error: #dc2626;
      --radius: 4px;
      --shadow: none;
    `
  },
  'creative': {
    name: 'Creative / Portfolio',
    css: `
      --color-bg: #0a0a0a;
      --color-surface: #171717;
      --color-border: #262626;
      --color-text-primary: #fafafa;
      --color-text-secondary: #a3a3a3;
      --color-accent: #f97316;
      --color-accent-alt: #eab308;
      --color-success: #22c55e;
      --color-warning: #facc15;
      --color-error: #ef4444;
      --radius: 0px;
      --shadow: 0 8px 32px rgba(0,0,0,0.4);
    `
  },
  'dashboard': {
    name: 'Data Dashboard',
    css: `
      --color-bg: #0f172a;
      --color-surface: #1e293b;
      --color-border: #334155;
      --color-text-primary: #f8fafc;
      --color-text-secondary: #94a3b8;
      --color-accent: #3b82f6;
      --color-chart-1: #3b82f6;
      --color-chart-2: #10b981;
      --color-chart-3: #f59e0b;
      --color-chart-4: #ef4444;
      --radius: 8px;
      --shadow: 0 4px 12px rgba(0,0,0,0.3);
    `
  }
};

// HTML template
function generateHTML({ preset = 'modern-saas', title = 'UI Preview', pages = [] }) {
  const presetData = PRESETS[preset] || PRESETS['modern-saas'];

  const pagesNav = pages.map((p, i) =>
    `<a href="#page-${i}" class="nav-item ${i === 0 ? 'active' : ''}" onclick="showPage(${i})">${p.name}</a>`
  ).join('');

  const pagesContent = pages.map((p, i) => `
    <div id="page-${i}" class="page ${i === 0 ? 'active' : ''}">
      ${p.content}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${presetData.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      ${presetData.css}
    }

    * { box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--color-bg);
      color: var(--color-text-primary);
      margin: 0;
      line-height: 1.6;
    }

    /* Navigation */
    .topnav {
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
    }
    .nav-logo {
      font-weight: 600;
      font-size: 16px;
      color: var(--color-text-primary);
    }
    .nav-links {
      display: flex;
      gap: 4px;
    }
    .nav-item {
      padding: 8px 16px;
      font-size: 14px;
      color: var(--color-text-secondary);
      text-decoration: none;
      border-radius: var(--radius);
      cursor: pointer;
      transition: all 0.15s;
    }
    .nav-item:hover {
      color: var(--color-text-primary);
      background: var(--color-bg);
    }
    .nav-item.active {
      color: var(--color-accent);
      background: color-mix(in srgb, var(--color-accent) 10%, transparent);
    }

    /* Main content */
    .main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    /* Page sections */
    .page {
      display: none;
    }
    .page.active {
      display: block;
    }

    /* Component styles */
    .card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      border-radius: var(--radius);
      border: none;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-primary {
      background: var(--color-accent);
      color: white;
    }
    .btn-primary:hover {
      background: var(--color-accent-hover);
    }
    .btn-secondary {
      background: transparent;
      color: var(--color-text-primary);
      border: 1px solid var(--color-border);
    }
    .btn-secondary:hover {
      border-color: var(--color-text-secondary);
    }

    .input {
      width: 100%;
      padding: 10px 14px;
      font-size: 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
      color: var(--color-text-primary);
      transition: border-color 0.15s;
    }
    .input:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 20%, transparent);
    }
    .input::placeholder {
      color: var(--color-text-secondary);
    }

    .badge {
      display: inline-flex;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 9999px;
      background: color-mix(in srgb, var(--color-accent) 15%, transparent);
      color: var(--color-accent);
    }

    .form-group {
      margin-bottom: 16px;
    }
    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
      color: var(--color-text-primary);
    }

    /* Preview badge */
    .preview-badge {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--color-accent);
      color: white;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    /* Grid */
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
      .nav-links { gap: 0; }
      .nav-item { padding: 8px 12px; font-size: 13px; }
    }
  </style>
</head>
<body>

<!-- Navigation -->
<nav class="topnav">
  <div class="nav-inner">
    <div class="nav-logo">${title}</div>
    <div class="nav-links">
      ${pagesNav}
    </div>
  </div>
</nav>

<!-- Main content -->
<main class="main">
  ${pagesContent}
</main>

<!-- Preview indicator -->
<div class="preview-badge">Preview Mode</div>

<script>
  function showPage(index) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach((el, i) => {
      el.classList.toggle('active', i === index);
    });
    // Update pages
    document.querySelectorAll('.page').forEach((el, i) => {
      el.classList.toggle('active', i === index);
    });
  }
</script>

</body>
</html>`;
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  let data = {};
  let outputPath = 'preview.html';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--data' && args[i + 1]) {
      const jsonPath = path.resolve(args[i + 1]);
      data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      outputPath = path.resolve(args[i + 1]);
      i++;
    } else if (args[i] === '--preset') {
      data.preset = args[i + 1];
      i++;
    } else if (args[i] === '--title') {
      data.title = args[i + 1];
      i++;
    } else if (args[i] === '--pages' && args[i + 1]) {
      data.pages = JSON.parse(args[i + 1]);
      i++;
    }
  }

  const html = generateHTML(data);
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`Preview generated: ${outputPath}`);
}

module.exports = { generateHTML, PRESETS };

if (require.main === module) {
  main();
}
