// utils/wishlistHelpers.js
export const saveComicWishlist = (comics) => {
  localStorage.setItem('comicWishlist', JSON.stringify(comics));
};

export const getComicWishlist = () => {
  const wishlist = localStorage.getItem('comicWishlist');
  return wishlist ? JSON.parse(wishlist) : [];
};

export const isComicWishlisted = (comic, wishlist) => {
  return wishlist.some((wishlistedComic) => wishlistedComic.url === comic.url);
};