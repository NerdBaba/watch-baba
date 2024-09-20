import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import { searchMulti } from '../services/tmdbApi';

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

function SearchResults() {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (searchQuery) {
      setResults([]);
      setCurrentPage(1);
      loadResults(1);
    }
  }, [searchQuery]);

  const loadResults = (page) => {
    searchMulti(searchQuery, page).then((response) => {
      setResults(prevResults => {
        const newResults = response.data.results.filter(
          newItem => !prevResults.some(existingItem => existingItem.id === newItem.id)
        );
        return [...prevResults, ...newResults];
      });
      setTotalPages(response.data.total_pages);
      setCurrentPage(page);
    }).catch(error => {
      console.error('Error fetching search results:', error);
    });
  };

  const handleLoadMore = () => {
    loadResults(currentPage + 1);
  };

  return (
    <div>
      <h2>Search Results for "{searchQuery}"</h2>
      <Grid>
        {results.map((item) => {
          if (item.media_type === 'movie' || item.media_type === 'tv') {
            return <MovieCard key={item.id} movie={item} />;
          }
          return null;
        })}
      </Grid>
      {currentPage < totalPages && (
        <LoadMoreButton onClick={handleLoadMore}>
          Load More
        </LoadMoreButton>
      )}
    </div>
  );
}

export default SearchResults;
