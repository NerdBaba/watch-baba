import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';



const PlayerBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;



const PlayerContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
`;

const ControlsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
  

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;


const EpisodeTitle = styled.span`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  padding: 8px;
  font-family: 'GeistVF', sans-serif;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ControlButton = styled.button`
  background: ${props => props.active ?  (props.theme.primary) : (props.theme.background || '#fff')};
  color: ${props => props.active ? (props.theme.background) : (props.theme.primary || '#fff')};
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: background-color 0.3s ease;
  font-family: 'GeistVF', sans-serif;

  &:hover {
    opacity: 0.8;
  background-color: ${props => props.active ? props.theme.primary : `${props.theme.primary}33`};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
`;

const VideoWrapper = styled.div`
  width: 100%;
  position: relative;
  aspect-ratio: 16 / 9;
`;

const StyledMediaPlayer = styled(MediaPlayer)`
  width: 100%;
  height: 100%;
  --video-brand: ${props => props.theme.primary || '#ff0000'};
  --video-controls-color: ${props => props.theme.primary || '#ff0000'};
`;

// Use the same styled components as your AnimePlayer

function KDramaPlayer({
  title,
  posterSrc,
  streamingData,
  onClose,
  onNextEpisode,
  onPreviousEpisode,
  hasNextEpisode,
  hasPreviousEpisode,
  episodeNumber
}) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [key, setKey] = useState(0); // this line

  useEffect(() => {
    setKey(prevKey => prevKey + 1); // Force video player to remount
  }, [streamingData, sourceIndex]);

  const currentSource = streamingData.sources[sourceIndex];

  return (
    <PlayerBackdrop>
      <PlayerContainer>
        <ControlsBar>
          <ControlGroup>
            <ControlButton onClick={onPreviousEpisode} disabled={!hasPreviousEpisode}>
              <FaChevronLeft /> Previous
            </ControlButton>
            <EpisodeTitle>Episode {episodeNumber}</EpisodeTitle>
            <ControlButton onClick={onNextEpisode} disabled={!hasNextEpisode}>
              Next <FaChevronRight />
            </ControlButton>
          </ControlGroup>

          <ControlGroup>
            {streamingData.sources.map((source, index) => (
              <ControlButton
                key={index}
                onClick={() => setSourceIndex(index)}
                active={sourceIndex === index}
              >
                Source {index + 1}
              </ControlButton>
            ))}
          </ControlGroup>

          <ControlButton onClick={onClose}>
            <FaTimes /> Close
          </ControlButton>
        </ControlsBar>

        <VideoWrapper>
          <StyledMediaPlayer
            key={key} 
            title={title}
            crossorigin
          >
            <MediaProvider>
              <source src={currentSource.url} type="application/x-mpegurl" />
            </MediaProvider>
            <DefaultVideoLayout icons={defaultLayoutIcons} />
          </StyledMediaPlayer>
        </VideoWrapper>
      </PlayerContainer>
    </PlayerBackdrop>
  );
}

export default KDramaPlayer;