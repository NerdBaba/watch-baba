import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const WatchContainer = styled.div`
  padding: 20px;
  color: ${props => props.theme.text || '#ffffff'};
  background: ${props => props.theme.background || '#000000'};
`;

const PlayerContainer = styled.div`
  aspect-ratio: 16/9;
  background: ${props => props.theme.cardBackground || '#1c1c1e'};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const ServersSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 15px;
`;

const ServersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
`;

const ServerButton = styled.button`
  padding: 10px;
  background: ${props => props.active ? props.theme.primary || '#007AFF' : props.theme.cardBackground || '#1c1c1e'};
  color: ${props => props.active ? '#ffffff' : props.theme.text || '#ffffff'};
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.active ? props.theme.primary || '#007AFF' : props.theme.cardBackgroundHover || '#2c2c2e'};
  }
`;

const sources = ['alpha', 'bravo', 'charlie', 'delta', 'echo'];
const streamNumbers = [1, 2, 3, 4];

function Watch() {
  const { id } = useParams();
  const [selectedSource, setSelectedSource] = useState('alpha');
  const [selectedNumber, setSelectedNumber] = useState(1);

  const getEmbedUrl = (source, matchId, streamNo) => {
    return `https://embedme.top/embed/${source}/${matchId}/${streamNo}`;
  };

  return (
    <WatchContainer>
      <PlayerContainer>
        <iframe
          src={getEmbedUrl(selectedSource, id, selectedNumber)}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="encrypted-media"
          title="Stream Player"
        />
      </PlayerContainer>

      <ServersSection>
        <SectionTitle>Servers</SectionTitle>
        <ServersGrid>
          {sources.map(source => (
            <ServerButton
              key={source}
              active={selectedSource === source}
              onClick={() => setSelectedSource(source)}
            >
              Server {source.toUpperCase()}
            </ServerButton>
          ))}
        </ServersGrid>
      </ServersSection>

      <ServersSection>
        <SectionTitle>Stream Options</SectionTitle>
        <ServersGrid>
          {streamNumbers.map(number => (
            <ServerButton
              key={number}
              active={selectedNumber === number}
              onClick={() => setSelectedNumber(number)}
            >
              Option {number}
            </ServerButton>
          ))}
        </ServersGrid>
      </ServersSection>
    </WatchContainer>
  );
}

export default Watch;