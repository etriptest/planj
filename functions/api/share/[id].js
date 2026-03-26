const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export async function onRequestGet(context) {
  const { params, env } = context;
  const id = params.id;
  if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400, headers: cors });
  try {
    const value = await env.PLANJ_KV.get(id);
    if (!value) return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers: cors });
    return new Response(JSON.stringify({ trip: JSON.parse(value) }), { status: 200, headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors });
}
