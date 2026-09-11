import { requestJson } from './requestJson';

// aniWatchApi.js
const BASE_URL = 'https://api-consumet-ten-delta.vercel.app';

export const fetchAnimeHome = async ({ signal } = {}) => {
  try {
    return await requestJson(`${BASE_URL}/meta/anilist/trending`, { signal });
  } catch (error) {
    console.error('Error fetching anime home:', error);
    throw error;
  }
};



export const fetchAnimeByCategory = async (category = 'POPULARITY_DESC', page = 1, { signal } = {}) => {
  try {
    const params = new URLSearchParams({ sort: category, page: String(page) });
    const data = await requestJson(`${BASE_URL}/meta/anilist/advanced-search?${params}`, { signal });
    return {
      animes: data.results,
      currentPage: page,
      totalPages: Math.ceil(data.totalResults / 20)
    };
  } catch (error) {
    console.error('Error fetching anime by category:', error);
    throw error;
  }
};

export const searchAnime = async (query, page = 1, { signal } = {}) => {
  try {
    return await requestJson(`${BASE_URL}/meta/anilist/${encodeURIComponent(query)}?page=${page}`, { signal });
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
};
export const fetchAnimeDetails = async (malId, { signal } = {}) => {
  try {
    return await requestJson(`${BASE_URL}/meta/anilist/info/${encodeURIComponent(malId)}`, { signal });
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
};

export const fetchAnimeEpisodes = async (id, { signal } = {}) => {
  return requestJson(`${BASE_URL}/info/${encodeURIComponent(id)}?provider=gogoanime`, { signal });
};

export const fetchEpisodeSources = async (episodeId, { signal } = {}) => {
  try {
    return await requestJson(`${BASE_URL}/meta/anilist/watch/${encodeURIComponent(episodeId)}`, { signal });
  } catch (error) {
    console.error('Error fetching episode sources:', error);
    throw error;
  }
};
