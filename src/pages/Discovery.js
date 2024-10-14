import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { 
  getTopRatedMovies, 
  getUpcomingMovies, 
  getNowPlayingMovies,
  discoverMoviesHome as discoverMovies,
  discoverTvShowsHome as discoverTvShows,
} from '../services/tmdbApi';
import { FilterDropdown } from '../components/GenreFilter'; // Import FilterDropdown from GenreFilter

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
  margin-left: 10px;
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

const Grid = styled.div`
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

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-left: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const categories = [
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'now_playing', label: 'Now Playing' }
];

const networks = [
  { value: '8', label: 'Netflix' },
  { value: '119', label: 'Amazon Prime' },
  { value: '350', label: 'Apple TV+' },
  { value: '283', label: 'Crunchyroll' },
  { value: '122', label: 'Hotstar' },
  { value: '220', label: 'Jio Cinema' },
  { value: '232', label: 'Zee5' },
  { value: '11', label: 'MUBI' }
];

function Discovery() {
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeCategory, setActiveCategory] = useState('top_rated');
  const [activeNetwork, setActiveNetwork] = useState('all');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        let response;
        
        if (activeNetwork !== 'all') {
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

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveNetwork('all');
    setCurrentPage(1);
  };

  const handleNetworkChange = (networkId) => {
    setActiveNetwork(networkId);
    setActiveCategory('all');
    setCurrentPage(1);
  };

  return (
    <div>
      <SectionTitle>Discover Content</SectionTitle>
      <FilterContainer>
        <FilterDropdown
          label="Category"
          options={[{ value: 'all', label: 'All Categories' }, ...categories]}
          value={activeCategory}
          onChange={handleCategoryChange}
        />
        <FilterDropdown
          label="Network"
          options={[{ value: 'all', label: 'All Networks' }, ...networks]}
          value={activeNetwork}
          onChange={handleNetworkChange}
        />
      </FilterContainer>
      <Grid>
        {content.map((item) => (
        <CardWrapper key={item.id}>
          <MovieCard 
            key={item.id} 
            movie={{
              ...item,
              title: item.title || item.name,
              release_date: item.release_date || item.first_air_date
            }} 
          />
          </CardWrapper>
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