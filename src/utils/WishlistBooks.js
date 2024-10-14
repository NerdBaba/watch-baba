

export const saveWishlist = (books) => {
  localStorage.setItem('wishlist', JSON.stringify(books));
};

export const getWishlist = () => {
  const wishlist = localStorage.getItem('wishlist');
  return wishlist ? JSON.parse(wishlist) : [];
};

export const isBookWishlisted = (book, wishlist) => {
  return wishlist.some((wishlistedBook) => wishlistedBook.md5 === book.md5);
};