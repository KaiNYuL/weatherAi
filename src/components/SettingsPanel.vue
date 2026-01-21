<template>
  <section class="card">
    <div class="flex">
      <h2>AI 模型设置</h2>
      <span class="badge">可选</span>
    </div>

    <div class="form">
      <label class="label">高德地图 API Key</label>
      <input v-model="form.amapKey" class="input" placeholder="你的高德 Web 服务 Key" />

      <label class="label">AI API 地址</label>
      <input v-model="form.baseUrl" class="input" placeholder="https://api.example.com/v1/chat/completions" />

      <label class="label">AI API Key</label>
      <input v-model="form.apiKey" class="input" placeholder="sk-..." />

      <label class="label">模型（可选）</label>
      <input v-model="form.model" class="input" placeholder="qwen-plus" />

      <div class="actions">
        <button class="btn" @click="save">保存设置</button>
        <button class="btn ghost" @click="clear">清除</button>
      </div>

      <small class="muted">高德 Key 优先于环境变量。AI 未配置时将使用系统自带建议，兼容 OpenAI 风格 /v1/chat/completions。</small>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { loadAiConfig, saveAiConfig, type AiConfig } from "../api/aiApi.ts";
import { loadAmapConfig, saveAmapConfig } from "../api/weatherApi";

const emit = defineEmits<{ saved: [] }>();

const initial = loadAiConfig();
const amapInitial = loadAmapConfig();
const form = reactive<AiConfig & { amapKey: string }>({
  baseUrl: initial?.baseUrl ?? "",
  apiKey: initial?.apiKey ?? "",
  model: initial?.model ?? "",
  amapKey: amapInitial?.amapKey ?? ""
});

const save = () => {
  if (form.baseUrl && form.apiKey) {
    saveAiConfig({ baseUrl: form.baseUrl, apiKey: form.apiKey, model: form.model });
  } else if (!form.baseUrl && !form.apiKey && !form.model) {
    saveAiConfig({ baseUrl: "", apiKey: "", model: "" });
  }

  saveAmapConfig({ amapKey: form.amapKey.trim() });
  emit("saved");
};

const clear = () => {
  saveAiConfig({ baseUrl: "", apiKey: "", model: "" });
  saveAmapConfig({ amapKey: "" });
  form.baseUrl = "";
  form.apiKey = "";
  form.model = "";
  form.amapKey = "";
  emit("saved");
};
</script>

<style scoped>
.form {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.label {
  font-size: 12px;
  color: #64748b;
}

.input {
  border: 1px solid #e2e8f0;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
}

.input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.btn {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
}

.btn.ghost {
  background: #e2e8f0;
  color: #0f172a;
}

.muted {
  color: #94a3b8;
}
</style>
