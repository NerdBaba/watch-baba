// src/components/DownloadOption.js

import React from 'react';
import styled from 'styled-components';

const DownloadContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.primary};
  border-radius: 5px;
`;

const DownloadButton = styled.a`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.text};
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  margin: 5px;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const DownloadOption = ({ sources, title }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <DownloadContainer>
      <h3>Download {title}</h3>
      {sources.map((source, index) => (
        <DownloadButton 
          key={index} 
          href={source.src}
          download={`${title}_${source.quality}.mp4`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {source.quality}
        </DownloadButton>
      ))}
    </DownloadContainer>
  );
};

export default DownloadOption;
