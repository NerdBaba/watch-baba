import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getTopRatedMovies = (page = 1) => {
  return tmdbApi.get('/movie/top_rated', {
    params: { page }
  });
};

export const getUpcomingMovies = (page = 1) => {
  return tmdbApi.get('/movie/upcoming', {
    params: { page }
  });
};

export const getNowPlayingMovies = (page = 1) => {
  return tmdbApi.get('/movie/now_playing', {
    params: { page }
  });
};

export const getPopularMovies = (page = 1, genreId = '') => {
  return tmdbApi.get('/movie/popular', {
    params: {
      page,
      with_genres: genreId,
    },
  });
};

export const discoverMovies = (page = 1, genreId = '') => {
  return tmdbApi.get('/discover/movie', {
    params: {
      page,
      with_genres: genreId,
      sort_by: 'popularity.desc'
    }
  });
};

export const getPopularTvShows = (page = 1) => {
  return tmdbApi.get('/tv/popular', {
    params: { page }
  });
};

export const getTvShowGenres = () => {
  return tmdbApi.get('/genre/tv/list');
};

export const discoverTvShows = (page = 1, genreId = '') => {
  return tmdbApi.get('/discover/tv', {
    params: {
      page,
      with_genres: genreId,
      sort_by: 'popularity.desc'
    }
  });
};

export const getMovieDetails = (id) => tmdbApi.get(`/movie/${id}`);
export const getTvShowDetails = (id) => tmdbApi.get(`/tv/${id}`);
export const searchMulti = (query, page = 1) => tmdbApi.get('/search/multi', { params: { query, page } });
export const getMovieRecommendations = (id) => tmdbApi.get(`/movie/${id}/recommendations`);
export const getTvShowRecommendations = (id) => tmdbApi.get(`/tv/${id}/recommendations`);
export const getMovieCredits = (id) => tmdbApi.get(`/movie/${id}/credits`);
export const getMovieGenres = () => tmdbApi.get('/genre/movie/list');
export const getTvShowCredits = (id) => tmdbApi.get(`/tv/${id}/credits`);

export default tmdbApi;