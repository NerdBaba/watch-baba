import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.div`
  background: ${props => props.theme.secondary};
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
  transition: background-color 0.3s;

  &:hover {
    background: ${props => props.theme.hover};
  }
`;

const Title = styled.h3`
  color: ${props => props.theme.text};
  margin: 0;
`;

const cleanTitle = (title) => {
  if (!title) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = title;
  return txt.value;
};

const getSlugFromLink = (link) => {
  return link.split('/').filter(Boolean).pop();
};

const SearchGameCard = ({ title, link }) => {
  const slug = getSlugFromLink(link);

  return (
    <Link to={`/game/${slug}`} style={{ textDecoration: 'none' }}>
      <Card>
        <Title>{cleanTitle(title)}</Title>
      </Card>
    </Link>
  );
};

export default SearchGameCard;