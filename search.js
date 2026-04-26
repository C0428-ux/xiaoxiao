#!/usr/bin/env node

/**
 * XiaoXiao Search Tool
 * 内置搜索工具，提供多搜索引擎支持
 *
 * 使用方式：
 *   node search.js "<搜索词>" [--engine bing|duckduckgo]
 *
 * 环境变量（可选）：
 *   GOOGLE_API_KEY - Google Custom Search API key
 *   GOOGLE_CSE_ID  - Google Custom Search Engine ID
 *   SERPAPI_KEY    - SerpAPI key
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// ========== 搜索引擎配置 ==========

const ENGINES = {
  duckduckgo: {
    name: 'DuckDuckGo',
    description: '免费，隐私友好，无需 API key（国内可能无法访问）',
    requiredEnv: [],
    free: true,
   chinaAccessible: false
  },
  bing: {
    name: 'Bing',
    description: '免费，使用 RSS 接口（国内可能无法访问）',
    requiredEnv: [],
    free: true,
    chinaAccessible: false
  },
  google: {
    name: 'Google Custom Search',
    description: '需要 GOOGLE_API_KEY 和 GOOGLE_CSE_ID',
    requiredEnv: ['GOOGLE_API_KEY', 'GOOGLE_CSE_ID'],
    free: false,
    chinaAccessible: false
  },
  serper: {
    name: 'Serper.dev',
    description: '免费额度 2500 次/月，支持国内访问',
    requiredEnv: ['SERPER_API_KEY'],
    free: true,
    chinaAccessible: true
  }
};

// ========== 搜索函数 ==========

/**
 * 主搜索入口
 */
async function search(query, options = {}) {
  const {
    engine = 'serper',  // 默认使用 serper（中国可访问）
    maxResults = 10,
    timeout = 30000  // 默认30秒超时，适应慢速网络
  } = options;

  const results = {
    engine,
    query,
    results: [],
    errors: [],
    timestamp: new Date().toISOString()
  };

  // 验证引擎
  if (!ENGINES[engine]) {
    results.errors.push(`Unknown engine: ${engine}`);
    return results;
  }

  const engineConfig = ENGINES[engine];

  // 检查必需的环境变量
  for (const env of engineConfig.requiredEnv) {
    if (!process.env[env]) {
      results.errors.push(`Missing required env: ${env}`);
    }
  }

  if (results.errors.length > 0 && !engineConfig.free) {
    return results;
  }

  // 执行搜索（带自动回退）
  const enginesToTry = [engine];

  // 非中国友好引擎失败后，尝试中国可访问的引擎
  const chinaFallback = ['bing', 'duckduckgo', 'google'].includes(engine) ? ['serper'] : [];

  // 添加回退引擎
  if (engine === 'duckduckgo') {
    enginesToTry.push('bing', ...chinaFallback);
  } else if (engine === 'bing') {
    enginesToTry.push('duckduckgo', ...chinaFallback);
  } else {
    // 其他引擎失败后尝试所有可用的
    enginesToTry.push(...Object.keys(ENGINES).filter(e => e !== engine));
  }

  for (const tryEngine of enginesToTry) {
    // 跳过没有配置必要环境变量的引擎
    const tryConfig = ENGINES[tryEngine];
    const missingEnv = tryConfig.requiredEnv.filter(e => !process.env[e]);
    if (missingEnv.length > 0 && !tryConfig.free) {
      continue;
    }

    try {
      switch (tryEngine) {
        case 'duckduckgo':
          results.results = await searchDuckDuckGoHTML(query, maxResults, timeout);
          break;
        case 'bing':
          results.results = await searchBingRSS(query, maxResults, timeout);
          break;
        case 'google':
          results.results = await searchGoogleCSE(query, maxResults, timeout);
          break;
        case 'serper':
          results.results = await searchSerper(query, maxResults, timeout);
          break;
        default:
          results.results = await searchDuckDuckGoHTML(query, maxResults, timeout);
      }
      results.engine = tryEngine;
      results.success = true;
      if (tryEngine !== engine) {
        results.errors.push(`Primary engine (${engine}) failed, used fallback: ${tryEngine}`);
      }
      break;  // 成功，退出重试循环
    } catch (error) {
      results.errors.push(`${tryEngine}: ${error.message}`);
      results.success = false;
      // 继续尝试下一个引擎
    }
  }

  return results;
}

