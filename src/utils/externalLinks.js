const HTTP_PROTOCOLS = new Set(['http:', 'https:']);
const INFO_HASH_PATTERN = /^(?:[a-f0-9]{40}|[a-z2-7]{32})$/i;

export const getSafeHttpUrl = (value) => {
  if (typeof value !== 'string' || value.trim() === '') return '';

  try {
    const url = new URL(value);
    return HTTP_PROTOCOLS.has(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};

export const openExternalUrl = (value) => {
  const safeUrl = getSafeHttpUrl(value);
  if (!safeUrl || typeof window === 'undefined' || typeof window.open !== 'function') {
    return false;
  }

  const openedWindow = window.open(safeUrl, '_blank', 'noopener,noreferrer');
  if (openedWindow) openedWindow.opener = null;
  return Boolean(openedWindow);
};

export const openMagnetUrl = (infoHash) => {
  if (typeof infoHash !== 'string' || !INFO_HASH_PATTERN.test(infoHash.trim())) {
    return false;
  }

  if (typeof window === 'undefined' || typeof window.open !== 'function') return false;

  const openedWindow = window.open(
    `magnet:?xt=urn:btih:${infoHash.trim()}`,
    '_blank',
    'noopener,noreferrer',
  );
  if (openedWindow) openedWindow.opener = null;
  return Boolean(openedWindow);
};

export const decodeHtmlEntities = (value) => {
  if (typeof value !== 'string' || value === '') return '';
  const parsedDocument = new DOMParser().parseFromString(value, 'text/html');
  return parsedDocument.body.textContent || '';
};
