import axios from 'axios';

const BASE_URL = 'https://api-consumet-ten-delta.vercel.app/movies/dramacool';

export const getPopularKDramas = async (page = 1) => {
  return axios.get(`${BASE_URL}/popular`, {
    params: { page }
  });
};

export const getKDramaInfo = async (id) => {
  return axios.get(`${BASE_URL}/info`, {
    params: { id }
  });
};

export const getKDramaEpisode = async (episodeId, mediaId) => {
  return axios.get(`${BASE_URL}/watch`, {
    params: {
      episodeId,
      mediaId
    }
  });
};

export const searchKDramas = async (query, page = 1) => {
  return axios.get(`${BASE_URL}/${query}`, {
    params: { page }
  });
};