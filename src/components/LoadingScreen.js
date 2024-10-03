import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInOut = keyframes`
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${props => props.theme.background};
`;

const LoadingText = styled.h1`
  font-family: 'Pacify Angry', sans-serif;
  font-size: 8rem;
  color: ${props => props.theme.primary};
  animation: ${fadeInOut} 2s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

function LoadingScreen() {
  const isMobile = window.innerWidth <= 768;

  return (
    <LoadingContainer>
      <LoadingText>
        {isMobile ? 'Watch.Baba' : 'Watch.Baba'}
      </LoadingText>
    </LoadingContainer>
  );
}

export default LoadingScreen;