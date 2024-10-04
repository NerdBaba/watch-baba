import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import AnimeCard from '../components/AnimeCard';
import { searchMulti } from '../services/tmdbApi';
import { searchAnime } from '../services/aniWatchApi';

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
  color: ${props => props.theme.text};
  border: none;
  border-radius: 5px;
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
  margin-top: 30px;
  margin-bottom: 20px;
  color: ${props => props.theme.text};
`;
function SearchResults() {
  const [movieResults, setMovieResults] = useState([]);
  const [animeResults, setAnimeResults] = useState([]);
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [currentAnimePage, setCurrentAnimePage] = useState(1);
  const [totalMoviePages, setTotalMoviePages] = useState(0);
  const [totalAnimePages, setTotalAnimePages] = useState(0);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (searchQuery) {
      setMovieResults([]);
      setAnimeResults([]);
      setCurrentMoviePage(1);
      setCurrentAnimePage(1);
      loadMovieResults(1);
      loadAnimeResults(1);
    }
  }, [searchQuery]);

  const loadMovieResults = (page) => {
    searchMulti(searchQuery, page).then((response) => {
      setMovieResults(prevResults => {
        const newResults = response.data.results.filter(
          newItem => !prevResults.some(existingItem => existingItem.id === newItem.id)
        );
        return [...prevResults, ...newResults];
      });
      setTotalMoviePages(response.data.total_pages);
      setCurrentMoviePage(page);
    }).catch(error => {
      console.error('Error fetching movie search results:', error);
    });
  };

  const loadAnimeResults = (page) => {
    searchAnime(searchQuery, page).then((response) => {
      setAnimeResults(prevResults => {
        const newResults = response.results.filter(
          newItem => !prevResults.some(existingItem => existingItem.id === newItem.id)
        );
        return [...prevResults, ...newResults];
      });
      setTotalAnimePages(Math.ceil(response.totalResults / 20)); // Assuming 20 results per page
      setCurrentAnimePage(page);
    }).catch(error => {
      console.error('Error fetching anime search results:', error);
    });
  };

  const handleLoadMoreMovies = () => {
    loadMovieResults(currentMoviePage + 1);
  };

  const handleLoadMoreAnime = () => {
    loadAnimeResults(currentAnimePage + 1);
  };

  return (
    <div>
      <h2>Search Results for "{searchQuery}"</h2>
      
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
    </div>
  );
}

export default SearchResults;