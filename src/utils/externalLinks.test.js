import {
  decodeHtmlEntities,
  getSafeHttpUrl,
  openExternalUrl,
  openMagnetUrl,
} from './externalLinks';

test('rejects executable and malformed external URL schemes', () => {
  expect(getSafeHttpUrl('javascript:alert(1)')).toBe('');
  expect(getSafeHttpUrl('data:text/html,<script>alert(1)</script>')).toBe('');
  expect(getSafeHttpUrl('not a URL')).toBe('');
});

test('decodes entities without writing attacker input to innerHTML', () => {
  expect(decodeHtmlEntities('&amp; &quot;')).toBe('& "');
});

test('opens only safe HTTP URLs with opener isolation', () => {
  window.open = jest.fn(() => ({ opener: {} }));

  expect(openExternalUrl('https://example.com/path')).toBe(true);
  expect(window.open).toHaveBeenCalledWith(
    'https://example.com/path',
    '_blank',
    'noopener,noreferrer',
  );
});

test('opens only validated magnet info hashes', () => {
  window.open = jest.fn();

  expect(openMagnetUrl('not-a-hash')).toBe(false);
  expect(window.open).not.toHaveBeenCalled();
});
