import React, { useState } from 'react';
import styled from 'styled-components';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

const PlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const StyledMediaPlayer = styled(MediaPlayer)`
  width: 100%;
  max-width: 1000px;
  aspect-ratio: 16 / 9;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const QualityToggle = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
`;

const QualityButton = styled.button`
  background: ${(props) => (props.active ? props.theme.primary : 'rgba(0, 0, 0, 0.5)')};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.active ? props.theme.primaryDark : 'rgba(0, 0, 0, 0.8)'};
  }
`;

function AnimePlayer({ title, posterSrc, streamingData, onClose }) {
  const [quality, setQuality] = useState('default');

  const currentSource =
    streamingData.sources.find((s) => s.quality === quality) || streamingData.sources[0];

  return (
    <PlayerContainer>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <QualityToggle>
        {streamingData.sources.map((source) => (
          <QualityButton
            key={source.quality}
            active={quality === source.quality}
            onClick={() => setQuality(source.quality)}
          >
            {source.quality}
          </QualityButton>
        ))}
      </QualityToggle>
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
