import { beforeEach, expect, test } from 'vitest';
import {
  getMangaWishlist,
  isMangaWishlisted,
  saveMangaWishlist,
} from './mangaWishlist';

beforeEach(() => {
  localStorage.clear();
});

test('round-trips manga wishlist entries through local storage', () => {
  const manga = { id: 'manga-1', name: 'Example Manga' };

  saveMangaWishlist([manga]);

  expect(getMangaWishlist()).toEqual([manga]);
  expect(isMangaWishlisted(manga, getMangaWishlist())).toBe(true);
});

test('returns an empty manga wishlist for malformed storage', () => {
  localStorage.setItem('mangaWishlist', '{bad json');

  expect(getMangaWishlist()).toEqual([]);
});
