// utils/localStorage.js

export const saveWatchedServer = (movieId, server) => {
  const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || {};
  watchedMovies[movieId] = server;
  localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
};

export const getWatchedServer = (movieId) => {
  const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || {};
  return watchedMovies[movieId];
};