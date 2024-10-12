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

  @media (min-width: 2560px) {
    padding: 30px;
    max-width: 2400px;
    margin: 0 auto;
  }

  @media (min-width: 3840px) {
    padding: 40px;
    max-width: 3400px;
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

  @media (min-width: 2560px) {
    width: 60px;
    height: 60px;
    border-width: 6px;
  }

  @media (min-width: 3840px) {
    width: 80px;
    height: 80px;
    border-width: 8px;
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 0px;
  padding-bottom: 0px;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 900px) {
   margin-bottom: 10px; 
   padding-bottom: 5px;
  }

  @media (min-width: 2560px) {
    margin-bottom: 30px;
    padding-bottom: 15px;
  }

  @media (min-width: 3840px) {
    margin-bottom: 40px;
    padding-bottom: 20px;
  }
`;

const CardWrapper = styled.div`
  flex: 0 0 auto;
  width: 140px;
  margin-right: 10px;

  @media (min-width: 480px) {
    width: 140px;
    margin-right: 15px;
  }

  @media (min-width: 768px) {
    width: 160px;
  }

  @media (min-width: 1024px) {
    width: 180px;
    margin-right: 20px;
  }

  @media (min-width: 1440px) {
    width: 200px;
  }

  @media (min-width: 2560px) {
    width: 240px;
    margin-right: 25px;
  }

  @media (min-width: 3840px) {
    width: 300px;
    margin-right: 30px;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 15px;
  color: ${(props) => props.theme.text};
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 18px;
    background-color: ${(props) => props.theme.primary};
    margin-right: 8px;
    border-radius: 32px;
  }

  @media (min-width: 480px) {
    font-size: 20px;

    &:before {
      width: 5px;
      height: 20px;
    }
  }

  @media (min-width: 768px) {
    font-size: 22px;
    margin-bottom: 20px;

    &:before {
      height: 22px;
      width: 6px;
    }
  }

  @media (min-width: 1024px) {
    font-size: 24px;

    &:before {
      height: 24px;
      width: 7px;
    }
  }

  @media (min-width: 1440px) {
    font-size: 26px;

    &:before {
      height: 26px;
      width: 8px;
    }
  }

  @media (min-width: 2560px) {
    font-size: 32px;
    margin-bottom: 25px;

    &:before {
      height: 32px;
      width: 10px;
      margin-right: 12px;
    }
  }

  @media (min-width: 3840px) {
    font-size: 40px;
    margin-bottom: 30px;

    &:before {
      height: 40px;
      width: 12px;
      margin-right: 16px;
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
