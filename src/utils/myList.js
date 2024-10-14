// utils/myList.js

export const saveToMyList = (movie) => {
  const myList = JSON.parse(localStorage.getItem('myList')) || [];
  myList.push(movie);
  localStorage.setItem('myList', JSON.stringify(myList));
};

export const removeFromMyList = (movieId) => {
  const myList = JSON.parse(localStorage.getItem('myList')) || [];
  const updatedList = myList.filter(movie => movie.id !== movieId);
  localStorage.setItem('myList', JSON.stringify(updatedList));
};

export const isInMyList = (movieId) => {
  const myList = JSON.parse(localStorage.getItem('myList')) || [];
  return myList.some(movie => movie.id === movieId);
};