import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { 
  getTopRatedMovies, 
  getUpcomingMovies, 
  getNowPlayingMovies,
  discoverMovies,
  discoverTvShows
} from '../services/tmdbApi';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const CategoryButton = styled.button`
  padding: 10px 15px;
  background-color: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? props.theme.background : props.theme.text};
  border: 2px solid ${props => props.theme.primary};
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${props => props.theme.primary}cc;
    color: ${props => props.theme.background};
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 12px;
  }
`;

const networks = [
  { id: 8, name: 'Netflix' },
  { id: 119, name: 'Amazon Prime' },
  { id: 350, name: 'Apple TV+' },
  { id: 283, name: 'Crunchyroll' },
  { id: 122, name: 'Hotstar' },
  { id: 220, name: 'Jio Cinema' },
  { id: 232, name: 'Zee5' },
  { id: 11, name: 'MUBI' }
];

const categories = [
  { id: 'top_rated', name: 'Top Rated' },
  { id: 'upcoming', name: 'Upcoming' },
  { id: 'now_playing', name: 'Now Playing' }
];

function Discovery() {
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeCategory, setActiveCategory] = useState('top_rated');
  const [activeNetwork, setActiveNetwork] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        let response;
        
        if (activeNetwork) {
          const [moviesRes, tvShowsRes] = await Promise.all([
            discoverMovies(currentPage, '', activeNetwork),
            discoverTvShows(currentPage, '', activeNetwork)
          ]);
          
          const movies = moviesRes.data.results.map(movie => ({ ...movie, media_type: 'movie' }));
          const tvShows = tvShowsRes.data.results.map(tvShow => ({ ...tvShow, media_type: 'tv' }));
          
          const combinedContent = [...movies, ...tvShows].sort((a, b) => b.popularity - a.popularity);
          
          setContent(combinedContent);
          setTotalPages(Math.max(moviesRes.data.total_pages, tvShowsRes.data.total_pages));
        } else {
          switch (activeCategory) {
            case 'top_rated':
              response = await getTopRatedMovies(currentPage);
              break;
            case 'upcoming':
              response = await getUpcomingMovies(currentPage);
              break;
            case 'now_playing':
              response = await getNowPlayingMovies(currentPage);
              break;
            default:
              response = await getTopRatedMovies(currentPage);
          }
          setContent(response.data.results.map(movie => ({ ...movie, media_type: 'movie' })));
          setTotalPages(response.data.total_pages);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, [activeCategory, activeNetwork, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveNetwork(null);
    setCurrentPage(1);
  };

  const handleNetworkClick = (networkId) => {
    setActiveNetwork(networkId);
    setActiveCategory(null);
    setCurrentPage(1);
  };

  return (
    <div>
      <h2>Discover Content</h2>
      <ButtonGroup>
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </CategoryButton>
        ))}
      </ButtonGroup>
      <ButtonGroup>
        {networks.map((network) => (
          <CategoryButton
            key={network.id}
            active={activeNetwork === network.id}
            onClick={() => handleNetworkClick(network.id)}
          >
            {network.name}
          </CategoryButton>
        ))}
      </ButtonGroup>
      <Grid>
        {content.map((item) => (
          <MovieCard 
            key={item.id} 
            movie={{
              ...item,
              title: item.title || item.name,
              release_date: item.release_date || item.first_air_date
            }} 
          />
        ))}
      </Grid>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Discovery;