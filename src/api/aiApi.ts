import type { CurrentWeather, ForecastDay } from "./weatherApi";
import type { AdviceFilterKey } from "../components/AdviceFilter.vue";

export interface AiConfig {
  baseUrl: string;
  apiKey: string;
  model?: string;
}

const STORAGE_KEY = "weather-ai-config";

export const loadAiConfig = (): AiConfig | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as AiConfig;
    if (!parsed.baseUrl || !parsed.apiKey) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const saveAiConfig = (config: AiConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

const cityProfiles: Record<string, { culture: string[]; nature: string[]; vibe: string }> = {
  "北京": {
    culture: ["中轴线历史建筑", "博物馆/展览", "胡同与老街区"],
    nature: ["城市公园", "山地近郊", "湖畔步道"],
    vibe: "历史厚重与现代都市融合"
  },
  "上海": {
    culture: ["海派建筑", "美术馆/展览", "滨江漫步"],
    nature: ["滨水公园", "城市绿道", "郊野湿地"],
    vibe: "摩登都市与江景风光"
  },
  "广州": {
    culture: ["岭南建筑", "美食街区", "老城街巷"],
    nature: ["江畔绿道", "市区公园", "近郊山林"],
    vibe: "岭南人文与南方气候"
  },
  "深圳": {
    culture: ["现代地标", "创意园区", "沿海城市风格"],
    nature: ["海滨步道", "城市公园", "近郊山地"],
    vibe: "滨海科技城市"
  },
  "杭州": {
    culture: ["江南水乡", "历史街区", "文化展馆"],
    nature: ["湖畔景观", "山林徒步", "古镇水景"],
    vibe: "江南雅致与湖山风光"
  },
  "成都": {
    culture: ["川蜀文化", "老街茶馆", "博物馆"],
    nature: ["城市公园", "近郊山地", "河畔步道"],
    vibe: "慢生活与人文气息"
  },
  "西安": {
    culture: ["古都遗址", "城墙古街", "历史博物馆"],
    nature: ["城郊山地", "湖景公园", "古城绿道"],
    vibe: "厚重历史与古城风貌"
  },
  "重庆": {
    culture: ["山城街巷", "夜景地标", "巴渝文化"],
    nature: ["江景步道", "山地观景", "城市公园"],
    vibe: "立体山城与夜景体验"
  },
  "厦门": {
    culture: ["海岛人文", "文艺街区", "历史建筑"],
    nature: ["海滨步道", "沙滩海风", "岛屿风光"],
    vibe: "海岛慢行与文艺气质"
  }
};

const resolveProfile = (city: string) => {
  return cityProfiles[city] ?? {
    culture: ["城市地标", "历史街区", "文化展馆"],
    nature: ["城市公园", "河湖步道", "近郊风景"],
    vibe: "本地人文与自然景观"
  };
};

const filterLabels: Record<AdviceFilterKey, string> = {
  wear: "穿搭",
  travel: "出行",
  activity: "活动",
  items: "物品",
  tips: "小提示"
};

const buildPrompt = (
  city: string,
  current: CurrentWeather | null,
  forecast: ForecastDay[],
  filters: AdviceFilterKey[]
) => {
  const today = forecast[0];
  const tomorrow = forecast[1];
  const profile = resolveProfile(city);
  const filterText = filters.length ? filters.map((key) => filterLabels[key]).join("、") : "全部";
  return [
    `城市：${city}`,
    `当前天气：${current?.description ?? "未知"}，温度${current?.temperature ?? "-"}°C，风速${current?.windSpeed ?? "-"}，湿度${current?.humidity ?? "-"}%`,
    today ? `今日预报：${today.description}，最高${today.tempMax}°C，最低${today.tempMin}°C` : "",
    tomorrow ? `明日预报：${tomorrow.description}，最高${tomorrow.tempMax}°C，最低${tomorrow.tempMin}°C` : "",
    `城市人文关键词：${profile.culture.join("、")}`,
    `自然风光关键词：${profile.nature.join("、")}`,
    `城市气质：${profile.vibe}`,
    `仅回答以下部分：${filterText}。`,
    "要求：若包含【活动/出行】，根据未来3天天气给出三日行程。",
    "每一天包含：上午/下午/夜间安排 + 景点/场所 + 交通方式(地铁/步行/打车)。",
    "优先匹配天气：雨/雪以室内为主，晴/多云适当户外。",
    "条列清晰，避免空泛。"
  ].filter(Boolean).join("\n");
};

const localAdvice = (
  city: string,
  current: CurrentWeather | null,
  forecast: ForecastDay[],
  filters: AdviceFilterKey[]
): string => {
  const temp = current?.temperature ?? forecast[0]?.tempMax ?? 20;
  const desc = current?.description ?? "天气变化";
  const tips: string[] = [];

  if (filters.includes("wear")) {
    if (temp <= 10) {
      tips.push("穿搭：厚外套/羽绒服+保暖内搭。");
    } else if (temp <= 18) {
      tips.push("穿搭：薄外套或针织衫+长裤。");
    } else if (temp <= 26) {
      tips.push("穿搭：短袖+轻薄外套，运动鞋。");
    } else {
      tips.push("穿搭：清凉短袖/薄衬衫，防晒。");
    }
  }

  if (filters.includes("travel")) {
    if (desc.includes("雨")) {
      tips.push("出行：室内优先，备伞/雨衣。");
    } else if (desc.includes("雪")) {
      tips.push("出行：白天出行，穿防滑鞋。");
    } else if (desc.includes("雾")) {
      tips.push("出行：能见度低，减少自驾。");
    } else {
      tips.push("出行：适合户外，慢行路线。");
    }
  }

  const profile = resolveProfile(city);
  if (filters.includes("activity")) {
    tips.push(`活动：${profile.culture[0]} + ${profile.nature[0]}。`);
  }
  if (filters.includes("items")) {
    tips.push("物品：水杯、充电宝、纸巾、雨具/防晒。");
  }
  if (filters.includes("tips")) {
    tips.push("提示：关注交通与体感温差。");
  }
  tips.push(`祝你在${city}出行顺利！`);
  return tips.join("\n");
};

const fallbackWithNotice = (
  city: string,
  current: CurrentWeather | null,
  forecast: ForecastDay[],
  filters: AdviceFilterKey[]
) => {
  return `未接入AI模型，以下为系统自带建议：\n${localAdvice(city, current, forecast, filters)}`;
};

const normalizeAiUrl = (baseUrl: string) => {
  const trimmed = baseUrl.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.endsWith("/chat/completions")) {
    return trimmed;
  }
  if (trimmed.endsWith("/v1")) {
    return `${trimmed}/chat/completions`;
  }
  return `${trimmed.replace(/\/+$/, "")}/chat/completions`;
};

