import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { searchMulti } from '../services/tmdbApi'; // Importing searchMulti

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

function SearchResults() {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (searchQuery) {
      searchMulti(searchQuery, currentPage).then((response) => {
        setResults(response.data.results);
        setTotalPages(response.data.total_pages);
      }).catch(error => {
        console.error('Error fetching search results:', error);
      });
    }
  }, [searchQuery, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default SearchResults;
