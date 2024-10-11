import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import AnimeCard from '../components/AnimeCard';
import { getPopularMovies, getPopularTvShowsInIndia, getMovieGenres, getTvShowGenres, discoverMovies, discoverTvShows } from '../services/tmdbApi';
import { fetchAnimeHome } from '../services/aniWatchApi';
import KDramaCard from '../components/KDramaCard';
import { getPopularKDramas } from '../services/kDramaApi';

const HomeContainer = styled.div`
  padding: 20px;
  display: grid;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    padding: 10px;
    width: 100%;
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.spinnerBorder};
  border-top: 4px solid ${props => props.theme.primary};
  border-radius: 50%;
  animation: spin 2s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 0px;
  padding-bottom: 10px;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  
  /* Hide scrollbar for cleaner mobile appearance */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  
  &::-webkit-scrollbar {
    display: none; /* WebKit */
  }
`;

const CardWrapper = styled.div`
  flex: 0 0 auto;
  width: 150px;
  margin-right: 15px;

  @media (min-width: 768px) {
    width: 200px;
    margin-right: 20px;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
  color: ${(props) => props.theme.text};
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 22px;
    background-color: ${(props) => props.theme.primary};
    margin-right: 10px;
    border-radius: 32px;
  }

  @media (min-width: 768px) {
    font-size: 26px;
    margin-bottom: 20px;

    &:before {
      height: 28px;
      width: 7px;
    }
  }
`;

const networks = [
  { id: 8, name: 'Netflix' },
  { id: 119, name: 'Amazon Prime Video' },
  { id: 350, name: 'Apple TV Plus' },
  { id: 283, name: 'Crunchyroll' },
  { id: 122, name: 'Hotstar' },
  { id: 220, name: 'Jio Cinema' },
  { id: 232, name: 'Zee5' },
  { id: 11, name: 'MUBI' }
];

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTvShows, setPopularTvShows] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);
  const [networkContent, setNetworkContent] = useState({});
  const [popularKDramas, setPopularKDramas] = useState([]);
  const [loadingPrimary, setLoadingPrimary] = useState(true);
  const [loadingNetworks, setLoadingNetworks] = useState(true);

  useEffect(() => {
    const fetchPrimaryData = async () => {
      try {
        const [moviesRes, tvShowsRes, animeRes, movieGenresRes, tvGenresRes] = await Promise.all([
          getPopularMovies(),
          getPopularTvShowsInIndia(),
          fetchAnimeHome(),
          getMovieGenres(),
          getTvShowGenres()
        ]);

        setPopularMovies(moviesRes.data.results);
        setPopularTvShows(tvShowsRes.data.results);
        setPopularAnime(animeRes.results || []);
        setMovieGenres(movieGenresRes.data.genres);
        setTvGenres(tvGenresRes.data.genres);

        const kdramaRes = await getPopularKDramas();
        if (kdramaRes.data && Array.isArray(kdramaRes.data.results)) {
          setPopularKDramas(kdramaRes.data.results);
        }

        setLoadingPrimary(false); // Primary data has finished loading
      } catch (error) {
        console.error('Error fetching primary data:', error);
      }
    };

    fetchPrimaryData();
  }, []);

  useEffect(() => {
    if (!loadingPrimary) {
      const fetchNetworkData = async () => {
        try {
          const networkContentPromises = networks.map(async (network) => {
            const [moviesRes, tvShowsRes] = await Promise.all([
              discoverMovies(1, '', network.id),
              discoverTvShows(1, '', network.id)
            ]);

            const movies = moviesRes.data.results.map(movie => ({ ...movie, media_type: 'movie' }));
            const tvShows = tvShowsRes.data.results.map(tvShow => ({ ...tvShow, media_type: 'tv' }));

            return {
              [network.name]: [...movies, ...tvShows]
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, 20)
            };
          });

          const networkContentResults = await Promise.all(networkContentPromises);
          setNetworkContent(Object.assign({}, ...networkContentResults));
          setLoadingNetworks(false); // Network data has finished loading
        } catch (error) {
          console.error('Error fetching network data:', error);
        }
      };

      fetchNetworkData();
    }
  }, [loadingPrimary]);

  const renderScrollableSection = (title, content, CardComponent) => (
    <>
      <SectionTitle>{title}</SectionTitle>
      <ScrollContainer>
        {content.map((item) => (
          <CardWrapper key={item.id}>
            <CardComponent
              drama={CardComponent === KDramaCard ? item : null}
              movie={CardComponent === MovieCard ? {
                ...item,
                title: item.title || item.name,
                release_date: item.release_date || item.first_air_date,
                media_type: item.media_type
              } : null}
              anime={CardComponent === AnimeCard ? item : null}
              genres={CardComponent === MovieCard ? (item.media_type === 'tv' ? tvGenres : movieGenres) : null}
            />
          </CardWrapper>
        ))}
      </ScrollContainer>
    </>
  );

return (
  <HomeContainer>
    {(loadingPrimary) && <LoadingSpinner />}
    
    {!loadingPrimary && (
      <>
        {renderScrollableSection('Popular Movies', popularMovies, MovieCard)}
        {renderScrollableSection('Popular TV Shows', popularTvShows, MovieCard)}
        {renderScrollableSection('Popular Anime', popularAnime, AnimeCard)}
        {popularKDramas && popularKDramas.length > 0 &&
          renderScrollableSection('Popular K-Dramas', popularKDramas, KDramaCard)}
      </>
    )}

    {!loadingNetworks && networks.map((network) => (
      <React.Fragment key={network.id}>
        {networkContent[network.name] && networkContent[network.name].length > 0 &&
          renderScrollableSection(network.name, networkContent[network.name], MovieCard)}
      </React.Fragment>
    ))}
  </HomeContainer>
);
}
export default Home;
