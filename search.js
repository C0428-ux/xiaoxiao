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
    description: '免费，隐私友好，无需 API key',
    requiredEnv: [],
    free: true
  },
  bing: {
    name: 'Bing',
    description: '免费，使用 RSS 接口',
    requiredEnv: [],
    free: true
  },
  google: {
    name: 'Google Custom Search',
    description: '需要 GOOGLE_API_KEY 和 GOOGLE_CSE_ID',
    requiredEnv: ['GOOGLE_API_KEY', 'GOOGLE_CSE_ID'],
    free: false
  }
};

// ========== 搜索函数 ==========

/**
 * 主搜索入口
 */
async function search(query, options = {}) {
  const {
    engine = 'duckduckgo',
    maxResults = 10,
    timeout = 15000
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

  // 执行搜索
  try {
    switch (engine) {
      case 'duckduckgo':
        results.results = await searchDuckDuckGoHTML(query, maxResults, timeout);
        break;
      case 'bing':
        results.results = await searchBingRSS(query, maxResults, timeout);
        break;
      case 'google':
        results.results = await searchGoogleCSE(query, maxResults, timeout);
        break;
      default:
        results.results = await searchDuckDuckGoHTML(query, maxResults, timeout);
    }
    results.success = true;
  } catch (error) {
    results.errors.push(error.message);
    results.success = false;

    // 自动尝试备用引擎
    if (engine !== 'duckduckgo') {
      try {
        results.results = await searchDuckDuckGoHTML(query, maxResults, timeout);
        results.errors.push(`Primary engine failed, used fallback: duckduckgo`);
        results.success = true;
      } catch (e) {
        results.errors.push(`Fallback also failed: ${e.message}`);
      }
    }
  }

  return results;
}

/**
 * DuckDuckGo HTML 搜索（免费，无需 API key）
 */
async function searchDuckDuckGoHTML(query, maxResults = 10, timeout = 15000) {
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
async function searchBingRSS(query, maxResults = 10, timeout = 15000) {
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
async function searchGoogleCSE(query, maxResults = 10, timeout = 15000) {
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

// ========== 工具函数 ==========

/**
 * 获取 URL 内容
 */
function fetchURL(url, timeout = 15000, asJSON = false) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const timeoutId = setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout);

    const req = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      // 处理重定向
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(timeoutId);
        fetchURL(res.headers.location, timeout, asJSON).then(resolve).catch(reject);
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
  --engine <name>    Search engine: duckduckgo (default), bing, google
  --max <n>          Max results (default: 10)
  --timeout <ms>     Timeout in ms (default: 15000)
  --list             List available engines

Examples:
  node search.js "market size SaaS 2024"
  node search.js "competitors for project management" --engine bing
  node search.js "industry trends 2024" --max 5

Environment Variables (optional):
  GOOGLE_API_KEY     For Google Custom Search
  GOOGLE_CSE_ID      For Google Custom Search
`);
    return;
  }

  if (args[0] === '--list') {
    console.log('Available search engines:\n');
    for (const [key, eng] of Object.entries(ENGINES)) {
      const status = eng.free ? 'FREE' : 'REQUIRES_API_KEY';
      console.log(`  ${key.padEnd(12)} - ${eng.name} (${status})`);
      console.log(`             ${eng.description}\n`);
    }
    return;
  }

  const query = args[0];
  let engine = 'duckduckgo';
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