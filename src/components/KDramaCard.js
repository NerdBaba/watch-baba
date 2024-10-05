import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled(Link)`
  width: 100%;
  max-width: 250px; // Increased from 200px
  text-decoration: none;
  color: #fff;
  position: relative;
  border-radius: 8px; // Slightly increased for better aesthetics
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    max-width: 180px; // Increased from 150px
  }

  @media (max-width: 480px) {
    max-width: 150px; // Adjusted for better mobile layout
  }
`;

const Title = styled.h3`
  margin: 12px 0 6px;
  font-size: 16px; // Increased from 14px
  font-weight: 600;
  color: ${props => props.theme.primary};
  padding: 0 12px;

  @media (max-width: 480px) {
    font-size: 14px; // Increased from 12px
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
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;



const ReleaseDate = styled.p`
  font-size: 13px;
  color: ${props => props.theme.text};
  margin: 0 0 12px;
  padding: 0 12px;

  @media (max-width: 480px) {
    font-size: 10px;
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