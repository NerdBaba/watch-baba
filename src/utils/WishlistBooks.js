
import { readJsonStorage } from './localStorage';

export const saveWishlist = (books) => {
  localStorage.setItem('wishlist', JSON.stringify(books));
};

export const getWishlist = () => {
  const wishlist = readJsonStorage('wishlist', []);
  return Array.isArray(wishlist) ? wishlist : [];
};

export const isBookWishlisted = (book, wishlist) => {
  return wishlist.some((wishlistedBook) => wishlistedBook.md5 === book.md5);
};
