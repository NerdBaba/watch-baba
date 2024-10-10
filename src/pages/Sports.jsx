import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBowlingBall } from 'react-icons/fa';

const SportsContainer = styled.div`
  padding: 20px;
  color: ${props => props.theme.text};
  background: ${props => props.theme.background};
  font-family: 'GeistVF', 'Watchbaba', sans-serif;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 24px;
  color: ${props => props.theme.text};
  display: flex;
  justify-content: space-between;
  align-items: center;

`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const NavButton = styled.button`
  background: ${props => props.theme.primary};
  border: none;
  color: ${props => props.theme.background};
  cursor: pointer;
  font-size: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  
  &:hover {
    opacity: 0.8;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }

  &:active {
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transform: translateY(1px);
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
  scroll-behavior: smooth;
  
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
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SportIcon = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 16px;
  background: ${props => props.active ? props.theme.primary : props.theme.background};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  font-size: 2rem;
  color: ${props => props.active ? props.theme.background : props.theme.text};
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 4px 8px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.2)'};

  ${SportCard}:hover & {
    background: ${props => props.active ? props.theme.primary : props.theme.text};
    color: ${props => props.active ? props.theme.background : props.theme.background};
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
  }
`;

const SportName = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.text};
  text-align: center;
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  max-height: 600px;
  overflow-y: auto;
  padding-top: 8px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    width: 100%;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.primary}33;
    border-radius: 4px;
  }
`;

const MatchCard = styled(Link)`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.primary};
  border-radius: 16px;
  padding: 12px;
  text-decoration: none;
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    border-radius: 12px;
    padding: 10px;
    width: 90%;
    margin-right: 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
`;

const MatchPoster = styled.div`
  width: 100%;
  height: 120px;
  background-image: ${props => props.poster ? `url(${props.poster})` : 'none'};
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 120px;
    border-radius: 8px;
  }

  &::before {
    content: '${props => props.placeholder || ''}';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.poster ? 'none' : props.theme.primary};
    opacity: 0.1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    color: ${props => props.theme.text};
    font-family: 'Watchbaba', sans-serif;
  }
`;

const SportTitle = styled.h3`
  font-size: 0.9rem;
  margin-bottom: 6px;
  color: ${props => props.theme.primary};

  @media (max-width: 768px) {
    font-size: 0.8rem;
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
  gap: 6px;
  max-width: 45%;

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const TeamBadge = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }
`;

const TeamBadgePlaceholder = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  color: ${props => props.theme.background};
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    font-size: 0.6rem;
  }
`;

const TeamName = styled.span`
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const MatchTime = styled.div`
  font-size: 0.7rem;
  color: ${props => props.theme.background};
  margin-bottom: 6px;
  background: ${props => props.theme.primary};
  display: inline-block;
  padding: 3px 6px;
  border-radius: 10px;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 2px 5px;
  }
`;

const LiveTag = styled.span`
  background: #ff3b30;
  color: #ffffff;
  padding: 3px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 6px;
  box-shadow: 0 2px 4px rgba(255, 59, 48, 0.3);

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 2px 5px;
  }
`;
const NoMatches = styled.div`
  text-align: center;
  padding: 20px;
  color: ${props => props.theme.text};
`;

function Sports() {
  const [sports, setSports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const sportCardsRef = useRef(null);
  const matchesGridRef = useRef(null);

  useEffect(() => {
    fetchSports();
    fetchMatches();
  }, [selectedSport]);

  const fetchSports = async () => {
    try {
      const response = await fetch('https://sports.mda2233.workers.dev/api/sports');
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
        ? `https://sports.mda2233.workers.dev/api/matches/${selectedSport}/popular`
        : 'https://sports.mda2233.workers.dev/api/matches/live/popular';
      
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
    return match.date <= now && now - match.date < 3 * 60 * 60 * 1000;
  };

  const renderTeamInfo = (team) => (
    <TeamInfo>
      {team ? (
        <>
          {team.badge ? (
            <TeamBadge 
              src={`https://sports.mda2233.workers.dev/api/images/badge/${team.badge}.webp`} 
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

  const scrollSports = (direction) => {
    if (sportCardsRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      sportCardsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollMatches = (direction) => {
    if (matchesGridRef.current) {
      const scrollAmount = direction === 'up' ? -200 : 200;
      matchesGridRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <SportsContainer>
      <SectionTitle>
        Sports
        <NavigationButtons>
          <NavButton onClick={() => scrollSports('left')}>&lt;</NavButton>
          <NavButton onClick={() => scrollSports('right')}>&gt;</NavButton>
        </NavigationButtons>
      </SectionTitle>
      <SportCardsGrid ref={sportCardsRef}>
        <SportCard onClick={() => setSelectedSport(null)}>
          <SportIcon active={selectedSport === null}>
            <FaBowlingBall />
          </SportIcon>
          <SportName>Live</SportName>
        </SportCard>
        {sports.map(sport => (
          <SportCard key={sport.id} onClick={() => setSelectedSport(sport.id)}>
            <SportIcon active={selectedSport === sport.id}>
              <FaBowlingBall />
            </SportIcon>
            <SportName>{sport.name}</SportName>
          </SportCard>
        ))}
      </SportCardsGrid>

      <SectionTitle>
        {selectedSport ? `Popular ${sports.find(s => s.id === selectedSport)?.name}` : 'Popular Live'}
        <NavigationButtons>
          <NavButton onClick={() => scrollMatches('up')}>&lt;</NavButton>
          <NavButton onClick={() => scrollMatches('down')}>&gt;</NavButton>
        </NavigationButtons>
      </SectionTitle>
      
      {loading ? (
        <NoMatches>Loading matches...</NoMatches>
      ) : matches.length > 0 ? (
        <MatchesGrid ref={matchesGridRef}>
          {matches.map(match => (
            <MatchCard 
              key={match.id} 
              to={`/watch/${match.id}`}
              state={{ matchData: match }}
            >
              <MatchPoster 
                poster={match.poster ? `https://sports.mda2233.workers.dev${match.poster}` : null}
                placeholder={match.category.charAt(0).toUpperCase()}
              />
              <SportTitle>{match.category}</SportTitle>
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