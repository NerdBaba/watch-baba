// src/services/anilistApi.js

export const fetchAnilistData = async (title) => {
  const query = `
    query ($search: String) {
      Media (search: $search, type: ANIME) {
        bannerImage
      }
    }
  `;

  const variables = {
    search: title
  };

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  });

  const data = await response.json();
  return data.data.Media;
};