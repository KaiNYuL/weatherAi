export interface CurrentWeather {
  temperature: number;
  windSpeed: number;
  windDirection?: string;
  windPower?: string;
  description: string;
  humidity?: number;
  feelsLike?: number;
}

export interface ForecastDay {
  date: string;
  tempMax: number;
  tempMin: number;
  description: string;
}

export interface WeatherResult {
  city: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
  updatedAt: string;
}

export interface AmapConfig {
  amapKey: string;
}

const AMAP_STORAGE_KEY = "weather-amap-config";

export const loadAmapConfig = (): AmapConfig | null => {
  try {
    const raw = localStorage.getItem(AMAP_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as AmapConfig;
    if (!parsed.amapKey) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const saveAmapConfig = (config: AmapConfig) => {
  localStorage.setItem(AMAP_STORAGE_KEY, JSON.stringify(config));
};

const parseLive = (raw: any, city: string): { current: CurrentWeather; updatedAt: string } => {
  if (raw?.status !== "1") {
    throw new Error(raw?.info ?? "高德实时天气接口返回异常");
  }

  const live = raw?.lives?.[0];
  if (!live) {
    throw new Error("未获取到实时天气数据");
  }

  const windPowerRaw = String(live.windpower ?? "");
  const parsedWind = Number.parseFloat(windPowerRaw);

  return {
    current: {
      temperature: Number(live.temperature ?? 0),
      windSpeed: Number.isNaN(parsedWind) ? 0 : parsedWind,
      windDirection: live.winddirection,
      windPower: live.windpower,
      description: live.weather ?? "-",
      humidity: live.humidity ? Number(live.humidity) : undefined
    },
    updatedAt: live.reporttime ?? new Date().toLocaleString()
  };
};

const parseForecast = (raw: any): ForecastDay[] => {
  if (raw?.status !== "1") {
    throw new Error(raw?.info ?? "高德预报天气接口返回异常");
  }
  const casts = raw?.forecasts?.[0]?.casts ?? [];
  return casts.slice(0, 3).map((cast: any) => ({
    date: cast.date ?? "-",
    tempMax: Number(cast.daytemp ?? 0),
    tempMin: Number(cast.nighttemp ?? 0),
    description: cast.dayweather ?? "-"
  }));
};

const buildAmapUrl = (city: string, extensions: "base" | "all", key?: string) => {
  const params = new URLSearchParams({
    city,
    extensions,
    output: "JSON"
  });
  if (key) {
    params.set("key", key);
  }
  return `https://restapi.amap.com/v3/weather/weatherInfo?${params.toString()}`;
};

export const fetchWeather = async (cityName: string): Promise<WeatherResult> => {
  const useProxy = import.meta.env.VITE_USE_PROXY === "true";
  const storedAmapKey = loadAmapConfig()?.amapKey;
  const amapKey = storedAmapKey || (import.meta.env.VITE_AMAP_KEY as string | undefined);

  if (!useProxy && !amapKey) {
    throw new Error("未配置高德地图 Key，请设置 VITE_AMAP_KEY");
  }

  const city = cityName.trim() || "北京";

  const buildProxyUrl = (extensions: "base" | "all") => {
    const params = new URLSearchParams({
      city,
      extensions
    });
    if (amapKey) {
      params.set("key", amapKey);
    }
    return `/api/weather?${params.toString()}`;
  };

  const liveUrl = useProxy ? buildProxyUrl("base") : buildAmapUrl(city, "base", amapKey);
  const forecastUrl = useProxy ? buildProxyUrl("all") : buildAmapUrl(city, "all", amapKey);

  const [liveRes, forecastRes] = await Promise.all([fetch(liveUrl), fetch(forecastUrl)]);
  if (!liveRes.ok) {
    throw new Error(`高德实时天气接口异常: ${liveRes.status}`);
  }
  if (!forecastRes.ok) {
    throw new Error(`高德预报天气接口异常: ${forecastRes.status}`);
  }

  const liveData = await liveRes.json();
  const forecastData = await forecastRes.json();

  const { current, updatedAt } = parseLive(liveData, city);
  const forecast = parseForecast(forecastData);

  return {
    city,
    current,
    forecast,
    updatedAt
  };
};
