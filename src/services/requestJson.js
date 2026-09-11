export class HttpRequestError extends Error {
  constructor(url, status) {
    super(`Request failed with status ${status}`);
    this.name = 'HttpRequestError';
    this.url = url;
    this.status = status;
  }
}

export const requestJson = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new HttpRequestError(url, response.status);
  }

  return response.json();
};
