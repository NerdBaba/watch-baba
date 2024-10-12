import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled(Link)`
  width: 100%;
  text-decoration: none;
  color: ${props => props.theme.text};
  position: relative;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (min-width: 768px) {
    border-radius: 6px;
  }

  @media (min-width: 1024px) {
    border-radius: 8px;
  }

  @media (min-width: 1440px) {
    border-radius: 10px;
  }

  @media (min-width: 2560px) {
    border-radius: 12px;
  }

  @media (min-width: 3840px) {
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

const DetailItem = styled.div`
  color: #fff;
  font-size: 12px;
  margin-bottom: 4px;
`;

// src/components/MangaCard.js
function MangaCard({ manga }) {
  return (
    <Card to={`/manga/${manga.id}`}>
      <PosterContainer>
        <Poster src={manga.image} alt={manga.title} />
      </PosterContainer>
      <Title>{manga.title}</Title>
    </Card>
  );
}

export default MangaCard;