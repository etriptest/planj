const CHARS = 'abcdefghijkmnpqrstuvwxyz23456789';
const TTL = 60 * 60 * 24 * 90; // 90 days

function genId() {
  const arr = new Uint8Array(6);
  crypto.getRandomValues(arr);
  return Array.from(arr, n => CHARS[n % CHARS.length]).join('');
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { trip } = await request.json();
    if (!trip) return new Response(JSON.stringify({ error: "trip is required" }), { status: 400, headers: cors });

    const id = genId();
    await env.PLANJ_KV.put(id, JSON.stringify(trip), { expirationTtl: TTL });
    return new Response(JSON.stringify({ id }), { status: 200, headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors });
}
