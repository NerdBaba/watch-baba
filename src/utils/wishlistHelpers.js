// utils/wishlistHelpers.js

import { readJsonStorage } from './localStorage';
export const saveComicWishlist = (comics) => {
  localStorage.setItem('comicWishlist', JSON.stringify(comics));
};

export const getComicWishlist = () => {
  const wishlist = readJsonStorage('comicWishlist', []);
  return Array.isArray(wishlist) ? wishlist : [];
};

export const isComicWishlisted = (comic, wishlist) => {
  return wishlist.some((wishlistedComic) => wishlistedComic.url === comic.url);
};
