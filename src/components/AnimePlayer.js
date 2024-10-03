import React, { useState } from 'react';
import styled from 'styled-components';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PlayerControls = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
  z-index: 1001;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
    
    & > * {
      flex: 1 1 40%;
      text-align: center;
    }
  }
`;

const ControlButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  color: ${(props) => (props.primary)};
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const QualityToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    order: -1;
    width: 100%;
    margin-bottom: 0.5rem;
  }
`;

const EpisodeInfo = styled.div`
  position: absolute;
  top: 4.5rem;
  left: 1rem;
  color: ${(props) => (props.primary)};
  font-size: 1.2rem;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 4px;

  @media (max-width: 768px) {
    top: auto;
    bottom: 5rem;
    font-size: 1rem;
  }
`;

const StyledMediaPlayer = styled(MediaPlayer)`
  width: 100%;
  max-width: 1000px;
  aspect-ratio: 16 / 9;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    max-width: none;
    aspect-ratio: auto;
  }
`;

function AnimePlayer({
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
  const [quality, setQuality] = useState('default');

  const currentSource =
    streamingData.sources.find((s) => s.quality === quality) || streamingData.sources[0];

  return (
    <PlayerContainer>
      <PlayerControls>
        <ControlButton
          onClick={onPreviousEpisode}
          disabled={!hasPreviousEpisode}
        >
          <FaChevronLeft /> Previous
        </ControlButton>
        
        <ControlButton onClick={onClose}>
          <FaTimes /> Close
        </ControlButton>
        
        <ControlButton
          onClick={onNextEpisode}
          disabled={!hasNextEpisode}
        >
          Next <FaChevronRight />
        </ControlButton>

        <QualityToggle>
          {streamingData.sources.map((source) => (
            <ControlButton
              key={source.quality}
              active={quality === source.quality}
              onClick={() => setQuality(source.quality)}
            >
              {source.quality}
            </ControlButton>
          ))}
        </QualityToggle>
      </PlayerControls>

      <EpisodeInfo>Episode {episodeNumber}</EpisodeInfo>

      <StyledMediaPlayer
        title={title}
        src={currentSource.url}
        poster={posterSrc}
        crossorigin
      >
        <MediaProvider>
          {streamingData.subtitles?.map((subtitle) => (
            <track
              key={subtitle.lang}
              kind="subtitles"
              src={subtitle.url}
              label={subtitle.lang}
              srcLang={subtitle.lang}
            />
          ))}
        </MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </StyledMediaPlayer>
    </PlayerContainer>
  );
}

export default AnimePlayer;