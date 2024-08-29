import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies } from '../services/tmdbApi';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;



const CategorySelect = styled.select`
  padding: 10px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
`;

function Discovery() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState('top_rated');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let response;
        switch (category) {
          case 'top_rated':
            response = await getTopRatedMovies(currentPage);
            break;
          case 'upcoming':
            response = await getUpcomingMovies(currentPage);
            break;
          case 'now_playing':
            response = await getNowPlayingMovies(currentPage);
            break;
          default:
            response = await getTopRatedMovies(currentPage);
        }
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [category, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      <h2>Discover Movies</h2>
      <FilterContainer>
        <CategorySelect value={category} onChange={handleCategoryChange}>
          <option value="top_rated">Top Rated</option>
          <option value="upcoming">Upcoming</option>
          <option value="now_playing">Now Playing</option>
        </CategorySelect>
      </FilterContainer>
      <Grid>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </Grid>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Discovery;