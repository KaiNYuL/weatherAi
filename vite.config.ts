import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      "/api/weather": {
        target: "https://restapi.amap.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, "/v3/weather/weatherInfo")
      }
    }
  }
});
