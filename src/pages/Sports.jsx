import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FaBasketballBall, 
  FaFutbol, 
  FaFootballBall, 
  FaHockeyPuck, 
  FaBaseballBall,
  FaCar,
  FaFistRaised,
  FaTableTennis,
  FaGolfBall,
  FaRunning,
  FaCircle
} from 'react-icons/fa';
import { MdSportsCricket } from 'react-icons/md';
import { GiBowlingPin, GiDart } from 'react-icons/gi';

const SportsContainer = styled.div`
  color: ${props => props.theme.text};
  background: ${props => props.theme.background};
  font-family: 'GeistVF', 'Watchbaba', sans-serif;
  
  width: 85vw; 
  margin: 0 auto;
  padding: 5vw;  /* Padding is now responsive to the viewport width */
  box-sizing: border-box;

  @media (min-width: 768px) {
    max-width: 90vw;
    padding: 3vw;
  }

  @media (min-width: 1024px) {
    max-width: 85vw;
    padding: 2.5vw;
  }

  @media (min-width: 1440px) {
    max-width: 80vw;
    padding: 2vw;
  }

  @media (min-width: 2560px) {
    max-width: 75vw;
    padding: 1.5vw;
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
  
  &:hover {
    opacity: 0.8;
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

const SportIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: ${props => props.active ? props.theme.primary : props.theme.background};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
  font-size: 1.5rem;
  color: ${props => props.active ? props.theme.background : props.theme.text};
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    width: 72px;
    height: 72px;
    font-size: 2rem;
  }
`;

// Also update the SportCard min-width for desktop
const SportCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 56px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    min-width: 72px;
  }
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const SportName = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.text};
  text-align: center;
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  max-height: 700px;
  overflow-y: auto;
  padding: 4px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.primary}40;
    border-radius: 3px;
  }
`;

const MatchCard = styled(Link)`
  position: relative;
  background: ${props => props.theme.background};
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: ${props => props.theme.text};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const MatchPoster = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: ${props => props.theme.primary}15;
  background-image: ${props => props.poster ? `url(${props.poster})` : 'none'};
  background-size: cover;
  background-position: center;

`;

const MatchContent = styled.div`
  padding: 12px;
`;

const SportTitle = styled.h3`
  font-size: 0.9rem;
  margin-bottom: 6px;
  color: ${props => props.theme.text};
`;

const PlaceholderContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 100%;
  color: ${props => props.theme.text};
  opacity: 0.5;
  
  .sport-icon {
    font-size: 2rem;
    margin-bottom: 8px;
  }
  
  .watchbaba {
    font-family: 'Isidora Sans Bold', sans-serif;
    font-size: 1.2rem;
    margin-bottom: 4px;
  }
  
  .sport-name {
    font-size: 1rem;
  }
`;

const MatchTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  font-family:'GeistVF';
  color: ${props => props.theme.text};
  margin-top: 8px;
  text-align: center;

  @media (max-width: 768px) {
   font-size: 0.8rem; 
  }
`;
const MatchTime = styled.div`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  font-size: 0.7rem;
`;

const LiveTag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  background: #E50914;
  color: white;
  font-size: 0.7rem;
  font-weight: 500;
`;

const NoMatches = styled.div`
  text-align: center;
  padding: 20px;
  color: ${props => props.theme.text};
`;

const sportIcons = {
  basketball: FaBasketballBall,
  football: FaFutbol,
  'american-football': FaFootballBall,
  hockey: FaHockeyPuck,
  baseball: FaBaseballBall,
  'motor-sports': FaCar,
  fight: FaFistRaised,
  tennis: FaTableTennis,
  rugby: FaFootballBall,
  golf: FaGolfBall,
  billiards: GiBowlingPin,
  afl: FaFootballBall,
  darts: GiDart,
  cricket: MdSportsCricket,
  other: FaRunning
};

function Sports() {
  const [sports, setSports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sportCardsRef = useRef(null);
  const matchesGridRef = useRef(null);

  const fetchSports = useCallback(async (signal) => {
    try {
      const response = await fetch('https://sports.mda2233.workers.dev/api/sports', { signal });
      if (!response.ok) throw new Error(`Sports request failed with status ${response.status}`);
      const data = await response.json();
      if (!signal.aborted) setSports(Array.isArray(data) ? data : []);
    } catch (requestError) {
      if (requestError?.name !== 'AbortError') {
        console.error('Error fetching sports:', requestError);
        setError('Unable to load sports right now.');
      }
    }
  }, []);

  const fetchMatches = useCallback(async (signal) => {
    setLoading(true);
    try {
      const endpoint = selectedSport
        ? `https://sports.mda2233.workers.dev/api/matches/${selectedSport}/popular`
        : 'https://sports.mda2233.workers.dev/api/matches/live/popular';
      
      const response = await fetch(endpoint, { signal });
      if (!response.ok) throw new Error(`Matches request failed with status ${response.status}`);
      const data = await response.json();
      if (!signal.aborted) setMatches(Array.isArray(data) ? data : []);
    } catch (requestError) {
      if (requestError?.name !== 'AbortError') {
        console.error('Error fetching matches:', requestError);
        setMatches([]);
        setError('Unable to load matches right now.');
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [selectedSport]);

  useEffect(() => {
    const controller = new AbortController();
    setError('');
    fetchSports(controller.signal);
    fetchMatches(controller.signal);
    return () => controller.abort();
  }, [fetchMatches, fetchSports]);
  const formatCategoryName = (category) => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
      {error && <p role="alert">{error}</p>}
      <SectionTitle>
        Sports
        <NavigationButtons>
          <NavButton type="button" aria-label="Scroll sports left" onClick={() => scrollSports('left')}>&lt;</NavButton>
          <NavButton type="button" aria-label="Scroll sports right" onClick={() => scrollSports('right')}>&gt;</NavButton>
        </NavigationButtons>
      </SectionTitle>
      <SportCardsGrid ref={sportCardsRef}>
        <SportCard onClick={() => setSelectedSport(null)}>
          <SportIcon active={selectedSport === null}>
            <FaCircle />
          </SportIcon>
          <SportName>Live</SportName>
        </SportCard>
        {sports.map(sport => {
          const IconComponent = sportIcons[sport.id.toLowerCase()] || sportIcons.other;
          return (
            <SportCard key={sport.id} onClick={() => setSelectedSport(sport.id)}>
              <SportIcon active={selectedSport === sport.id}>
                <IconComponent />
              </SportIcon>
              <SportName>{sport.name}</SportName>
            </SportCard>
          );
        })}
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
  <MatchPoster poster={match.poster ? `https://sports.mda2233.workers.dev${match.poster}` : null}>
    {!match.poster && (
      <PlaceholderContent>
        <div className="sport-icon">
          {React.createElement(sportIcons[match.category.toLowerCase()] || sportIcons.other)}
        </div>
        <div className="watchbaba">watchbaba</div>
        <div className="sport-name">{formatCategoryName(match.category)}</div>
      </PlaceholderContent>
    )}
  </MatchPoster>
  <MatchContent>
    <SportTitle>{formatCategoryName(match.category)}</SportTitle>
    {isLive(match) ? (
      <LiveTag>LIVE</LiveTag>
    ) : (
      <MatchTime>{formatMatchTime(match.date)}</MatchTime>
    )}
          <MatchTitle>{match.title}</MatchTitle>

  </MatchContent>
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
