import React, { useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {styled,useTheme} from 'styled-components';
import { FaSearch, FaDice, FaBars, FaTimes, FaBook, FaFilm, FaTv, FaUser,FaEye,FaCompass, FaPlayCircle,FaBaseballBall,FaMask } from 'react-icons/fa';
import { getPopularMovies, getPopularTvShows } from '../services/tmdbApi';
import { FaBarsStaggered } from 'react-icons/fa6';
import Topbar from './Topbar';

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
    margin-top: 10px;
    margin-bottom: -10px;
    justify-content: space-between;
    align-items: center;
  }
`;



const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 25px;
  margin: 0 0 15px 15px;
  font-family: 'Isidora Sans Bold', sans-serif;
  cursor: pointer; /* Add pointer to indicate it's clickable */
  
  .logo-text {
    margin-left: 10px;
    background: linear-gradient(to right, ${props => props.theme.primary}, ${props => props.theme.text || props.theme.primary}, ${props => props.theme.primary}ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }

  @media (min-width: 769px) {
    font-size: 50px;
    margin-bottom: 0;
  }
  @media (max-width: 900px) {
    font-size: 35px;
    margin: 0;
    margin-right: 15px;
    margin-bottom: 10px;
  }
`;

const GradientIcon = styled.div`
  font-size: 25px;
  display: flex;
  margin-left: 15px;
  margin-top: 10px;
  align-items: center;
  
  svg {
    width: 1em;
    height: 1em;
    fill: url(#gradient);
  }

  @media (min-width: 769px) {
    font-size: 40px;
    margin-top: 15px;

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
  border-radius: 10px;
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
    const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isTopbarOpen, setIsTopbarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileSearchOpen(false);
    }
  };
  const handleLogoClick = () => {
    navigate('/');  // Redirect to home page
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
  const isOnSportsPage = location.pathname.includes('/sports');
  const isOnKDramaPage = location.pathname.includes('/kdrama');

  const getIcon = () => {
    if (isOnMangaPage) return FaBook;
    if (isOnMoviesPage) return FaFilm;
    if (isOnDiscoveryPage) return FaCompass;
    if (isOnTvShowsPage) return FaTv;
    if (isOnAnimePage) return FaEye;
    if (isOnActorsPage) return FaUser;
    if (isOnSportsPage) return FaBaseballBall;
    if (isOnKDramaPage) return FaMask;
    return FaPlayCircle;
  };

  const IconComponent = getIcon();

  return (
  <HeaderContainer>
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={theme.primary} />
          <stop offset="50%" stopColor={theme.text || theme.primary} />
          <stop offset="100%" stopColor={`${theme.primary}cc`} />
        </linearGradient>
      </defs>
    </svg>
    
     {/* Logo Clickable for redirection */}
      <Logo onClick={handleLogoClick}>
        <GradientIcon>
          <IconComponent />
        </GradientIcon>
        <span className="logo-text">
          {isOnMangaPage ? 'readbaba' : 'watchbaba'}
        </span>
      </Logo>

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
      <MobileButton onClick={() => setIsTopbarOpen(true)}>
        <FaBarsStaggered  />
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
    
    <Topbar isOpen={isTopbarOpen} onClose={() => setIsTopbarOpen(false)} />
  </HeaderContainer>
);
}

export default Header;