import React, { useEffect, useRef, useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';

export { themes } from '../theme';

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

const BlockedMessage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 1.2rem;
`;

// List of domains to block
const blockedDomains = [
  'acscdn.com',
  'tracking.example.com',
  // Add more domains as needed
];

function isDomainBlocked(url) {
  const hostname = new URL(url).hostname;
  return blockedDomains.some(domain => hostname.includes(domain));
}

function VideoPlayer({ tmdbId, season, episode, malId, audio }) {
  const theme = useContext(ThemeContext);
  const [isBlocked, setIsBlocked] = useState(false);
  const iframeRef = useRef(null);

  let embedUrl = '';

  if (malId) {
    embedUrl = `https://vidlink.mda2233.workers.dev/anime/${malId}/${episode}/${audio}`;
  } else if (season && episode) {
    embedUrl = `https://vidlink.mda2233.workers.dev/tv/${tmdbId}/${season}/${episode}`;
  } else {
    embedUrl = `https://vidlink.mda2233.workers.dev/movie/${tmdbId}`;
  }

  if (theme && theme.primary && theme.background) {
    const primaryColor = theme.primary.replace('#', '');
    const secondaryColor = theme.background.replace('#', '');
    const iconColor = theme.primary.replace('#', '');

    embedUrl += `?primaryColor=${primaryColor}&secondaryColor=${secondaryColor}&iconColor=${iconColor}`;
  }

  useEffect(() => {
    if (isDomainBlocked(embedUrl)) {
      setIsBlocked(true);
      return;
    }

    const checkIframeRequests = () => {
      if (iframeRef.current) {
        const observer = new MutationObserver(() => {
          const iframeSrc = iframeRef.current.src;
          if (isDomainBlocked(iframeSrc)) {
            setIsBlocked(true);
            observer.disconnect();
          }
        });

        observer.observe(iframeRef.current, { attributes: true, attributeFilter: ['src'] });
      }
    };

    checkIframeRequests();

    return () => {
      // Clean up any observers or listeners if needed
    };
  }, [embedUrl]);

  if (isBlocked) {
    return (
      <PlayerContainer>
        <BlockedMessage>
          This content has been blocked due to potentially harmful domains.
        </BlockedMessage>
      </PlayerContainer>
    );
  }

  return (
    <PlayerContainer>
      <Iframe 
        ref={iframeRef}
        src={embedUrl} 
        allowFullScreen 
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </PlayerContainer>
  );
}

export default VideoPlayer;