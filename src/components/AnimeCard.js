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


function AnimeCard({ anime }) {
  const navigate = useNavigate();
  const link = `/anime/${anime.id}`;
  
  // Normalize the data structure
 const normalizedAnime = {
    id: anime.id,
    name: anime.title?.english || anime.title?.romaji || 'Unknown Title',
    poster: anime.image,
    rating: anime.rating / 10, // Assuming the API returns rating out of 100
    type: anime.type,
    episodes: anime.episodes
  };

  const handleClick = useCallback((e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => navigate(link), 500);
  }, [navigate, link]);

  return (
    <Card to={link} onClick={handleClick}>
      <PosterContainer>
        {normalizedAnime.poster ? (
          <Poster src={normalizedAnime.poster} alt={normalizedAnime.name} />
        ) : (
          <PlaceholderSVG viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </PlaceholderSVG>
        )}
        <HoverOverlay>
          <Rating>⭐ {normalizedAnime.rating.toFixed(1)}</Rating>
          {normalizedAnime.type && (
            <DetailItem><Icon>📺</Icon> {normalizedAnime.type}</DetailItem>
          )}
          {normalizedAnime.episodes && (
            <DetailItem><Icon>🌐</Icon> {normalizedAnime.episodes} episodes</DetailItem>
          )}
        </HoverOverlay>
      </PosterContainer>
      <Title>{normalizedAnime.name}</Title>
    </Card>
  );
}
export default AnimeCard;