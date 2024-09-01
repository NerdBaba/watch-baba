import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaDice, FaBars } from 'react-icons/fa';
import { getPopularMovies, getPopularTvShows } from '../services/tmdbApi';
import Sidebar from './Sidebar';

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: ${props => props.theme.secondary};

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Logo = styled.h1`
  font-size: 32px;
  color: ${props => props.theme.primary};
  font-weight: 700;
  margin: 0 0 15px 0;
  @font-face {
    font-family: 'Pacify Angry';
    src: url('fonts/Pacify%20Angry.ttf') format('truetype');
  }
  font-family: 'Pacify Angry', sans-serif;

  @media (min-width: 768px) {
    font-size: 40px;
    margin-bottom: 0;
  }
`;

const SearchForm = styled.form`
  width: 100%;
  max-width: 250px;
  margin-bottom: 15px;

  @media (min-width: 768px) {
    margin-bottom: 0;
    margin-left: auto;
    margin-right: 15px;
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

  @media (min-width: 768px) {
    width: auto;
  }
`;

const DiceIcon = styled(FaDice)`
  margin-right: 5px;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;
function Header({toggleSidebar}) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleRandomClick = async () => {
    try {
      const isMovie = Math.random() < 0.5;
      const page = Math.floor(Math.random() * 5) + 1;

      let response;
      if (isMovie) {
        response = await getPopularMovies(page);
      } else {
        response = await getPopularTvShows(page);
      }

      const results = response.data.results;
      const randomItem = results[Math.floor(Math.random() * results.length)];

      if (isMovie) {
        navigate(`/movie/${randomItem.id}`);
      } else {
        navigate(`/tv/${randomItem.id}`);
      }
    } catch (error) {
      console.error('Error fetching random item:', error);
    }
  };

  return (
    <HeaderContainer>
    <MenuButton onClick={toggleSidebar}>
        <FaBars />
      </MenuButton>
      <Logo>Watch.Baba</Logo>
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
        <DiceIcon /> Random
      </RandomButton>
    </HeaderContainer>
  );
}

export default Header;
