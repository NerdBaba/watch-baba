import React from 'react';
import styled from 'styled-components';

// Container to maintain the aspect ratio (16:9) for the video player
const PlayerContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
`;

// Iframe for the embedded video player
const Iframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

// // Blocker overlay to capture clicks and prevent interaction with unwanted elements in the iframe
// const Blocker = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   z-index: 10; /* Ensure it's above the iframe */
//   pointer-events: none; /* Allow clicks to pass through to the iframe */
// `;

function VideoPlayer({ imdbId, season, episode }) {
  // Construct the embed URL based on whether it's a movie or a TV show
  let embedUrl = '';

  if (season && episode) {
    embedUrl = `https://vidsrc.cc/v3/embed/tv/${imdbId}/${season}/${episode}`;
  } else {
    embedUrl = `https://vidsrc.cc/v3/embed/movie/${imdbId}`;
  }
 

  return (
    <PlayerContainer>
      {/* Embed the video using an iframe */}
      <Iframe src={embedUrl} allowFullScreen />
      {/* Invisible blocker overlay to prevent interaction with popups or ads */}
    </PlayerContainer>
  );
}

export default VideoPlayer;
