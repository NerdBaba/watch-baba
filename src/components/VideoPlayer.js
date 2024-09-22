import React from 'react';
import styled, { ThemeContext } from 'styled-components';
import { themes } from '../theme';

export { themes };

const PlayerContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
`;

const Iframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

function VideoPlayer({ tmdbId, season, episode }) {
  const theme = React.useContext(ThemeContext);

  let embedUrl = '';

  if (season && episode) {
    embedUrl = `https://vidlink.mda2233.workers.dev/tv/${tmdbId}/${season}/${episode}`;
  } else {
    embedUrl = `https://vidlink.mda2233.workers.dev/movie/${tmdbId}`;
  }

  if (theme && theme.primary && theme.background) {
    // Remove the '#' from the hex codes and construct the URL parameters
    const primaryColor = theme.primary.replace('#', '');
    const secondaryColor = theme.background.replace('#', '');
    const iconColor = theme.primary.replace('#', '');

    // Append the color parameters to the embedUrl
    embedUrl += `?primaryColor=${primaryColor}&secondaryColor=${secondaryColor}&iconColor=${iconColor}`;
  }

  return (
    <PlayerContainer>
      <Iframe src={embedUrl} allowFullScreen />
    </PlayerContainer>
  );
}

export default VideoPlayer;