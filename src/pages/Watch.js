// pages/Watch.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const WatchContainer = styled.div`
  padding: 20px;
  color: ${props => props.theme.text};
`;

const MatchInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 20px;
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TeamBadgePlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.primary}40;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`;

const TeamBadge = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const TeamName = styled.span`
  font-size: 18px;
`;

const VS = styled.span`
  margin: 0 20px;
  font-size: 18px;
`;

const ServersContainer = styled.div`
  margin-bottom: 20px;
`;

const ServerTypeTabs = styled.div`
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const ServerTypeTab = styled.button`
  padding: 10px 20px;
  background: none;
  border: none;
  color: ${props => props.active ? props.theme.primary : props.theme.text};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? props.theme.primary : 'transparent'};
`;

const SourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
`;

const SourceButton = styled.button`
  padding: 10px;
  background: ${props => props.active ? props.theme.primary : props.theme.cardBackground};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
`;

const QualityButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const QualityButton = styled(SourceButton)``;

const StreamContainer = styled.div`
  aspect-ratio: 16/9;
  background: ${props => props.theme.cardBackground};
  overflow: hidden;
  border-radius: 8px;
`;

function Watch() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [streams, setStreams] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [serverType, setServerType] = useState('all'); // 'all', 'free', 'premium'

  useEffect(() => {
    fetch(`https://streamed.su/api/matches/all`)
      .then(res => res.json())
      .then(data => {
        const matchDetails = data.find(m => m.id === id);
        setMatch(matchDetails);
      });

    const sources = ['alpha', 'bravo', 'charlie', 'delta', 'echo'];
    Promise.all(
      sources.map(source => 
        fetch(`https://streamed.su/api/stream/${source}/${id}`)
          .then(res => res.json())
          .catch(() => [])
      )
    ).then(streamsData => {
      const allStreams = streamsData.flat();
      setStreams(allStreams);
      if (allStreams.length > 0) {
        setSelectedSource(allStreams[0].source);
        setSelectedQuality(allStreams[0].hd ? 'HD' : 'SD');
      }
    });
  }, [id]);

  if (!match) return <div>Loading...</div>;

  const filteredStreams = streams.filter(stream => 
    serverType === 'all' || 
    (serverType === 'premium' && stream.premium) ||
    (serverType === 'free' && !stream.premium)
  );

  const availableSources = [...new Set(filteredStreams.map(stream => stream.source))];
  const availableQualities = selectedSource 
    ? [...new Set(filteredStreams
        .filter(stream => stream.source === selectedSource)
        .map(stream => stream.hd ? 'HD' : 'SD'))]
    : [];

  const selectedStream = filteredStreams.find(stream => 
    stream.source === selectedSource && 
    (stream.hd ? 'HD' : 'SD') === selectedQuality
  );

  const renderTeam = (team) => (
    <TeamInfo>
      {team?.badge ? (
        <TeamBadge src={`https://streamed.su/api/images/badge/${team.badge}.webp`} alt={team.name} />
      ) : (
        <TeamBadgePlaceholder>{team?.name?.charAt(0)}</TeamBadgePlaceholder>
      )}
      <TeamName>{team?.name || 'TBA'}</TeamName>
    </TeamInfo>
  );

  return (
    <WatchContainer>
      <MatchInfo>
        {renderTeam(match.teams?.home)}
        <VS>VS</VS>
        {renderTeam(match.teams?.away)}
      </MatchInfo>

      <ServersContainer>
        <ServerTypeTabs>
          {['all', 'free', 'premium'].map(type => (
            <ServerTypeTab
              key={type}
              active={serverType === type}
              onClick={() => setServerType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </ServerTypeTab>
          ))}
        </ServerTypeTabs>

        <SourcesGrid>
          {availableSources.map(source => (
            <SourceButton
              key={source}
              active={selectedSource === source}
              onClick={() => setSelectedSource(source)}
            >
              {source}
            </SourceButton>
          ))}
        </SourcesGrid>

        <QualityButtons>
          {availableQualities.map(quality => (
            <QualityButton
              key={quality}
              active={selectedQuality === quality}
              onClick={() => setSelectedQuality(quality)}
            >
              {quality}
            </QualityButton>
          ))}
        </QualityButtons>
      </ServersContainer>

      {selectedStream && (
        <StreamContainer>
          <iframe
            src={selectedStream.embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            sandbox = "allow-same-origin allow-scripts allow-forms allow-presentation allow-orientation-lock"
            allowFullScreen
          />
        </StreamContainer>
      )}
    </WatchContainer>
  );
}

export default Watch;