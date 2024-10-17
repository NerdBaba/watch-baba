// utils/urlHelpers.js
export const getSlugFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    // Remove leading/trailing slashes and 'category/' if present
    return path.replace(/^\/|\/$/g, '').replace('category/', '');
  } catch (e) {
    return url;
  }
};

export const getFullUrl = (slug, type) => {
  const baseUrl = 'https://readallcomics.com/';
  if (type === 'category') {
    return `${baseUrl}category/${slug}/`;
  }
  return `${baseUrl}${slug}/`;
};