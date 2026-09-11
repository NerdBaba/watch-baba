// pages/Comics.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { fetchComics, searchComics } from '../services/comicApi';
import { getSlugFromUrl } from '../utils/urlHelpers';
import LoadingBar from '../components/LoadingBar';
import Pagination from '../components/Pagination';

const ComicsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 30px;
  padding: 20px;
  justify-items: center;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
    padding: 10px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 500px;
  margin: 20px auto;

  @media (max-width: 768px) {
   max-width: 70vw; 
   margin: 20px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 45px 15px 20px;
  border-radius: 25px;
  border: 2px solid ${props => props.theme.border};
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 16px;
  font-family: 'GeistVF', sans-serif;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
  }

  @media (max-width: 768px) {
    padding: 12px 40px 12px 15px;
    font-size: 14px;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.text};
  opacity: 0.5;
`;

const ComicCard = styled(motion.div)`
  position: relative;
  width: 100%;
  background: ${props => props.theme.background};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const ComicImage = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
  transition: transform 0.3s ease;
`;

const ComicInfo = styled.div`
  padding: 15px;
  background: ${props => props.theme.background};

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ComicTitle = styled.h3`
  font-size: 1rem;
  margin: 0;
  color: ${props => props.theme.text};
  font-family: 'GeistVF', sans-serif;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  width: 100%;
`;

function Comics() {
  const [comics, setComics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchResult, setIsSearchResult] = useState(false);
  const cleanTextFromHtmlEntities = (text) => {
  return text.replace(/&#\d+;/g, '');
};

  useEffect(() => {
    const fetchComicsList = async () => {
      setLoading(true);
      try {
        const response = await fetchComics(currentPage);
        setComics(response.comics);
        setTotalPages(response.totalPages);
        setIsSearchResult(false);
      } catch (error) {
        console.error('Error fetching comics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!isSearchResult) {
      fetchComicsList();
    }
  }, [currentPage, isSearchResult]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchComics(searchQuery);
      setComics(response.results);
      setTotalPages(1);
      setCurrentPage(1);
      setIsSearchResult(true);
    } catch (error) {
      console.error('Error searching comics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderComicCard = (comic, index) => (
  <StyledLink
    to={isSearchResult 
      ? `/comics/category/${getSlugFromUrl(comic.url)}` 
      : `/comics/chapter/${getSlugFromUrl(comic.url)}`}
    key={comic.url}
  >
    <ComicCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {!isSearchResult && <ComicImage src={comic.image} alt={comic.title} />}
      <ComicInfo>
        <ComicTitle>{cleanTextFromHtmlEntities(comic.title)}</ComicTitle>
      </ComicInfo>
    </ComicCard>
  </StyledLink>
);

  return (
    <>
      <LoadingBar isLoading={loading} />
      <form onSubmit={handleSearch}>
        <SearchContainer>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for comics..."
          />
          <SearchIcon onClick={handleSearch} />
        </SearchContainer>
      </form>

      <ComicsContainer>
        {comics.map((comic, index) => renderComicCard(comic, index))}
      </ComicsContainer>

      {!isSearchResult && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}

export default Comics;