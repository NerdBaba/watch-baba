import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const rotateA = keyframes`
  0%, 25% { transform: rotate(0deg); }
  50%, 75% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
`;

const rotateB = keyframes`
  0%, 25% { transform: rotate(90deg); }
  50%, 75% { transform: rotate(270deg); }
  100% { transform: rotate(450deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.background};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
`;

const Kinetic = styled.div`
  position: relative;
  width: 80px;
  height: 80px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border: 50px solid transparent;
    border-bottom-width: 10px; // Adjust the thickness if needed
    animation: ${rotateA} 2s linear infinite;
    border-image: linear-gradient(45deg, ${(props) => props.theme.primary}, ${(props) => props.theme.accent}) 1;
  }

  &::before {
    animation: ${rotateB} 2s linear infinite;
    transform: rotate(90deg);
  }
`;

function LoadingScreen() {
  const [loaderSize, setLoaderSize] = useState(60);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) setLoaderSize(25);
      else if (window.innerWidth <= 768) setLoaderSize(35);
      else if (window.innerWidth <= 1024) setLoaderSize(45);
      else setLoaderSize(60);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <LoadingContainer>
      <Kinetic />
    </LoadingContainer>
  );
}

export default LoadingScreen;
