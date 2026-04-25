# Preview Tool

生成独立 HTML 预览文件，双击即可在浏览器打开查看设计效果。

## 使用方式

### Node.js API

```javascript
const { generateHTML, PRESETS } = require('./generate.js');

// 方式1: 传对象
const html = generateHTML({
  preset: 'modern-saas',  // 可选: modern-saas, apple-minimal, enterprise, creative, dashboard
  title: 'My App',
  pages: [
    {
      name: 'Dashboard',
      content: '<div class="card p-6">Hello World</div>'
    }
  ]
});

// 方式2: 保存文件
const fs = require('fs');
fs.writeFileSync('preview.html', html);
```

### CLI

```bash
# 使用 JSON 数据文件
node generate.js --data design-data.json --output preview.html

# 直接指定参数
node generate.js --preset modern-saas --title "My App" --pages '[{"name":"Home","content":"..."}]'
```

## 预览内容结构

```javascript
{
  preset: 'modern-saas',  // 设计风格
  title: 'App Name',      // 页面标题
  pages: [
    {
      name: 'Page Name',    // 导航标签
      content: '<html content>'  // 页面 HTML（使用 Tailwind）
    }
  ]
}
```

## 设计风格

| Preset | 名称 | 适用场景 |
|--------|------|---------|
| `modern-saas` | Modern SaaS | B2B 产品、后台 |
| `apple-minimal` | Apple-level Minimal | 消费级 App |
| `enterprise` | Enterprise | 企业内部系统 |
| `creative` | Creative / Portfolio | 作品集、创意网站 |
| `dashboard` | Data Dashboard | 数据平台 |

## 示例

生成带多个页面的预览：

```javascript
const { generateHTML } = require('./generate.js');

const html = generateHTML({
  preset: 'modern-saas',
  title: 'Task Manager',
  pages: [
    {
      name: 'Dashboard',
      content: `
        <div class="grid-3">
          <div class="card p-6">
            <div class="text-sm text-secondary mb-2">Total Tasks</div>
            <div class="text-3xl font-bold">24</div>
          </div>
          <div class="card p-6">
            <div class="text-sm text-secondary mb-2">Completed</div>
            <div class="text-3xl font-bold text-success">18</div>
          </div>
          <div class="card p-6">
            <div class="text-sm text-secondary mb-2">In Progress</div>
            <div class="text-3xl font-bold text-accent">6</div>
          </div>
        </div>
      `
    },
    {
      name: 'Settings',
      content: `
        <div class="card p-6" style="max-width: 480px">
          <h2 class="text-xl font-semibold mb-4">Profile Settings</h2>
          <div class="form-group">
            <label class="form-label">Name</label>
            <input class="input" type="text" placeholder="Your name">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input class="input" type="email" placeholder="you@example.com">
          </div>
          <button class="btn btn-primary">Save Changes</button>
        </div>
      `
    }
  ]
});
```

打开生成的 HTML 文件即可在浏览器中看到效果。
