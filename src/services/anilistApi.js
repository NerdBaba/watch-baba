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

export async function fetchEpisodeSources(episodeId) {
  const response = await fetch(`${BASE_URL}/anime/gogoanime/watch/${episodeId}`);
  return response.json();
}