import { readJsonStorage } from './localStorage';

const STORAGE_KEY = 'mangaWishlist';

export const saveMangaWishlist = (manga) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(manga));
};

export const getMangaWishlist = () => {
  const wishlist = readJsonStorage(STORAGE_KEY, []);
  return Array.isArray(wishlist) ? wishlist : [];
};

export const isMangaWishlisted = (manga, wishlist) => (
  wishlist.some((item) => String(item.id) === String(manga.id))
);
