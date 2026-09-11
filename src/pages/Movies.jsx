import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import GenreFilter from '../components/GenreFilter';
import { getMovieGenres, discoverMovies } from '../services/tmdbApi';

const Grid = styled.div`
  display: flex;

  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
`;

const CardWrapper = styled.div`
  width: 200px;

  @media (max-width: 768px) {
    width: auto;
  }
`;

const FilterWrapper = styled.div`
  margin-bottom: 20px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.primary};
  margin-left: 10px
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
  margin-left: 10px;
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
function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popularity.desc');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setError('');
    const fetchMovies = async () => {
      try {
        const response = await discoverMovies(currentPage, {
          with_genres: selectedGenre !== 'all' ? selectedGenre : '',
          sort_by: selectedSort,
          primary_release_year: selectedYear !== 'all' ? selectedYear : '',
          with_original_language: selectedLanguage !== 'all' ? selectedLanguage : '',
        }, { signal: controller.signal });
        if (!active) return;
        setMovies(Array.isArray(response.data.results) ? response.data.results : []);
        setTotalPages(response.data.total_pages || 0);
      } catch (requestError) {
        if (active && requestError?.code !== 'ERR_CANCELED' && requestError?.name !== 'AbortError') {
          console.error('Error fetching movies:', requestError);
          setMovies([]);
          setError('Unable to load movies right now.');
        }
      }
    };

    fetchMovies();

    return () => {
      active = false;
      controller.abort();
    };
  }, [currentPage, selectedGenre, selectedSort, selectedYear, selectedLanguage]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const fetchGenres = async () => {
      try {
        const response = await getMovieGenres({ signal: controller.signal });
        if (active) setGenres(Array.isArray(response.data.genres) ? response.data.genres : []);
      } catch (requestError) {
        if (active && requestError?.code !== 'ERR_CANCELED' && requestError?.name !== 'AbortError') {
          console.error('Error fetching genres:', requestError);
        }
      }
    };

    fetchGenres();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
  };

  const handleSortSelect = (sort) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setCurrentPage(1);
  };

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      <SectionTitle>Popular Movies</SectionTitle>
      <FilterWrapper>
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreSelect={handleGenreSelect}
          selectedSort={selectedSort}
          onSortSelect={handleSortSelect}
          selectedYear={selectedYear}
          onYearSelect={handleYearSelect}
          selectedLanguage={selectedLanguage}
          onLanguageSelect={handleLanguageSelect}
        />
      </FilterWrapper>
      <Grid>

        {movies.map((movie) => (
        <CardWrapper key={movie.id}>
          <MovieCard key={movie.id} movie={movie} genres={genres} />
        </CardWrapper>
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
