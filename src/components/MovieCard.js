import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled(Link)`
  width: 200px;
  flex-shrink: 0;
  margin-bottom: 10px;
  text-decoration: none;
  color: #fff;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 5px;
`;

const Title = styled.h3`
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 14px;
  color: ${props => props.theme.primary};
`;

const Genre = styled.p`
  font-size: 12px;
  color: #888;
  margin: 0;
`;

function MovieCard({ movie, genres = [] }) {
  const isTV = movie.media_type === 'tv' || movie.first_air_date;
  const link = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const title = isTV ? movie.name : movie.title;

  const movieGenres = movie.genre_ids
    ? movie.genre_ids
        .map(id => genres.find(genre => genre.id === id)?.name)
        .filter(Boolean)
        .join(', ')
    : '';

  return (
    <Card to={link}>
      <Poster src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={title} />
      <Title>{title}</Title>
      {movieGenres && <Genre>{movieGenres}</Genre>}
    </Card>
  );
}

export default MovieCard;
