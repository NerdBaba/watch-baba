import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled(Link)`
  width: 100%;
  max-width: 200px;
  flex-shrink: 0;
  margin-bottom: 20px;
  text-decoration: none;
  color: #fff;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    max-width: 150px;
  }

  @media (max-width: 480px) {
    max-width: 130px;
  }
`;

const Poster = styled.img`
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 5px;
`;

const Title = styled.h3`
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 14px;
  color: ${props => props.theme.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Genre = styled.p`
  font-size: 12px;
  color: #888;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

function MovieCard({ movie, genres = [] }) {
  const navigate = useNavigate();
  const isTV = movie.media_type === 'tv' || movie.first_air_date;
  const link = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const title = isTV ? movie.name : movie.title;

  const movieGenres = movie.genre_ids
    ? movie.genre_ids
        .map(id => genres.find(genre => genre.id === id)?.name)
        .filter(Boolean)
        .join(', ')
    : '';

  const handleClick = useCallback((e) => {
    e.preventDefault();
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    scrollToTop();

    setTimeout(() => {
      navigate(link);
    }, 500);
  }, [navigate, link]);

  return (
    <Card to={link} onClick={handleClick}>
      <Poster src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={title} />
      <Title>{title}</Title>
      {movieGenres && <Genre>{movieGenres}</Genre>}
    </Card>
  );
}

export default MovieCard;
