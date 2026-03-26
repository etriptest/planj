// Cloudflare Pages Function
// API Key 存在 Cloudflare 環境變數，不會暴露給前端

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const { query } = await request.json();
    if (!query) {
      return new Response(JSON.stringify({ error: "query is required" }), {
        status: 400, headers: corsHeaders,
      });
    }

    const SYS = `你是專業旅遊規劃師。根據使用者需求生成完整旅遊行程。
只回傳純 JSON，不加任何說明文字或 markdown。結構：
{"title":"","destination":"","dates":"","travelers":"","theme":"",
"flight":{"outbound":{"airline":"","flightNo":"","departure":"","arrival":"","from":"","to":"","price":""},"return":{"airline":"","flightNo":"","departure":"","arrival":"","from":"","to":"","price":""}},
"transfer":{"type":"","detail":"","price":""},
"hotel":{"name":"","location":"","roomType":"","nights":0,"pricePerNight":"","mapUrl":""},
"days":[{"day":1,"date":"","title":"","activities":[{"time":"","icon":"emoji","name":"","desc":"30字內","mapUrl":""}]}]}
規則：每天5-6個活動，符合偏好，餐廳在地特色，mapUrl留空字串由使用者貼入，價格用TWD或JPY。`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,   // 從 Cloudflare 環境變數讀取
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
    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 500, headers: corsHeaders,
      });
    }

    const text = data.content.map(x => x.text || "").join("").replace(/```json|```/g, "").trim();
    const trip = JSON.parse(text);

    return new Response(JSON.stringify({ trip }), {
      status: 200, headers: corsHeaders,
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: corsHeaders,
    });
  }
}

// 處理 OPTIONS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
