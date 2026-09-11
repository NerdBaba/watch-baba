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
  padding: 10px;

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const PlayerContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
@media (min-width: 501px) {
    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-track {
      background: ${props => props.theme.background};
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${props => props.theme.primary};
      border-radius: 5px;
    }
  }

  @media (max-width: 500px) {
    overflow-y: hidden;
  }

overflow: auto;
  -webkit-overflow-scrolling: touch;

  @media (min-width: 1440px) {
    max-width: 1400px;
  }

  @media (min-width: 2560px) {
    max-width: 2000px;
  }
`;

const ControlsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 768px) {
    gap: 10px;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
`;

const EpisodeTitle = styled.span`
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  padding: 6px;
  font-family: 'GeistVF', sans-serif;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
    padding: 8px;
  }

  @media (min-width: 1440px) {
    font-size: 1.2rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.3rem;
  }
`;

const ControlButton = styled.button`
  background: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? props.theme.background : props.theme.primary};
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.8rem;
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

  @media (min-width: 768px) {
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  @media (min-width: 1440px) {
    padding: 10px 14px;
    font-size: 1rem;
  }

  @media (min-width: 2560px) {
    padding: 12px 16px;
    font-size: 1.1rem;
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
            {streamingData.sources.map((source) => (
              <ControlButton
                key={source.quality}
                onClick={() => setQuality(source.quality)}
                active={quality === source.quality}
              >
                {source.quality}
              </ControlButton>
            ))}
          </ControlGroup>

          <ControlButton onClick={onClose}>
            <FaTimes /> Close
          </ControlButton>
        </ControlsBar>

        <VideoWrapper>
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
        </VideoWrapper>
      </PlayerContainer>
    </PlayerBackdrop>
  );
}

export default AnimePlayer;