# Weather & AI Suggest

基于 Vue3 + Vite 的轻量天气应用，支持全国城市实时/未来 3 天天气查询（高德地图天气 API），并结合 AI 给出穿搭、出行与三日游玩建议。适配 Vercel 一键部署。

## 功能概览
- 全国城市天气查询（实时 + 未来 3 天，高德地图天气 API）
- AI 穿搭 / 出行 / 活动 / 物品 / 小提示建议
- 建议筛选模块（只输出勾选信息）
- 天气主题色随天气变化（晴/多云/雨/雪/阴）
- Vercel Serverless 代理（跨域友好）
- 前端 AI 设置面板（自定义 AI API / Key）

## 技术栈
- Vue 3 + Vite + TypeScript
- Pinia 状态管理
- Vercel Serverless Functions

## 项目结构
- api/proxy.ts：Vercel 代理（高德天气 / AI）
- src/api：前端 API 封装（天气、AI）
- src/components：核心组件（搜索、天气、建议、筛选、设置）
- src/stores：Pinia 状态管理

## 本地开发
1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`

### 高德地图天气 API 配置
高德天气接口为：
- `GET https://restapi.amap.com/v3/weather/weatherInfo`
- 关键参数：`city`（城市 adcode 推荐）、`extensions=base|all`、`output=JSON`、`key`

本地开发建议开启代理避免 CORS：
- .env 中设置：`VITE_USE_PROXY=true`
- .env 中设置：`VITE_AMAP_KEY=你的高德Key`

搜索栏支持输入城市名或城市 adcode（推荐 adcode，例如 110101）。

### AI API 配置（前端设置面板）
在页面右上角的“AI 设置”中填写：
- Base URL（例如：`https://dashscope.aliyuncs.com/compatible-mode/v1`）
- API Key
- 模型名称（例如：`qwen-plus`）

要求：AI API 需兼容 OpenAI 风格 `/v1/chat/completions`。如果只填写到 `/v1`，系统会自动补全。

未接入 AI 模型时，会显示系统自带建议。

## 生产部署（Vercel）
1. 导入 GitHub 仓库
2. 构建命令：`npm run build`
3. 输出目录：`dist`
4. 设置环境变量：
   - AMAP_KEY（必填，用于高德天气 API）
   - AI_API_BASE（可选）
   - AI_API_KEY（可选）
   - AI_MODEL（可选）

## 常见问题
- 无法调用高德接口：确认 `VITE_AMAP_KEY` 已配置且开发服务重启。
- CORS 问题：确保 `VITE_USE_PROXY=true`，并通过 `/api/weather` 代理请求。
- AI 调用失败：确认 Base URL 指向兼容 `/v1/chat/completions` 的服务。
