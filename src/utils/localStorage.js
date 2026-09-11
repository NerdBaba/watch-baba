// utils/localStorage.js

export const readJsonStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;

    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

export const saveWatchedServer = (movieId, server) => {
  const storedMovies = readJsonStorage('watchedMovies', {});
  const watchedMovies = storedMovies && typeof storedMovies === 'object' && !Array.isArray(storedMovies)
    ? storedMovies
    : {};
  watchedMovies[movieId] = server;
  localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
};

export const getWatchedServer = (movieId) => {
  const storedMovies = readJsonStorage('watchedMovies', {});
  const watchedMovies = storedMovies && typeof storedMovies === 'object' && !Array.isArray(storedMovies)
    ? storedMovies
    : {};
  return watchedMovies[movieId];
};
