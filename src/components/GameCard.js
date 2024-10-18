import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGamepad } from 'react-icons/fa';

const Card = styled(motion.div)`
  background: ${props => props.theme.secondary};
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 15px;
`;

const Title = styled.h3`
  color: ${props => props.theme.text};
  margin: 0;
  font-family: 'GeistVF', sans-serif;
  font-size: 1rem;
`;

const PlaceholderContainer = styled.div`
  width: 100%;
  height: 350px;
  background: ${props => props.theme.secondary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const PlaceholderIcon = styled(FaGamepad)`
  font-size: 48px;
  color: ${props => props.theme.text};
`;

const PlaceholderBrand = styled.div`
  font-family: 'Isidora Sans Bold', sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: ${props => props.theme.text};
`;

const PlaceholderTitle = styled.div`
  font-size: 14px;
  color: ${props => props.theme.text};
  text-align: center;
  padding: 0 15px;
  max-width: 90%;
  word-break: break-word;
`;

const cleanImageUrl = (url) => {
  if (!url) return url;
  return url.replace(/-\d+x\d+\.(jpg|png|webp)$/, '.$1');
};

const cleanTitle = (title) => {
  if (!title) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = title;
  return txt.value;
};

const GameCard = ({ title, image, link }) => {
  const slug = link.split('/').filter(Boolean).pop();
  const [imageError, setImageError] = React.useState(false);

  return (
    <Link to={`/game/${slug}`} style={{ textDecoration: 'none' }}>
      <Card
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {imageError ? (
          <PlaceholderContainer>
            <PlaceholderIcon />
            <PlaceholderBrand>playbaba</PlaceholderBrand>
            <PlaceholderTitle>{cleanTitle(title)}</PlaceholderTitle>
          </PlaceholderContainer>
        ) : (
          <Image
            src={cleanImageUrl(image)}
            alt={cleanTitle(title)}
            onError={() => setImageError(true)}
          />
        )}
        <Content>
          <Title>{cleanTitle(title)}</Title>
        </Content>
      </Card>
    </Link>
  );
};

export default GameCard;