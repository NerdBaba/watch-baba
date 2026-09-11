const IGDB_URL = 'https://api.igdb.com/v4/games';
const MAX_QUERY_LENGTH = 8_000;

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json' },
});

export async function onRequestPost({ request, env }) {
  if (!env?.IGDB_ACCESS_TOKEN || !env?.IGDB_CLIENT_ID) {
    return jsonResponse({ error: 'IGDB is not configured' }, 500);
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return jsonResponse({ error: 'Expected application/json' }, 415);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const query = typeof payload?.query === 'string' ? payload.query.trim() : '';
  if (!query || query.length > MAX_QUERY_LENGTH) {
    return jsonResponse({ error: 'A valid IGDB query is required' }, 400);
  }

  let response;
  try {
    response = await fetch(IGDB_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.IGDB_ACCESS_TOKEN}`,
        'Client-ID': env.IGDB_CLIENT_ID,
        Accept: 'application/json',
        'Content-Type': 'text/plain',
      },
      body: query,
    });
  } catch {
    return jsonResponse({ error: 'IGDB request failed' }, 502);
  }

  if (!response.ok) {
    return jsonResponse({ error: 'IGDB request failed' }, 502);
  }

  try {
    return jsonResponse(await response.json());
  } catch {
    return jsonResponse({ error: 'Invalid IGDB response' }, 502);
  }
}
