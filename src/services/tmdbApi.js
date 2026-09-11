import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://proxy-api-server-woz1.onrender.com/v1/tmdb/3';

const defaultParams = API_KEY ? { api_key: API_KEY } : {};

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: defaultParams,
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

export const discoverMoviesHome = (page = 1, genreId = '', watchProviderId = '',options = {}) => {
  return tmdbApi.get('/discover/movie', {
    params: {
      page,
      ...options,
      with_genres: genreId,
      watch_region: 'IN',
      region: 'IN',
      with_watch_providers: watchProviderId,
      sort_by: 'popularity.desc'
    }
  });
};

export const discoverTvShowsHome = (page = 1, genreId = '', watchProviderId = '',options = {}) => {
  return tmdbApi.get('/discover/tv', {
    params: {
      page,
      ...options,
      with_genres: genreId,
      watch_region: 'IN',
      region: 'IN',
      with_watch_providers: watchProviderId,
      sort_by: 'popularity.desc'
    }
  });
};
export const discoverMovies = (page = 1, options = {}) => {
  return tmdbApi.get('/discover/movie', {
    params: {
      page,
      watch_region: 'IN',
      region: 'IN',
      include_adult: false, // Exclude adult content
      ...options,
    }
  });
};

// Modify the discoverTvShows function
export const discoverTvShows = (page = 1, options = {}) => {
  return tmdbApi.get('/discover/tv', {
    params: {
      page,
      watch_region: 'IN',
      region: 'IN',
      include_adult: false, // Exclude adult content
      ...options,
    }
  });
};
export const getPopularTvShows = (page = 1) => {
  return tmdbApi.get('/tv/popular', {
    params: { page }
  });
};

export const getPopularTvShowsInIndia = (page = 1) => {
  return tmdbApi.get('/trending/tv/week', {
    params: {
      page,
      region: 'IN'
    }
  });
};

export const discoverTrendingTvShowsInIndia = (page = 1, genreId = '') => {
  return tmdbApi.get('/discover/tv', {
    params: {
      page,
      with_genres: genreId,
      sort_by: 'popularity.desc',
      region: 'IN',
    }
  });
};

export const getTvShowGenres = () => {
  return tmdbApi.get('/genre/tv/list');
};

export const getMovieVideos = (movieId) => {
  return tmdbApi.get(`/movie/${movieId}/videos`);
};

export const getTvShowVideos = (tvShowId) => {
  return tmdbApi.get(`/tv/${tvShowId}/videos`);
};

export const getTvShowExternalIds = (id) => tmdbApi.get(`/tv/${id}/external_ids`);
export const getMovieExternalIds = (id) => tmdbApi.get(`/movie/${id}/external_ids`);


export const getMovieDetails = (id) => tmdbApi.get(`/movie/${id}`);

export const getTvShowDetails = (id) => tmdbApi.get(`/tv/${id}`);

export const searchMulti = (query, page = 1) => tmdbApi.get('/search/multi', { params: { query, page } });

export const getMovieRecommendations = (id) => tmdbApi.get(`/movie/${id}/recommendations`);

export const getTvShowRecommendations = (id) => tmdbApi.get(`/tv/${id}/recommendations`);

export const getMovieCredits = (id) => tmdbApi.get(`/movie/${id}/credits`);

export const getMovieGenres = () => tmdbApi.get('/genre/movie/list');

export const getTvShowCredits = (id) => tmdbApi.get(`/tv/${id}/credits`);

// New function for fetching TV season details
export const getTvShowSeasonEpisodes = (tvShowId, seasonNumber) => {
  return tmdbApi.get(`/tv/${tvShowId}/season/${seasonNumber}`);
};

export const getTvShowEpisodeDetails = (tvShowId, seasonNumber, episodeNumber) => {
  return tmdbApi.get(`/tv/${tvShowId}/season/${seasonNumber}/episode/${episodeNumber}`);
};


export const searchTMDBShow = async (title) => {
  try {
    const response = await tmdbApi.get('/search/tv', {
      params: {
        query: title,
        language: 'en-US'
      }
    });
    return response.data.results[0]; // Return the first result
  } catch (error) {
    console.error('Error searching TMDB show:', error);
    return null;
  }
};

export default tmdbApi;
