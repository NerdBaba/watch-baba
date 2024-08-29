import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import GenreFilter from '../components/GenreFilter';
import { getPopularTvShows, getTvShowGenres, discoverTvShows } from '../services/tmdbApi';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

function TvShows() {
  const [tvShows, setTvShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchTvShows = async () => {
      try {
        let response;
        if (selectedGenre) {
          response = await discoverTvShows(currentPage, selectedGenre);
        } else {
          response = await getPopularTvShows(currentPage);
        }
        setTvShows(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      }
    };

    fetchTvShows();
  }, [currentPage, selectedGenre]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getTvShowGenres();
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching TV show genres:', error);
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
      <h2>Popular TV Shows</h2>
      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
      />
      <Grid>
        {tvShows.map((show) => (
          <MovieCard
            key={show.id}
            movie={{
              ...show,
              title: show.name,
              release_date: show.first_air_date,
              media_type: 'tv'
            }}
            genres={genres}
          />
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

export default TvShows;