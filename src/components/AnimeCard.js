import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const Card = styled(Link)`
  width: 100%;
  max-width: 160px;
  text-decoration: none;
  color: #fff;
  position: relative;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (min-width: 480px) {
    max-width: 180px;
  }

  @media (min-width: 768px) {
    max-width: 200px;
    border-radius: 6px;
  }

  @media (min-width: 1024px) {
    max-width: 220px;
    border-radius: 8px;
  }

  @media (min-width: 1440px) {
    max-width: 240px;
    border-radius: 10px;
  }

  @media (min-width: 2560px) {
    max-width: 300px;
    border-radius: 12px;
  }

  @media (min-width: 3840px) {
    max-width: 400px;
    border-radius: 16px;
  }
`;

const PosterContainer = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3;
  position: relative;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: inherit;
`;


const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
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

  @media (min-width: 768px) {
    padding: 18px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
  }

  @media (min-width: 1440px) {
    padding: 22px;
  }

  @media (min-width: 2560px) {
    padding: 26px;
  }

  @media (min-width: 3840px) {
    padding: 32px;
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



  @media (min-width: 768px) {
    font-size: 15px;
    padding: 5px 7px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }

  @media (min-width: 1440px) {
    font-size: 17px;
  }

  @media (min-width: 2560px) {
    font-size: 20px;
    padding: 6px 8px;
  }

  @media (min-width: 3840px) {
    font-size: 26px;
    padding: 8px 12px;
  }
`;
const DetailItem = styled.div`
  color: #fff;
  font-size: 14px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;

    @media (min-width: 768px) {
    font-size: 15px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }

  @media (min-width: 1440px) {
    font-size: 17px;
  }

  @media (min-width: 2560px) {
    font-size: 20px;
    margin-bottom: 8px;
  }

  @media (min-width: 3840px) {
    font-size: 26px;
    margin-bottom: 12px;
  }
`;

const Icon = styled.span`
  margin-right: 8px;
  font-size: 16px;
  color: ${props => props.theme.primary};


  @media (min-width: 1024px) {
    font-size: 18px;
  }

  @media (min-width: 2560px) {
    font-size: 22px;
  }

  @media (min-width: 3840px) {
    font-size: 30px;
  }

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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

    @media (max-width: 480px) {
    font-size: 12px;
  }
  @media (min-width: 768px) {
    font-size: 14px;
    margin: 14px 0 7px;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
    margin: 16px 0 8px;
  }

  @media (min-width: 1440px) {
    font-size: 18px;
    margin: 18px 0 9px;
    padding: 0 14px;
  }

  @media (min-width: 2560px) {
    font-size: 24px;
    margin: 20px 0 10px;
    padding: 0 16px;
  }

  @media (min-width: 3840px) {
    font-size: 32px;
    margin: 24px 0 12px;
    padding: 0 20px;
  }

`;

const Genre = styled.p`
  font-size 13px;
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