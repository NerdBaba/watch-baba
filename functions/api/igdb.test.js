import { beforeEach, expect, test, vi } from 'vitest';
import { onRequestPost } from './igdb';

const createContext = ({ body, env = {} } = {}) => ({
  request: new Request('https://watch-baba.example/api/igdb', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }),
  env,
});

beforeEach(() => {
  vi.restoreAllMocks();
});

test('rejects requests when server credentials are missing', async () => {
  const response = await onRequestPost(createContext({ body: { query: 'game' } }));

  expect(response.status).toBe(500);
  await expect(response.json()).resolves.toEqual({ error: 'IGDB is not configured' });
});

test('forwards a validated query with server credentials and returns IGDB JSON', async () => {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify([{ id: 42, name: 'Example' }]), { status: 200 }),
  );
  vi.stubGlobal('fetch', fetchMock);

  const response = await onRequestPost(createContext({
    body: { query: 'search "game"; limit 1;' },
    env: { IGDB_ACCESS_TOKEN: 'server-token', IGDB_CLIENT_ID: 'client-id' },
  }));

  expect(response.status).toBe(200);
  await expect(response.json()).resolves.toEqual([{ id: 42, name: 'Example' }]);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://api.igdb.com/v4/games',
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        Authorization: 'Bearer server-token',
        'Client-ID': 'client-id',
      }),
      body: 'search "game"; limit 1;',
    }),
  );
});

test('rejects malformed query payloads before contacting IGDB', async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);

  const response = await onRequestPost(createContext({
    body: { query: '' },
    env: { IGDB_ACCESS_TOKEN: 'server-token', IGDB_CLIENT_ID: 'client-id' },
  }));

  expect(response.status).toBe(400);
  expect(fetchMock).not.toHaveBeenCalled();
});
