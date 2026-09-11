import { getWatchedServer } from './localStorage';
import { isInMyList } from './myList';
import { getWishlist } from './WishlistBooks';
import { getComicWishlist } from './wishlistHelpers';

beforeEach(() => {
  localStorage.clear();
});

test('returns no watched server when stored JSON is corrupted', () => {
  localStorage.setItem('watchedMovies', '{bad json');

  expect(getWatchedServer('movie-1')).toBeUndefined();
});

test('returns false when my list JSON is corrupted', () => {
  localStorage.setItem('myList', '{bad json');

  expect(isInMyList('movie-1')).toBe(false);
});

test('returns empty book wishlist when stored JSON is corrupted', () => {
  localStorage.setItem('wishlist', '{bad json');

  expect(getWishlist()).toEqual([]);
});

test('returns empty comic wishlist when stored JSON is corrupted', () => {
  localStorage.setItem('comicWishlist', '{bad json');

  expect(getComicWishlist()).toEqual([]);
});
