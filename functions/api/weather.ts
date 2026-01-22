export const onRequest = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const target = new URL("https://restapi.amap.com/v3/weather/weatherInfo");
  url.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });

  const response = await fetch(target.toString(), {
    method: request.method,
    headers: {
      "Content-Type": "application/json"
    }
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json"
    }
  });
};
