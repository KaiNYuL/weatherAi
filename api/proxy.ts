import type { VercelRequest, VercelResponse } from "@vercel/node";

const sendJson = (res: VercelResponse, status: number, data: unknown) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.status(status).json(data);
};

const fetchWeather = async (city: string, extensions: string) => {
  const apiKey = process.env.AMAP_KEY;
  if (!apiKey) {
    throw new Error("AMAP_KEY 未配置");
  }

  const params = new URLSearchParams({
    city,
    extensions,
    output: "JSON",
    key: apiKey
  });

  const response = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`高德天气接口异常: ${response.status}`);
  }
  return response.json();
};

const fetchAIAdvice = async (body: any) => {
  const aiBase = process.env.AI_API_BASE;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL ?? "gpt-4o-mini";

  if (!aiBase || !apiKey) {
    return {
      advice: "未配置AI服务，已返回本地建议。"
    };
  }

  const response = await fetch(aiBase, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "你是天气穿搭与出行建议助手。" },
        { role: "user", content: body?.prompt ?? "请给出穿搭建议" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const advice = data?.choices?.[0]?.message?.content ?? "AI暂未返回建议。";
  return { advice };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return;
  }

  try {
    const path = req.url ?? "";
    if (path.startsWith("/api/weather")) {
      const city = (req.query.city as string) ?? "北京";
      const extensions = (req.query.extensions as string) ?? "base";
      const data = await fetchWeather(city, extensions);
      sendJson(res, 200, data);
      return;
    }

    if (path.startsWith("/api/ai-suggest")) {
      const data = await fetchAIAdvice(req.body);
      sendJson(res, 200, data);
      return;
    }

    sendJson(res, 404, { message: "Not Found" });
  } catch (error: any) {
    sendJson(res, 500, { message: error?.message ?? "Server Error" });
  }
}
