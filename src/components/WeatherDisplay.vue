<template>
  <section class="card weather-card">
    <div class="flex">
      <h2>天气概览</h2>
      <span class="badge">{{ city }}</span>
    </div>

    <p v-if="loading" class="loading">正在获取天气数据...</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <template v-else>
      <div class="current">
        <div>
          <h3>{{ current?.description ?? "-" }}</h3>
          <p class="temp">{{ current?.temperature ?? "-" }}°C</p>
        </div>
        <div class="meta">
          <p>风力：{{ current?.windPower ?? current?.windSpeed ?? "-" }}</p>
          <p v-if="current?.windDirection">风向：{{ current.windDirection }}</p>
          <p v-if="current?.feelsLike !== undefined">体感：{{ current?.feelsLike }}°C</p>
          <p v-if="current?.humidity !== undefined">湿度：{{ current?.humidity }}%</p>
        </div>
      </div>

      <div class="list">
        <div v-for="item in forecast" :key="item.date" class="forecast">
          <div>
            <strong>{{ item.date }}</strong>
            <p class="muted">{{ item.description }}</p>
          </div>
          <div class="temps">
            <span>{{ item.tempMax }}°C</span>
            <small class="muted">/{{ item.tempMin }}°C</small>
          </div>
        </div>
      </div>

      <small class="muted" v-if="updatedAt">更新于 {{ updatedAt }}</small>
    </template>
  </section>
</template>

<script setup lang="ts">
import type { CurrentWeather, ForecastDay } from "../api/weatherApi.ts";

defineProps<{ 
  city: string;
  current: CurrentWeather | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
  updatedAt: string | null;
}>();
</script>

<style scoped>
.weather-card {
  min-height: 320px;
}

.current {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 16px 0;
  gap: 16px;
}

.temp {
  font-size: 36px;
  font-weight: 700;
}

.meta {
  text-align: right;
  color: #475569;
}

.forecast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px 12px;
}

.temps {
  font-weight: 600;
}

.muted {
  color: #94a3b8;
}
</style>
