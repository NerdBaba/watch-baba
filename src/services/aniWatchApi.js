// aniWatchApi.js
const BASE_URL = 'https://api-consumet-ten-delta.vercel.app';

export const fetchAnimeHome = async () => {
  try {
    const response = await fetch(`${BASE_URL}/meta/anilist/trending`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching anime home:', error);
    throw error;
  }
};

// export const fetchAnimeDetails = async (id) => {
//   try {
//     const response = await fetch(`${BASE_URL}/meta/anilist/info/${id}`);
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching anime details:', error);
//     throw error;
//   }
// };

export const fetchAnimeByCategory = async (category = 'POPULARITY_DESC', page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/meta/anilist/advanced-search?sort="${category}"&page=${page}`);
    const data = await response.json();
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
    const response = await fetch(`${BASE_URL}/meta/anilist/${query}?page=${page}`);
    return await response.json();
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
};

export const fetchAnimeDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/meta/anilist/info/${id}`);
  return response.json();
};

export const fetchAnimeEpisodes = async (id) => {
  const response = await fetch(`${BASE_URL}/info/${id}?provider=gogoanime`);
  return response.json();
};

export const fetchEpisodeSources = async (episodeId) => {
  try {
    const response = await fetch(`${BASE_URL}/anime/gogoanime/watch/${episodeId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching episode sources:', error);
    throw error;
  }
};