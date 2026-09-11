import { expect, test, vi } from 'vitest';
import { fetchIgdbGames } from './igdbApi';

test('sends public IGDB queries to the same-origin server boundary', async () => {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify([{ id: 1 }]), { status: 200 }),
  );
  vi.stubGlobal('fetch', fetchMock);

  await expect(fetchIgdbGames('search "game"; limit 1;')).resolves.toEqual([{ id: 1 }]);
  expect(fetchMock).toHaveBeenCalledWith('/api/igdb', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: 'search "game"; limit 1;' }),
  });
});
