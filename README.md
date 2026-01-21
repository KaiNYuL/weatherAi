# WeatherAI

全国城市实时 / 未来 3 天天气 + AI 穿搭/出行建议。

## 功能概览
- 实时天气 + 未来 3 天预报（高德天气）
- AI 穿搭/出行建议（支持自定义 OpenAI 兼容接口）
- 城市筛选、主题随天气变化

## 本地开发
1. 克隆项目
	```
	git clone https://github.com/KaiNYuL/weatherAi.git
	cd weatherAi
	```
2. 安装依赖
	```
	npm install
	```
3. 配置环境变量（可选）
	- 复制一份配置文件并填写：
	```
	# Windows PowerShell
	Copy-Item .env .env.local
	```
	- 在 `.env.local` 中填入高德 Key（或在页面内设置）
4. 启动开发服务
	```
	npm run dev
	```
5. 访问
	- http://localhost:5173/

## 项目实现说明
- 前端：Vue 3 + TypeScript + Vite
- 状态管理：Pinia
- 天气接口：高德天气（支持 VITE_AMAP_KEY 或页面内配置）
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

## 页面内设置（AI / 高德 Key）
页面右上角点击“AI 设置”，填写并保存：
- 高德地图 API Key：你的高德 Web 服务 Key
- Base URL：OpenAI 兼容地址（例如以 `/v1` 结尾的地址）
- API Key：你的密钥
- Model：模型名（如不填会使用环境变量或默认值）

保存后会存储在 `localStorage`，优先级高于环境变量（高德 Key 同理）。

## 部署说明
### 方式一：本地打包后部署静态站点
1. 生产构建
	```
	npm run build
	```
2. 产物目录
	- `dist/`
3. 将 `dist/` 上传到任意静态托管（OSS/COS/对象存储/CDN）

### 方式二：Vercel（海外）
1. 将仓库导入 Vercel
2. Build Command：`npm run build`
3. Output Directory：`dist`
4. 设置环境变量：
	- `VITE_USE_PROXY=true`
	- `VITE_AMAP_KEY=你的高德Key`
	- 可选：`VITE_AI_API_BASE`、`VITE_AI_MODEL`

### 方式三：国内静态托管（推荐国内访问）
1. 使用方式一打包 `dist/`
2. 上传到国内对象存储（阿里云 OSS / 腾讯云 COS）
3. 开启静态网站托管并绑定自定义域名

## 常见问题
- 未配置高德 Key 且关闭代理时会无法获取天气。
- 未配置 AI 接口时会返回系统内置建议。
