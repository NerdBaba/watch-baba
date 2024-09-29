import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies } from '../services/tmdbApi';

const Grid = styled.div`
 display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
`;

const CategorySelect = styled.select`
  appearance: none;
  width: 100%;
  padding: 12px 20px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border: 2px solid ${props => props.theme.primary};
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s;

  &:hover {
    background-color: ${props => props.theme.background}ee;
  }

  &:focus {
    box-shadow: 0 0 0 2px ${props => props.theme.primary}80;
  }
`;

const SelectArrow = styled.div`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid ${props => props.theme.primary};
  pointer-events: none;
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
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

return (
    <div>
      <h2>Discover Movies</h2>
      <SelectWrapper>
        <CategorySelect value={category} onChange={handleCategoryChange}>
          <option value="top_rated">Top Rated</option>
          <option value="upcoming">Upcoming</option>
          <option value="now_playing">Now Playing</option>
        </CategorySelect>
        <SelectArrow />
      </SelectWrapper>
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

export default Discovery
