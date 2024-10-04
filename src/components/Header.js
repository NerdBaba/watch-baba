import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaDice, FaBars, FaTimes, FaBook, FaFilm, FaTv, FaUser,FaEye,FaCompass } from 'react-icons/fa';
import { getPopularMovies, getPopularTvShows } from '../services/tmdbApi';

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  padding-bottom: 0;
  background-color: ${props => props.theme.background};

  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    padding: 10px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Logo = styled.h1`
  font-size: 32px;
  color: ${props => props.theme.primary};
  font-weight: 700;
  margin: 0 0 15px 15px;

  @font-face {
    font-family: 'Pacify Angry';
    src: url('fonts/Pacify%20Angry.ttf') format('truetype');
  }
  font-family: 'Pacify Angry', sans-serif;

  @media (min-width: 769px) {
    font-size: 40px;
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 30px;
    margin: 0;
  }
`;

const SearchForm = styled.form`
  width: 100%;
  max-width: 250px;
  margin-bottom: 15px;

  @media (min-width: 769px) {
    margin-bottom: 0;
    margin-left: auto;
    margin-right: 15px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchBarContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchBar = styled.input`
  padding: 10px;
  padding-right: 40px;
  border-radius: 5px;
  border: 3px solid ${props => props.theme.primary};
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  width: 100%;
  box-sizing: border-box;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.text};
  cursor: pointer;
`;

const RandomButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.background};
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  width: 100%;
  justify-content: center;
  font-family: GeistVF, sans-serif;
  font-weight: heavy; 

  @media (min-width: 769px) {
    width: auto;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const DiceIcon = styled(FaDice)`
  margin-right: 5px;
`;

const MobileControls = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const MobileButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.primary};
  font-size: 1.3rem;
  cursor: pointer;
  padding: 5px;
  &:hover {
   background-color: rgba(0, 0, 0, 0.1); 
  }
  margin-left: 10px;
  @media (min-width: 769px) {
   display: none; 
  }
`;

const MobileSearchOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const CloseButton = styled(MobileButton)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const MobileSearchForm = styled(SearchForm)`
  display: block;
  width: 80%;
  max-width: none;
  margin: 0;
`;


function Header({ toggleSidebar }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileSearchOpen(false);
    }
  };

  const handleRandomClick = async () => {
    try {
      const isMovie = Math.random() < 0.5;
      const page = Math.floor(Math.random() * 5) + 1;
      let response = isMovie ? await getPopularMovies(page) : await getPopularTvShows(page);
      const results = response.data.results;
      const randomItem = results[Math.floor(Math.random() * results.length)];
      navigate(isMovie ? `/movie/${randomItem.id}` : `/tv/${randomItem.id}`);
    } catch (error) {
      console.error('Error fetching random item:', error);
    }
  };

 const isOnMangaPage = location.pathname.includes('/manga');
  const isOnMoviesPage = location.pathname.includes('/movies');
  const isOnAnimePage = location.pathname.includes('/anime');
  const isOnTvShowsPage = location.pathname.includes('/tv');
  const isOnActorsPage = location.pathname.includes('/actors');
  const isOnDiscoveryPage = location.pathname === '/discovery';

  const getSidebarIcon = () => {
    if (isOnMangaPage) return <FaBook />;
    if (isOnMoviesPage) return <FaFilm />;
    if (isOnDiscoveryPage) return <FaCompass />;
    if (isOnTvShowsPage) return <FaTv />;
    if (isOnAnimePage) return <FaEye />;
    if (isOnActorsPage) return <FaUser />;
    return <FaBars />;
  };

 return (
    <HeaderContainer>
      <MobileButton onClick={toggleSidebar}>
        {getSidebarIcon()}
      </MobileButton>
      <Logo>{isOnMangaPage ? 'Read.Baba' : 'Watch.Baba'}</Logo>
      <SearchForm onSubmit={handleSearch}>
        <SearchBarContainer>
          <SearchBar
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon onClick={handleSearch} />
        </SearchBarContainer>
      </SearchForm>
      <RandomButton onClick={handleRandomClick}>
        <DiceIcon />
        <span className="random-text">Random</span>
      </RandomButton>
      <MobileControls>
        <MobileButton onClick={() => setIsMobileSearchOpen(true)}>
          <FaSearch />
        </MobileButton>
        <MobileButton onClick={handleRandomClick}>
          <FaDice />
        </MobileButton>
      </MobileControls>
      {isMobileSearchOpen && (
        <MobileSearchOverlay>
          <MobileSearchForm onSubmit={handleSearch}>
            <SearchBarContainer>
              <SearchBar
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <SearchIcon onClick={handleSearch} />
            </SearchBarContainer>
          </MobileSearchForm>
          <CloseButton onClick={() => setIsMobileSearchOpen(false)}>
            <FaTimes />
          </CloseButton>
        </MobileSearchOverlay>
      )}
    </HeaderContainer>
  );
}

export default Header;