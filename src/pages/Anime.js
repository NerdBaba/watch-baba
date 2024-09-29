// src/pages/Anime.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchAnime } from '../services/jikanApi';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';

const AnimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const AnimeTitle = styled.h1`
  font-family: 'Geist', sans-serif;
  color: ${props => props.theme.text};
  margin-bottom: 10px;

  @media (max-width: 768px) {
    margin-top: -20px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: ${props => props.theme.background};
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
  }
`;

const FilterLabel = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: ${props => props.theme.text};
  font-family: 'GeistVF', sans-serif;
`;

const Select = styled.select`
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.primary};
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover, &:focus {
    border-color: ${props => props.theme.secondary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}40;
  }
`;

function Anime() {
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    const getAnime = async () => {
      try {
        const data = await fetchAnime(currentPage, status, orderBy, type);
        setAnimeList(data.data.filter(anime => anime.rating !== 'Rx - Hentai'));
        setTotalPages(data.pagination.last_visible_page);
      } catch (error) {
        console.error('Error fetching anime:', error);
      }
    };

    getAnime();
  }, [currentPage, status, orderBy, type]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <AnimeTitle>Anime</AnimeTitle>
      <FilterContainer>
        <FilterGroup>
          <FilterLabel htmlFor="status">Status</FilterLabel>
          <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="complete">Completed</option>
            <option value="airing">Airing</option>
            <option value="upcoming">Upcoming</option>
          </Select>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel htmlFor="orderBy">Sort By</FilterLabel>
          <Select id="orderBy" value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            <option value="">Default</option>
            <option value="title">Title</option>
            <option value="popularity">Popularity</option>
            <option value="rank">Rank</option>
          </Select>
        </FilterGroup>
        <FilterGroup>
          <FilterLabel htmlFor="type">Type</FilterLabel>
          <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="tv">TV</option>
            <option value="movie">Movie</option>
            <option value="ova">OVA</option>
            <option value="special">Special</option>
            <option value="ona">ONA</option>
          </Select>
        </FilterGroup>
      </FilterContainer>
      <AnimeGrid>
        {animeList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </AnimeGrid>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Anime;
