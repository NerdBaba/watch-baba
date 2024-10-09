import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
  position: relative;
`;


const ServersSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 22px;
    background-color: ${props => props.theme.primary};
    margin-right: 10px;
    border-radius: 32px;

  }
  
  @media (min-width: 768px) {
    font-size: 26px;
    margin-bottom: 20px;
    
    &:before {
      height: 28px;
      width: 7px;
    }
  }
`;

const ServersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
`;

const ServerButton = styled.button`
 background: ${props => props.active ?  (props.theme.primary) : (props.theme.background || '#fff')};
  color: ${props => props.active ? (props.theme.background) : (props.theme.primary || '#fff')};
  border: none;
  border-radius: 10px;
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


const Banner = styled.div`
  background: ${props => props.theme.primary}CC;
  color: ${props => props.theme.background};
  padding: 10px;
  text-align: center;
  border-radius: 8px;
  font-family: 'GeistVF', sans-serif;
  margin-bottom: 15px;
  font-size: 14px;



  a {
    color: ${props => props.theme.background || '#3498db'};
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;


const SPORTS = [
  "basketball", "football", "american-football", "hockey", "baseball",
  "motor-sports", "fight", "tennis", "rugby", "golf", "billiards",
  "afl", "darts", "cricket", "other"
];

function Watch() {
  const { id } = useParams();
  const location = useLocation();
  const [matchData, setMatchData] = useState(location.state?.matchData);
  const [loading, setLoading] = useState(!location.state?.matchData);
  const [selectedSource, setSelectedSource] = useState(
    matchData?.sources && matchData.sources.length > 0 ? matchData.sources[0] : null
  );
  const [selectedNumber, setSelectedNumber] = useState(1);

  const streamNumbers = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    if (!matchData) {
      fetchMatchData();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        try {
          window.screen.orientation?.lock('landscape').catch(() => {
            // Fallback or silent fail if orientation lock is not supported
          });
        } catch (err) {
          // Handle error or silently fail if screen orientation API is not supported
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const fetchMatchData = async () => {
    try {
      setLoading(true);
      
      // First try live/popular
      let response = await fetch('https://sports.mda2233.workers.dev/api/matches/live/popular');
      let matches = await response.json();
      let match = matches.find(m => m.id === id);
      
      // If not found, try each sport
      if (!match) {
        for (const sport of SPORTS) {
          response = await fetch(`https://sports.mda2233.workers.dev/api/matches/${sport}`);
          matches = await response.json();
          match = matches.find(m => m.id === id);
          if (match) break;
        }
      }
      
      if (match) {
        setMatchData(match);
        if (match.sources && match.sources.length > 0) {
          setSelectedSource(match.sources[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching match data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (source, streamNo) => {
    if (!source) return '';
    return `https://embedme.top/embed/${source.source}/${source.id}/${streamNo}`;
  };

  if (loading) {
    return <WatchContainer>Loading match data...</WatchContainer>;
  }

  if (!matchData) {
    return <WatchContainer>Match not found</WatchContainer>;
  }

  return (
    <WatchContainer>
      <Banner>
        <a href="https://fmhy.pages.dev/adblockvpnguide#vpn" target="_blank" rel="noopener noreferrer">
          If Stream Doesn't Load Use A Free VPN
        </a>
      </Banner>
      <PlayerContainer>
        <iframe
          src={getEmbedUrl(selectedSource, selectedNumber)}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="fullscreen; encrypted-media"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          title="Stream Player"
        />
      </PlayerContainer>

      <ServersSection>
        <SectionTitle>Servers</SectionTitle>
        <ServersGrid>
          {matchData.sources.map(source => (
            <ServerButton
              key={`${source.source}-${source.id}`}
              active={selectedSource && selectedSource.source === source.source}
              onClick={() => setSelectedSource(source)}
            >
              Server {source.source.toUpperCase()}
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