// utils/myList.js

import { readJsonStorage } from './localStorage';

export const saveToMyList = (movie) => {
  const storedList = readJsonStorage('myList', []);
  const myList = Array.isArray(storedList) ? storedList : [];
  myList.push(movie);
  localStorage.setItem('myList', JSON.stringify(myList));
};

export const removeFromMyList = (movieId) => {
  const storedList = readJsonStorage('myList', []);
  const myList = Array.isArray(storedList) ? storedList : [];
  const updatedList = myList.filter(movie => movie.id !== movieId);
  localStorage.setItem('myList', JSON.stringify(updatedList));
};

export const isInMyList = (movieId) => {
  const storedList = readJsonStorage('myList', []);
  const myList = Array.isArray(storedList) ? storedList : [];
  return myList.some(movie => movie.id === movieId);
};
