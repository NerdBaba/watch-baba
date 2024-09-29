import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled(Link)`
  width: 100%;
  max-width:200px;
  text-decoration: none;
  color: #fff;
  position: relative;
  border-radius: 4px;
  // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

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
  position: relative;
  background-color: #333; // Placeholder background color
  display: flex;
  justify-content: center;
  align-items: center;
`;


const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  ${Card}:hover & {
    opacity: 1;
  }
`;

const Rating = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #ffd700;
  padding: 4px 6px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
`;
const DetailItem = styled.div`
  color: #fff;
  font-size: 14px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
`;

const Icon = styled.span`
  margin-right: 8px;
  font-size: 16px;
  color: ${props => props.theme.primary};
`;

const PlaceholderSVG = styled.svg`
  width: 50%;
  height: 50%;
  fill: ${props => props.theme.text};
`;

const Title = styled.h3`
  margin: 12px 0 6px;
  font-size: 14px;
  color: ${props => props.theme.primary};
  padding: 0 12px;

    @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Genre = styled.p`
  font-size: 13px;
  color:${props => props.theme.text};
  margin: 0 0 12px;
  padding: 0 12px;

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
        .slice(0, 2)
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
          <PlaceholderSVG viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </PlaceholderSVG>
        )}
        <HoverOverlay>
          <Rating>⭐ {movie.vote_average.toFixed(1)}</Rating>
          <DetailItem><Icon>📅</Icon> {(isTV ? movie.first_air_date : movie.release_date)?.slice(0, 4)}</DetailItem>
          <DetailItem><Icon>{isTV ? '📺' : '🎬'}</Icon> {isTV ? 'TV Show' : 'Movie'}</DetailItem>
          <DetailItem><Icon>🌐</Icon> {movie.original_language?.toUpperCase()}</DetailItem>
        </HoverOverlay>
      </PosterContainer>
      <Title>{title}</Title>
      {movieGenres && <Genre>{movieGenres}</Genre>}
    </Card>
  );
}

export default MovieCard;