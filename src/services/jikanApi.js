import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

export const fetchAnime = async (page = 1, status = '', order_by = '', type = '') => {
  try {
    const response = await axios.get(`${BASE_URL}/anime`, {
      params: {
        page,
        status,
        order_by,
        type,
        limit: 24,
        sfw: true, // Exclude Rx rated content
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching anime:', error);
    throw error;
  }
};

export const fetchAnimeDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime/${id}/full`);
    return response.data;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
};

export const fetchAnimeRecommendations = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime/${id}/recommendations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching anime recommendations:', error);
    throw error;
  }
};

export const fetchAnimeCharacters = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime/${id}/characters`);
    return response.data;
  } catch (error) {
    console.error('Error fetching anime characters:', error);
    throw error;
  }
};

export const fetchAnimeEpisodes = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime/${id}/episodes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching anime episodes:', error);
    throw error;
  }
};