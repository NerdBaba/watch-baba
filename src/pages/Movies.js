import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import GenreFilter from '../components/GenreFilter';
import { getPopularMovies, getMovieGenres, discoverMovies } from '../services/tmdbApi';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const FilterWrapper = styled.div`
  margin-bottom: 20px;
`;

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let response;
        if (selectedGenre) {
          response = await discoverMovies(currentPage, selectedGenre);
        } else {
          response = await getPopularMovies(currentPage);
        }
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [currentPage, selectedGenre]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getMovieGenres();
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
  };

 return (
    <div>
      <h2>Popular Movies</h2>
      <FilterWrapper>
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
        />
      </FilterWrapper>
      <Grid>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} genres={genres} />
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

export default Movies;