import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchAnimeByCategory, fetchAnimeHome } from '../services/aniWatchApi';
import AnimeCard from '../components/AnimeCard';
import Pagination from '../components/Pagination';
import LoadingScreen from '../components/LoadingScreen';
import { FilterDropdown } from '../components/GenreFilter';


const AnimeContainer = styled.div`
  padding: 20px;
  max-width: 2000px;
  margin: 0 auto;

  @media (min-width: 2560px) {
    max-width: 2400px;
  }

  @media (min-width: 3840px) {
    max-width: 3400px;
  }
`;

const AnimeGrid = styled.div`
   display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
`;

const CardWrapper = styled.div`
  width: 200px;

  @media (max-width: 768px) {
    width: auto;
  }
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
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    gap: 5px;
  }
`;

function Anime() {
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState('POPULARITY_DESC');
  const [isLoading, setIsLoading] = useState(true);

  const categoryOptions = [
    
    { value: 'POPULARITY_DESC', label: 'Most Popular' },
    { value: 'TRENDING', label: 'Trending' },
    { value: 'SCORE_DESC', label: 'Top Rated' },
    { value: 'UPDATED_AT_DESC', label: 'Recently Updated' },
    { value: 'START_DATE_DESC', label: 'Newest' },
  ];

  useEffect(() => {
    const getAnime = async () => {
      setIsLoading(true);
      try {
        let data;
        if (category === 'TRENDING') {
          data = await fetchAnimeHome();
          setAnimeList(data.results || []);
          setTotalPages(1); // Assuming trending doesn't have pagination
        } else {
          data = await fetchAnimeByCategory(category, currentPage);
          setAnimeList(data.animes || []);
          setTotalPages(data.totalPages);
        }
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
        <FilterDropdown
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={handleCategoryChange}
        />
      </FilterContainer>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <AnimeGrid>
          {animeList.map((anime) => (
          <CardWrapper key={anime.id}>
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
            </CardWrapper>
          ))}
        </AnimeGrid>
      )}
      {category !== 'TRENDING' && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </AnimeContainer>
  );
}

export default Anime;