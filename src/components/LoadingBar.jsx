// components/LoadingBar.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LoadingBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.1);
  z-index: 1000;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(
    to right,
    ${props => props.theme.primary},
    ${props => props.theme.accent},
    ${props => props.theme.highlight}
  );
  transition: width 0.3s ease-in-out;
  width: ${props => props.progress}%;
`;

function LoadingBar({ isLoading }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
    } else {
      setProgress(100);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <LoadingBarContainer>
      <Progress progress={progress} />
    </LoadingBarContainer>
  );
}

export default LoadingBar;