/**
 * DuckDuckGo HTML 搜索（免费，无需 API key）
 */
async function searchDuckDuckGoHTML(query, maxResults = 10, timeout = 30000) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://html.duckduckgo.com/html/?q=${encodedQuery}&kl=wt-wt`;

  const html = await fetchURL(url, timeout);
  return parseDuckDuckGoHTML(html, maxResults);
}

/**
 * 解析 DuckDuckGo HTML 结果
 */
function parseDuckDuckGoHTML(html, maxResults) {
  const results = [];

  // 匹配结果链接和标题
  // <a class="result__a" href="URL">Title</a>
  const linkPattern = /<a class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi;
  const snippetPattern = /<p class="result__snippet"[^>]*>([\s\S]*?)<\/p>/gi;

  const links = [];
  let match;

  while ((match = linkPattern.exec(html)) !== null && links.length < maxResults) {
    const href = match[1];
    const title = decodeHTMLEntities(match[2].trim());
    if (href && !href.startsWith('/') && title) {
      links.push({ url: href, title });
    }
  }

  // 匹配摘要
  const snippets = [];
  while ((match = snippetPattern.exec(html)) !== null) {
    snippets.push(decodeHTMLEntities(match[1].trim()));
  }

  // 合并
  for (let i = 0; i < Math.min(links.length, maxResults); i++) {
    results.push({
      title: links[i].title,
      url: links[i].url,
      snippet: snippets[i] || '',
      engine: 'duckduckgo'
    });
  }

  return results;
}

/**
 * Bing RSS 搜索（免费，无需 API key）
 */
async function searchBingRSS(query, maxResults = 10, timeout = 30000) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://www.bing.com/rss?q=${encodedQuery}`;

  const xml = await fetchURL(url, timeout);
  return parseBingRSS(xml, maxResults);
}

/**
 * 解析 Bing RSS 结果
 */
function parseBingRSS(xml, maxResults) {
  const results = [];

  // 解析 XML item
  const itemPattern = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemPattern.exec(xml)) !== null && results.length < maxResults) {
    const item = match[1];

    const titleMatch = item.match(/<title[^>]*>([^<]*)<\/title>/i);
    const linkMatch = item.match(/<link[^>]*>([^<]*)<\/link>/i);
    const descMatch = item.match(/<description[^>]*>([^<]*)<\/description>/i);

    if (titleMatch && linkMatch) {
      results.push({
        title: decodeHTMLEntities(titleMatch[1].trim()),
        url: linkMatch[1].trim(),
        snippet: descMatch ? decodeHTMLEntities(stripTags(descMatch[1]).trim()) : '',
        engine: 'bing'
      });
    }
  }

  return results;
}

/**
 * Google Custom Search API（需要 API key）
 */
async function searchGoogleCSE(query, maxResults = 10, timeout = 30000) {
  if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_CSE_ID) {
    throw new Error('GOOGLE_API_KEY and GOOGLE_CSE_ID required');
  }

  const params = new URLSearchParams({
    key: process.env.GOOGLE_API_KEY,
    cx: process.env.GOOGLE_CSE_ID,
    q: query,
    num: String(Math.min(maxResults, 10))
  });

  const url = `https://www.googleapis.com/customsearch/v1?${params.toString()}`;
  const data = await fetchURL(url, timeout, true);

  if (!data.items) {
    return [];
  }

  return data.items.map(item => ({
    title: item.title || 'No title',
    url: item.link || '',
    snippet: item.snippet || '',
    engine: 'google'
  }));
}

/**
 * Serper.dev API（支持国内访问，免费额度 2500/月）
 */
async function searchSerper(query, maxResults = 10, timeout = 30000) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    throw new Error('SERPER_API_KEY environment variable required');
  }

  const params = new URLSearchParams({
    q: query,
    num: String(Math.min(maxResults, 10))
  });

  const url = `https://google.serper.dev/search?${params.toString()}`;
  const data = await fetchURL(url, timeout, true, {
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json'
  });

  if (!data.items) {
    return [];
  }

  return data.items.map(item => ({
    title: item.title || 'No title',
    url: item.link || '',
    snippet: item.snippet || '',
    engine: 'serper'
  }));
}

