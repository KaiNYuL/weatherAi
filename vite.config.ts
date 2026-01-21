import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const useProxy = env.VITE_USE_PROXY === "true";

  const weatherTarget = env.VITE_PROXY_WEATHER_TARGET || "https://restapi.amap.com";
  const aiTarget = env.VITE_PROXY_AI_TARGET;

  const proxy: Record<string, any> = {};

  if (useProxy) {
    proxy["/api/weather"] = {
      target: weatherTarget,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api\/weather/, "/v3/weather/weatherInfo")
    };

    if (aiTarget) {
      proxy["/api/ai-suggest"] = {
        target: aiTarget,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api\/ai-suggest/, "")
      };
    }
  }

  return {
    plugins: [vue()],
    server: {
      port: 5173,
      proxy: Object.keys(proxy).length ? proxy : undefined
    }
  };
});
