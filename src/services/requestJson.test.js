import { expect, test, vi } from 'vitest';
import { HttpRequestError, requestJson } from './requestJson';

test('returns JSON for a successful response', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ ok: true }), { status: 200 }),
  ));

  await expect(requestJson('/api/example')).resolves.toEqual({ ok: true });
});

test('throws an HTTP error without parsing an error response as success', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ message: 'nope' }), { status: 502 }),
  ));

  await expect(requestJson('/api/example')).rejects.toEqual(
    expect.objectContaining({
      name: 'HttpRequestError',
      status: 502,
    }),
  );
  expect(HttpRequestError).toBeTypeOf('function');
});

test('forwards an AbortSignal and preserves abort errors', async () => {
  const controller = new AbortController();
  const abortError = new DOMException('The operation was aborted.', 'AbortError');
  const fetchMock = vi.fn().mockRejectedValue(abortError);
  vi.stubGlobal('fetch', fetchMock);

  await expect(requestJson('/api/example', { signal: controller.signal })).rejects.toBe(abortError);
  expect(fetchMock).toHaveBeenCalledWith('/api/example', { signal: controller.signal });
});
