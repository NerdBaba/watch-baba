import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SportsContainer = styled.div`
  padding: 20px;
  color: ${props => props.theme.text || '#ffffff'};
  background: ${props => props.theme.background || '#000000'};
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 16px;
  color: ${props => props.theme.text || '#ffffff'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const NavButton = styled.button`
  background: ${props => props.theme.cardBackground || '#1c1c1e'};
  border: none;
  color: ${props => props.theme.text || '#ffffff'};
  cursor: pointer;
  font-size: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
  
  &:hover {
    background: ${props => props.theme.cardBackgroundHover || '#2c2c2e'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SportCardsGrid = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 30px;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SportCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 90px;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const SportIcon = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 16px;
  background: ${props => props.theme.cardBackground || '#1c1c1e'};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  font-size: 1.5rem;
  color: ${props => props.theme.text || '#ffffff'};
  transition: background-color 0.3s;

  ${SportCard}:hover & {
    background: ${props => props.theme.cardBackgroundHover || '#2c2c2e'};
  }
`;

const SportName = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.text || '#ffffff'};
  text-align: center;
`;

const MatchesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MatchCard = styled(Link)`
  background: ${props => props.theme.cardBackground || '#1c1c1e'};
  border-radius: 12px;
  padding: 16px;
  text-decoration: none;
  color: ${props => props.theme.text || '#ffffff'};
  transition: background-color 0.3s;

  &:hover {
    background: ${props => props.theme.cardBackgroundHover || '#2c2c2e'};
  }
`;

const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TeamBadge = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const TeamBadgePlaceholder = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.theme.cardBackgroundHover || '#2c2c2e'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary || '#666'};
`;

const TeamName = styled.span`
  font-size: 0.875rem;
`;

const MatchTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary || '#666'};
  margin-bottom: 8px;
  background: ${props => props.theme.cardBackgroundHover || '#2c2c2e'};
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
`;

const LiveTag = styled.span`
  background: #ff0000;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 8px;
`;

const NoMatches = styled.div`
  text-align: center;
  padding: 20px;
  color: ${props => props.theme.textSecondary || '#666'};
`;

function Sports() {
  const [sports, setSports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSports();
    fetchMatches();
  }, [selectedSport]);

  const fetchSports = async () => {
    try {
      const response = await fetch('https://streamed.su/api/sports');
      const data = await response.json();
      setSports(data);
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const endpoint = selectedSport
        ? `https://streamed.su/api/matches/${selectedSport}/popular`
        : 'https://streamed.su/api/matches/live/popular';
      
      const response = await fetch(endpoint);
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const formatMatchTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const isLive = (match) => {
    const now = Date.now();
    // Assuming a match is "live" if it started within the last 3 hours
    return match.date <= now && now - match.date < 3 * 60 * 60 * 1000;
  };

  const renderTeamInfo = (team) => (
    <TeamInfo>
      {team ? (
        <>
          {team.badge ? (
            <TeamBadge 
              src={`https://streamed.su/api/images/badge/${team.badge}.webp`} 
              alt={team.name} 
            />
          ) : (
            <TeamBadgePlaceholder>
              {team.name.charAt(0)}
            </TeamBadgePlaceholder>
          )}
          <TeamName>{team.name}</TeamName>
        </>
      ) : (
        <>
          <TeamBadgePlaceholder>?</TeamBadgePlaceholder>
          <TeamName>TBA</TeamName>
        </>
      )}
    </TeamInfo>
  );

  return (
    <SportsContainer>
      <SectionTitle>
        Sports
        <NavigationButtons>
          <NavButton>&lt;</NavButton>
          <NavButton>&gt;</NavButton>
        </NavigationButtons>
      </SectionTitle>
      <SportCardsGrid>
        <SportCard onClick={() => setSelectedSport(null)}>
          <SportIcon>🔴</SportIcon>
          <SportName>Live</SportName>
        </SportCard>
        {sports.map(sport => (
          <SportCard key={sport.id} onClick={() => setSelectedSport(sport.id)}>
            <SportIcon>{sport.name.charAt(0).toUpperCase()}</SportIcon>
            <SportName>{sport.name}</SportName>
          </SportCard>
        ))}
      </SportCardsGrid>

      <SectionTitle>
        {selectedSport ? `Popular ${sports.find(s => s.id === selectedSport)?.name}` : 'Popular Live'}
        <NavigationButtons>
          <NavButton>&lt;</NavButton>
          <NavButton>&gt;</NavButton>
        </NavigationButtons>
      </SectionTitle>
      
      {loading ? (
        <NoMatches>Loading matches...</NoMatches>
      ) : matches.length > 0 ? (
        <MatchesGrid>
          {matches.map(match => (
            <MatchCard key={match.id} to={`/watch/${match.id}`}>
              {isLive(match) ? (
                <LiveTag>LIVE</LiveTag>
              ) : (
                <MatchTime>{formatMatchTime(match.date)}</MatchTime>
              )}
              <TeamsContainer>
                {renderTeamInfo(match.teams?.home)}
                <span>vs</span>
                {renderTeamInfo(match.teams?.away)}
              </TeamsContainer>
            </MatchCard>
          ))}
        </MatchesGrid>
      ) : (
        <NoMatches>No matches available</NoMatches>
      )}
    </SportsContainer>
  );
}

export default Sports;