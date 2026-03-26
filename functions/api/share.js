// POST /api/share
// Stores trip JSON in KV, returns a 6-char short ID
// KV binding name: PLANJ_KV  (set in Cloudflare dashboard)

const CHARS = 'abcdefghijkmnpqrstuvwxyz23456789'; // no confusing chars
const ID_LEN = 6;
const TTL = 60 * 60 * 24 * 90; // 90 days

function genId() {
  let id = '';
  const arr = new Uint8Array(ID_LEN);
  crypto.getRandomValues(arr);
  for (const n of arr) id += CHARS[n % CHARS.length];
  return id;
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
