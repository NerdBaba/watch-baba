export const fetchAnilistData = async (id) => {
  const query = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
        id
        title {
          english
          native
        }
        bannerImage
        coverImage {
          large
        }
        description
        episodes
        characters {
          edges {
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
        recommendations {
          edges {
            node {
              id
              title {
                english
                native
              }
              coverImage {
                large
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    id: parseInt(id)
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