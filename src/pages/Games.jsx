import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';
import SearchGameCard from '../components/SearchGameCard';
import Pagination from '../components/Pagination';
import LoadingBar from '../components/LoadingBar';
import { MdSearch } from 'react-icons/md';

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
  background: ${props => props.theme.secondary};
  border-radius: 8px;
  padding: 8px;
  align-items: center;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 35px 8px 12px;
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  font-size: 14px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.text}80;
  }
`;

const SearchIcon = styled.button`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;

  &:hover {
    color: ${props => props.theme.background};
    background-color: ${props => props.theme.hover};

  }

  svg {
    font-size: 20px;
  }
`;

const CategoryDropdown = styled.select`
  background: transparent;
  color: ${props => props.theme.text};
  border: none;
  padding: 8px;
  cursor: pointer;
  min-width: 120px;

  &:focus {
    outline: none;
  }

  option {
    background: ${props => props.theme.secondary};
    color: ${props => props.theme.text};
  }
`;


const useProgressiveLoading = (items, batchSize = 6) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items.length) {
      setVisibleItems([]);
      setCurrentIndex(0);
      return undefined;
    }

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
  const [error, setError] = useState('');
  const searchControllerRef = useRef(null);
  const visibleGames = useProgressiveLoading(games);

  const categories = [
    'ACTION', 'ADVENTURE', 'ANIME', 'CASUAL', 'FPS', 'FIGHTING',
    'HORROR', 'INDIE', 'OPEN-WORLD', 'SPORTS', 'PUZZLE', 'RPG',
    'RACING', 'SHOOTERS', 'SIMULATION', 'SCI-FI', 'STRATEGY',
    'SURVIVAL', 'VR'
  ];

  const fetchGames = useCallback(async (signal) => {
    setIsLoading(true);
    setError('');
    try {
      let url = 'https://games.mda2233.workers.dev/';
      if (selectedCategory) {
        url += `category/${selectedCategory.toLowerCase()}`;
      }
      if (currentPage > 1 || selectedCategory) {
        url += `${url.includes('?') ? '&' : '?'}page=${currentPage}`;
      }
      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error(`Games API request failed with status ${response.status}`);
      const data = await response.json();
      const nextGames = selectedCategory
        ? data.games
        : data.sections?.[0]?.games;
      setGames(Array.isArray(nextGames) ? nextGames : []);
      setTotalPages(Number.isFinite(data.totalPages)
        ? data.totalPages
        : data.hasNextPage ? currentPage + 1 : currentPage);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching games:', error);
        setGames([]);
        setError('Unable to load games. Please try again later.');
      }
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    const controller = new AbortController();
    fetchGames(controller.signal);
    return () => controller.abort();
  }, [fetchGames]);

  const handleSearch = async (query) => {
    searchControllerRef.current?.abort();
    if (query.trim().length > 2) {
      const controller = new AbortController();
      searchControllerRef.current = controller;
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`https://games.mda2233.workers.dev/?s=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Games search failed with status ${response.status}`);
        const data = await response.json();
        setSearchResults(Array.isArray(data.results) ? data.results : []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error searching games:', error);
          setSearchResults([]);
          setError('Unable to search games. Please try again later.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => () => searchControllerRef.current?.abort(), []);

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
  <SearchWrapper>
    <SearchInput
      type="text"
      placeholder="Search games..."
      value={searchQuery}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
    />
    <SearchIcon onClick={() => handleSearch(searchQuery)}>
      <MdSearch />
    </SearchIcon>
  </SearchWrapper>
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

      {searchQuery.trim().length > 2 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {searchResults.length > 0 ? searchResults.map((game, index) => (
            <SearchGameCard key={game.id ?? game.slug ?? `${game.name}-${index}`} {...game} />
          )) : (
            <p>No games found.</p>
          )}
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
                key={game.id ?? game.slug ?? `${game.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GameCard {...game} />
              </motion.div>
            ))}
          </Grid>
          
          {error && <p role="alert">{error}</p>}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default Games;
