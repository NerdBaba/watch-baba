import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchAnimeByCategory } from '../services/aniWatchApi';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import LoadingScreen from '../components/LoadingScreen';

const AnimeContainer = styled.div`
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;

  @media (min-width: 2560px) {
    max-width: 2400px;
  }

  @media (min-width: 3840px) {
    max-width: 3400px;
  }
`;

const AnimeGrid = styled.div`
   display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
`;
const AnimeTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 24px;
    background-color: ${props => props.theme.primary};
    margin-right: 12px;
    border-radius: 32px;
  }
  
  @media (min-width: 768px) {
    font-size: 28px;
    margin-bottom: 24px;
    
    &:before {
      height: 28px;
      width: 7px;
    }
  }

  @media (min-width: 1440px) {
    font-size: 32px;
    margin-bottom: 28px;
    
    &:before {
      height: 32px;
      width: 8px;
    }
  }

  @media (min-width: 2560px) {
    font-size: 40px;
    margin-bottom: 36px;
    
    &:before {
      height: 40px;
      width: 10px;
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    gap: 15px;
    margin-bottom: 24px;
  }

  @media (min-width: 1440px) {
    gap: 20px;
    margin-bottom: 28px;
  }
`;

const FilterButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.primary};
  background-color: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? props.theme.background : props.theme.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.background};
  }

  @media (min-width: 768px) {
    padding: 10px 15px;
    font-size: 16px;
  }

  @media (min-width: 1440px) {
    padding: 12px 18px;
    font-size: 18px;
  }

  @media (min-width: 2560px) {
    padding: 16px 24px;
    font-size: 22px;
  }
`;

function Anime() {
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState('POPULARITY_DESC');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAnime = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAnimeByCategory(category, currentPage);
        setAnimeList(data.animes || []);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching anime:', error);
      }
      setIsLoading(false);
    };
    
    getAnime();
  }, [currentPage, category]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  return (
    <AnimeContainer>
      <AnimeTitle>Anime</AnimeTitle>
      <FilterContainer>
        <FilterButton 
          active={category === 'POPULARITY_DESC'} 
          onClick={() => handleCategoryChange('POPULARITY_DESC')}
        >
          Most Popular
        </FilterButton>
        <FilterButton 
          active={category === 'SCORE_DESC'} 
          onClick={() => handleCategoryChange('SCORE_DESC')}
        >
          Top Rated
        </FilterButton>
        <FilterButton 
          active={category === 'UPDATED_AT_DESC'} 
          onClick={() => handleCategoryChange('UPDATED_AT_DESC')}
        >
          Recently Updated
        </FilterButton>
        <FilterButton 
          active={category === 'START_DATE_DESC'} 
          onClick={() => handleCategoryChange('START_DATE_DESC')}
        >
          Newest
        </FilterButton>
      </FilterContainer>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <AnimeGrid>
          {animeList.map((anime) => (
            <AnimeCard
              key={anime.id}
              anime={{
                id: anime.id,
                title: anime.title,
                image: anime.image,
                rating: anime.rating,
                duration: anime.duration,
                type: anime.type,
                episodes: anime.totalEpisodes
              }}
            />
          ))}
        </AnimeGrid>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </AnimeContainer>
  );
}

export default Anime;