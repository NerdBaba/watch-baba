import { requestJson } from './requestJson';

export const fetchIgdbGames = (query, signal) => requestJson('/api/igdb', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ query }),
  ...(signal ? { signal } : {}),
});
