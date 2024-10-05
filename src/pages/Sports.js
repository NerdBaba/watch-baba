// pages/Sports.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SportsContainer = styled.div`
  padding: 20px;
  color: ${props => props.theme.text};
`;

const SportIconsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 15px;
  margin-bottom: 30px;
  padding: 10px 0;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SportIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  min-width: 80px;
  opacity: ${props => props.active ? 1 : 0.7};
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const IconCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.active ? props.theme.primary : props.theme.cardBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  transition: background 0.2s;
`;

const SportName = styled.span`
  font-size: 12px;
  text-align: center;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  background: ${props => props.active ? props.theme.primary : props.theme.cardBackground};
  color: ${props => props.theme.text};
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.theme.primary};
  }
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const MatchCard = styled(Link)`
  background: ${props => props.theme.cardBackground};
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: ${props => props.theme.text};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TeamBadgePlaceholder = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.theme.primary}40;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
`;

const TeamBadge = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const TeamName = styled.span`
  font-size: 14px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusTag = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  align-self: flex-start;
  margin-bottom: 10px;
  background: ${props => props.live ? '#ff4444' : props.theme.primary};
  color: white;
`;

function Sports() {
  const [selectedSport, setSelectedSport] = useState(null);
  const [sports, setSports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'live', 'upcoming', 'popular'

  useEffect(() => {
    fetch('https://streamed.su/api/sports')
      .then(res => res.json())
      .then(setSports);

    fetchMatches();
  }, [selectedSport]);

  const fetchMatches = async () => {
    const endpoints = [
      'https://streamed.su/api/matches/all',
      'https://streamed.su/api/matches/live'
    ];

    const responses = await Promise.all(endpoints.map(url => fetch(url)));
    const [allMatches, liveMatches] = await Promise.all(responses.map(res => res.json()));

    const combinedMatches = [...allMatches, ...liveMatches].reduce((acc, match) => {
      if (!acc.find(m => m.id === match.id)) {
        acc.push(match);
      }
      return acc;
    }, []);

    setMatches(combinedMatches);
  };

  const filteredMatches = matches
    .filter(match => !selectedSport || match.category === selectedSport)
    .filter(match => {
      switch (filter) {
        case 'live': return match.live;
        case 'upcoming': return !match.live && new Date(match.date) > new Date();
        case 'popular': return match.popular;
        default: return true;
      }
    });

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
    <SportsContainer>
      <SportIconsContainer>
        <SportIcon 
          active={!selectedSport}
          onClick={() => setSelectedSport(null)}
        >
          <IconCircle active={!selectedSport}>All</IconCircle>
          <SportName>All Sports</SportName>
        </SportIcon>
        {sports.map(sport => (
          <SportIcon 
            key={sport.id}
            active={selectedSport === sport.id}
            onClick={() => setSelectedSport(sport.id)}
          >
            <IconCircle active={selectedSport === sport.id}>
              {sport.name.charAt(0)}
            </IconCircle>
            <SportName>{sport.name}</SportName>
          </SportIcon>
        ))}
      </SportIconsContainer>

      <FiltersContainer>
        {['all', 'live', 'upcoming', 'popular'].map(filterOption => (
          <FilterButton
            key={filterOption}
            active={filter === filterOption}
            onClick={() => setFilter(filterOption)}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </FilterButton>
        ))}
      </FiltersContainer>

      <MatchesGrid>
        {filteredMatches.map(match => (
          <MatchCard key={match.id} to={`/watch/${match.id}`}>
            <StatusTag live={match.live}>
              {match.live ? 'LIVE' : new Date(match.date).toLocaleTimeString()}
            </StatusTag>
            <TeamsContainer>
              {renderTeam(match.teams?.home)}
              <span>vs</span>
              {renderTeam(match.teams?.away)}
            </TeamsContainer>
          </MatchCard>
        ))}
      </MatchesGrid>
    </SportsContainer>
  );
}

export default Sports;