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
    max-width: 430px;
  }
`;

const PosterContainer = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 5px;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
`;

const PlaceholderSVG = () => (
  <svg width="50%" height="50%" viewBox="0 0 24 24" fill="#666">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
);

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
      <PosterContainer>
        {movie.poster_path ? (
          <Poster src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={title} />
        ) : (
          <PlaceholderSVG src="./movie-recorder-svgrepo-com.svg" />
        )}
      </PosterContainer>
      <Title>{title}</Title>
      {movieGenres && <Genre>{movieGenres}</Genre>}
    </Card>
  );
}

export default MovieCard;