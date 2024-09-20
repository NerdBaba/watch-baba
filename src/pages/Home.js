import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import { getPopularMovies, getPopularTvShowsInIndia, getMovieGenres, getTvShowGenres } from '../services/tmdbApi';

 const Grid = styled.div`
 display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
`;


function Home() {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTvGenres] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, tvShowsRes, movieGenresRes, tvGenresRes] = await Promise.all([
          getPopularMovies(),
          getPopularTvShowsInIndia(),
          getMovieGenres(),
          getTvShowGenres()
        ]);

        setMovies(moviesRes.data.results);
        setTvShows(tvShowsRes.data.results);
        setMovieGenres(movieGenresRes.data.genres);
        setTvGenres(tvGenresRes.data.genres);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Popular Movies</h2>
      <Grid>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} genres={movieGenres} />
        ))}
      </Grid>

      <h2>Popular TV Shows</h2>
      <Grid>
        {tvShows.map((tvShow) => (
          <MovieCard
            key={tvShow.id}
            movie={{
              ...tvShow,
              title: tvShow.name,
              release_date: tvShow.first_air_date,
              media_type: 'tv'
            }}
            genres={tvGenres}
          />
        ))}
      </Grid>
    </div>
  );
}

export default Home;
