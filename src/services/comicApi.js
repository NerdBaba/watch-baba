const BASE_URL = 'https://comic.mda2233.workers.dev';

const fetchComics = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/comics?page=${page}`);
  const data = await response.json();
  return {
    comics: data.comics,
    totalPages: 17827, // Assuming the API returns totalPages, otherwise default to 1
    currentPage: data.currentPage || page
  };
};

const searchComics = async (query) => {
  const response = await fetch(`${BASE_URL}/search?query=${query}`);
  return response.json();
};

const fetchCategoryDetails = async (url) => {
  const response = await fetch(`${BASE_URL}/category?url=${url}`);
  return response.json();
};

const fetchComicChapter = async (url) => {
  const response = await fetch(`${BASE_URL}/comic?url=${url}`);
  return response.json();
};

export { fetchComics, searchComics, fetchCategoryDetails, fetchComicChapter };