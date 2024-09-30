// src/pages/Anime.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchAnimeByCategory } from '../services/aniWatchApi';
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
  @media (max-width: 768px) {
   flex-direction: row; 
   padding: 10px;
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

  @media (max-width: 768px) {
    scale: 0.8;
    padding: 5px 10px;
    margin-left: -15px;
  }
`;

function Anime() {
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState('most-favorite');

  useEffect(() => {
    const getAnime = async () => {
      try {
        const data = await fetchAnimeByCategory(category, currentPage);
        setAnimeList(data.animes);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching anime:', error);
      }
    };

    getAnime();
  }, [currentPage, category]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <AnimeTitle>Anime</AnimeTitle>
      <FilterContainer>
        <FilterGroup>
          <FilterLabel htmlFor="category">Category</FilterLabel>
          <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="most-favorite">Most Favorite</option>
            <option value="recently-updated">Recently Updated</option>
            <option value="most-popular">Most Popular</option>
            <option value="top-airing">Top Airing</option>
          </Select>
        </FilterGroup>
      </FilterContainer>
      <AnimeGrid>
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
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