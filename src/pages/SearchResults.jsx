import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import AnimeCard from '../components/AnimeCard';
import KDramaCard from '../components/KDramaCard';
import { searchMulti } from '../services/tmdbApi';
import { searchAnime } from '../services/aniWatchApi';
import { searchKDramas } from '../services/kDramaApi';

const isAbortError = (error) => error?.name === 'AbortError' || error?.code === 'ERR_CANCELED';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  border: none;
  border-radius: 5px;
  font-family: 'GeistVF'
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.theme.secondary};
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 15px;
  }
`;

const CategoryTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 7px;
    height: 23px;
    background-color: ${props => props.theme.primary};
    margin-right: 10px;
    border-radius: 32px;

  }
  
  @media (min-width: 768px) {
    font-size: 26px;
    margin-bottom: 20px;
    
    &:before {
      height: 28px;
    }
  }
`;
function SearchResults() {
  const [movieResults, setMovieResults] = useState([]);
  const [animeResults, setAnimeResults] = useState([]);
    const [kDramaResults, setKDramaResults] = useState([]);
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [currentAnimePage, setCurrentAnimePage] = useState(1);
    const [currentKDramaPage, setCurrentKDramaPage] = useState(1);
  const [totalMoviePages, setTotalMoviePages] = useState(0);
  const [totalAnimePages, setTotalAnimePages] = useState(0);
  const [totalKDramaPages, setTotalKDramaPages] = useState(0);
  const [error, setError] = useState('');
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  const loadMovieResults = useCallback((page, signal) => {
    return searchMulti(searchQuery, page, { signal }).then((response) => {
      setMovieResults(prevResults => {
        const newResults = response.data.results.filter(
          newItem => !prevResults.some(existingItem => existingItem.id === newItem.id)
        );
        return [...prevResults, ...newResults];
      });
      setTotalMoviePages(response.data.total_pages);
      setCurrentMoviePage(page);
    }).catch(error => {
      if (!isAbortError(error)) {
        console.error('Error fetching movie search results:', error);
        setError('Some movie results could not be loaded.');
      }
    });
  }, [searchQuery]);

  const loadAnimeResults = useCallback((page, signal) => {
    return searchAnime(searchQuery, page, { signal }).then((response) => {
      setAnimeResults(prevResults => {
        const newResults = response.results.filter(
          newItem => !prevResults.some(existingItem => existingItem.id === newItem.id)
        );
        return [...prevResults, ...newResults];
      });
      setTotalAnimePages(Math.ceil(response.totalResults / 20));
      setCurrentAnimePage(page);
    }).catch(error => {
      if (!isAbortError(error)) {
        console.error('Error fetching anime search results:', error);
        setError('Some anime results could not be loaded.');
      }
    });
  }, [searchQuery]);

  const loadKDramaResults = useCallback((page, signal) => {
    return searchKDramas(searchQuery, page, { signal }).then((response) => {
      setKDramaResults(prevResults => {
        const newResults = response.data.results.filter(
          newItem => !prevResults.some(existingItem => existingItem.id === newItem.id)
        );
        return [...prevResults, ...newResults];
      });
      setTotalKDramaPages(response.data.totalPages);
      setCurrentKDramaPage(page);
    }).catch(error => {
      if (!isAbortError(error)) {
        console.error('Error fetching KDrama search results:', error);
        setError('Some K-Drama results could not be loaded.');
      }
    });
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      const controller = new AbortController();
      setError('');
      setMovieResults([]);
      setAnimeResults([]);
      setKDramaResults([]);
      setCurrentMoviePage(1);
      setCurrentAnimePage(1);
      setCurrentKDramaPage(1);
      loadMovieResults(1, controller.signal);
      loadAnimeResults(1, controller.signal);
      loadKDramaResults(1, controller.signal);
      return () => controller.abort();
    }
    return undefined;
  }, [loadAnimeResults, loadKDramaResults, loadMovieResults, searchQuery]);

  const handleLoadMoreMovies = () => {
    loadMovieResults(currentMoviePage + 1);
  };

  const handleLoadMoreAnime = () => {
    loadAnimeResults(currentAnimePage + 1);
  };
 const handleLoadMoreKDramas = () => {
    loadKDramaResults(currentKDramaPage + 1);
  };

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <CategoryTitle>Movies and TV Shows</CategoryTitle>
      <Grid>
        {movieResults.map((item) => {
          if (item.media_type === 'movie' || item.media_type === 'tv') {
            return <MovieCard key={item.id} movie={item} />;
          }
          return null;
        })}
      </Grid>
      {currentMoviePage < totalMoviePages && (
        <LoadMoreButton onClick={handleLoadMoreMovies}>
          Load More Movies/TV Shows
        </LoadMoreButton>
      )}

      <CategoryTitle>Anime</CategoryTitle>
      <Grid>
        {animeResults.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </Grid>
      {currentAnimePage < totalAnimePages && (
        <LoadMoreButton onClick={handleLoadMoreAnime}>
          Load More Anime
        </LoadMoreButton>
      )}

      <CategoryTitle>KDramas</CategoryTitle>
      <Grid>
        {kDramaResults.map((kdrama) => (
          <KDramaCard key={kdrama.id} drama={kdrama} />
        ))}
      </Grid>
      {currentKDramaPage < totalKDramaPages && (
        <LoadMoreButton onClick={handleLoadMoreKDramas}>
          Load More KDramas
        </LoadMoreButton>
      )}
    </div>
  );
}

export default SearchResults;
