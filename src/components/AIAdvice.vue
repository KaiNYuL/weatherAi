<template>
  <section class="card advice-card">
    <div class="flex">
      <h2>AI 穿搭 / 出行建议</h2>
      <span class="badge">AI Suggest</span>
    </div>

    <p v-if="loading" class="loading">AI 正在整理建议...</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <div v-else class="content">
      <p v-for="(line, index) in adviceLines" :key="index">{{ line }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ advice: string; loading: boolean; error: string | null }>();

const adviceLines = computed(() => {
  if (!props.advice) {
    return ["暂未获取建议，请稍后重试。"];
  }
  return props.advice.split("\n").filter(Boolean);
});
</script>

<style scoped>
.advice-card {
  min-height: 320px;
}

.content {
  display: grid;
  gap: 10px;
  margin-top: 12px;
  color: #0f172a;
}
</style>
