import React from 'react';
import { Link } from 'react-router-dom';
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

const Title = styled.h3`
  margin: 12px 0 6px;
  font-size: 14px;
  font-weight: 600;
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


const PosterContainer = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3;
  position: relative;
  background-color: #333;
  display: flex;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  align-items: center;
  border-radius: inherit;

  @media (min-width: 1440px) {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 2560px) {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`;

const ReleaseDate = styled.p`
  font-size: 12px;
  color: ${props => props.theme.text};
  margin: 0 0 12px;
  padding: 0 12px;

  @media (min-width: 768px) {
    font-size: 13px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }

  @media (min-width: 1440px) {
    font-size: 15px;
    padding: 0 14px;
  }

  @media (min-width: 2560px) {
    font-size: 18px;
    padding: 0 16px;
  }

  @media (min-width: 3840px) {
    font-size: 24px;
    padding: 0 20px;
  }
`;
function KDramaCard({ drama }) {
    if (!drama) return null;
  return (
    <Card to={`/kdrama/${drama.id}`}>
      <PosterContainer>
        <Poster src={drama.image} alt={drama.title} />
      </PosterContainer>
      <Title>{drama.title}</Title>
      <ReleaseDate>{drama.releaseDate}</ReleaseDate>
    </Card>
  );
}

export default KDramaCard;