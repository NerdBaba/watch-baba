import { requestJson } from './requestJson';

const BASE_URL = 'https://comic.mda2233.workers.dev';

const fetchComics = async (page = 1, { signal } = {}) => {
  const data = await requestJson(`${BASE_URL}/comics?page=${encodeURIComponent(page)}`, { signal });
  return {
    comics: Array.isArray(data.comics) ? data.comics : [],
    totalPages: Number.isFinite(data.totalPages)
      ? data.totalPages
      : data.hasNextPage ? page + 1 : page,
    currentPage: data.currentPage || page,
    hasNextPage: Boolean(data.hasNextPage),
  };
};

const searchComics = async (query, { signal } = {}) => {
  return requestJson(`${BASE_URL}/search?query=${encodeURIComponent(query)}`, { signal });
};

const fetchCategoryDetails = async (url, { signal } = {}) => {
  return requestJson(`${BASE_URL}/category?url=${encodeURIComponent(url)}`, { signal });
};

const fetchComicChapter = async (url, { signal } = {}) => {
  return requestJson(`${BASE_URL}/comic?url=${encodeURIComponent(url)}`, { signal });
};

export { fetchComics, searchComics, fetchCategoryDetails, fetchComicChapter };