// ========== 工具函数 ==========

/**
 * 获取 URL 内容
 * @param {string} url - URL
 * @param {number} timeout - 超时(ms)
 * @param {boolean} asJSON - 是否解析JSON
 * @param {Object} extraHeaders - 额外的请求头
 */
function fetchURL(url, timeout = 30000, asJSON = false, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const timeoutId = setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout);

    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...extraHeaders
      }
    }, (res) => {
      // 处理重定向
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(timeoutId);
        fetchURL(res.headers.location, timeout, asJSON, extraHeaders).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        clearTimeout(timeoutId);
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        clearTimeout(timeoutId);
        if (asJSON) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('JSON parse error'));
          }
        } else {
          resolve(data);
        }
      });
    });

    req.on('error', err => {
      clearTimeout(timeoutId);
      reject(err);
    });
  });
}

/**
 * 解码 HTML 实体
 */
function decodeHTMLEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/**
 * 去除 HTML 标签
 */
function stripTags(html) {
  return html.replace(/<[^>]*>/g, '');
}

// ========== CLI 入口 =========-

function main() {
  // 解析参数
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
XiaoXiao Search Tool
====================

Usage:
  node search.js "<query>" [options]

Options:
  --engine <name>    Search engine: serper (default for CN), duckduckgo, bing, google
  --max <n>          Max results (default: 10)
  --timeout <ms>     Timeout in ms (default: 30000)
  --list             List available engines

Examples:
  node search.js "market size SaaS 2024"
  node search.js "competitors for project management" --engine serper
  node search.js "industry trends 2024" --max 5

Environment Variables:
  SERPER_API_KEY     Serper.dev API key (recommended for CN) - get at https://serper.dev
  GOOGLE_API_KEY     Google Custom Search API key
  GOOGLE_CSE_ID      Google Custom Search Engine ID
`);
    return;
  }

  if (args[0] === '--list') {
    console.log('Available search engines:\n');
    for (const [key, eng] of Object.entries(ENGINES)) {
      const status = eng.free ? 'FREE' : 'REQUIRES_API_KEY';
      const cnAccess = eng.chinaAccessible ? ' [CN OK]' : '';
      console.log(`  ${key.padEnd(12)} - ${eng.name} (${status})${cnAccess}`);
      console.log(`             ${eng.description}\n`);
    }
    return;
  }

  const query = args[0];
  let engine = 'serper';  // 默认使用 serper（中国可访问）
  let maxResults = 10;

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--engine' && args[i + 1]) {
      engine = args[++i];
    } else if (args[i] === '--max' && args[i + 1]) {
      maxResults = parseInt(args[++i], 10);
    }
  }

  console.log(`Searching: "${query}"`);
  console.log(`Engine: ${engine}, Max: ${maxResults}`);
  console.log('---\n');

  search(query, { engine, maxResults })
    .then(results => {
      if (!results.success && results.errors.length > 0) {
        console.log('Errors:', results.errors.join('; '));

        // 提供明确的 API 配置提示
        if (results.errors.some(e => e.includes('SERPER_API_KEY') || e.includes('serper'))) {
          console.log('\n⚠️  搜索 API 未配置或配置失效');
          console.log('请配置 Serper API Key（支持国内访问，免费 2500 次/月）：');
          console.log('1. 访问 https://serper.dev 注册并获取 API Key');
          console.log('2. 设置环境变量：');
          console.log('   Windows: set SERPER_API_KEY=你的密钥');
          console.log('   Mac/Linux: export SERPER_API_KEY=你的密钥');
        }
      }

      if (results.results.length === 0) {
        console.log('No results found.');
        return;
      }

      console.log(`Found ${results.results.length} results:\n`);

      results.results.forEach((r, i) => {
        console.log(`${i + 1}. ${r.title}`);
        console.log(`   URL: ${r.url}`);
        if (r.snippet) {
          const snippet = r.snippet.length > 200 ? r.snippet.substring(0, 200) + '...' : r.snippet;
          console.log(`   ${snippet}`);
        }
        console.log('');
      });
    })
    .catch(err => {
      console.error('Search failed:', err.message);
      process.exit(1);
    });
}

if (require.main === module) {
  main();
}

module.exports = { search, ENGINES };