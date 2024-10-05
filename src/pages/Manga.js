// src/pages/Manga.js
import React, { useState, useEffect} from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import MangaCard from '../components/MangaCard';

const MangaContainer = styled.div`
  padding: 20px;
  max-width: 2000px;
  margin: 0 auto;
`;

const SearchContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;

  @media (min-width: 600px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px 20px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  margin-bottom: 15px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};

  &:focus {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 5px ${props => props.theme.primary}33;
  }

  @media (min-width: 600px) {
    margin-bottom: 0;
    margin-right: 15px;
  }
`;

const SearchButton = styled.button`
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.primaryHover};
    transform: translateY(-2px);
  }

  &:disabled {
    background: ${props => props.theme.disabled};
    cursor: not-allowed;
  }

  svg {
    margin-right: 8px;
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${props => props.theme.spinnerBorder};
  border-top: 4px solid ${props => props.theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ResultsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
  justify-content: center;

  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
`;

const PopularMangaContainer = styled.div`
  margin-bottom: 30px;
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
    width: 7px;
    height: 23px;
    background-color: ${props => props.theme.primary};
    margin-right: 10px;
    border-radius: 32px;

  }
  
  @media (min-width: 768px) {
    font-size: 26px;
    margin-bottom: 20px;
    
    &:before {
      height: 28px;
    }
  }
`;

function Manga() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popularManga, setPopularManga] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialSearch = params.get('search');
    if (initialSearch) {
      setSearchQuery(initialSearch);
      handleSearch(null, initialSearch);
    } else {
      fetchPopularManga();
    }
  }, [location]);

  const fetchPopularManga = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://simple-proxy.mda2233.workers.dev/?destination=https://mangahook-api-jfg5.onrender.com/api/mangaList?category=Adventure&type=topview&state=all');
      setPopularManga(response.data.mangaList || []);
    } catch (error) {
      console.error('Error fetching popular manga:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e, query = searchQuery) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`https://simple-proxy.mda2233.workers.dev/?destination=https://mangahook-api-jfg5.onrender.com/api/search/${encodeURIComponent(query)}`);
      setSearchResults(response.data.mangaList || []);
    } catch (error) {
      console.error('Error searching manga:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MangaContainer>
      <SearchContainer onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder="Search for manga..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchButton type="submit" disabled={isLoading}>
          <FontAwesomeIcon icon={faSearch} />
          Search
        </SearchButton>
      </SearchContainer>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : searchResults.length > 0 ? (
        <ResultsContainer>
          {searchResults.map(manga => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </ResultsContainer>
      ) : (
        <PopularMangaContainer>
          <SectionTitle>Popular Adventure Manga</SectionTitle>
          <ResultsContainer>
            {popularManga.map(manga => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </ResultsContainer>
        </PopularMangaContainer>
      )}
    </MangaContainer>
  );
}

export default Manga;