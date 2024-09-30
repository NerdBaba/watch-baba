// aniWatchApi.js

const BASE_URL = 'https://aniwatch-api-git-main-nerdbabas-projects.vercel.app';

export const fetchAnimeHome = async () => {
  try {
    const response = await fetch(`${BASE_URL}/anime/home`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching anime home:', error);
    throw error;
  }
};
export const fetchAnimeDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/anime/info?id=${id}`);
    const data = await response.json();
    console.log('Anime details response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
};

export const fetchAnimeByCategory = async (category = 'most-favorite', page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/anime/${category}?page=${page}`);
    const data = await response.json();
    
    // Limit the animes array to 24 items
    data.animes = data.animes.slice(0, 24);
    
    // Recalculate total pages based on 24 items per page
    const totalItems = data.totalPages * data.animes.length; // Assuming the original data.animes.length is the items per page in the API
    data.totalPages = Math.ceil(totalItems / 24);
    
    return data;
  } catch (error) {
    console.error('Error fetching anime by category:', error);
    throw error;
  }
};

export const searchAnime = async (query, page = 1, filters = {}) => {
  try {
    const { status, sort, type } = filters;
    let url = `${BASE_URL}/anime/search?q=${encodeURIComponent(query)}&page=${page}`;
    
    if (status) url += `&status=${status}`;
    if (sort) url += `&sort=${sort}`;
    if (type) url += `&type=${type}`;

    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
};
export const fetchAnimeEpisodes = async (animeId) => {
  try {
    const response = await fetch(`${BASE_URL}/anime/episodes/${animeId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching anime episodes:', error);
    throw error;
  }
};

export const fetchEpisodeServers = async (episodeId) => {
  try {
    const response = await fetch(`${BASE_URL}/anime/servers?episodeId=${episodeId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching episode servers:', error);
    throw error;
  }
};

export const fetchEpisodeSources = async (episodeId, server = 'hd-1', category = 'sub') => {
  try {
    const response = await fetch(`${BASE_URL}/anime/episode-srcs?id=${episodeId}&server=${server}&category=${category}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching episode sources:', error);
    throw error;
  }
};