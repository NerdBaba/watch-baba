// aniWatchApi.js
const BASE_URL = 'https://api-consumet-ten-delta.vercel.app';

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Anime API request failed with status ${response.status}`);
  }
  return response.json();
};

export const fetchAnimeHome = async () => {
  try {
    return await fetchJson(`${BASE_URL}/meta/anilist/trending`);
  } catch (error) {
    console.error('Error fetching anime home:', error);
    throw error;
  }
};



export const fetchAnimeByCategory = async (category = 'POPULARITY_DESC', page = 1) => {
  try {
    const params = new URLSearchParams({ sort: category, page: String(page) });
    const data = await fetchJson(`${BASE_URL}/meta/anilist/advanced-search?${params}`);
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

export const searchAnime = async (query, page = 1) => {
  try {
    return await fetchJson(`${BASE_URL}/meta/anilist/${encodeURIComponent(query)}?page=${page}`);
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
};
export const fetchAnimeDetails = async (malId) => {
  try {
    return await fetchJson(`${BASE_URL}/meta/anilist/info/${encodeURIComponent(malId)}`);
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
};

export const fetchAnimeEpisodes = async (id) => {
  return fetchJson(`${BASE_URL}/info/${encodeURIComponent(id)}?provider=gogoanime`);
};

export const fetchEpisodeSources = async (episodeId) => {
  try {
    return await fetchJson(`${BASE_URL}/meta/anilist/watch/${encodeURIComponent(episodeId)}`);
  } catch (error) {
    console.error('Error fetching episode sources:', error);
    throw error;
  }
};
