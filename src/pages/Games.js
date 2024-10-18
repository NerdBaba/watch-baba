import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';
import SearchGameCard from '../components/SearchGameCard';
import Pagination from '../components/Pagination';
import LoadingBar from '../components/LoadingBar';

const Container = styled.div`
  padding: 20px;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 100%;
  max-width: 300px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background: ${props => props.theme.secondary};
  color: ${props => props.theme.text};
`;

const CategoryDropdown = styled.select`
  padding: 10px;
  background: ${props => props.theme.secondary};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  min-width: 150px;
`;

const useProgressiveLoading = (items, batchSize = 6) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return;
    
    setVisibleItems([]);
    setCurrentIndex(0);
  }, [items]);

  useEffect(() => {
    if (currentIndex >= items.length) return;

    const timer = setTimeout(() => {
      setVisibleItems(prev => [
        ...prev,
        ...items.slice(currentIndex, currentIndex + batchSize)
      ]);
      setCurrentIndex(prev => prev + batchSize);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentIndex, items, batchSize]);

  return visibleItems;
};

const Games = () => {
  const [games, setGames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const visibleGames = useProgressiveLoading(games);

  const categories = [
    'ACTION', 'ADVENTURE', 'ANIME', 'CASUAL', 'FPS', 'FIGHTING',
    'HORROR', 'INDIE', 'OPEN-WORLD', 'SPORTS', 'PUZZLE', 'RPG',
    'RACING', 'SHOOTERS', 'SIMULATION', 'SCI-FI', 'STRATEGY',
    'SURVIVAL', 'VR'
  ];

  useEffect(() => {
    fetchGames();
  }, [selectedCategory, currentPage]);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      let url = 'https://games.mda2233.workers.dev/';
      if (selectedCategory) {
        url += `category/${selectedCategory.toLowerCase()}`;
        if (currentPage > 1) {
          url += `?page=${currentPage}`;
        }
      }
      const response = await fetch(url);
      const data = await response.json();
      setGames(selectedCategory ? data.games : data.sections[0].games);
      setTotalPages(data.hasNextPage ? currentPage + 1 : currentPage);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (query.length > 2) {
      setIsLoading(true);
      try {
        const response = await fetch(`https://games.mda2233.workers.dev/?s=${query}`);
        const data = await response.json();
        setSearchResults(data.results);
      } catch (error) {
        console.error('Error searching games:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container>
      <LoadingBar isLoading={isLoading} />
      
      <SearchContainer>
        <SearchInput
        type="text"
        placeholder="Search games..."
        value={searchQuery}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
        <CategoryDropdown
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </CategoryDropdown>
      </SearchContainer>

      {searchQuery && searchResults.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {searchResults.map((game, index) => (
            <SearchGameCard key={index} {...game} />
          ))}
        </motion.div>
      ) : (
        <>
          <Grid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {visibleGames.map((game, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GameCard {...game} />
              </motion.div>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages + 1}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default Games;