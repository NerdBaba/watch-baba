// services/animeApi.js
const BASE_URL = 'https://api-consumet-ten-delta.vercel.app';

export async function fetchAnimeDetails(id) {
  const response = await fetch(`${BASE_URL}/meta/anilist/info/${id}`);
  return response.json();
}

export async function fetchAnimeEpisodes(id) {
  const response = await fetch(`${BASE_URL}/anime/gogoanime/watch/${id}`);
  return response.json();
}

export const fetchEpisodeSources = async (episodeId) => {
  try {
    const response = await fetch(`${BASE_URL}/anime/gogoanime/watch/${episodeId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching episode sources:', error);
    throw error;
  }
};