<template>
  <div class="page" :class="themeClass">
    <header class="hero">
      <div>
        <p class="eyebrow">Weather & AI Suggest</p>
        <h1>全国城市实时 / 未来3天天气 + AI穿搭/出行建议</h1>
        <p class="sub">轻量、快速、的出行建议。</p>
      </div>
      <div class="hero-actions">
        <CitySelector v-model="inputCity" @search="onSearch" />
        <button class="ghost-btn primary" @click="isSettingsOpen = true">AI 设置</button>
      </div>
    </header>

    <AdviceFilter v-model="selectedFilters" />

    <main class="grid">
      <WeatherDisplay
        :city="activeCity"
        :current="store.current"
        :forecast="store.forecast"
        :loading="store.loading"
        :error="store.error"
        :updated-at="store.updatedAt"
      />
      <AIAdvice
        :loading="store.aiLoading"
        :advice="store.aiAdvice"
        :error="store.aiError"
      />
    </main>

    <div class="drawer" :class="{ open: isSettingsOpen }">
      <div class="drawer-overlay" @click="isSettingsOpen = false"></div>
      <div class="drawer-panel">
        <div class="drawer-header">
          <strong>AI 接口设置</strong>
          <button class="ghost-btn" @click="isSettingsOpen = false">关闭</button>
        </div>
        <SettingsPanel @saved="refreshAdvice" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import CitySelector from "./components/CitySelector.vue";
import WeatherDisplay from "./components/WeatherDisplay.vue";
import AIAdvice from "./components/AIAdvice.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import AdviceFilter, { type AdviceFilterKey } from "./components/AdviceFilter.vue";
import { useWeatherStore } from "./stores/weather";

const store = useWeatherStore();
const inputCity = ref("北京");
const activeCity = ref("北京");
const isSettingsOpen = ref(false);
const selectedFilters = ref<AdviceFilterKey[]>(["wear", "travel", "activity", "items", "tips"]);

const themeClass = computed(() => {
  const desc = store.current?.description ?? "";
  if (desc.includes("晴")) {
    return "theme-sunny";
  }
  if (desc.includes("雪")) {
    return "theme-snowy";
  }
  if (desc.includes("雨")) {
    return "theme-rainy";
  }
  if (desc.includes("云")) {
    return "theme-cloudy";
  }
  if (desc.includes("阴") || desc.includes("雾")) {
    return "theme-overcast";
  }
  return "theme-default";
});

const refreshAll = async () => {
  await store.fetchWeather(activeCity.value);
  await store.fetchAdvice(activeCity.value, selectedFilters.value);
};

const refreshAdvice = async () => {
  await store.fetchAdvice(activeCity.value, selectedFilters.value);
};

const onSearch = async () => {
  activeCity.value = inputCity.value.trim() || "北京";
  await refreshAll();
};

onMounted(async () => {
  await refreshAll();
});
</script>
