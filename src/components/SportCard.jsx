// components/SportCard.jsx
import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
  
  ${props => props.isSelected && `
    border: 2px solid ${props.theme.primary};
  `}
`;

const SportIcon = styled.div`
  width: 50px;
  height: 50px;
  margin: 0 auto 10px;
  background: ${props => props.theme.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SportName = styled.h3`
  text-align: center;
  margin: 0;
  font-size: 16px;
`;

function SportCard({ sport, isSelected, onClick }) {
  return (
    <Card isSelected={isSelected} onClick={() => onClick(sport.id)}>
      <SportIcon>
        {/* You could add sport-specific icons here */}
      </SportIcon>
      <SportName>{sport.name}</SportName>
    </Card>
  );
}

export default SportCard;