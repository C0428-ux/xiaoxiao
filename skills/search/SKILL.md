{
  "name": "search",
  "description": "内置搜索工具，提供多引擎搜索能力",
  "usage": "node search.js \"<query>\" [--engine bing|duckduckgo]",
  "engines": {
    "duckduckgo": { "free": true, "description": "HTML接口，隐私友好" },
    "bing": { "free": true, "description": "RSS接口" },
    "google": { "free": false, "description": "需要 GOOGLE_API_KEY + GOOGLE_CSE_ID" }
  },
  "note": "供 strategy-review 和 product-consult 调用，不直接触发"
}