export const fetchAIAdvice = async (
  city: string,
  current: CurrentWeather | null,
  forecast: ForecastDay[],
  filters: AdviceFilterKey[]
): Promise<string> => {
  const useProxy = import.meta.env.VITE_USE_PROXY === "true";
  const aiBase = import.meta.env.VITE_AI_API_BASE as string | undefined;
  const config = loadAiConfig();
  const prompt = buildPrompt(city, current, forecast, filters);

  if (!config?.baseUrl && !useProxy && !aiBase) {
    return fallbackWithNotice(city, current, forecast, filters);
  }

  try {
    const isCustomAi = Boolean(config?.baseUrl);
    const url = isCustomAi
      ? normalizeAiUrl(config?.baseUrl ?? "")
      : (useProxy ? "/api/ai-suggest" : aiBase ?? "/api/ai-suggest");

    const body = isCustomAi
      ? {
          model: config?.model ?? import.meta.env.VITE_AI_MODEL ?? "qwen-plus",
          messages: [
            { role: "system", content: "你是天气穿搭与出行建议助手。" },
            { role: "user", content: prompt }
          ]
        }
      : {
          city,
          current,
          forecast,
          prompt,
          model: config?.model ?? import.meta.env.VITE_AI_MODEL
        };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config?.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {})
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    if (isCustomAi) {
      const content = data?.choices?.[0]?.message?.content;
      return content ?? fallbackWithNotice(city, current, forecast, filters);
    }
    return data?.advice ?? localAdvice(city, current, forecast, filters);
  } catch (error) {
    return config?.baseUrl
      ? `AI调用失败，已返回系统自带建议：\n${localAdvice(city, current, forecast, filters)}`
      : fallbackWithNotice(city, current, forecast, filters);
  }
};
