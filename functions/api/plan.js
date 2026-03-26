export async function onRequestPost(context) {
  const { request, env } = context;
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  try {
    const { query } = await request.json();
    if (!query) return new Response(JSON.stringify({ error: "query is required" }), { status: 400, headers: cors });

    const SYS = `你是專業旅遊規劃師。根據使用者需求生成完整旅遊行程。
只回傳純 JSON，不加任何說明文字或 markdown。結構：
{"title":"","destination":"","dates":"","travelers":"","theme":"",
"flight":{
  "outbound":{"airline":"","flightNo":"","date":"","departure":"","arrival":"","from":"機場名稱 IATA代號","to":"機場名稱 IATA代號","price":""},
  "return":{"airline":"","flightNo":"","date":"","departure":"","arrival":"","from":"機場名稱 IATA代號","to":"機場名稱 IATA代號","price":""}
},
"transfer":{"type":"","detail":"","price":""},
"hotel":{"name":"","location":"","roomType":"","nights":0,"pricePerNight":"","mapUrl":""},
"days":[{"day":1,"date":"","title":"","activities":[{"time":"","icon":"emoji","name":"","desc":"30字內","mapUrl":""}]}]}
規則：
- from/to 格式範例：桃園國際機場 TPE、新千歲機場 CTS、成田機場 NRT
- 每天5-6個活動，最後一個活動不要是回飯店（程式會自動加）
- 符合使用者偏好（主題、預算、租車、飯店星級）
- 餐廳要有在地特色
- mapUrl 用活動名稱加城市產生關鍵字，例如：狸小路商店街+札幌
- 價格用 TWD 或 JPY`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: SYS,
        messages: [{ role: "user", content: query }],
      }),
    });

    const data = await response.json();
    if (data.error) return new Response(JSON.stringify({ error: data.error.message }), { status: 500, headers: cors });

    const text = data.content.map(x => x.text || "").join("").replace(/```json|```/g, "").trim();
    const trip = JSON.parse(text);
    return new Response(JSON.stringify({ trip }), { status: 200, headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }});
}
