# WeatherAI

全国城市实时 / 未来 3 天天气 + AI 穿搭/出行建议。

## 功能概览
- 实时天气 + 未来 3 天预报（高德天气）
- AI 穿搭/出行建议（支持自定义 OpenAI 兼容接口）
- 城市筛选、主题随天气变化

## 本地开发
1. 安装依赖
	- `npm install`
2. 启动开发服务
	- `npm run dev`
3. 访问
	- http://localhost:5173/

## 项目实现说明
- 前端：Vue 3 + TypeScript + Vite
- 状态管理：Pinia
- 天气接口：高德天气（通过 VITE_AMAP_KEY）
- AI 建议：
  - 默认走本地配置的 OpenAI 兼容接口
  - 未配置时返回内置建议

## 环境变量
在本地 `.env` 中配置：

```
VITE_USE_PROXY=true
VITE_AMAP_KEY=你的高德Key
# 可选：自定义 AI API 基础地址（OpenAI 兼容）
# VITE_AI_API_BASE=https://your-ai-api.example.com/v1
# 可选：模型
# VITE_AI_MODEL=gpt-4o-mini
```

可选代理目标：
```
# 高德天气代理目标（默认 https://restapi.amap.com）
# VITE_PROXY_WEATHER_TARGET=https://restapi.amap.com
# AI 代理目标（为空则不启用 /api/ai-suggest 代理）
# VITE_PROXY_AI_TARGET=https://your-ai-api.example.com
```

## AI 接口设置（页面内）
页面右上角点击“AI 设置”，填写并保存：
- Base URL：OpenAI 兼容地址（例如以 `/v1` 结尾的地址）
- API Key：你的密钥
- Model：模型名（如不填会使用环境变量或默认值）

保存后会存储在 `localStorage`，优先级高于环境变量。

## 部署说明
1. 生产构建
	- `npm run build`
2. 产物目录
	- `dist/`
3. 部署方式
	- 直接将 `dist/` 作为静态站点部署
	- 若需要规避 CORS，请在生产环境配置反向代理，将：
	  - `/api/weather` 代理到 `https://restapi.amap.com/v3/weather/weatherInfo`
	  - `/api/ai-suggest` 代理到你的 AI 服务

## 常见问题
- 未配置 `VITE_AMAP_KEY` 且关闭代理时会无法获取天气。
- 未配置 AI 接口时会返回系统内置建议。
