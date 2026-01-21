import { defineStore } from "pinia";
import { fetchWeather, type CurrentWeather, type ForecastDay } from "../api/weatherApi";
import { fetchAIAdvice } from "../api/aiApi";

interface WeatherState {
  current: CurrentWeather | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
  updatedAt: string | null;
  aiAdvice: string;
  aiLoading: boolean;
  aiError: string | null;
}

export const useWeatherStore = defineStore("weather", {
  state: (): WeatherState => ({
    current: null,
    forecast: [],
    loading: false,
    error: null,
    updatedAt: null,
    aiAdvice: "",
    aiLoading: false,
    aiError: null
  }),
  actions: {
    async fetchWeather(city: string) {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchWeather(city);
        this.current = data.current;
        this.forecast = data.forecast;
        this.updatedAt = data.updatedAt;
      } catch (error) {
        const message = (error as Error)?.message ?? "获取天气失败，请稍后再试。";
        this.error = message;
      } finally {
        this.loading = false;
      }
    },
    async fetchAdvice(city: string, filters: ("wear" | "travel" | "activity" | "items" | "tips")[]) {
      this.aiLoading = true;
      this.aiError = null;
      try {
        this.aiAdvice = await fetchAIAdvice(city, this.current, this.forecast, filters);
      } catch (error) {
        const message = (error as Error)?.message ?? "AI建议获取失败，请稍后再试。";
        this.aiError = message;
      } finally {
        this.aiLoading = false;
      }
    }
  }
});
