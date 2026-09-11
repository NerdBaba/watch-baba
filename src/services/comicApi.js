const BASE_URL = 'https://comic.mda2233.workers.dev';

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Comic API request failed with status ${response.status}`);
  }
  return response.json();
};

const fetchComics = async (page = 1) => {
  const data = await fetchJson(`${BASE_URL}/comics?page=${encodeURIComponent(page)}`);
  return {
    comics: data.comics,
    totalPages: 17827, // Assuming the API returns totalPages, otherwise default to 1
    currentPage: data.currentPage || page
  };
};

const searchComics = async (query) => {
  return fetchJson(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
};

const fetchCategoryDetails = async (url) => {
  return fetchJson(`${BASE_URL}/category?url=${encodeURIComponent(url)}`);
};

const fetchComicChapter = async (url) => {
  return fetchJson(`${BASE_URL}/comic?url=${encodeURIComponent(url)}`);
};

export { fetchComics, searchComics, fetchCategoryDetails, fetchComicChapter };
